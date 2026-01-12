package main

import (
	"log"
	"net/http"

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

	log.Println("SMS Store running on :8081")
	log.Fatal(http.ListenAndServe(":8081", r))
}
