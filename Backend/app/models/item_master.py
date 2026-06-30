from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func

from app.db.database import Base


class ItemMaster(Base):
    __tablename__ = "item_master"

    item_id = Column(Integer, primary_key=True, index=True)

    item_code = Column(String(50), unique=True, nullable=False, index=True)

    manufacturer_part_number = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True
    )

    component_name = Column(String(255), nullable=False)

    description = Column(String(500))

    unit = Column(String(50), nullable=False)

    category = Column(String(100))

    minimum_stock = Column(Integer, default=0)

    reorder_level = Column(Integer, default=0)

    is_active = Column(Boolean, default=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())