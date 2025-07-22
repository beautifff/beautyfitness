from fastapi import FastAPI
app = FastAPI(title="BeautyFitness")

@app.get("/")
def home():
    return {"message": "Добро пожаловать в BeautyFitness"}