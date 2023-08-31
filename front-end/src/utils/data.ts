import axios from "axios";
import { KeywordMetrics, Metric, TopMetrics } from "@/types";

const fetchApiData = async () => {
  try {
    const response = await axios.get(
      "http://localhost:8080/api/keyword-performance"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching API data:", error);
    return [];
  }
};

const calculateTopMetrics = (
  apiData: KeywordMetrics[],
  metricName: string,
  count: number
) => {
  const sortedKeywords = apiData
    .map((keywordData) => {
      const totalMetricValue = keywordData.metrics.reduce(
        (total, metric) => total + Number(metric[metricName as keyof Metric]),
        0
      );
      return {
        keyword: keywordData.keyword,
        value: totalMetricValue,
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, count);

  return sortedKeywords;
};

const processApiData = async () => {
  const apiData = await fetchApiData();

  const topMetrics: TopMetrics = {
    clicks: calculateTopMetrics(apiData, "clicks", 7),
    impressions: calculateTopMetrics(apiData, "impressions", 7),
    ctr: calculateTopMetrics(apiData, "ctr", 7),
  };

  return {
    apiData,
    topMetrics,
  };
};

export default processApiData;
