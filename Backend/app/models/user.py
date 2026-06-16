from sqlalchemy import Column, Integer, String, ForeignKey
from app.db.database import Base

class User(Base):
    __tablename__ = "users"
    user_id = Column(Integer, primary_key=True, index=True)
    role_id = Column(
        Integer,
        ForeignKey("roles.role_id")
    )
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    status = Column(String, default="Active")