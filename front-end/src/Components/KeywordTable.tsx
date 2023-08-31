import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Button,
  TablePagination,
} from "@mui/material";
import { KeywordMetrics, Metric } from "@/types";
import { useState } from "react";
import * as FileSaver from "file-saver";
import { Download } from "@mui/icons-material";

interface KeywordsTableProps {
  keywords: KeywordMetrics[];
}

const getLastMetric = (
  keyword: KeywordMetrics,
  metricType: keyof Metric
): number => {
  if (keyword.metrics.length === 0) {
    return 0;
  }

  const lastValue = keyword.metrics[keyword.metrics.length - 1][
    metricType
  ] as number;
  return lastValue;
};

function generateCSVContent(keywords: any[]) {
  const csvRows = [];
  const headers = ["Palavra-Chave", "Cliques", "Impressões", "CTR"];
  csvRows.push(headers.join(","));

  keywords.forEach((keyword) => {
    const row = [
      keyword.keyword,
      getLastMetric(keyword, "clicks"),
      getLastMetric(keyword, "impressions"),
      getLastMetric(keyword, "ctr").toFixed(3),
    ];
    csvRows.push(row.join(","));
  });

  return csvRows.join("\n");
}

export default function KeywordsTable({ keywords }: KeywordsTableProps) {
  const [orderBy, setOrderBy] = useState<keyof Metric>("clicks");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSortRequest = (property: keyof Metric) => {
    const isAsc = orderBy === property && order === "asc";
    setOrderBy(property);
    setOrder(isAsc ? "desc" : "asc");
  };

  const sortedKeywords = keywords.slice().sort((a, b) => {
    if (order === "asc") {
      return getLastMetric(a, orderBy) - getLastMetric(b, orderBy);
    } else {
      return getLastMetric(b, orderBy) - getLastMetric(a, orderBy);
    }
  });

  const handleChangePage = (
    event: any,
    newPage: React.SetStateAction<number>
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const downloadCSV = () => {
    const csvContent = generateCSVContent(sortedKeywords);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    FileSaver.saveAs(blob, "keywords.csv");
  };

  return (
    <TableContainer component={Paper}>
      <div className="flex justify-between w-full p-4">
        <p className="text-zinc-400">
          Palavras chaves interessantes para o seu negócio.
        </p>
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={downloadCSV}
        >
          Baixar
        </Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel>Palavra-Chave</TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "clicks"}
                direction={orderBy === "clicks" ? order : "asc"}
                onClick={() => handleSortRequest("clicks")}
              >
                Cliques
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "impressions"}
                direction={orderBy === "impressions" ? order : "asc"}
                onClick={() => handleSortRequest("impressions")}
              >
                Impressões
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "ctr"}
                direction={orderBy === "ctr" ? order : "asc"}
                onClick={() => handleSortRequest("ctr")}
              >
                CTR
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedKeywords
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((keyword) => (
              <TableRow key={keyword.keyword}>
                <TableCell>{keyword.keyword}</TableCell>
                <TableCell>{getLastMetric(keyword, "clicks")}</TableCell>
                <TableCell>{getLastMetric(keyword, "impressions")}</TableCell>
                <TableCell>
                  {getLastMetric(keyword, "ctr").toFixed(3)}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={sortedKeywords.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}
