from sqlalchemy import (
    Column,
    Integer,
    String,
    Date,
    DateTime,
    ForeignKey
)
from sqlalchemy.sql import func

from app.db.database import Base


class PurchaseRequisition(Base):
    __tablename__ = "purchase_requisitions"

    pr_id = Column(Integer, primary_key=True, index=True)

    pr_number = Column(
        String(50),
        unique=True,
        nullable=False
    )

    selection_id = Column(
        Integer,
        ForeignKey("vendor_selection.selection_id"),
        nullable=False
    )

    requested_by = Column(Integer)

    required_date = Column(Date)

    priority = Column(
        String(20),
        default="Normal"
    )

    status = Column(
        String(30),
        default="Pending"
    )

    remarks = Column(String)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )