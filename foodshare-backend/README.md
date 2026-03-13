# FoodShare Backend - Spring Boot Application

This is the backend REST API for the FoodShare platform, built with Spring Boot 3.x.

## Technology Stack

- **Spring Boot**: 3.1.5
- **Spring Security**: JWT-based authentication
- **Spring Data JPA**: ORM for database operations
- **MySQL**: 8.0 Database
- **Maven**: Build management
- **Java**: 17+

## Project Structure

```
foodshare-backend/
├── src/main/java/com/foodshare/
│   ├── config/              # Security and global configuration
│   ├── controller/          # REST API endpoints
│   ├── service/             # Business logic
│   ├── repository/          # Database access layer (JPA)
│   ├── entity/              # JPA entity models
│   ├── dto/                 # Data transfer objects
│   ├── security/            # JWT and authentication utilities
│   ├── exception/           # Custom exceptions
│   └── FoodshareApplication.java
├── src/main/resources/
│   ├── application.yml      # Application configuration
│   └── uploads/             # Food image storage
├── pom.xml                  # Maven dependencies
└── README.md               # This file
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20),
  address TEXT,
  role ENUM('ADMIN', 'DONOR', 'RECEIVER') NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at DATETIME,
  updated_at DATETIME
);
```

### Food Donations Table
```sql
CREATE TABLE food_donations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  donor_id BIGINT NOT NULL,
  event_name VARCHAR(200) NOT NULL,
  description TEXT,
  food_items TEXT NOT NULL,
  quantity DOUBLE NOT NULL,
  unit VARCHAR(50) NOT NULL,
  pickup_location VARCHAR(255) NOT NULL,
  latitude DOUBLE,
  longitude DOUBLE,
  available_from DATETIME NOT NULL,
  available_until DATETIME NOT NULL,
  price DOUBLE,
  image_path VARCHAR(500),
  status ENUM('AVAILABLE', 'PARTIALLY_CLAIMED', 'CLAIMED', 'EXPIRED') DEFAULT 'AVAILABLE',
  created_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (donor_id) REFERENCES users(id)
);
```

### Food Requests Table
```sql
CREATE TABLE food_requests (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  donation_id BIGINT NOT NULL,
  receiver_id BIGINT NOT NULL,
  quantity_requested DOUBLE NOT NULL,
  message TEXT,
  status ENUM('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
  requested_at DATETIME,
  responded_at DATETIME,
  pickup_at DATETIME,
  updated_at DATETIME,
  FOREIGN KEY (donation_id) REFERENCES food_donations(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
);
```

## Setup Instructions

### Prerequisites
- Java 17+ installed
- MySQL 8.0+ running
- Maven 3.6+

### Step 1: Clone and Navigate
```bash
cd foodshare-backend
```

### Step 2: Create Database
```bash
mysql -u root -proot
CREATE DATABASE foodshare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Step 3: Configure Database Connection
Edit `src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/foodshare_db?useSSL=false&serverTimezone=UTC
    username: root
    password: root
```

### Step 4: Build Project
```bash
mvn clean install
```

### Step 5: Run Application
```bash
mvn spring-boot:run
```

Application will start at: `http://localhost:8080/api`

## API Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "donor1",
  "email": "donor1@example.com",
  "password": "password123",
  "fullName": "John Donor",
  "phoneNumber": "9876543210",
  "address": "123 Main St",
  "role": "DONOR"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "donor1@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "id": 1,
  "username": "donor1",
  "email": "donor1@example.com",
  "role": "DONOR",
  "fullName": "John Donor"
}
```

### Users

#### Get Current User
```http
GET /api/users/me
Authorization: Bearer <token>
```

#### Get User Profile
```http
GET /api/users/{userId}
```

#### Update User Profile
```http
PUT /api/users/{userId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "phoneNumber": "9876543210",
  "address": "456 New St"
}
```

### Food Donations

#### Get All Available Donations
```http
GET /api/donations
```

#### Get Donation Details
```http
GET /api/donations/{donationId}
```

#### Search Donations
```http
GET /api/donations/search?location=Downtown&foodType=Biryani&availableFrom=2024-01-15T18:00:00
```

#### Create Donation
```http
POST /api/donations
Authorization: Bearer <token>
Content-Type: application/json

{
  "eventName": "Wedding Reception",
  "description": "Leftover biryani and desserts",
  "foodItems": "Biryani, Desserts, Juice",
  "quantity": 10,
  "unit": "kg",
  "pickupLocation": "Hotel ABC, Downtown",
  "latitude": 28.6139,
  "longitude": 77.2090,
  "availableFrom": "2024-01-15T18:00:00",
  "availableUntil": "2024-01-15T22:00:00",
  "price": 0
}
```

#### Update Donation
```http
PUT /api/donations/{donationId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "eventName": "Updated Event Name"
}
```

#### Delete Donation
```http
DELETE /api/donations/{donationId}
Authorization: Bearer <token>
```

#### Upload Food Image
```http
POST /api/donations/{donationId}/upload-image
Authorization: Bearer <token>
Content-Type: multipart/form-data

