# FoodShare - Food Donation Platform

FoodShare is a full-stack web application that helps reduce food wastage from marriage halls, function halls, and events by connecting food donors with receivers (NGOs, shelters, nearby people).

## Project Structure

```
FoodShare/
├── foodshare-backend/       # Spring Boot Backend
│   ├── src/
│   ├── pom.xml
│   └── README.md
└── foodshare-frontend/      # React Frontend
    ├── src/
    ├── package.json
    └── index.html
```

## Features

### User Roles
- **Admin**: Platform management, user activation/deactivation
- **Food Donor**: Can post leftover food, manage listings, approve/reject requests
- **Receiver**: Can browse available food, request items, track orders

### Core Features
- User registration and login with JWT authentication
- Role-based access control
- Food donation posting with images and details
- Search and filter donations by location, food type, and availability
- Food request management system
- Order tracking and status updates
- File upload for food images

## Tech Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Security**: Spring Security with JWT
- **Database**: MySQL 8.0
- **ORM**: Spring Data JPA
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18.x
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **UI Library**: Bootstrap 5 + React-Bootstrap

## Prerequisites

- Java 17+
- Node.js 16+ with npm
- MySQL 8.0+
- Git

## Installation & Setup

### 1. Backend Setup (Spring Boot)

#### Step 1: Navigate to backend directory
```bash
cd foodshare-backend
```

#### Step 2: Create MySQL Database
```sql
CREATE DATABASE foodshare_db;
```

#### Step 3: Update database credentials in application.yml
Edit `src/main/resources/application.yml` and update MySQL credentials if needed:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/foodshare_db
    username: root          # Update if different
    password: root          # Update if different
```

#### Step 4: Build the project
```bash
mvn clean install
```

#### Step 5: Run the application
```bash
mvn spring-boot:run
```

The backend will start at `http://localhost:8080`

### 2. Frontend Setup (React)

#### Step 1: Navigate to frontend directory
```bash
cd foodshare-frontend
```

#### Step 2: Install dependencies
```bash
npm install
```

#### Step 3: Run development server
```bash
npm run dev
```

The frontend will start at `http://localhost:3000`

## Running the Application

1. **Start MySQL Server**
   - Ensure MySQL is running on localhost:3306

2. **Start Backend**
   ```bash
   cd foodshare-backend
   mvn spring-boot:run
   ```
   - Backend will be available at `http://localhost:8080/api`

3. **Start Frontend**
   ```bash
   cd foodshare-frontend
   npm run dev
   ```
   - Frontend will be available at `http://localhost:3000`

4. **Access Application**
   - Open browser and navigate to `http://localhost:3000`

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Food Donation Endpoints
- `GET /api/donations` - Get all available donations
- `GET /api/donations/{id}` - Get specific donation
- `GET /api/donations/search` - Search/filter donations
- `POST /api/donations` - Create new donation (DONOR only)
- `PUT /api/donations/{id}` - Update donation (DONOR only)
- `DELETE /api/donations/{id}` - Delete donation (DONOR only)
- `POST /api/donations/{id}/upload-image` - Upload food image

### Food Request Endpoints
- `POST /api/requests` - Create food request (RECEIVER only)
- `GET /api/requests/{id}` - Get request details
- `GET /api/requests/receiver/my-requests` - Get my requests (RECEIVER)
- `GET /api/requests/donor/incoming` - Get incoming requests (DONOR)
- `PUT /api/requests/{id}/approve` - Approve request (DONOR only)
- `PUT /api/requests/{id}/reject` - Reject request (DONOR only)
- `PUT /api/requests/{id}/mark-completed` - Mark as completed
- `DELETE /api/requests/{id}` - Cancel request (RECEIVER only)

### User Endpoints
- `GET /api/users/me` - Get current user profile
- `GET /api/users/{id}` - Get user profile
- `PUT /api/users/{id}` - Update user profile

