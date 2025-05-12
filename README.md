# Enhanced Public Infrastructure Booking Platform

A modern web application for booking public infrastructure facilities like community halls, parks, crematoriums, guest houses, and stadiums.

## Features

- Dynamic form fields based on facility selection
- Slot availability & booking concurrency control
- Secure online payment simulation
- Real-time status updates
- Cancellation and refund logic
- Admin panel for facility management

## Tech Stack

### Frontend

- React.js with TypeScript
- Material UI for components
- React Router for navigation
- React Hook Form for form handling
- Axios for API calls

### Backend

- Spring Boot (Java)
- PostgreSQL for data storage
- Redis for caching and locking
- JWT for authentication
- Spring Security

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Java 17
- PostgreSQL
- Redis

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Build the project:

   ```bash
   ./mvnw clean install
   ```

3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   └── package.json
│
└── backend/
    ├── src/
    │   ├── main/
    │   │   ├── java/
    │   │   │   └── com/booking/
    │   │   │       ├── controller/
    │   │   │       ├── model/
    │   │   │       ├── repository/
    │   │   │       ├── service/
    │   │   │       └── config/
    │   │   └── resources/
    │   └── test/
    └── pom.xml
```

## API Documentation

The API documentation will be available at `/swagger-ui.html` when running the backend server.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
