from fastapi import APIRouter, HTTPException, status
from bson.objectid import ObjectId
from app.models import EmployeeCreate, EmployeeResponse
from app.database import employees_collection

router = APIRouter()

@router.post("/", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(employee: EmployeeCreate):
    existing = employees_collection.find_one({"employee_id": employee.employee_id})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee ID already exists"
        )
    
    email_exists = employees_collection.find_one({"email": employee.email})
    if email_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    result = employees_collection.insert_one(employee.dict())
    created_employee = employees_collection.find_one({"_id": result.inserted_id})
    
    return EmployeeResponse(
        id=str(created_employee["_id"]),
        **created_employee
    )

@router.get("/", response_model=list[EmployeeResponse])
def get_all_employees():
    employees = list(employees_collection.find())
    return [
        EmployeeResponse(
            id=str(emp["_id"]),
            **{k: v for k, v in emp.items() if k != "_id"}
        )
        for emp in employees
    ]

@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(employee_id: str):
    employee = employees_collection.find_one({"employee_id": employee_id})
    if not employee:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    
    return EmployeeResponse(
        id=str(employee["_id"]),
        **{k: v for k, v in employee.items() if k != "_id"}
    )

@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: str):
    result = employees_collection.delete_one({"employee_id": employee_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employee not found"
        )
    return None
