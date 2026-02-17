package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"regexp"
	"time"

	"sms-store/db"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var phoneRegex = regexp.MustCompile(`^\+[1-9][0-9]{8,14}$`)

func ValidatePhone(phone string) bool {
	return phoneRegex.MatchString(phone)
}

func GetUserMessages(w http.ResponseWriter, r *http.Request) {
	userId := mux.Vars(r)["userId"]

	if userId == "" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Please enter phone number",
		})
		return
	}

	if !ValidatePhone(userId) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "Please enter phone number in valid format",
		})
		return
	}

	w.Header().Set("Content-Type", "application/json")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	opts := options.Find().SetSort(bson.M{"timestamp": -1})
	cursor, err := db.Collection.Find(ctx, bson.M{"userId": userId}, opts)
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
