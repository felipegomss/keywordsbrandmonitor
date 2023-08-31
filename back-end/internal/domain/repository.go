package domain

type KeywordPerformanceRepository interface {
	GetAll() ([]KeywordPerformance, error)
}

type KeywordPerformance struct {
	Keyword string
	Metrics []MetricData
}

type MetricData struct {
	Date          string
	Clicks        int
	Impressions   int
	CTR           float64
	ConversionRate float64
}