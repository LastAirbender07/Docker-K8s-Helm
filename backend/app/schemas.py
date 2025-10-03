from pydantic import BaseModel, EmailStr

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

class TaskBase(BaseModel):
    title: str

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    completed: bool

class TaskOut(TaskBase):
    id: int
    completed: bool

    class Config:
        orm_mode = True
