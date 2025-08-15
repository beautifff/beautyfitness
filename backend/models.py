from pydantic import BaseModel, Field

class UserInput(BaseModel):
    goal: str
    fitness_level: str
    frequency: str

