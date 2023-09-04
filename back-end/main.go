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

type Goal struct {
	ID            string `json:"_id,omitempty" bson:"_id,omitempty"`
	ClicksGoal    int                `json:"clicksGoal" bson:"clicksGoal"`
	ImpressionsGoal int             `json:"impressionsGoal" bson:"impressionsGoal"`
	CtrGoal       float64            `json:"ctrGoal" bson:"ctrGoal"`
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
    AllowOrigins:     []string{"http://localhost:3000"}, // Atualize com o domínio correto do seu front-end
    AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
    AllowHeaders:     []string{"Origin", "Content-Type"},
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

router.GET("/api/goals", func(c *gin.Context) {
	collection := db.Collection("goals")
	var goal Goal
	err := collection.FindOne(context.Background(), bson.M{}).Decode(&goal)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, goal)
})

router.POST("/api/goals", func(c *gin.Context) {
	var goal Goal
	if err := c.ShouldBindJSON(&goal); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	collection := db.Collection("goals")
	_, err := collection.ReplaceOne(context.Background(), bson.M{}, goal)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update goals"})
		return
	}
	c.JSON(http.StatusCreated, goal)
})


	port := "8080"
	fmt.Printf("Backend is running on port %s\n", port)
	log.Fatal(router.Run(":" + port))
}
