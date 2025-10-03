from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import schemas, crud, database
import redis, os, hashlib

router = APIRouter(prefix="/auth", tags=["auth"])

REDIS_HOST = os.getenv("REDIS_HOST", "redis-service")
REDIS_PORT = os.getenv("REDIS_PORT", "6379")
r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)

@router.post("/signup")
def signup(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    existing = crud.get_user_by_username(db, user.username)
    if existing:
        raise HTTPException(status_code=400, detail="Username already taken")
    hashed_pw = hashlib.sha256(user.password.encode()).hexdigest()
    db_user = crud.create_user(db, user, hashed_pw)
    return {"id": db_user.id, "username": db_user.username, "email": db_user.email, "gender": db_user.gender}

@router.post("/login")
def login(data: schemas.UserLogin, db: Session = Depends(database.get_db)):
    user = crud.get_user_by_username(db, data.username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    hashed_pw = hashlib.sha256(data.password.encode()).hexdigest()
    if user.password != hashed_pw:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # store session in Redis
    session_key = f"session:{user.username}"
    r.set(session_key, "logged_in", ex=3600)  # expire in 1 hr
    return {"username": user.username, "email": user.email, "gender": user.gender}

@router.post("/logout")
def logout(username: str):
    session_key = f"session:{username}"
    r.delete(session_key)
    return {"message": "Logged out"}
