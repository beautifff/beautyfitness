from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from models import UserInput, UserRegistration, UserLogin, UserResponse, Token, User
from database import engine, Base, SessionLocal
from auth import (
    verify_password, get_password_hash, authenticate_user, 
    create_access_token, get_current_user, get_db, ACCESS_TOKEN_EXPIRE_MINUTES,
    debug_database_users, get_user_by_email
)

# Create an instance of the FastAPI class.
app = FastAPI(title="BeautyFitness API")

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],  # React dev server ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Вспомогательные функции
def create_user(db: Session, user_registration: UserRegistration):
    """Создает нового пользователя"""
    print(f"🔍 Попытка регистрации пользователя: {user_registration.email}")
    
    # Проверяем, существует ли пользователь с таким email
    db_user = db.query(User).filter(User.email == user_registration.email).first()
    if db_user:
        print(f"❌ Пользователь с email {user_registration.email} уже существует")
        raise HTTPException(
            status_code=400,
            detail="Пользователь с таким email уже существует"
        )
    
    # Создаем нового пользователя
    hashed_password = get_password_hash(user_registration.password)
    print(f"🔒 Пароль захеширован для пользователя {user_registration.email}")
    
    db_user = User(
        email=user_registration.email,
        hashed_password=hashed_password,
        name=user_registration.name
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    print(f"✅ Пользователь {user_registration.email} успешно создан с ID: {db_user.id}")
    return db_user

# АУТЕНТИФИКАЦИЯ ENDPOINTS

@app.post("/register", response_model=UserResponse)
def register(user_registration: UserRegistration, db: Session = Depends(get_db)):
    """Регистрация нового пользователя"""
    print(f"🔍 Registration attempt for: {user_registration.email}")
    
    try:
        user = create_user(db=db, user_registration=user_registration)
        print(f"✅ Registration successful for: {user_registration.email}")
        return user
    except HTTPException as e:
        print(f"❌ Registration failed for {user_registration.email}: {e.detail}")
        raise e
    except Exception as e:
        print(f"❌ Unexpected registration error for {user_registration.email}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error during registration"
        )

@app.post("/token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Вход пользователя (получение токена)"""
    print(f"🔍 Token request for: {form_data.username}")
    
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:  # Проверяем на False, None, или пустое значение
        print(f"❌ Token authentication FAILED for {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print(f"✅ Token granted for: {user.email}")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/login", response_model=Token)
def login(user_login: UserLogin, db: Session = Depends(get_db)):
    """Альтернативный endpoint для входа с JSON"""
    print(f"🔍 Login attempt for: {user_login.email}")
    
    # СТРОГАЯ ПРОВЕРКА: убеждаемся что пользователь существует
    user_exists = get_user_by_email(db, user_login.email)
    if user_exists is None:
        print(f"❌ ОТКАЗ: Пользователь {user_login.email} НЕ СУЩЕСТВУЕТ")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль"
        )
    
    # Теперь проверяем аутентификацию
    user = authenticate_user(db, user_login.email, user_login.password)
    if user is None:
        print(f"❌ Authentication FAILED for {user_login.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль. Пользователь не найден или пароль неверный."
        )
    
    # ДОПОЛНИТЕЛЬНАЯ ПРОВЕРКА: убеждаемся что возвращенный user тот же самый
    if user.email != user_login.email:
        print(f"❌ ОШИБКА БЕЗОПАСНОСТИ: email не совпадает!")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Ошибка аутентификации"
        )
    
    print(f"✅ Login successful for: {user.email}")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/me", response_model=UserResponse)
def read_users_me(current_user: User = Depends(get_current_user)):
    """Получить информацию о текущем пользователе"""
    return current_user

@app.get("/debug/users")
def debug_users(db: Session = Depends(get_db)):
    """ОТЛАДКА: Показать всех пользователей в базе данных"""
    users = debug_database_users(db)
    return {
        "total_users": len(users),
        "users": [{"id": u.id, "email": u.email, "name": u.name} for u in users],
        "database_file": "sql_app.db"
    }

@app.delete("/debug/reset-db")
def reset_database(db: Session = Depends(get_db)):
    """ОТЛАДКА: Очистить всю базу данных"""
    try:
        db.query(User).delete()
        db.commit()
        return {"message": "База данных очищена", "users_deleted": "all"}
    except Exception as e:
        db.rollback()
        return {"error": f"Ошибка очистки БД: {e}"}

@app.post("/debug/test-login")
def debug_test_login(email: str, password: str, db: Session = Depends(get_db)):
    """ОТЛАДКА: Тестировать аутентификацию пользователя"""
    print(f"🔍 Debug: Testing login for {email}")
    
    # Проверяем существование пользователя
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return {"status": "user_not_found", "message": f"Пользователь {email} не найден в базе данных"}
    
    # Проверяем пароль
    from auth import verify_password
    password_valid = verify_password(password, user.hashed_password)
    
    return {
        "status": "user_found",
        "user_email": user.email,
        "user_name": user.name,
        "password_valid": password_valid,
        "hashed_password_length": len(user.hashed_password)
    }

# ОСНОВНЫЕ ENDPOINTS

# ОСНОВНЫЕ ENDPOINTS

@app.get("/")
def read_root():
    """Приветственное сообщение"""
    return {"message": "Добро пожаловать в BeautyFitness API"}

@app.get("/health")
def health_check():
    """Проверка здоровья API"""
    return {"status": "healthy", "message": "BeautyFitness API is running"}

@app.post("/generate-program")
def generate_program(
    user_input: UserInput, 
    current_user: User = Depends(get_current_user)
):
    """Генерация фитнес-программы (требует аутентификации)"""
    program_message = (
        f"Привет, {current_user.name}! "
        f"Мы создали персональную программу для достижения цели '{user_input.goal}' "
        f"на уровне '{user_input.fitness_level}', "
        f"с тренировками '{user_input.frequency}'."
    )
    
    return {"program": program_message}