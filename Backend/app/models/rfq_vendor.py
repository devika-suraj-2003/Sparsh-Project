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


class RFQVendor(Base):
    __tablename__ = "rfq_vendors"

    id = Column(Integer, primary_key=True, index=True)

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

    sent_date = Column(Date)

    responded_date = Column(Date)

    status = Column(
        String(30),
        default="Pending"
    )

    remarks = Column(String)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )