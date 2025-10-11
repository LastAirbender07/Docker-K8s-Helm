from sqlalchemy.orm import Session
from . import models, schemas

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

    task = models.Task(
        title=task_data.title,
        description=task_data.description,  # can be None
        progress=task_data.progress or 0.0, # default 0 if None
        due_date=task_data.due_date,        # can be None
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
    if task:
        for attr, value in task_update.dict(exclude_unset=True).items():
            setattr(task, attr, value)
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
