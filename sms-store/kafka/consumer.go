package kafka

import (
	"context"
	"encoding/json"
	"log"
	"time"

	"sms-store/db"
	"sms-store/models"

	"github.com/segmentio/kafka-go"
)

func StartConsumer() {
	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers: []string{"localhost:9092"},
		Topic:   "sms-events",
		GroupID: "sms-store-group",
	})

	log.Println("Kafka consumer started")

	for {
		m, err := r.ReadMessage(context.Background())
		if err != nil {
			log.Println("Kafka read error:", err)
			continue
		}

		var sms models.SMSRecord
		if err := json.Unmarshal(m.Value, &sms); err != nil {
			log.Println("JSON unmarshal error:", err)
			continue
		}

		// Retry logic for database inserts
		insertWithRetry(sms)
	}
}

func insertWithRetry(sms models.SMSRecord) {
	maxRetries := 3
	retryDelay := 2 * time.Second

	for attempt := 1; attempt <= maxRetries; attempt++ {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		_, err := db.Collection.InsertOne(ctx, sms)
		cancel()

		if err == nil {
			return
		}

		log.Printf("Insert attempt %d failed: %v", attempt, err)
		if attempt < maxRetries {
			time.Sleep(retryDelay)
		}
	}

	log.Printf("Failed to insert SMS for userId: %s after %d attempts", sms.UserID, maxRetries)
}
