from pydantic import BaseModel

class UserBase(BaseModel):
    name: str
    email: EmailStr


class UserCreate(UserBase):
    pass