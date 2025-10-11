from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional
from enum import Enum

#### User Schemas

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    gender: str | None = None

class UserLogin(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    gender: str | None = None

    class Config:
        orm_mode = True

#### Task Schemas

class TaskType(str, Enum):
    PERSONAL = "PERSONAL"
    WORK = "WORK"
    STUDY = "STUDY"
    HOBBY = "HOBBY"
    OTHER = "OTHER"


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    progress: Optional[float] = 0.0
    due_date: Optional[datetime] = None
    type: Optional[TaskType] = TaskType.OTHER

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    completed: Optional[bool]
    progress: Optional[float]
    due_date: Optional[datetime]
    type: Optional[TaskType]

class TaskOut(TaskBase):
    id: int
    completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True