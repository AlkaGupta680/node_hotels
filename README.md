# Hotel Management System

A full-stack hotel management application with separate backend and frontend.

## Project Structure

```
├── backend/          # Node.js/Express backend
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── Auth.js       # Passport authentication
│   ├── db.js         # Database connection
│   ├── jwt.js        # JWT middleware
│   └── script.js     # Main server file
└── frontend/         # React frontend
    ├── src/
    │   ├── components/
    │   └── services/
    └── package.json
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your MongoDB connection string and JWT secret:
   ```
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

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
   npm run dev
   ```

## Features

- User authentication (signup/login)
- JWT token-based authorization
- User profile management
- Staff management
- Menu item management
- Responsive design with Tailwind CSS

## API Endpoints

### Authentication
- `POST /person/signup` - User registration
- `POST /person/login` - User login
- `GET /person/profile` - Get user profile

### Person Management
- `GET /person` - Get all persons
- `GET /person/:workType` - Get persons by work type
- `PUT /person/:id` - Update person
- `DELETE /person/:id` - Delete person

### Menu Management
- `GET /MenuItem` - Get all menu items
- `POST /MenuItem` - Create menu item

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Passport.js for local authentication
- bcrypt for password hashing

### Frontend
- React
- Axios for API calls
- Tailwind CSS for styling
- Vite for build tooling