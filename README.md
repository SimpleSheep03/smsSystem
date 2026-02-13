# SMS System

A scalable, distributed SMS management system built with microservices architecture. This project demonstrates event-driven architecture using Apache Kafka, with services implemented in Java (Spring Boot), Go, and a modern Next.js frontend.

## Project Overview

The SMS System is designed to handle SMS sending and storage at scale using a decoupled microservices approach. It consists of three main components:

- **SMS Sender** (Java/Spring Boot): Receives SMS requests, validates users against a blocklist, and publishes events to Kafka
- **SMS Store** (Go): Consumes SMS events from Kafka and persists them to MongoDB for historical tracking
- **SMS Frontend** (Next.js/React): Modern web UI for sending SMS, viewing messages, managing blocked numbers, and exploring MongoDB

## Architecture

```
┌──────────────────┐      ┌────────────┐         ┌─────────────┐
│                  │      │ SMS Sender │────────▶│   Kafka     │
│  SMS Frontend    │─────▶│ (Java)     │         │             │
│  (Next.js/React) │      │ (Port 8080)│         └──────┬──────┘
└──────────────────┘      └────────────┘                │
   (Port 3000)                 │                        │
   ┌─ Breadcrumbs              │ (Redis)                │
   ├─ Dark Mode                ▼                        │
   ├─ Pagination          ┌────────────┐                │
   ├─ CSV Export          │   Redis    │                │
   ├─ Copy to Clipboard   │ (Blocklist)│                │
   └─ Empty States        └────────────┘                │
                                                        │
                                                        ▼
                                              ┌─────────────────┐
                                              │   SMS Store     │
                                              │   (Go)          │
                                              │ (Port 8081)     │
                                              └────────┬────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │   MongoDB       │
                                              │   (Storage)     │
                                              └─────────────────┘
```

## Technology Stack

### SMS Sender Service
- **Framework**: Spring Boot 4.0.1
- **Language**: Java 17
- **Key Dependencies**:
  - Spring Web (REST APIs)
  - Spring Kafka (Event Publishing)
  - Spring Data Redis (User Blocklist Management)
  - Jakarta Validation (Bean Validation with @Pattern, @Size, @NotBlank)

### SMS Store Service
- **Framework**: Go 1.25.5
- **Key Dependencies**:
  - Gorilla Mux (HTTP Router)
  - Kafka Go (Event Consumption)
  - MongoDB Go Driver (Data Persistence)

### SMS Frontend
- **Framework**: Next.js 14.2
- **Language**: JavaScript/React 18.2
- **UI Library**: Tailwind CSS 3.4
- **Notifications**: react-toastify 9.1.3
- **Features**:
  - Send SMS with character counter
  - View message history with pagination
  - Manage blocked numbers with pagination
  - MongoDB database explorer
  - Dark/light mode toggle
  - CSV export functionality
  - Copy-to-clipboard for phone numbers

### Infrastructure
- **Message Broker**: Apache Kafka 7.5.0
- **Caching**: Redis 7
- **Database**: MongoDB 6
- **Orchestration**: Docker Compose
- **Coordination**: Zookeeper 7.5.0

## Project Structure

```
sms-system/
├── sms-sender/                 # Java Spring Boot service
│   ├── src/main/java/...      # Source code
│   ├── pom.xml                # Maven configuration
│   └── mvnw                   # Maven wrapper
├── sms-store/                 # Go service
│   ├── cmd/main.go            # Entry point
│   ├── db/mongo.go            # Database connections
│   ├── handlers/              # HTTP handlers
│   ├── kafka/consumer.go       # Kafka consumer logic
│   ├── models/                # Data models
│   └── go.mod                 # Go modules
├── sms-frontend/              # Next.js React frontend
│   ├── pages/                 # Page components
│   │   ├── index.js          # Home page
│   │   ├── send.js           # Send SMS page
│   │   ├── messages.js       # View messages page
│   │   ├── blocked.js        # Manage blocked page
│   │   └── mongo.js          # MongoDB explorer
│   ├── components/            # Reusable components
│   │   ├── NavBar.js         # Navigation bar
│   │   ├── MessageCard.js    # Message display card
│   │   ├── ResultCard.js     # Result display card
│   │   └── EmptyStates.js    # Empty state components
│   ├── utils/                # Utility functions
│   │   └── csv.js            # CSV export utilities
│   ├── styles/               # Tailwind CSS
│   ├── package.json          # Dependencies
│   └── next.config.js        # Next.js configuration (API rewrites)
├── infra/
│   └── docker-compose.yml    # Container orchestration
├── .gitignore                # Root gitignore
└── README.md                 # This file
```

## SMS Sender Service

### Endpoint

**POST** `/v1/sms/send`

### Request Body
```json
{
  "phoneNumber": "+1234567890",
  "message": "Hello, this is a test SMS!"
}
```

### Response
```json
{
  "status": "SENT"
}
```

### Features
- **Phone Validation**: E.164 format validation with regex pattern
- **Message Length**: Automatic truncation to 320 characters
- **Blocklist Checking**: Redis-backed blocklist validation
- **Event Publishing**: Sends SMS event to Kafka topic
- **Bean Validation**: @Pattern, @NotBlank, @Size annotations
- **Error Handling**: Detailed error messages for validation failures

## SMS Store Service

### Endpoints

**GET** `/v1/user/{phoneNumber}/messages`
- Retrieves all SMS messages for a phone number
- Results sorted by timestamp (newest first)
- Returns empty array if no messages found

**GET** `/v1/blocked`
- Returns list of all blocked phone numbers

**POST** `/v1/blocked`
- Add a phone number to blocklist
- Request body: `{"phoneNumber": "+1234567890"}`

**DELETE** `/v1/blocked/{phoneNumber}`
- Remove a phone number from blocklist

**GET** `/v1/admin/dbs`
- List all MongoDB databases

**GET** `/v1/admin/dbs/{db}/collections`
- List collections in a database

**GET** `/v1/admin/dbs/{db}/collections/{collection}/documents`
- Retrieve documents from a collection

### Features
- **Event Consumption**: Listens to Kafka topic for SMS events
- **Data Persistence**: Stores SMS records in MongoDB
- **Message History**: Retrieves complete SMS history with sorting
- **Admin Tools**: MongoDB database explorer
- **Async Processing**: Non-blocking event consumption via goroutines

## SMS Frontend

### Pages

1. **Home Page** (`/`)
   - Dashboard with navigation to all features
   - Quick tips and best practices
   - Feature cards with descriptions

2. **Send SMS** (`/send`)
   - Phone number input with E.164 format hint
   - Message textarea with real-time character counter (max 320 chars)
   - Attractive result display with status indicators
   - Success/warning/error visual feedback

3. **View Messages** (`/messages`)
   - Search messages by phone number
   - Pagination (5 messages per page)
   - Export messages to CSV
   - MessageCard components with copy-to-clipboard button
   - Messages sorted by newest first
   - Empty state illustration

4. **Blocked Numbers** (`/blocked`)
   - Add phone numbers to blocklist
   - View all blocked numbers with pagination (10 per page)
   - Remove individual entries
   - Bulk export to CSV
   - Refresh button to reload list

5. **MongoDB Explorer** (`/mongo`)
   - Browse all databases
   - Navigate collections within each database
   - View documents with MessageCard rendering for SMS objects
   - Admin interface for database inspection

### Features

- **Dark/Light Mode**: Toggle between themes with localStorage persistence
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Navigation**: Breadcrumbs and back buttons on all pages
- **Loading States**: Spinners and disabled buttons during async operations
- **Error Handling**: Toast notifications for all actions (success, error, warning, info)
- **CSV Export**: Download data in CSV format with proper escaping
- **Copy to Clipboard**: Quick phone number copying with visual feedback
- **Pagination**: Efficient data display for large lists
- **Empty States**: Friendly illustrations for empty lists
- **Real-time Feedback**: Character counters and action indicators

### UI Components

- **NavBar**: Navigation with dark mode toggle
- **MessageCard**: Reusable card for displaying SMS with:
  - Phone number with copy button
  - Message content in styled box
  - Status badge (green/yellow/red)
  - Timestamp
  - Hover effects
  - Dark mode support

- **ResultCard**: Attractive result display for send operations with:
  - Status indicator (✅/❌/⚠️/⏳)
  - HTTP status code
  - Status field and message
  - Collapsible full response view

- **EmptyStates**: Friendly empty state illustrations:
  - EmptyMessages 📭
  - EmptyBlocked ✅
  - EmptyDatabases 🔍
  - EmptyCollections 📚
  - EmptyDocuments 📄

## API Examples

### Send SMS
```bash
curl -X POST http://localhost:8080/v1/sms/send \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1234567890",
    "message": "Test message"
  }'
```

### Add to Blocklist
```bash
curl -X POST http://localhost:8080/v1/blocked \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+1234567890"
  }'
```

### Retrieve User Messages
```bash
curl http://localhost:8081/v1/user/+1234567890/messages
```

### Get All Blocked Numbers
```bash
curl http://localhost:8080/v1/blocked
```

### Explore MongoDB
```bash
# List all databases
curl http://localhost:8081/v1/admin/dbs

# List collections in a database
curl http://localhost:8081/v1/admin/dbs/sms/collections

# Get documents from a collection
curl http://localhost:8081/v1/admin/dbs/sms/collections/messages/documents
```

## Configuration

### Application Properties
Each service can be configured via configuration files:

**SMS Sender** (`sms-sender/src/main/resources/application.yaml`):
```yaml
spring:
  kafka:
    bootstrap-servers: localhost:9092
  redis:
    host: localhost
    port: 6379
```

**SMS Store** (environment or config):
- MongoDB connection string: `MONGO_URI`
- Kafka broker: `localhost:9092`
- Server port: `8081`

**SMS Frontend** (`sms-frontend/next.config.js`):
- API rewrites configured to proxy `/v1/*` routes
- Targets: `http://localhost:8080` (SMS Sender) and `http://localhost:8081` (SMS Store)

## Data Flow

1. **SMS Request**: User fills form in frontend and submits
2. **Frontend Validation**: Phone number and message validated client-side
3. **API Call**: Frontend sends POST to `/v1/sms/send` via proxy
4. **Backend Validation**: SMS Sender validates format and checks blocklist
5. **Event Publishing**: Valid SMS event published to Kafka
6. **Event Consumption**: SMS Store consumes event
7. **Persistence**: SMS record stored in MongoDB
8. **History View**: User can fetch SMS history via `/v1/user/{phone}/messages`
9. **UI Display**: Messages rendered with MessageCard components

## Monitoring and Debugging

### Health Checks
- **SMS Sender**: Available at `http://localhost:8080/actuator/health`
- **SMS Store**: Check logs for startup messages
- **Frontend**: Accessible at `http://localhost:3000`

### Logs
- Monitor Kafka consumer in SMS Store for event processing
- Check Redis commands for blocklist operations
- Review MongoDB operations for data persistence
- Frontend browser console for API calls and errors

### Git Configuration

To ensure clean repository:
```bash
# Frontend dependencies won't be tracked
cat .gitignore  # Shows node_modules/ and .next/ are ignored

# Root ignore file
cat .gitignore  # Shows service-specific builds are ignored
```

## Deployment Considerations

1. **Containerization**: Services can be containerized for deployment using provided Dockerfiles
2. **Frontend Deployment**: 
   - Build with `npm run build`
   - Deploy to Vercel, Netlify, or self-hosted server
   - Configure API endpoints for production backend services
3. **Scalability**: Kafka ensures horizontal scaling of SMS Store instances
4. **Resilience**: Event-driven approach provides loose coupling and fault tolerance
5. **Data Consistency**: MongoDB ensures data persistence for SMS records
6. **Caching**: Redis provides fast blocklist lookups

## Future Enhancements

- User authentication and authorization
- Rate limiting per user/phone number
- Message templates
- Delivery status tracking (delivered, failed, pending)
- SMS gateway provider integration
- Real-time message delivery notifications
- Analytics and reporting dashboard
- Multi-language support
- Webhook callbacks for delivery status
- Message scheduling

## Troubleshooting

### 404 Error on Frontend
- **Cause**: Backend services not running on correct ports
- **Solution**: Ensure SMS Sender (8080) and SMS Store (8081) are running

### Messages Not Appearing
- **Cause**: Kafka consumer not running or database offline
- **Solution**: Check SMS Store logs and verify MongoDB is running

### Cannot Add to Blocklist
- **Cause**: Phone validation failed or blocklist service unavailable
- **Solution**: Use E.164 format and verify Redis is running

### Frontend API Calls Failing
- **Cause**: CORS or rewrite issues
- **Solution**: Check `next.config.js` rewrites and backend API availability

## License

This project is part of the SDE(B) Pre-Onboarding Learning Material and is provided as a learning exercise.

## Support

For questions or issues related to this project, refer to the SDE(B) Pre-Onboarding Learning Material documentation.
