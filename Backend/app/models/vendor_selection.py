from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey
)
from sqlalchemy.sql import func

from app.db.database import Base


class VendorSelection(Base):
    __tablename__ = "vendor_selection"

    selection_id = Column(Integer, primary_key=True, index=True)

    rfq_id = Column(
        Integer,
        ForeignKey("rfqs.rfq_id"),
        nullable=False
    )

    vendor_id = Column(
        Integer,
        ForeignKey("vendors.id"),
        nullable=False
    )

    quote_id = Column(
        Integer,
        ForeignKey("vendor_quotes.id"),
        nullable=False
    )

    selected_by = Column(Integer)

    selection_reason = Column(String)

    approval_status = Column(
        String(30),
        default="Pending"
    )

    remarks = Column(String)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )