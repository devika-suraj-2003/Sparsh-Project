from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from app.db.database import Base


class Vendor(Base):
    __tablename__ = "vendors"

    id = Column(Integer, primary_key=True, index=True)

    vendor_code = Column(String, unique=True, nullable=False)
    vendor_name = Column(String, nullable=False)

    contact_person = Column(String)
    email = Column(String)
    phone = Column(String)

    address = Column(String)

    created_at = Column(DateTime(timezone=True), server_default=func.now())