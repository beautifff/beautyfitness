from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# This is the URL for our SQLite database. It will create a file
# named "sql_app.db" in our project folder.
SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

# Create an engine to connect to the database.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Create a SessionLocal class. Each instance of this class will be a
# database session.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# This is the base class for all our database models (schemas).
Base = declarative_base()