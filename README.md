# Enhanced Public Infrastructure Booking Platform

A modern web application for booking public infrastructure facilities like community halls, parks, crematoriums, guest houses, and stadiums.

## 🚀 Features

- Dynamic facility booking system
- Real-time slot availability
- Secure payment processing
- Booking management dashboard
- Admin panel for facility management
- Responsive design for all devices

## 🛠️ Tech Stack

### Frontend

- React.js
- Material UI
- React Router
- React Hook Form
- Redux Toolkit
- Axios

### Backend

- Spring Boot
- PostgreSQL
- Redis
- JWT Authentication
- Razorpay Integration

## 🚀 Getting Started

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### Backend Setup

```bash
cd backend
mvn spring-boot:run
```

## 📁 Project Structure

```
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── store/        # Redux store
│   │   └── utils/        # Utility functions
│   └── public/           # Static files
│
└── backend/              # Spring Boot backend application
    ├── src/
    │   ├── main/
    │   │   ├── java/    # Java source files
    │   │   └── resources/ # Configuration files
    │   └── test/        # Test files
    └── pom.xml          # Maven configuration
```

## 🔐 Environment Variables

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:8080
REACT_APP_RAZORPAY_KEY=your_razorpay_key
```

### Backend (application.properties)

```
spring.datasource.url=jdbc:postgresql://localhost:5432/booking_platform
spring.datasource.username=your_username
spring.datasource.password=your_password
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
