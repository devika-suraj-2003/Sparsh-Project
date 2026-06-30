from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.db.database import Base


class ProductionEntry(Base):
    __tablename__ = "production_entries"

    production_id = Column(Integer, primary_key=True, index=True)

    work_order_id = Column(
        Integer,
        ForeignKey("work_orders.work_order_id"),
        nullable=False
    )

    produced_quantity = Column(Integer, nullable=False)

    rejected_quantity = Column(Integer, default=0)

    production_date = Column(Date, nullable=False)

    remarks = Column(String)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )