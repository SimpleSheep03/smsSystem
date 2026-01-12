package kafka

import (
	"context"
	"encoding/json"
	"log"

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
			log.Println(err)
			continue
		}

		var sms models.SMSRecord
		json.Unmarshal(m.Value, &sms)

		_, err = db.Collection.InsertOne(context.Background(), sms)
		if err != nil {
			log.Println("Mongo insert failed:", err)
		}
	}
}
