from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class EmployeeCreate(BaseModel):
    employee_id: str = Field(..., min_length=1, max_length=50)
    full_name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    department: str = Field(..., min_length=1, max_length=100)

class EmployeeResponse(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    employee_id: str
    full_name: str
    email: str
    department: str

    class Config:
        populate_by_name = True

class AttendanceCreate(BaseModel):
    employee_id: str = Field(..., min_length=1)
    date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    status: str = Field(..., pattern="^(Present|Absent)$")

class AttendanceResponse(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    employee_id: str
    date: str
    status: str
    created_at: datetime

    class Config:
        populate_by_name = True
