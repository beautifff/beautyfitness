from pydantic import BaseModel, EmailStr
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base
from typing import Optional
from datetime import datetime

# Схемы Pydantic для API

# Схема для фитнес-программы
class UserInput(BaseModel):
    goal: str
    fitness_level: str
    frequency: str

# Схемы для аутентификации
class UserRegistration(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# Схема SQLAlchemy для базы данных
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())