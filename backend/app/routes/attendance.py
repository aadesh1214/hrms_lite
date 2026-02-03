from fastapi import APIRouter, HTTPException, status
from datetime import datetime
from app.models import AttendanceCreate, AttendanceResponse
from app.database import attendance_collection, employees_collection

router = APIRouter()

@router.post("/", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
def mark_attendance(attendance: AttendanceCreate):
    from datetime import datetime, date
    
    # Validate employee_id not empty
    if not attendance.employee_id or attendance.employee_id.strip() == "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee ID cannot be empty"
        )
    
    attendance.employee_id = attendance.employee_id.strip()
    
    # Validate employee exists (case-insensitive)
    employee = employees_collection.find_one({
        "employee_id": {"$regex": f"^{attendance.employee_id}$", "$options": "i"}
    })
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{attendance.employee_id}' not found"
        )
    
    actual_employee_id = employee["employee_id"]
    
    # Validate date format and not in future
    try:
        attendance_date = datetime.strptime(attendance.date, "%Y-%m-%d").date()
        today = date.today()
        
        if attendance_date > today:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Attendance date cannot be in the future"
            )
        
        # Prevent marking attendance for dates more than 5 years in the past
        five_years_ago = today.replace(year=today.year - 5)
        if attendance_date < five_years_ago:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Attendance date cannot be more than 5 years in the past"
            )
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Date must be in YYYY-MM-DD format"
        )
    
    # Validate status
    if attendance.status not in ["Present", "Absent"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be 'Present' or 'Absent'"
        )
    
    # Check if attendance already marked for this date
    existing = attendance_collection.find_one({
        "employee_id": actual_employee_id,
        "date": attendance.date
    })
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Attendance already marked for {actual_employee_id} on {attendance.date}. Cannot mark attendance twice for the same date."
        )
    
    # Insert attendance record
    data = {
        "employee_id": actual_employee_id,
        "date": attendance.date,
        "status": attendance.status,
        "created_at": datetime.utcnow()
    }
    
    result = attendance_collection.insert_one(data)
    created_attendance = attendance_collection.find_one({"_id": result.inserted_id})
    
    return AttendanceResponse(
        _id=str(created_attendance["_id"]),
        employee_id=created_attendance["employee_id"],
        date=created_attendance["date"],
        status=created_attendance["status"]
    )

@router.get("/{employee_id}", response_model=list[AttendanceResponse])
def get_employee_attendance(employee_id: str):
    # Validate employee_id not empty
    if not employee_id or employee_id.strip() == "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee ID cannot be empty"
        )
    
    employee_id = employee_id.strip()
    
    # Validate employee exists (case-insensitive)
    employee = employees_collection.find_one({
        "employee_id": {"$regex": f"^{employee_id}$", "$options": "i"}
    })
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )
    
    actual_employee_id = employee["employee_id"]
    
    # Get all attendance records for this employee sorted by date descending
    records = list(attendance_collection.find({"employee_id": actual_employee_id}).sort("date", -1))
    
    return [
        AttendanceResponse(
            _id=str(record["_id"]),
            employee_id=record["employee_id"],
            date=record["date"],
            status=record["status"]
        )
        for record in records
    ]

@router.get("/", response_model=list[AttendanceResponse])
def get_all_attendance():
    records = list(attendance_collection.find().sort("date", -1))
    
    return [
        AttendanceResponse(
            _id=str(record["_id"]),
            employee_id=record["employee_id"],
            date=record["date"],
            status=record["status"]
        )
        for record in records
    ]
