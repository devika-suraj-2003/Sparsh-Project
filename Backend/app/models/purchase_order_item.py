from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    ForeignKey
)
from sqlalchemy.orm import relationship

from app.db.database import Base


class PurchaseOrderItem(Base):
    __tablename__ = "purchase_order_items"

    item_id = Column(Integer, primary_key=True, index=True)

    po_id = Column(
        Integer,
        ForeignKey("purchase_orders.po_id"),
        nullable=False
    )

    bom_id = Column(
        Integer,
        ForeignKey("bom.bom_id"),
        nullable=False
    )

    quantity = Column(Integer, nullable=False)

    unit_price = Column(Float, nullable=False)

    line_total = Column(Float, nullable=False)

    remarks = Column(String)

    purchase_order = relationship("PurchaseOrder")
    bom = relationship("BOM")

    received_quantity = Column(
        Integer,
        nullable=False,
        default=0
    )

    status = Column(
        String(30),
        nullable=False,
        default="Pending"
    )