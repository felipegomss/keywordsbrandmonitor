"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CircularProgress, Typography } from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";
import Chart from "@/Components/Chart";
import processApiData from "@/utils/data";
import { KeywordMetrics, TopMetrics } from "@/types";

const user = "Felipe";
const METAS = {
  clicks: 1700,
  impressions: 27000,
  ctr: 0.07,
};

const Home: React.FC = () => {
  const [apiData, setApiData] = useState<KeywordMetrics[]>([]);
  const [topMetrics, setTopMetrics] = useState<TopMetrics>({
    clicks: [],
    impressions: [],
    ctr: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const processedData = await processApiData();
      setApiData(processedData.apiData);
      setTopMetrics(processedData.topMetrics);
    };

    fetchData();
  }, []);

  const getLastMetric = (
    metricType: keyof TopMetrics
  ): { lastValue: number; difference: number } => {
    if (apiData.length === 0) {
      return { lastValue: 0, difference: 0 };
    }

    const metricSum = apiData.reduce((total, keyword) => {
      const metricValue = keyword.metrics[keyword.metrics.length - 1][
        metricType
      ] as unknown as string;
      return total + parseFloat(metricValue);
    }, 0);

    const previousMetricSum = apiData.reduce((total, keyword) => {
      const metricValue = keyword.metrics[keyword.metrics.length - 2][
        metricType
      ] as unknown as string;
      return total + parseFloat(metricValue);
    }, 0);

    const lastValue =
      metricType === "ctr" ? metricSum / apiData.length : metricSum;
    const previousValue =
      metricType === "ctr"
        ? previousMetricSum / apiData.length
        : previousMetricSum;

    const difference = ((lastValue - previousValue) / previousValue) * 100;
    return { lastValue, difference };
  };

  const calculatePercentageOfMeta = (
    metricType: keyof TopMetrics,
    value: number
  ): number => {
    const metaValue = METAS[metricType];
    return metricType === "ctr"
      ? (value * 100) / metaValue
      : (value / metaValue) * 100;
  };

  const renderMetricCard = (
    title: string,
    metricType: keyof TopMetrics,
    decimalPlaces: number
  ) => {
    const metric = getLastMetric(metricType);
    const percentageOfMeta = calculatePercentageOfMeta(
      metricType,
      metric.lastValue
    );

    return (
      <Card>
        <CardContent className="flex justify-between">
          <div className="flex flex-col gap-2">
            <Typography
              className="text-zinc-400"
              variant="overline"
              component="div"
              gutterBottom
            >
              {title}
            </Typography>
            <Typography className="font-bold " variant="h4" component="div">
              {metric.lastValue.toLocaleString(undefined, {
                maximumFractionDigits: decimalPlaces,
              })}
            </Typography>
            <div className="flex gap-2">
              {Math.round(metric.difference) >= 0 ? (
                <TrendingUp
                  color="success"
                  className="p-1 bg-green-100 rounded-full"
                />
              ) : (
                <TrendingDown
                  color="error"
                  className="p-1 bg-red-100 rounded-full"
                />
              )}
              <Typography variant="body2" component="div">
                {metric.difference.toFixed(decimalPlaces)}%
              </Typography>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <CircularProgress
              variant="determinate"
              value={Math.round(percentageOfMeta)}
            />
            {percentageOfMeta.toFixed(2)}%
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col w-full gap-6 p-8 px-0 pt-4">
      <span>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-zinc-400">
          Olá, {user} 👋🏽 Bem-vindo ao Keywords Brand Monitor!
        </p>
      </span>
      <div className="grid w-full gap-4 md:grid-cols-3">
        {renderMetricCard("Cliques", "clicks", 2)}
        {renderMetricCard("Impressões", "impressions", 2)}
        {renderMetricCard("CTR", "ctr", 2)}
      </div>
      <div>{<Chart data={topMetrics} />}</div>
    </div>
  );
};

export default Home;
