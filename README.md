# PurdueRide

PurdueRide is a ride-sharing application designed specifically for Purdue University students, offering affordable fixed-price ($3) rides around campus and West Lafayette.

## Project Overview

This repository contains both the frontend and backend code for the PurdueRide application. The frontend is built with React, TypeScript, and Tailwind CSS, while the backend will be implemented using Node.js, Express, and MongoDB.

## Frontend Architecture

The frontend is a modern React application built with TypeScript, Vite, and Tailwind CSS. It follows a component-based architecture with a focus on reusability, accessibility, and responsive design.

### Directory Structure

```
purdueride-frontend/
├── public/              # Static assets
├── src/                 # Source code
│   ├── assets/          # Images, fonts, and other static assets
│   ├── components/      # Reusable UI components
│   │   ├── common/      # Generic UI components (Button, Input, Card, etc.)
│   │   ├── features/    # Feature-specific components (RideCard, RideRequestForm, etc.)
│   │   └── layout/      # Layout components (Header, Footer, Layout)
│   ├── context/         # React context providers (AuthContext, etc.)
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── services/        # API services and other service layers
│   ├── test/            # Test utilities and mocks
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

### Key Features

- **Authentication**: User registration and login with Purdue email addresses
- **Ride Booking**: Request rides with pickup and drop-off locations
- **Ride Scheduling**: Schedule rides in advance
- **Ride History**: View past rides and their status
- **Profile Management**: Update user profile information
- **Responsive Design**: Works on mobile, tablet, and desktop devices
- **Accessibility**: WCAG 2.1 AA compliant

## Backend Implementation Guide

To implement the backend for PurdueRide, follow these steps:

### 1. Setup Backend Project

Create a new directory for the backend:

```bash
mkdir purdueride-backend
cd purdueride-backend
npm init -y
```

Install necessary dependencies:

```bash
npm install express mongoose dotenv cors jsonwebtoken bcrypt helmet morgan
npm install --save-dev typescript ts-node nodemon @types/express @types/mongoose @types/cors @types/jsonwebtoken @types/bcrypt @types/morgan
```

### 2. Configure TypeScript

Create a `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "target": "es2018",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "**/*.test.ts"]
}
```

### 3. Project Structure

Set up the following directory structure:

```
purdueride-backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # Express routes
│   ├── services/       # Business logic
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   └── app.ts          # Express app setup
└── server.ts           # Server entry point
```

### 4. Implement Core Models

Based on the frontend types, implement these Mongoose models:

- User
- Ride
- RideRequest
- Vehicle

### 5. Implement API Endpoints

Implement the following API endpoints as defined in the frontend's `API_ENDPOINTS` object:

#### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/register` - User registration
- POST `/api/auth/logout` - User logout
- POST `/api/auth/refresh` - Refresh authentication token
- GET `/api/auth/verify` - Verify authentication token

#### Rides
- GET `/api/rides/available` - Get available rides
- POST `/api/rides/request` - Request a ride
- GET `/api/rides/history` - Get user's ride history
- GET `/api/rides/status/:id` - Get status of a specific ride
- POST `/api/rides/cancel/:id` - Cancel a ride request

#### User
- GET `/api/user/profile` - Get user profile
- PUT `/api/user/update` - Update user profile
- POST `/api/user/verify` - Verify user (e.g., student status)

### 6. Authentication and Security

- Implement JWT-based authentication
- Store passwords securely using bcrypt
- Implement proper validation for all inputs
- Use middleware to protect routes that require authentication

### 7. Database Setup

- Set up MongoDB connection
- Create indexes for frequently queried fields
- Implement data validation at the schema level

### 8. Testing

- Write unit tests for controllers and services
- Write integration tests for API endpoints
- Set up a test database for testing

### 9. Deployment

- Set up environment variables for different environments
- Configure logging for production
- Set up error handling and monitoring
- Deploy to a cloud provider (e.g., Heroku, AWS, DigitalOcean)

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB (for backend)

### Frontend Setup

```bash
cd purdueride-frontend
npm install
npm run dev
```

### Backend Setup (After Implementation)

```bash
cd purdueride-backend
npm install
npm run dev
```

## Testing

### Frontend Tests

```bash
cd purdueride-frontend
npm test
```

### Backend Tests (After Implementation)

```bash
cd purdueride-backend
npm test
```

## Building for Production

### Frontend

```bash
cd purdueride-frontend
npm run build
```

### Backend (After Implementation)

```bash
cd purdueride-backend
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.