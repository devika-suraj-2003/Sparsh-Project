from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    DateTime,
    ForeignKey
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.database import Base


class GoodsReceipt(Base):
    __tablename__ = "goods_receipts"

    grn_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    grn_number = Column(
        String(50),
        unique=True,
        nullable=False
    )

    po_id = Column(
        Integer,
        ForeignKey("purchase_orders.po_id"),
        nullable=False
    )

    po_item_id = Column(
        Integer,
        ForeignKey("purchase_order_items.item_id"),
        nullable=False
    )

    accepted_quantity = Column(
        Integer,
        nullable=False
    )

    rejected_quantity = Column(
        Integer,
        nullable=False,
        default=0
    )

    received_date = Column(
        Date,
        nullable=False
    )

    received_by = Column(Integer)

    status = Column(
        String(30),
        default="Received"
    )

    remarks = Column(String)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    purchase_order = relationship(
        "PurchaseOrder"
    )

    purchase_order_item = relationship(
        "PurchaseOrderItem"
    )