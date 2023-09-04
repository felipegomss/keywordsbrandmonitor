export interface Metric {
  date: string;
  clicks: number;
  impressions: number;
  ctr: number;
  conversionRate: number;
}

export interface KeywordMetrics {
  keyword: string;
  metrics: Metric[];
}

export interface TopMetrics {
  clicks: { keyword: string; value: number }[];
  impressions: { keyword: string; value: number }[];
  ctr: { keyword: string; value: number }[];
}

export interface Goals {
  _id: string;
  clicksGoal: number;
  impressionsGoal: number;
  ctrGoal: number;
}
