# HRMS Lite - Human Resource Management System

A lightweight, full-stack Human Resource Management System built with modern technologies for managing employee records and attendance tracking.

## Tech Stack

- **Frontend:** Angular 17 (Standalone Components)
- **Backend:** FastAPI (Python)
- **Database:** MongoDB
- **Deployment:** Docker, Vercel (Frontend), Render (Backend)

## Features

### Employee Management
- Add new employees with Employee ID, Full Name, Email, and Department
- View all employee records in a professional table format
- Delete employees with confirmation
- Duplicate employee ID and email validation

### Attendance Management
- Mark attendance for employees with date and status (Present/Absent)
- View attendance records for all employees
- Employee name lookup in attendance records
- Clean historical records display

### UI Features
- Responsive and professional layout
- Real-time loading states
- Empty state messaging
- Error handling with user-friendly messages
- Success notifications
- Intuitive navigation between sections

## Project Structure

```
hrms-lite/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── database.py          # MongoDB connection
│   │   ├── models.py            # Pydantic models for validation
│   │   └── routes/
│   │       ├── employees.py     # Employee API endpoints
│   │       └── attendance.py    # Attendance API endpoints
│   ├── main.py                  # FastAPI app entry point
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   └── .gitignore
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.component.ts           # Root component
│   │   │   ├── app.routes.ts             # Routing configuration
│   │   │   ├── services/
│   │   │   │   ├── employee.service.ts   # Employee API service
│   │   │   │   └── attendance.service.ts # Attendance API service
│   │   │   └── components/
│   │   │       ├── navbar/
│   │   │       ├── employee-list/
│   │   │       └── attendance/
│   │   ├── main.ts
│   │   └── index.html
│   ├── angular.json
│   ├── tsconfig.json
│   ├── package.json
│   ├── Dockerfile
│   └── .gitignore
├── docker-compose.yml
└── README.md
```

## Prerequisites

- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- MongoDB 5.0+ (or Docker)
- Docker & Docker Compose (for containerized setup)

## Local Setup

### Option 1: Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd hrms-lite

# Build and start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:4200
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Update MONGO_URL if not using default

# Start MongoDB (in another terminal)
mongod

# Run the application
python main.py
```

Backend will be available at `http://localhost:8000`

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will be available at `http://localhost:4200`

## API Documentation

### Base URL
- Local: `http://localhost:8000`
- Interactive docs: `http://localhost:8000/docs`

### Employee Endpoints

#### Create Employee
```
POST /api/employees
Content-Type: application/json

{
  "employee_id": "EMP001",
  "full_name": "John Doe",
  "email": "john@example.com",
  "department": "Engineering"
}
```

#### Get All Employees
```
GET /api/employees
```

#### Get Employee by ID
```
GET /api/employees/{employee_id}
```

#### Delete Employee
```
DELETE /api/employees/{employee_id}
```

### Attendance Endpoints

#### Mark Attendance
```
POST /api/attendance
Content-Type: application/json

{
  "employee_id": "EMP001",
  "date": "2025-02-03",
  "status": "Present"
}
```

#### Get Employee Attendance
```
GET /api/attendance/{employee_id}
```

#### Get All Attendance Records
```
GET /api/attendance
```

## Validation Rules

### Employee
- Employee ID: Required, unique, 1-50 characters
- Full Name: Required, 1-100 characters
- Email: Required, valid email format, unique
- Department: Required, 1-100 characters

### Attendance
- Employee ID: Required, must exist in database
- Date: Required, format YYYY-MM-DD
- Status: Required, must be "Present" or "Absent"
- One record per employee per day

## Error Handling

All API responses follow consistent error format:

```json
{
  "detail": "Meaningful error message"
}
```

### Common Status Codes
- `201`: Created successfully
- `204`: Deleted successfully
- `400`: Bad request (validation error)
- `404`: Resource not found
- `500`: Server error

## Deployment

### Frontend Deployment (Vercel)

```bash
cd frontend
npm run build

# Deploy using Vercel CLI
vercel

# Or connect GitHub repo to Vercel dashboard
```

Environment variables:
```
ANGULAR_APP_API_URL=https://your-backend-api.com
```

### Backend Deployment (Render)

1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables:
   ```
   MONGO_URL=your-mongodb-atlas-url
   ```
4. Deploy

### Database (MongoDB Atlas)

1. Create account at mongodb.com/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGO_URL` in environment variables

## Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## Performance Considerations

- Database indexes on `employee_id`, `email`, and `date`
- CORS enabled for frontend-backend communication
- Pagination ready (can be added to endpoints)
- Efficient MongoDB queries with sorting

## Assumptions & Limitations

- Single admin user (no authentication required as per requirements)
- No user session management
- Email validation at API level
- MongoDB running and accessible
- Frontend must have backend URL configured
- No advanced filtering (can be added)
- No role-based access control

## Security Notes

For production deployment:
- Set `CORS_ORIGINS` to specific frontend domain
- Use environment variables for sensitive data
- Implement API rate limiting
- Add authentication/authorization
- Use HTTPS for all communications
- Validate and sanitize all inputs
- Use MongoDB connection pooling

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running on localhost:27017
- Check `MONGO_URL` in `.env` file
- Verify MongoDB service status

### CORS Errors
- Backend CORS is configured for all origins in development
- For production, update `CORS_ORIGINS` to specific domains

### API Not Responding
- Ensure backend is running on port 8000
- Check if port 8000 is not in use: `lsof -i :8000`
- Verify MONGO_URL configuration

### Frontend Not Loading
- Clear browser cache
- Ensure Angular CLI is installed: `npm install -g @angular/cli`
- Check if port 4200 is not in use

## Future Enhancements

- User authentication and authorization
- Advanced attendance filtering and reporting
- Employee salary management
- Leave management system
- Performance metrics and dashboards
- Email notifications
- Mobile application

## License

MIT

## Contact

For support or questions, please reach out to the development team.
