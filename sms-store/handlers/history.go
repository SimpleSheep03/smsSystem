package handlers

import (
	"context"
	"encoding/json"
	"net/http"

	"sms-store/db"

	"github.com/gorilla/mux"
)

func GetUserMessages(w http.ResponseWriter, r *http.Request) {
	userId := mux.Vars(r)["userId"]

	cursor, _ := db.Collection.Find(context.Background(), map[string]string{
		"userId": userId,
	})

	var result []map[string]interface{}
	cursor.All(context.Background(), &result)

	json.NewEncoder(w).Encode(result)
}