### Admin Endpoints
- `GET /api/admin/users` - List all users (ADMIN only)
- `PUT /api/admin/users/{id}/activate` - Activate user (ADMIN only)
- `PUT /api/admin/users/{id}/deactivate` - Deactivate user (ADMIN only)
- `GET /api/admin/stats` - Get platform statistics (ADMIN only)

## Testing

### Backend Testing with Postman

1. **Register a new user**
   ```
   POST http://localhost:8080/api/auth/register
   Body: {
     "username": "donor1",
     "email": "donor1@example.com",
     "password": "password123",
     "fullName": "John Donor",
     "phoneNumber": "9876543210",
     "address": "123 Main St",
     "role": "DONOR"
   }
   ```

2. **Login**
   ```
   POST http://localhost:8080/api/auth/login
   Body: {
     "email": "donor1@example.com",
     "password": "password123"
   }
   ```

3. **Create a donation** (use token from login)
   ```
   POST http://localhost:8080/api/donations
   Headers: Authorization: Bearer <token>
   Body: {
     "eventName": "Wedding Reception",
     "description": "Leftover biryani and desserts",
     "foodItems": "Biryani, Desserts, Juice",
     "quantity": 10,
     "unit": "kg",
     "pickupLocation": "Hotel ABC, Downtown",
     "availableFrom": "2024-01-15T18:00:00",
     "availableUntil": "2024-01-15T22:00:00",
     "price": 0
   }
   ```

## Database Schema

### Users Table
- id, username, email, password, fullName, phoneNumber, address, role, isActive, createdAt, updatedAt

### Food Donations Table
- id, donorId, eventName, description, foodItems, quantity, unit, pickupLocation, latitude, longitude, availableFrom, availableUntil, price, imagePath, status, createdAt, updatedAt

### Food Requests Table
- id, donationId, receiverId, quantityRequested, message, status, requestedAt, respondedAt, pickupAt, updatedAt

## File Upload

Food images are stored locally in the `uploads/` directory on the backend server. The path is configurable in `application.yml`:

```yaml
upload:
  path: uploads
```

Max file size: 5MB
Allowed formats: jpg, jpeg, png

## Environment Variables

### Backend (application.yml)
- `spring.datasource.url` - MySQL connection URL
- `spring.datasource.username` - MySQL username
- `spring.datasource.password` - MySQL password
- `jwt.secret` - JWT signing secret
- `jwt.expiration` - JWT token expiration time (ms)
- `upload.path` - File upload directory

### Frontend (.env or vite.config.js)
- API base URL is currently hardcoded to `http://localhost:8080/api`

## Common Issues

### Backend won't start
- Check MySQL is running: `mysql -u root -p`
- Verify database exists: `SHOW DATABASES;`
- Check port 8080 is available
- Build project first: `mvn clean install`

### Frontend won't connect to backend
- Ensure backend is running on port 8080
- Check CORS configuration in `SecurityConfig.java`
- Verify API URL in frontend services

### MySQL connection error
- Check MySQL credentials in `application.yml`
- Ensure MySQL server is running
- Verify database `foodshare_db` exists

## Next Steps / Future Enhancements

1. **Real-time Notifications**: Add WebSocket for real-time request notifications
2. **Geolocation**: Implement distance-based filtering for nearby food
3. **Payment Integration**: Add payment gateway (Stripe/Razorpay)
4. **Reviews & Ratings**: User review system
5. **Mobile App**: React Native mobile application
6. **Analytics Dashboard**: Advanced admin dashboard with analytics
7. **Email Notifications**: Email alerts for requests and approvals
8. **Scheduling**: Schedule recurring donations

## Troubleshooting

### Step-by-step test flow:
1. Register as a DONOR
2. Create a food donation
3. Register as a RECEIVER
4. Search and view available donations
5. Request food from a donation
6. Switch to DONOR account and approve request
7. RECEIVER marks order as completed

## Support

For issues or questions, please check:
1. Backend logs: `target/` directory
2. Browser console for frontend errors
3. MySQL logs and status
4. Network tab in browser DevTools

## License

This project is open source and available for educational purposes.

## Author

FoodShare Development Team - 2024
