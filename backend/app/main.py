from fastapi import FastAPI
from . import models, database
from .auth import router as auth_router
from .tasks import router as tasks_router

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="FastAPI Backend")

app.include_router(auth_router)
app.include_router(tasks_router)

# @app.get("/api/users")
# def list_users(db=Depends(database.get_db)):
#     return db.query(models.User).all()
