# API Testing Examples

## Base URL
- Local: `http://localhost:8000`
- Production: `https://your-deployed-backend.com`

---

## Health Check

### Request
```
GET /health
```

### Response
```json
{
  "status": "healthy"
}
```

---

## Employee Endpoints

### 1. Create Employee

#### Request
```
POST /api/employees
Content-Type: application/json

{
  "employee_id": "EMP001",
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "department": "Engineering"
}
```

#### Success Response (201 Created)
```json
{
  "id": "507f1f77bcf86cd799439011",
  "employee_id": "EMP001",
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "department": "Engineering"
}
```

#### Error Response (400 Bad Request)
```json
{
  "detail": "Employee ID already exists"
}
```

```json
{
  "detail": "Email already registered"
}
```

---

### 2. Get All Employees

#### Request
```
GET /api/employees
```

#### Response (200 OK)
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "employee_id": "EMP001",
    "full_name": "John Doe",
    "email": "john.doe@example.com",
    "department": "Engineering"
  },
  {
    "id": "507f1f77bcf86cd799439012",
    "employee_id": "EMP002",
    "full_name": "Jane Smith",
    "email": "jane.smith@example.com",
    "department": "HR"
  }
]
```

#### Empty Response
```json
[]
```

---

### 3. Get Employee by ID

#### Request
```
GET /api/employees/EMP001
```

#### Response (200 OK)
```json
{
  "id": "507f1f77bcf86cd799439011",
  "employee_id": "EMP001",
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "department": "Engineering"
}
```

#### Error Response (404 Not Found)
```json
{
  "detail": "Employee not found"
}
```

---

### 4. Delete Employee

#### Request
```
DELETE /api/employees/EMP001
```

#### Success Response (204 No Content)
```
(No body)
```

#### Error Response (404 Not Found)
```json
{
  "detail": "Employee not found"
}
```

---

## Attendance Endpoints

### 1. Mark Attendance

#### Request
```
POST /api/attendance
Content-Type: application/json

{
  "employee_id": "EMP001",
  "date": "2025-02-03",
  "status": "Present"
}
```

#### Success Response (201 Created)
```json
{
  "id": "507f1f77bcf86cd799439013",
  "employee_id": "EMP001",
  "date": "2025-02-03",
  "status": "Present",
  "created_at": "2025-02-03T10:30:00"
}
```

#### Error Responses

**Employee not found (404)**
```json
{
  "detail": "Employee not found"
}
```

**Attendance already marked (400)**
```json
{
  "detail": "Attendance already marked for this date"
}
```

**Invalid date format (400)**
```json
{
  "detail": "Invalid date format. Use YYYY-MM-DD"
}
```

**Invalid status (400)**
```json
{
  "detail": "Status must be 'Present' or 'Absent'"
}
```

---

### 2. Get Employee Attendance

#### Request
```
GET /api/attendance/EMP001
```

#### Response (200 OK)
```json
[
  {
    "id": "507f1f77bcf86cd799439013",
    "employee_id": "EMP001",
    "date": "2025-02-03",
    "status": "Present",
    "created_at": "2025-02-03T10:30:00"
  },
  {
    "id": "507f1f77bcf86cd799439014",
    "employee_id": "EMP001",
    "date": "2025-02-02",
    "status": "Present",
    "created_at": "2025-02-02T09:15:00"
  },
  {
    "id": "507f1f77bcf86cd799439015",
    "employee_id": "EMP001",
    "date": "2025-02-01",
    "status": "Absent",
    "created_at": "2025-02-01T08:00:00"
  }
]
```

#### Error Response (404 Not Found)
```json
{
  "detail": "Employee not found"
}
```

---

### 3. Get All Attendance Records

#### Request
```
GET /api/attendance
```

#### Response (200 OK)
```json
[
  {
    "id": "507f1f77bcf86cd799439013",
    "employee_id": "EMP001",
    "date": "2025-02-03",
    "status": "Present",
    "created_at": "2025-02-03T10:30:00"
  },
  {
    "id": "507f1f77bcf86cd799439016",
    "employee_id": "EMP002",
    "date": "2025-02-03",
    "status": "Absent",
    "created_at": "2025-02-03T10:31:00"
  },
  {
    "id": "507f1f77bcf86cd799439014",
    "employee_id": "EMP001",
    "date": "2025-02-02",
    "status": "Present",
    "created_at": "2025-02-02T09:15:00"
  }
]
```

---

## cURL Examples

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

### Get Specific Employee
```bash
curl http://localhost:8000/api/employees/EMP001
```

### Delete Employee
```bash
curl -X DELETE http://localhost:8000/api/employees/EMP001
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

