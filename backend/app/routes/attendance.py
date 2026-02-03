from fastapi import APIRouter, HTTPException, status
from datetime import datetime
from app.models import AttendanceCreate, AttendanceResponse
from app.database import attendance_collection, employees_collection

router = APIRouter()

@router.post("/", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
def mark_attendance(attendance: AttendanceCreate):
    employee = employees_collection.find_one({"employee_id": attendance.employee_id})
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    existing = attendance_collection.find_one({
        "employee_id": attendance.employee_id,
        "date": attendance.date
    })
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Attendance already marked for this date"
        )
    
    data = attendance.dict()
    data["created_at"] = datetime.utcnow()
    
    result = attendance_collection.insert_one(data)
    created_attendance = attendance_collection.find_one({"_id": result.inserted_id})
    
    return AttendanceResponse(
        id=str(created_attendance["_id"]),
        **{k: v for k, v in created_attendance.items() if k != "_id"}
    )

@router.get("/{employee_id}", response_model=list[AttendanceResponse])
def get_employee_attendance(employee_id: str):
    employee = employees_collection.find_one({"employee_id": employee_id})
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    records = list(attendance_collection.find({"employee_id": employee_id}).sort("date", -1))
    
    return [
        AttendanceResponse(
            id=str(record["_id"]),
            **{k: v for k, v in record.items() if k != "_id"}
        )
        for record in records
    ]

@router.get("/", response_model=list[AttendanceResponse])
def get_all_attendance():
    records = list(attendance_collection.find().sort("date", -1))
    
    return [
        AttendanceResponse(
            id=str(record["_id"]),
            **{k: v for k, v in record.items() if k != "_id"}
        )
        for record in records
    ]
