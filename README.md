# HR System

A full-stack HR system built with NestJS and React.

## Features

- HR Employee Authentication
- Employee Management (Add/Edit)
- Attendance Tracking
- Protected Routes
- Role-based Access Control

## Tech Stack

### Backend
- NestJS
- TypeORM
- SQLite
- JWT Authentication
- TypeScript

### Frontend
- React
- TypeScript
- Mantine UI
- React Query
- React Router
- Axios

## Setup & Installation

1. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

2. Create an initial HR employee:
```bash
# Start the backend server
cd backend
npm run start

# In another terminal, use curl to create an HR employee
curl -X POST http://localhost:4000/auth/employees \
  -H "Content-Type: application/json" \
  -d '{
    "name": "HR Admin",
    "email": "admin@hr.com",
    "password": "password123",
    "group": "HR"
  }'
```

3. Start both frontend and backend:
```bash
# In the root directory
npm run dev
```

## Usage

1. Access the application at http://localhost:3000
2. Login with the HR employee credentials:
   - Email: admin@hr.com
   - Password: password123
3. Use the dashboard to:
   - View all employees
   - Add new employees
   - Mark attendance
   - Edit employee details

## API Endpoints

### Authentication
- POST /auth/login - Login
- POST /auth/employees - Create employee (HR only)

### Employees
- GET /employees - Get all employees
- GET /employees/:id - Get employee by ID
- PATCH /employees/:id - Update employee
- POST /employees/attendance - Create attendance
- GET /employees/:id/attendance - Get employee attendance

## Notes

- Only HR employees can log in to the system
- All routes except login require JWT authentication
- The system uses SQLite for simplicity, but can be easily modified to use other databases