form-data:
  file: <image file>
```

### Food Requests

#### Create Request
```http
POST /api/requests
Authorization: Bearer <token>
Content-Type: application/json

{
  "donationId": 1,
  "quantityRequested": 5,
  "message": "We need food for 50 people"
}
```

#### Get My Requests (Receiver)
```http
GET /api/requests/receiver/my-requests
Authorization: Bearer <token>
```

#### Get Incoming Requests (Donor)
```http
GET /api/requests/donor/incoming
Authorization: Bearer <token>
```

#### Approve Request
```http
PUT /api/requests/{requestId}/approve
Authorization: Bearer <token>
```

#### Reject Request
```http
PUT /api/requests/{requestId}/reject
Authorization: Bearer <token>
```

#### Mark as Completed
```http
PUT /api/requests/{requestId}/mark-completed
Authorization: Bearer <token>
```

#### Cancel Request
```http
DELETE /api/requests/{requestId}
Authorization: Bearer <token>
```

### Admin

#### Get All Users
```http
GET /api/admin/users
Authorization: Bearer <admin-token>
```

#### Activate User
```http
PUT /api/admin/users/{userId}/activate
Authorization: Bearer <admin-token>
```

#### Deactivate User
```http
PUT /api/admin/users/{userId}/deactivate
Authorization: Bearer <admin-token>
```

#### Get Statistics
```http
GET /api/admin/stats
Authorization: Bearer <admin-token>
```

## Configuration (application.yml)

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/foodshare_db
    username: root
    password: root
    driver-class-name: com.mysql.cj.jdbc.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
  servlet:
    multipart:
      max-file-size: 5MB
      max-request-size: 5MB

server:
  port: 8080
  servlet:
    context-path: /api

jwt:
  secret: foodshare_secret_key_very_long_and_secure_for_jwt_token_generation_2024
  expiration: 86400000  # 24 hours in milliseconds

upload:
  path: uploads
```

## Authentication & Security

### JWT Token Flow
1. User registers/logs in
2. Backend generates JWT token with user claims
3. Frontend stores token in localStorage
4. Each request includes token in Authorization header: `Bearer <token>`
5. Backend validates token before processing request

### Token Claims
- `sub`: username
- `userId`: user ID
- `email`: user email
- `role`: user role (ADMIN, DONOR, RECEIVER)
- `exp`: expiration time
- `iat`: issued at time

### Password Security
- Passwords are hashed using BCryptPasswordEncoder
- Minimum password length: 6 characters

## File Upload

- **Max file size**: 5MB
- **Allowed formats**: jpg, jpeg, png
- **Storage location**: `uploads/{userId}/{timestamp}.{extension}`
- **Access**: Images are served as static files

## Exception Handling

The application includes global exception handling with proper HTTP status codes:

- `400 Bad Request`: Validation errors
- `401 Unauthorized`: Authentication failures
- `403 Forbidden`: Authorization failures / Access denied
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server errors

## Testing the API

### Using Postman/Insomnia

1. **Set up environment**
   - Base URL: `http://localhost:8080/api`
   - Add `Authorization` header with token for protected routes

2. **Test workflow**
   - Register → Login → Create Donation → Search → Create Request → Approve

3. **Import provided Postman collection** (if available)

## Troubleshooting

### MySQL Connection Issues
```bash
# Check if MySQL is running
sudo service mysql status

# Restart MySQL
sudo service mysql restart

# Test connection
mysql -u root -proot -e "SHOW DATABASES;"
```

### Port 8080 Already in Use
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9
```

### Build Errors
```bash
# Clean and rebuild
mvn clean install -U

# Clear Maven cache
rm -rf ~/.m2/repository
mvn clean install
```

### Database Migration Issues
- Set `ddl-auto: update` in `application.yml` for automatic schema creation
- Or manually run SQL schema creation scripts

## Performance Optimization

- Add indexes on frequently queried columns (userId, status, location)
- Implement pagination for large result sets
- Cache donation listings
- Optimize JPA queries with projection

## Security Best Practices

1. ✅ Passwords are hashed with BCrypt
2. ✅ JWT tokens are signed and validated
3. ✅ CORS is configured for frontend origin only
4. ✅ Role-based access control implemented
5. ⚠️  TODO: Add HTTPS for production
6. ⚠️  TODO: Implement rate limiting
7. ⚠️  TODO: Add request validation constraints

## Future Enhancements

- [ ] WebSocket for real-time notifications
- [ ] Geospatial queries for location-based search
- [ ] Email notifications
- [ ] User ratings and reviews
- [ ] Advanced analytics
- [ ] Payment integration
- [ ] API documentation with Swagger/OpenAPI
- [ ] Unit and integration tests

## Logs

Check logs for debugging:
```bash
# View logs in real-time
tail -f target/logs/foodshare.log

# Search for errors
grep ERROR target/logs/foodshare.log
```

## License

Open source for educational purposes.
