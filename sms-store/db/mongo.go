package db

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var Collection *mongo.Collection
var Client *mongo.Client

func ConnectMongo() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		log.Fatal("Failed to connect to MongoDB:", err)
	}

	// Verify connection
	if err = client.Ping(ctx, nil); err != nil {
		log.Fatal("Failed to ping MongoDB:", err)
	}

	Client = client
	Collection = client.Database("sms_db").Collection("messages")
	log.Println("Connected to MongoDB")
}

func ListDatabases(ctx context.Context) ([]string, error) {
	return Client.ListDatabaseNames(ctx, map[string]interface{}{})
}

func ListCollections(ctx context.Context, dbName string) ([]string, error) {
	db := Client.Database(dbName)
	return db.ListCollectionNames(ctx, map[string]interface{}{})
}

func FindDocuments(ctx context.Context, dbName, collName string, limit int64) (*mongo.Cursor, error) {
	coll := Client.Database(dbName).Collection(collName)
	opts := options.Find()
	if limit > 0 {
		opts.SetLimit(limit)
	}
	return coll.Find(ctx, map[string]interface{}{}, opts)
}
