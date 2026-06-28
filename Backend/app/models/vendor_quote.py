from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Date,
    DateTime,
    ForeignKey
)
from sqlalchemy.sql import func

from app.db.database import Base


class VendorQuote(Base):
    __tablename__ = "vendor_quotes"

    id = Column(Integer, primary_key=True, index=True)

    vendor_id = Column(
        Integer,
        ForeignKey("vendors.id"),
        nullable=False
    )

    bom_id = Column(
        Integer,
        ForeignKey("bom.bom_id"),
        nullable=False
    )

    rfq_id = Column(
        Integer,
        ForeignKey("rfqs.rfq_id")
    )

    quote_number = Column(String(50))

    quoted_price = Column(Float, nullable=False)

    currency = Column(String, default="INR")

    moq = Column(Integer)

    lead_time_days = Column(Integer)

    quote_date = Column(Date)

    valid_until = Column(Date)

    payment_terms = Column(String(100))

    incoterms = Column(String(100))

    quote_status = Column(
        String(30),
        default="Draft"
    )

    attachment_path = Column(String(255))

    submitted_at = Column(DateTime)

    approved_at = Column(DateTime)

    remarks = Column(String)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )