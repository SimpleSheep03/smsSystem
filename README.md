# SMS System

A scalable, distributed SMS management system built with microservices architecture. This project demonstrates event-driven architecture using Apache Kafka, with services implemented in Java (Spring Boot) and Go.

## Project Overview

The SMS System is designed to handle SMS sending and storage at scale using a decoupled microservices approach. It consists of two primary services:

- **SMS Sender** (Java/Spring Boot): Receives SMS requests, validates users against a blocklist, and publishes events to Kafka
- **SMS Store** (Go): Consumes SMS events from Kafka and persists them to MongoDB for historical tracking

## Architecture

```
┌─────────────┐         ┌────────────┐         ┌─────────────┐
│   Client    │────────▶│ SMS Sender │────────▶│   Kafka     │
│             │         │ (Java)     │         │             │
└─────────────┘         └────────────┘         └──────┬──────┘
                              │                        │
                              │ (Redis)                │
                              ▼                        │
                        ┌────────────┐                │
                        │   Redis    │                │
                        │ (Blocklist)│                │
                        └────────────┘                │
                                                      │
                                                      ▼
                                            ┌─────────────────┐
                                            │   SMS Store     │
                                            │   (Go)          │
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

### SMS Store Service
- **Framework**: Go 1.25.5
- **Key Dependencies**:
  - Gorilla Mux (HTTP Router)
  - Kafka Go (Event Consumption)
  - MongoDB Go Driver (Data Persistence)

### Infrastructure
- **Message Broker**: Apache Kafka 7.5.0
- **Caching**: Redis 7
- **Database**: MongoDB 6
- **Orchestration**: Docker Compose
- **Coordination**: Zookeeper 7.5.0

## Project Structure

```
smsSystem/
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
├── infra/
│   └── docker-compose.yml     # Container orchestration
└── pre-commit-scripts/        # Git hooks and validation
```

## SMS Sender Service

### Endpoint

**POST** `/v1/sms/send`

### Request Body
```json
{
  "userId": "user123",
  "phoneNumber": "+1234567890",
  "message": "Hello, this is a test SMS!"
}
```

### Response
```json
{
  "status": "SMS_SENT_SUCCESSFULLY"
}
```

### Features
- **User Validation**: Checks Redis blocklist to prevent SMS to blocked users
- **Event Publishing**: Sends SMS event to Kafka topic with timestamp
- **Error Handling**: Returns `USER_BLOCKED` status if user is in blocklist
- **Data Enrichment**: Automatically timestamps all SMS events

## SMS Store Service

### Endpoint

**GET** `/v1/user/{userId}/messages`

### Response
Returns a list of all SMS messages sent to a specific user with historical data

### Features
- **Event Consumption**: Listens to Kafka topic for SMS events
- **Data Persistence**: Stores SMS records in MongoDB
- **Message History**: Retrieves complete SMS history for any user
- **Async Processing**: Non-blocking consumption of events via goroutines

## Getting Started

### Prerequisites
- Docker and Docker Compose
- Java 17 (for building SMS Sender locally)
- Go 1.25+ (for building SMS Store locally)
- Maven (or use Maven wrapper)

### Quick Start with Docker Compose

1. Start all infrastructure services:
```bash
cd infra
docker-compose up -d
```

This will start:
- Zookeeper on port 2181
- Kafka on port 9092
- Redis on port 6379
- MongoDB on port 27017

2. Build and run SMS Sender:
```bash
cd sms-sender
./mvnw spring-boot:run
```
The service will start on `http://localhost:8080`

3. Build and run SMS Store:
```bash
cd sms-store
go run cmd/main.go
```
The service will start on `http://localhost:8081`

### Development Workflow

#### SMS Sender (Java)
```bash
cd sms-sender

# Build
./mvnw clean package

# Run tests
./mvnw test

# Run the application
./mvnw spring-boot:run
```

#### SMS Store (Go)
```bash
cd sms-store

# Download dependencies
go mod download

# Build
go build -o sms-store cmd/main.go

# Run
go run cmd/main.go
```

## API Examples

### Send SMS
```bash
curl -X POST http://localhost:8080/v1/sms/send \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "phoneNumber": "+1234567890",
    "message": "Test message"
  }'
```

### Retrieve User Messages
```bash
curl http://localhost:8081/v1/user/user123/messages
```

## Configuration

### Application Properties
Each service can be configured via `application.properties` or `application.yaml` files:

**SMS Sender** (`sms-sender/src/main/resources/application.properties`):
- Kafka broker connection settings
- Redis connection details
- Server port configuration

**SMS Store** (`sms-store/`):
- MongoDB connection string
- Kafka broker configuration
- Server port configuration

## Data Flow

1. **SMS Request**: Client sends SMS via `/v1/sms/send` endpoint
2. **Validation**: SMS Sender checks Redis for user blocklist status
3. **Event Publishing**: Valid SMS event is published to Kafka topic
4. **Event Consumption**: SMS Store consumes event from Kafka
5. **Persistence**: SMS record is stored in MongoDB
6. **Retrieval**: User can fetch their SMS history via SMS Store API

## Monitoring and Debugging

### Health Checks
- **SMS Sender**: Available at `http://localhost:8080/actuator/health` (Spring Boot Actuator)
- **SMS Store**: Check logs for startup messages

### Logs
- Monitor Kafka consumer in SMS Store for event processing
- Check Redis commands for blocklist operations
- Review MongoDB operations for data persistence

### Pre-commit Validation
The project includes validation scripts for code quality:
```bash
cd pre-commit-scripts
./runner.sh
```

## Deployment Considerations

1. **Containerization**: Services can be containerized for deployment
2. **Scalability**: Kafka ensures horizontal scaling of SMS Store instances
3. **Resilience**: Event-driven approach provides loose coupling and fault tolerance
4. **Data Consistency**: MongoDB ensures ACID properties for SMS records

## Future Enhancements

- Multi-language support for messages
- SMS delivery status tracking
- Rate limiting per user
- Message templates
- Analytics and reporting dashboards
- SMS gateway provider integration

## License

This project is part of the SDE(B) Pre-Onboarding Learning Material and is provided as a learning exercise.

## Support

For questions or issues related to this project, refer to the SDE(B) Pre-Onboarding Learning Material documentation.
