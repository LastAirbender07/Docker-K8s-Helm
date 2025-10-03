from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import database, crud, models, schemas

router = APIRouter(prefix="/api/users", tags=["tasks"])

# Dependency to get user_id
def get_user_id_by_username(username: str, db: Session):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.id

# GET /api/users/{username}/tasks
@router.get("/{username}/tasks", response_model=list[schemas.TaskOut])
def list_tasks(username: str, db: Session = Depends(database.get_db)):
    user_id = get_user_id_by_username(username, db)
    return crud.get_tasks(db, user_id)

# POST /api/users/{username}/tasks
@router.post("/{username}/tasks", response_model=schemas.TaskOut)
def create_task(username: str, task: schemas.TaskCreate, db: Session = Depends(database.get_db)):
    user_id = get_user_id_by_username(username, db)
    return crud.create_task(db, user_id, task.title)

# PATCH /api/users/{username}/tasks/{task_id}
@router.patch("/{username}/tasks/{task_id}", response_model=schemas.TaskOut)
def update_task(username: str, task_id: int, task_update: schemas.TaskUpdate, db: Session = Depends(database.get_db)):
    get_user_id_by_username(username, db)  # validate user exists
    updated_task = crud.update_task(db, task_id, task_update.completed)
    if not updated_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated_task

# DELETE /api/users/{username}/tasks/{task_id}
@router.delete("/{username}/tasks/{task_id}")
def delete_task(username: str, task_id: int, db: Session = Depends(database.get_db)):
    get_user_id_by_username(username, db)
    deleted_task = crud.delete_task(db, task_id)
    if not deleted_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"detail": "Task deleted"}
