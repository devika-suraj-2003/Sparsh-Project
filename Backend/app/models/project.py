from sqlalchemy import Column, Integer, String, Text, Date, DateTime
from sqlalchemy.sql import func

from app.db.database import Base


class Project(Base):
    __tablename__ = "projects"

    project_id = Column(Integer, primary_key=True, index=True)

    project_code = Column(String(50), unique=True, nullable=False)
    project_name = Column(String(255), nullable=False)

    customer_name = Column(String(255), nullable=False)

    description = Column(Text, nullable=True)

    start_date = Column(Date, nullable=True)
    target_date = Column(Date, nullable=True)

    status = Column(String(50), default="Planning")

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )