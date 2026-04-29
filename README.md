# Smart Campus Hub

A full-stack web application for managing campus resources, bookings, maintenance tickets, and user dashboards. Built with Java Spring Boot (backend) and React (frontend).

## Features
- User authentication (with Google Auth support)
- Resource management (add, view, update, delete)
- Booking system (create, view, verify bookings)
- Maintenance ticketing (create, track, admin panel)
- Admin and user dashboards
- Analytics for resources

## Tech Stack
- **Backend:** Java, Spring Boot, Maven
- **Frontend:** React, Vite, Tailwind CSS
- **Database:** (Specify your DB, e.g., MySQL/PostgreSQL)
- **Other:** Google Auth

## Folder Structure
```
backend/   # Spring Boot backend (API, business logic, DB)
frontend/  # React frontend (UI, client logic)
```

## Setup Instructions
### Prerequisites
- Java 17+
- Node.js 16+
- npm 8+
- Maven 3.8+

### Backend Setup
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Build and run the backend:
   ```sh
   mvn spring-boot:run
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

## Usage
- Access the frontend at: `http://localhost:5173` (default Vite port)
- Backend API runs at: `http://localhost:8080` (default Spring Boot port)
- Update database credentials in `backend/src/main/resources/application.properties` as needed.

## Contribution Guidelines
- Fork the repo and create a feature branch
- Follow code style and naming conventions
- Submit pull requests with clear descriptions




