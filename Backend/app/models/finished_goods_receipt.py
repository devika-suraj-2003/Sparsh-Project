from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.db.database import Base


class FinishedGoodsReceipt(Base):
    __tablename__ = "finished_goods_receipts"

    fgr_id = Column(Integer, primary_key=True, index=True)

    fgr_number = Column(String, unique=True, nullable=False)

    production_id = Column(
        Integer,
        ForeignKey("production_entries.production_id"),
        nullable=False
    )

    item_id = Column(
        Integer,
        ForeignKey("item_master.item_id"),
        nullable=False
    )

    received_quantity = Column(Integer, nullable=False)

    receipt_date = Column(Date, nullable=False)

    received_by = Column(Integer, nullable=False)

    remarks = Column(String)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )