from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.db.database import Base


class StockAdjustment(Base):
    __tablename__ = "stock_adjustments"

    adjustment_id = Column(Integer, primary_key=True, index=True)

    adjustment_number = Column(String, unique=True, nullable=False)

    item_id = Column(
        Integer,
        ForeignKey("item_master.item_id"),
        nullable=False
    )

    quantity = Column(Integer, nullable=False)

    adjustment_type = Column(String, nullable=False)
    # INCREASE or DECREASE

    adjustment_date = Column(Date, nullable=False)

    remarks = Column(String)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )