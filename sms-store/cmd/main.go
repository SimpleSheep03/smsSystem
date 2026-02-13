package main

import (
	"log"
	"net/http"
	"time"

	"sms-store/db"
	"sms-store/handlers"
	"sms-store/kafka"

	"github.com/gorilla/mux"
)

func main() {
	db.ConnectMongo()
	go kafka.StartConsumer()

	r := mux.NewRouter()
	r.HandleFunc("/v1/user/{userId}/messages", handlers.GetUserMessages).Methods("GET")
	r.HandleFunc("/v1/admin/dbs", handlers.ListDatabases).Methods("GET")
	r.HandleFunc("/v1/admin/dbs/{db}/collections", handlers.ListCollections).Methods("GET")
	r.HandleFunc("/v1/admin/dbs/{db}/collections/{coll}/documents", handlers.FindDocuments).Methods("GET")

	server := &http.Server{
		Addr:         ":8081",
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	log.Println("SMS Store running on :8081")
	log.Fatal(server.ListenAndServe())
}
