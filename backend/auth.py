from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User, TokenData

# Конфигурация для JWT и паролей
SECRET_KEY = "your-secret-key-here"  # В продакшне используйте переменную окружения
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Настройка для хеширования паролей
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 схема для получения токена
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password, hashed_password):
    """Проверяет пароль"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Хеширует пароль"""
    return pwd_context.hash(password)

def get_user_by_email(db: Session, email: str):
    """Получает пользователя по email"""
    try:
        user = db.query(User).filter(User.email == email).first()
        print(f"🔍 Поиск пользователя {email}: {'НАЙДЕН' if user else 'НЕ НАЙДЕН'}")
        return user
    except Exception as e:
        print(f"❌ Ошибка при поиске пользователя {email}: {e}")
        return None

def debug_database_users(db: Session):
    """ОТЛАДКА: Показывает всех пользователей в БД"""
    try:
        all_users = db.query(User).all()
        print(f"📊 ВСЕГО ПОЛЬЗОВАТЕЛЕЙ в БД: {len(all_users)}")
        for user in all_users:
            print(f"   - ID: {user.id}, Email: {user.email}, Name: {user.name}")
        return all_users
    except Exception as e:
        print(f"❌ Ошибка при проверке БД: {e}")
        return []

def authenticate_user(db: Session, email: str, password: str):
    """Аутентифицирует пользователя"""
    print(f"🔍 Попытка входа для email: {email}")
    
    # ОТЛАДКА: Показываем всех пользователей в БД
    debug_database_users(db)
    
    # Ищем пользователя в базе данных
    user = get_user_by_email(db, email)
    if user is None:
        print(f"❌ Пользователь с email {email} НЕ НАЙДЕН в базе данных")
        return None
    
    print(f"✅ Пользователь найден: {user.name} ({user.email})")
    print(f"🔑 Проверяем пароль...")
    
    # Проверяем пароль
    try:
        password_valid = verify_password(password, user.hashed_password)
        if not password_valid:
            print(f"❌ НЕВЕРНЫЙ ПАРОЛЬ для пользователя {email}")
            return None
        
        print(f"✅ ПАРОЛЬ ВЕРНЫЙ - аутентификация успешна для {email}")
        return user
        
    except Exception as e:
        print(f"❌ Ошибка при проверке пароля: {e}")
        return None

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Создает JWT токен"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_db():
    """Получает сессию базы данных"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """Получает текущего пользователя из JWT токена"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user
