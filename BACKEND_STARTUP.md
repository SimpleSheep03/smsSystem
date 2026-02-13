# Backend Startup Guide

## Issue: 404 on /v1/blocked endpoint

The 404 error occurs when the Spring Boot service (sms-sender) is not running on port 8080.

### Start Spring Boot Service (sms-sender)

Open a terminal in the `sms-sender` directory and run:

```bash
# Windows
mvnw spring-boot:run

# or 
mvn spring-boot:run

# or build and run JAR
mvnw clean package -DskipTests
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

The service should start on http://localhost:8080

You should see output like:
```
Started DemoApplication in X seconds (JVM running for Y.XXs)
Tomcat started on port(s): 8080
```

### Start Go Service (sms-store)

Open another terminal in the `sms-store` directory and run:

```bash
go run cmd/main.go
```

The service should start on http://localhost:8081

### Start Frontend (Next.js)

Open another terminal in the `sms-frontend` directory and run:

```bash
npm run dev
```

The frontend will be available at http://localhost:3000

### Test the Blocked Endpoint

Once all services are running, test in your browser:
- http://localhost:3000/blocked

Or test the backend directly:
```bash
curl http://localhost:8080/v1/blocked
```

### Verify Ports

Check that services are running on correct ports:
- Spring Boot (sms-sender): http://localhost:8080
- Go (sms-store): http://localhost:8081
- Next.js (sms-frontend): http://localhost:3000

