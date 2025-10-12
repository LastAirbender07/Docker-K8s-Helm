from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from . import schemas, crud, database
import redis, os, hashlib
import json

router = APIRouter(prefix="/auth", tags=["auth"])

REDIS_HOST = os.getenv("REDIS_HOST", "redis-service")
REDIS_PORT = os.getenv("REDIS_PORT", "6379")
r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)

CACHE_TTL = 300  # seconds, 5 minutes

@router.post("/signup")
def signup(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    existing = crud.get_user_by_username(db, user.username)
    if existing:
        raise HTTPException(status_code=400, detail="Username already taken")
    hashed_pw = hashlib.sha256(user.password.encode()).hexdigest()
    db_user = crud.create_user(db, user, hashed_pw)
    # Cache user in Redis for faster login
    user_data = {
        "id": db_user.id,
        "username": db_user.username,
        "email": db_user.email,
        "gender": db_user.gender,
        "password": db_user.password  # store hashed password
    }
    r.set(f"user:{db_user.username}", json.dumps(user_data), ex=CACHE_TTL)
    return {"id": db_user.id, "username": db_user.username, "email": db_user.email, "gender": db_user.gender}

@router.post("/login")
def login(data: schemas.UserLogin, db: Session = Depends(database.get_db)):
    # Try to get user from Redis cache first
    cached_user = r.get(f"user:{data.username}")
    if cached_user:
        user = json.loads(cached_user)
    else:
        user_obj = crud.get_user_by_username(db, data.username)
        if not user_obj:
            raise HTTPException(status_code=404, detail="User not found")
        user = {
            "id": user_obj.id,
            "username": user_obj.username,
            "email": user_obj.email,
            "gender": user_obj.gender,
            "password": user_obj.password
        }
        # Cache in Redis
        r.set(f"user:{data.username}", json.dumps(user), ex=CACHE_TTL)

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
