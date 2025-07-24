# PurdueRide Backend

Backend API server for the PurdueRide ride-sharing application built with Node.js, Express.js, and TypeScript.

## Features

- Supabase Auth integration with Purdue email verification
- Ride management and booking system
- User profile management
- Real-time ride status updates via Supabase Realtime
- Comprehensive input validation and security
- Rate limiting and CORS protection
- Structured logging and error handling

## Tech Stack

- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js 4.x
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth with JWT
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage
- **Testing**: Jest with Supertest
- **Logging**: Winston

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 8 or higher
- Supabase project (create at https://supabase.com)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your Supabase project credentials

### Development

Start the development server with hot reloading:
```bash
npm run dev
```

Build the project:
```bash
npm run build
```

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

### Production

Build and start the production server:
```bash
npm run build
npm start
```

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /` - Basic API information

More endpoints will be added as development progresses.

## Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # Express routes
├── services/        # Business logic services
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

## Contributing

1. Follow TypeScript best practices
2. Write tests for new features
3. Use conventional commit messages
4. Ensure code passes linting and tests

## License

MIT