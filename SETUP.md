# HRMS Lite - Setup Instructions

## Quick Start (5 minutes)

### Prerequisites
- Docker & Docker Compose installed
OR
- Node.js 18+, Python 3.11+, MongoDB

### Option 1: Docker (Easiest)

```bash
# Navigate to project directory
cd /Users/aadeshparija/Documents/Daily_code/hrms-lite

# Start all services
docker-compose up --build

# Wait for all services to start
# Access the application:
# Frontend: http://localhost:4200
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

**That's it!** The entire system is now running.

---

### Option 2: Manual Setup (For Development)

#### Step 1: Start MongoDB
```bash
# Using Homebrew (macOS)
brew install mongodb-community
brew services start mongodb-community

# Or using Docker
docker run -d -p 27017:27017 mongo:latest
```

#### Step 2: Start Backend
```bash
cd /Users/aadeshparija/Documents/Daily_code/hrms-lite/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Run server
python main.py

# Backend starts on http://localhost:8000
# API Docs available at http://localhost:8000/docs
```

#### Step 3: Start Frontend (in new terminal)
```bash
cd /Users/aadeshparija/Documents/Daily_code/hrms-lite/frontend

# Install dependencies
npm install

# Start development server
npm start

# Frontend starts on http://localhost:4200
```

---

## Testing the Application

### 1. Add an Employee
- Navigate to: http://localhost:4200/employees
- Fill in the form:
  - Employee ID: `EMP001`
  - Full Name: `John Doe`
  - Email: `john@example.com`
  - Department: `Engineering`
- Click "Add Employee"

### 2. View Employees
- All added employees appear in the table below the form

### 3. Mark Attendance
- Navigate to: http://localhost:4200/attendance
- Select an employee from the dropdown
- Select today's date
- Select "Present" or "Absent"
- Click "Mark Attendance"

### 4. View Attendance
- All marked attendances appear in the table

---

## API Testing (Using cURL or Postman)

### Create Employee
```bash
curl -X POST http://localhost:8000/api/employees \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP001",
    "full_name": "John Doe",
    "email": "john@example.com",
    "department": "Engineering"
  }'
```

### Get All Employees
```bash
curl http://localhost:8000/api/employees
```

### Mark Attendance
```bash
curl -X POST http://localhost:8000/api/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "employee_id": "EMP001",
    "date": "2025-02-03",
    "status": "Present"
  }'
```

### Get Attendance for Employee
```bash
curl http://localhost:8000/api/attendance/EMP001
```

---

## Troubleshooting

### MongoDB Connection Error
```
Error: Connection refused
```
**Solution**: Ensure MongoDB is running
```bash
# Check if running
brew services list | grep mongodb

# Start if not running
brew services start mongodb-community

# Or restart Docker MongoDB
docker ps | grep mongo
```

### Port Already in Use
```
Address already in use
```
**Solution**: Kill the process using the port
```bash
# For port 8000 (Backend)
lsof -i :8000
kill -9 <PID>

# For port 4200 (Frontend)
lsof -i :4200
kill -9 <PID>

# For port 27017 (MongoDB)
lsof -i :27017
kill -9 <PID>
```

### CORS Error in Frontend
**Solution**: Backend has CORS enabled for all origins in development. If still facing issues:
1. Clear browser cache: Cmd+Shift+Delete
2. Restart frontend: Ctrl+C in frontend terminal, then `npm start`

### Module Not Found in Frontend
**Solution**: Reinstall packages
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Module Not Found in Backend
**Solution**: Reinstall packages
```bash
cd backend
source venv/bin/activate
pip install --force-reinstall -r requirements.txt
python main.py
```

---

## Project Structure

```
hrms-lite/
├── README.md                 # Full documentation
├── PROJECT_SUMMARY.md        # This file
├── package.json             # Root scripts
├── docker-compose.yml       # Docker configuration
├── start.sh                # Quick start script
│
├── backend/
│   ├── main.py             # FastAPI entry point
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example        # Environment template
│   ├── Dockerfile          # Docker config
│   └── app/
│       ├── database.py     # MongoDB setup
│       ├── models.py       # Validation schemas
│       └── routes/
│           ├── employees.py  # Employee APIs
│           └── attendance.py  # Attendance APIs
│
└── frontend/
    ├── package.json         # Node dependencies
    ├── angular.json         # Angular config
    ├── Dockerfile          # Docker config
    └── src/
        ├── main.ts         # Bootstrap
        ├── index.html      # HTML entry
        └── app/
            ├── app.component.ts
            ├── app.routes.ts
            ├── services/     # API services
            └── components/   # UI components
```

---

## Development Tips

### Hot Reload
- **Frontend**: Automatically reloads on file save
- **Backend**: Restart `python main.py` to see changes

### API Documentation
- Interactive: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Database Inspection
```bash
# Open MongoDB shell
mongosh

# List databases
show databases

# Select HRMS database
use hrms_lite

# View employees
db.employees.find()

# View attendance
db.attendance.find()
```

### Frontend Console Logs
- Open browser DevTools: F12 or Cmd+Option+I
- Check Console and Network tabs for debugging

---

## Building for Production

### Build Frontend
```bash
cd frontend
npm run build

# Output in: frontend/dist/hrms-lite/
```

### Build Backend Docker Image
```bash
cd backend
docker build -t hrms-backend:latest .
```

### Build Both with Docker Compose
```bash
docker-compose build
```

---

## Deployment Checklist

- [ ] Push code to GitHub
- [ ] Update MongoDB connection string
- [ ] Update API URL in frontend environment
- [ ] Deploy backend (Render/Railway)
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Test all endpoints on production
- [ ] Verify CORS settings
- [ ] Set up monitoring

---

## Support & Questions

If you encounter any issues:
1. Check the README.md for detailed documentation
2. Check the troubleshooting section above
3. Review browser console for frontend errors
4. Check backend logs for API errors
5. Verify all services are running: `docker-compose ps`

---

**Ready to start?** Run: `docker-compose up --build` 🚀
