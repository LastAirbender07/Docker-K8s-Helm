from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.types import Enum, DateTime, Float
from datetime import datetime
import enum
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    gender = Column(String, nullable=True)


class TaskType(enum.Enum):
    PERSONAL = "PERSONAL"
    WORK = "WORD"
    STUDY = "STUDY"
    HOBBY = "HOBBY"
    OTHER = "OTHER"

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)  # Optional description
    completed = Column(Boolean, default=False)
    progress = Column(Float, default=0.0)  # 0-100% progress
    due_date = Column(DateTime, nullable=True)  # Optional due date
    type = Column(Enum(TaskType), default=TaskType.OTHER)  # Task category
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", backref="tasks")
