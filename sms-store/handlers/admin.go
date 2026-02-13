package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"sms-store/db"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
)

func ListDatabases(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	names, err := db.ListDatabases(ctx)
	if err != nil {
		log.Println("Error listing databases:", err)
		http.Error(w, "Error listing databases", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(names)
}

func ListCollections(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	vars := mux.Vars(r)
	dbName := vars["db"]
	if dbName == "" {
		http.Error(w, "db required", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	names, err := db.ListCollections(ctx, dbName)
	if err != nil {
		log.Println("Error listing collections:", err)
		http.Error(w, "Error listing collections", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(names)
}

func FindDocuments(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	vars := mux.Vars(r)
	dbName := vars["db"]
	collName := vars["coll"]
	if dbName == "" || collName == "" {
		http.Error(w, "db and coll required", http.StatusBadRequest)
		return
	}

	q := r.URL.Query()
	limitStr := q.Get("limit")
	var limit int64 = 100
	if limitStr != "" {
		if v, err := strconv.ParseInt(limitStr, 10, 64); err == nil {
			limit = v
		}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := db.FindDocuments(ctx, dbName, collName, limit)
	if err != nil {
		log.Println("Error finding docs:", err)
		http.Error(w, "Error finding docs", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var result []bson.M
	if err = cursor.All(ctx, &result); err != nil {
		log.Println("Error decoding docs:", err)
		http.Error(w, "Error decoding docs", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(result)
}
