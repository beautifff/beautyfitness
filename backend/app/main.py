from fastapi import FastAPI
from app.db.session import engine
from app.models import Base
import app.models

app = FastAPI(title="BeautyFitness")

@app.get("/")
def home():
    return {"message": "Добро пожаловать в BeautyFitness"}

Base.metadata.create_all(bind=engine)