### Get Employee Attendance
```bash
curl http://localhost:8000/api/attendance/EMP001
```

### Get All Attendance
```bash
curl http://localhost:8000/api/attendance
```

---

## JavaScript/Fetch Examples

### Create Employee
```javascript
const response = await fetch('http://localhost:8000/api/employees', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    employee_id: 'EMP001',
    full_name: 'John Doe',
    email: 'john@example.com',
    department: 'Engineering'
  })
});

const data = await response.json();
console.log(data);
```

### Get All Employees
```javascript
const response = await fetch('http://localhost:8000/api/employees');
const employees = await response.json();
console.log(employees);
```

### Mark Attendance
```javascript
const response = await fetch('http://localhost:8000/api/attendance', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    employee_id: 'EMP001',
    date: '2025-02-03',
    status: 'Present'
  })
});

const data = await response.json();
console.log(data);
```

### Delete Employee
```javascript
const response = await fetch('http://localhost:8000/api/employees/EMP001', {
  method: 'DELETE'
});

if (response.ok) {
  console.log('Employee deleted');
}
```

---

## Postman Collection

Import the following JSON into Postman:

```json
{
  "info": {
    "name": "HRMS Lite API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Employees",
      "item": [
        {
          "name": "Create Employee",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/api/employees",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"employee_id\": \"EMP001\",\n  \"full_name\": \"John Doe\",\n  \"email\": \"john@example.com\",\n  \"department\": \"Engineering\"\n}"
            }
          }
        },
        {
          "name": "Get All Employees",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/employees"
          }
        },
        {
          "name": "Get Employee",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/employees/EMP001"
          }
        },
        {
          "name": "Delete Employee",
          "request": {
            "method": "DELETE",
            "url": "{{base_url}}/api/employees/EMP001"
          }
        }
      ]
    },
    {
      "name": "Attendance",
      "item": [
        {
          "name": "Mark Attendance",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/api/attendance",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"employee_id\": \"EMP001\",\n  \"date\": \"2025-02-03\",\n  \"status\": \"Present\"\n}"
            }
          }
        },
        {
          "name": "Get Employee Attendance",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/attendance/EMP001"
          }
        },
        {
          "name": "Get All Attendance",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/attendance"
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8000"
    }
  ]
}
```

---

## HTTP Status Codes

| Code | Meaning | Scenario |
|------|---------|----------|
| 200 | OK | Successfully retrieved data |
| 201 | Created | Successfully created resource |
| 204 | No Content | Successfully deleted resource |
| 400 | Bad Request | Validation error or duplicate |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Unexpected server error |

---

## Common Validation Errors

### Missing Required Field
```json
{
  "detail": "Field 'full_name' is required"
}
```

### Invalid Email Format
```json
{
  "detail": "Invalid email format"
}
```

### Duplicate Employee ID
```json
{
  "detail": "Employee ID already exists"
}
```

### Duplicate Email
```json
{
  "detail": "Email already registered"
}
```

### Invalid Date Format
```json
{
  "detail": "Invalid date format. Use YYYY-MM-DD"
}
```

### Invalid Status
```json
{
  "detail": "Status must be 'Present' or 'Absent'"
}
```

---

**Need more examples?** Check the README.md file for additional documentation.
