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


class PurchaseOrder(Base):
    __tablename__ = "purchase_orders"

    po_id = Column(Integer, primary_key=True, index=True)

    po_number = Column(
        String(50),
        unique=True,
        nullable=False
    )

    pr_id = Column(
        Integer,
        ForeignKey("purchase_requisitions.pr_id"),
        nullable=False
    )

    vendor_id = Column(
        Integer,
        ForeignKey("vendors.id"),
        nullable=False
    )

    order_date = Column(Date)

    expected_delivery_date = Column(Date)

    status = Column(
        String(30),
        default="Draft"
    )

    remarks = Column(String)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    # Relationships
    purchase_requisition = relationship("PurchaseRequisition")
    vendor = relationship("Vendor")