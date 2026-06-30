from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.database import Base


class StockLedger(Base):
    __tablename__ = "stock_ledger"

    ledger_id = Column(Integer, primary_key=True, index=True)

    item_id = Column(
        Integer,
        ForeignKey("item_master.item_id"),
        nullable=False
    )

    transaction_type = Column(
        String(50),
        nullable=False
    )

    reference_type = Column(
        String(50),
        nullable=False
    )

    reference_id = Column(Integer)

    quantity_in = Column(Integer, default=0)

    quantity_out = Column(Integer, default=0)

    balance_after = Column(Integer, nullable=False)

    remarks = Column(String(500))

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    item = relationship("ItemMaster")