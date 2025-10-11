from sqlalchemy.orm import Session
from . import models, schemas
from datetime import datetime

def create_user(db: Session, user: schemas.UserCreate, hashed_password: str):
    db_user = models.User(
        username=user.username,
        email=user.email,
        password=hashed_password,
        gender=user.gender
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

# Create Task
def create_task(db: Session, user_id: int, task_data: schemas.TaskCreate):
    task_type = task_data.type.value.upper() if task_data.type else "OTHER"

    due_date = task_data.due_date
    if due_date is not None and not isinstance(due_date, datetime):
        try:
            due_date = datetime.fromisoformat(str(due_date))
        except Exception:
            due_date = None

    task = models.Task(
        title=task_data.title,
        description=task_data.description,  # can be None
        progress=task_data.progress or 0.0, # default 0 if None
        due_date=due_date,      # can be None
        type=task_type,
        user_id=user_id
    )

    db.add(task)
    db.commit()
    db.refresh(task)
    return task

# Get tasks for a user
def get_tasks(db: Session, user_id: int):
    return db.query(models.Task).filter(models.Task.user_id == user_id).all()

# Update task
def update_task(db: Session, task_id: int, task_update: schemas.TaskUpdate):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if not task:
        return None

    update_data = task_update.dict(exclude_unset=True)

    if "type" in update_data and update_data["type"] is not None:
        t = update_data["type"]
        try:
            update_data["type"] = t.value
        except Exception:
            if isinstance(t, str):
                update_data["type"] = t.upper()
            else:
                update_data["type"] = "OTHER"

    if "progress" in update_data and update_data["progress"] is not None:
        try:
            p = float(update_data["progress"])
        except Exception:
            p = 0.0
        # clamp between 0 and 100
        if p < 0.0:
            p = 0.0
        if p > 100.0:
            p = 100.0
        update_data["progress"] = p

    if "due_date" in update_data and update_data["due_date"] is not None:
        if not isinstance(update_data["due_date"], datetime):
            try:
                update_data["due_date"] = datetime.fromisoformat(str(update_data["due_date"]))
            except Exception:
                update_data["due_date"] = None

    for attr, value in update_data.items():
        if hasattr(task, attr):
            setattr(task, attr, value)

    task.updated_at = datetime.utcnow()  # update timestamp
    db.commit()
    db.refresh(task)
    return task

# Delete task
def delete_task(db: Session, task_id: int):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if task:
        db.delete(task)
        db.commit()
    return task
