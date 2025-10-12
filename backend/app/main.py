from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import models, database
from .auth import router as auth_router
from .tasks import router as tasks_router

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="FastAPI Backend")

origins = [
    "http://localhost:5173",  # for host dev testing
    "http://frontend:80",      # from Docker container network
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(tasks_router)

@app.get("/")
def index():
    return {"message": "Welcome to the FastAPI Backend"}

@app.get("/health")
def health():
    return {"status": "ok"}

# @app.get("/api/users")
# def list_users(db=Depends(database.get_db)):
#     return db.query(models.User).all()
