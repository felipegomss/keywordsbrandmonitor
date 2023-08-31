package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"
	"os"
	"encoding/json"
	"io/ioutil"

	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type PerformanceData struct {
	Keyword string         `json:"keyword" bson:"keyword"`
	Metrics []MetricData  `json:"metrics" bson:"metrics"`
}

type MetricData struct {
	Date          string  `json:"date" bson:"date"`
	Clicks        int     `json:"clicks" bson:"clicks"`
	Impressions   int     `json:"impressions" bson:"impressions"`
	CTR           float64 `json:"ctr" bson:"ctr"`
	ConversionRate float64 `json:"conversionRate" bson:"conversionRate"`
}

var db *mongo.Database

func connectDatabase() {
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	client, err := mongo.NewClient(clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}

	db = client.Database("dashboard_db")
	fmt.Println("Connected to MongoDB")

	// Criação do banco de dados e importação do arquivo keywords.json
	collection := db.Collection("keyword_performance")
	count, err := collection.CountDocuments(context.Background(), bson.M{})
	if err != nil {
		log.Fatal(err)
	}

	if count == 0 {
		fmt.Println("No data found in the database. Creating and importing data...")
		createAndImportData()
	}
}

func createAndImportData() {
	file, err := os.Open("keywords.json")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	byteValue, _ := ioutil.ReadAll(file)

	var data []PerformanceData
	json.Unmarshal(byteValue, &data)

	collection := db.Collection("keyword_performance")
	for _, keywordData := range data {
		_, err := collection.InsertOne(context.Background(), keywordData)
		if err != nil {
			log.Fatal(err)
		}
	}

	fmt.Println("Data imported successfully!")
}

func main() {
	connectDatabase()

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET"},
		AllowHeaders:     []string{"Origin"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	router.GET("/api/keyword-performance", func(c *gin.Context) {
		collection := db.Collection("keyword_performance")
		cursor, err := collection.Find(context.Background(), bson.M{})
		if err != nil {
			log.Fatal(err)
		}
		defer cursor.Close(context.Background())

		var performanceData []PerformanceData
		if err := cursor.All(context.Background(), &performanceData); err != nil {
			log.Fatal(err)
		}

		c.JSON(http.StatusOK, performanceData)
	})

	port := "8080"
	fmt.Printf("Backend is running on port %s\n", port)
	log.Fatal(router.Run(":" + port))
}
