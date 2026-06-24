from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class VendorQuoteBase(BaseModel):
    vendor_id: int
    bom_id: int

    quoted_price: float

    currency: Optional[str] = "INR"

    moq: Optional[int] = None

    lead_time_days: Optional[int] = None

    quote_date: Optional[date] = None

    remarks: Optional[str] = None


class VendorQuoteCreate(VendorQuoteBase):
    pass


class VendorQuoteResponse(VendorQuoteBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True