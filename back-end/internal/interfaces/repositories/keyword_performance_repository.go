package repository

import (
	"context"
	"go.mongodb.org/mongo-driver/mongo"
)

type keywordPerformanceRepository struct {
	db *mongo.Database
}

func NewKeywordPerformanceRepository(db *mongo.Database) *keywordPerformanceRepository {
	return &keywordPerformanceRepository{
		db: db,
	}
}

func (r *keywordPerformanceRepository) GetAll() ([]domain.KeywordPerformance, error) {
	collection := r.db.Collection("keyword_performance")
	cursor, err := collection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var performanceData []domain.KeywordPerformance
	if err := cursor.All(context.Background(), &performanceData); err != nil {
		return nil, err
	}

	return performanceData, nil
}