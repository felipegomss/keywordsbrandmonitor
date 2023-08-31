import { MouseEvent, useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { TopMetrics } from "@/types";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Card, CardContent } from "@mui/material";

interface ChartProps {
  data: TopMetrics;
}

export default function Chart({ data }: ChartProps) {
  const [category, setCategory] = useState<string | null>("click");

  const handleCategory = (
    event: MouseEvent<HTMLElement>,
    newCategory: string | null
  ) => {
    setCategory(newCategory);
  };

  const getCategoryValues = () => {
    switch (category) {
      case "click":
        return data.clicks
          .slice(0, 7)
          .map((click) => click.value)
          .sort();
      case "impression":
        return data.impressions
          .slice(0, 7)
          .map((impression) => impression.value)
          .sort();
      case "ctr":
        return data.ctr
          .slice(0, 7)
          .map((ctr) => ctr.value)
          .sort();
      default:
        return [];
    }
  };

  const keywords = data.clicks.map((click) => click.keyword);
  const categoryValues = getCategoryValues();

  const pieChartData = categoryValues.map((value, index) => ({
    id: index,
    value: value,
    label: keywords[index],
  }));

  const [chartSize, setChartSize] = useState({
    width: 300,
    height: 200,
  });

  useEffect(() => {
    function handleChartSize() {
      if (innerWidth > 600) {
        setChartSize({
          width: 500,
          height: 400,
        });
      }
    }
    handleChartSize();
  }, []);

  return (
    <Card className="p-4">
      <h1 className="text-xl font-bold ">Top 7 keywords</h1>
      <CardContent className="grid gap-8 my-4 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-4">
          <ToggleButtonGroup
            value={category}
            exclusive
            onChange={handleCategory}
            aria-label="Category display"
          >
            <ToggleButton value="click" aria-label="click values">
              Cliques
            </ToggleButton>
            <ToggleButton value="impression" aria-label="impressions values">
              Impressões
            </ToggleButton>
            <ToggleButton value="ctr" aria-label="ctr values">
              CTR
            </ToggleButton>
          </ToggleButtonGroup>
          {data.clicks.length > 0 ? (
            <PieChart
              series={[
                {
                  data: pieChartData,
                  innerRadius: 50,
                  paddingAngle: 5,
                  cornerRadius: 10,
                  startAngle: -90,
                  endAngle: 180,
                  highlightScope: { faded: "global", highlighted: "item" },
                  cx: chartSize.width / 2,
                  cy: chartSize.height / 2,
                },
              ]}
              width={chartSize.width}
              height={chartSize.height}
              legend={{ hidden: true }}
            />
          ) : (
            ""
          )}
        </div>
        <div>
          {data.clicks.length > 0 ? (
            <div>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Palavra-Chave</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Valor</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pieChartData.map((metric) => (
                      <TableRow key={metric.label}>
                        <TableCell>{metric.label}</TableCell>
                        <TableCell>{metric.value.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ) : (
            ""
          )}
        </div>
      </CardContent>
    </Card>
  );
}
