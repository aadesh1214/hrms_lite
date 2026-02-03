from fastapi import APIRouter, HTTPException, status
from bson.objectid import ObjectId
from app.models import EmployeeCreate, EmployeeResponse
from app.database import employees_collection

router = APIRouter()

@router.post("/", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(employee: EmployeeCreate):
    # Validate employee_id not empty and properly formatted
    if not employee.employee_id or employee.employee_id.strip() == "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee ID cannot be empty"
        )
    
    employee.employee_id = employee.employee_id.strip()
    
    # Validate full_name not empty
    if not employee.full_name or employee.full_name.strip() == "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Full name cannot be empty"
        )
    
    employee.full_name = employee.full_name.strip()
    
    # Validate department not empty
    if not employee.department or employee.department.strip() == "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Department cannot be empty"
        )
    
    employee.department = employee.department.strip()
    
    # Validate that not all fields have the same value (suspicious/test data)
    all_same = (
        employee.employee_id.lower() == employee.full_name.lower() and
        employee.employee_id.lower() == employee.email.lower() and
        employee.employee_id.lower() == employee.department.lower()
    )
    if all_same:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="All fields cannot have the same value. Please provide valid employee information."
        )
    
    # Check if employee_id already exists (case-insensitive)
    existing = employees_collection.find_one({
        "employee_id": {"$regex": f"^{employee.employee_id}$", "$options": "i"}
    })
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Employee ID '{employee.employee_id}' already exists"
        )
    
    # Check if email already registered (case-insensitive)
    email_exists = employees_collection.find_one({
        "email": {"$regex": f"^{employee.email}$", "$options": "i"}
    })
    if email_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Email '{employee.email}' already registered"
        )
    
    # Insert employee
    result = employees_collection.insert_one(employee.dict())
    created_employee = employees_collection.find_one({"_id": result.inserted_id})
    
    return EmployeeResponse(
        _id=str(created_employee["_id"]),
        employee_id=created_employee["employee_id"],
        full_name=created_employee["full_name"],
        email=created_employee["email"],
        department=created_employee["department"]
    )

@router.get("/", response_model=list[EmployeeResponse])
def get_all_employees():
    employees = list(employees_collection.find())
    return [
        EmployeeResponse(
            _id=str(emp["_id"]),
            employee_id=emp["employee_id"],
            full_name=emp["full_name"],
            email=emp["email"],
            department=emp["department"]
        )
        for emp in employees
    ]

@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(employee_id: str):
    # Validate employee_id not empty
    if not employee_id or employee_id.strip() == "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee ID cannot be empty"
        )
    
    employee_id = employee_id.strip()
    
    # Find employee (case-insensitive)
    employee = employees_collection.find_one({
        "employee_id": {"$regex": f"^{employee_id}$", "$options": "i"}
    })
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )
    
    return EmployeeResponse(
        _id=str(employee["_id"]),
        employee_id=employee["employee_id"],
        full_name=employee["full_name"],
        email=employee["email"],
        department=employee["department"]
    )

@router.delete("/{employee_id}")
def delete_employee(employee_id: str):
    # Validate employee_id not empty
    if not employee_id or employee_id.strip() == "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee ID cannot be empty"
        )
    
    employee_id = employee_id.strip()
    
    # Find employee first to ensure they exist (case-insensitive)
    employee = employees_collection.find_one({
        "employee_id": {"$regex": f"^{employee_id}$", "$options": "i"}
    })
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Employee with ID '{employee_id}' not found"
        )
    
    actual_employee_id = employee["employee_id"]
    
    # Delete associated attendance records
    from app.database import attendance_collection
    attendance_result = attendance_collection.delete_many({"employee_id": actual_employee_id})
    
    # Delete the employee
    result = employees_collection.delete_one({"employee_id": actual_employee_id})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete employee"
        )
    
    return {
        "message": f"Employee '{actual_employee_id}' deleted successfully",
        "deleted_employee": 1,
        "deleted_attendance_records": attendance_result.deleted_count
    }
