/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import KeywordTable from "@/Components/KeywordTable";
import { KeywordMetrics } from "@/types";
import processApiData from "@/utils/data";
import React, { useEffect, useState } from "react";

export default function page() {
  const [apiData, setApiData] = useState<KeywordMetrics[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const processedData = await processApiData();
      setApiData(processedData.apiData);
    };

    fetchData();
  }, []);
  return (
    <div className="flex flex-col w-full gap-6 p-8 px-0 pt-4">
      <h1 className="text-xl font-bold">Keywords</h1>
      <KeywordTable keywords={apiData} />
    </div>
  );
}
