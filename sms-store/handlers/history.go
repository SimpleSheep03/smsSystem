package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"sms-store/db"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
)

func GetUserMessages(w http.ResponseWriter, r *http.Request) {
	userId := mux.Vars(r)["userId"]

	if userId == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := db.Collection.Find(ctx, bson.M{"userId": userId})
	if err != nil {
		log.Println("Database query error:", err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var result []bson.M
	if err = cursor.All(ctx, &result); err != nil {
		log.Println("Error decoding results:", err)
		http.Error(w, "Error processing results", http.StatusInternalServerError)
		return
	}

	if result == nil {
		result = []bson.M{}
	}

	json.NewEncoder(w).Encode(result)
}
