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

    quoted_price = Column(Float, nullable=False)

    currency = Column(String, default="INR")

    moq = Column(Integer)

    lead_time_days = Column(Integer)

    quote_date = Column(Date)

    remarks = Column(String)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )