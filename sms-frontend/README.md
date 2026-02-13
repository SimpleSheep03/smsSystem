SMS Frontend

Quick setup:

1. cd sms-frontend
2. npm install
3. npm run dev

Notes:
- The frontend expects the backend services to be reachable at the same host (relative paths). If you run the frontend on a different origin, set up a proxy or CORS.
- Endpoints used:
  - POST /v1/sms/send (sms-sender)
  - GET /v1/user/{userId}/messages (sms-store)
  - GET/POST/DELETE /v1/blocked (sms-sender)
  - GET /v1/admin/dbs, /v1/admin/dbs/{db}/collections, /v1/admin/dbs/{db}/collections/{coll}/documents (sms-store)
