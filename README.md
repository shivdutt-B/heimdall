# Heimdall - Server Monitoring & Keep-Alive Platform

Heimdall is a full-stack web application that monitors your servers, keeps them alive, and provides analytics on their performance.

## Features

- **User Authentication**: Secure login and registration system
- **Server Management**: Add, edit, and remove servers to monitor
- **Keep-Alive Service**: Automatically ping your servers to prevent them from going to sleep
- **Performance Metrics**: Track response times, uptime percentages, and more
- **Alert System**: Get notified when your servers go down
- **Analytics Dashboard**: Visualize server performance with interactive charts

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **Job Scheduling**: Node-cron
- **Email Alerts**: Nodemailer

## Getting Started

### Prerequisites

- Node.js (v14+)
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/heimdall.git
   cd heimdall
   ```

2. Install dependencies:

   ```
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables:

   ```
   # Create .env file in the backend directory
   cd ../backend
   cp .env.example .env
   ```

4. Update the `.env` file with your database credentials and JWT secret.

5. Set up the database:

   ```
   npx prisma migrate dev
   ```

6. Start the development servers:

   ```
   # Start backend (from backend directory)
   npm run dev

   # Start frontend (from frontend directory)
   cd ../frontend
   npm start
   ```

## Project Structure

```
heimdall/
├── backend/            # Backend Node.js/Express API
│   ├── prisma/         # Prisma schema and migrations
│   └── src/
│       ├── config/     # Configuration files
│       ├── controllers/# Route controllers
│       ├── middleware/ # Custom middleware
│       ├── models/     # Data models
│       ├── routes/     # API routes
│       └── utils/      # Utility functions
├── frontend/           # React frontend
│   └── src/
│       ├── components/ # React components
│       ├── contexts/   # React contexts
│       ├── hooks/      # Custom hooks
│       ├── pages/      # Page components
│       └── services/   # API service functions
└── README.md           # Project documentation
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user and get token
- `GET /api/auth/me` - Get authenticated user

### Servers

- `GET /api/servers` - Get all servers for authenticated user
- `GET /api/servers/:id` - Get server by ID
- `POST /api/servers` - Create a new server
- `PUT /api/servers/:id` - Update server
- `DELETE /api/servers/:id` - Delete server
- `PUT /api/servers/:id/alerts` - Update alert settings for a server

### Users

- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Update user password
- `PUT /api/users/settings` - Update user settings

## License

This project is licensed under the MIT License.
