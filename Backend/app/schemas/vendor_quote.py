from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class VendorQuoteBase(BaseModel):
    vendor_id: int
    bom_id: int
    rfq_id: Optional[int] = None

    quote_number: Optional[str] = None

    quoted_price: float

    currency: Optional[str] = "INR"

    moq: Optional[int] = None

    lead_time_days: Optional[int] = None

    quote_date: Optional[date] = None

    valid_until: Optional[date] = None

    payment_terms: Optional[str] = None

    incoterms: Optional[str] = None

    quote_status: Optional[str] = "Draft"

    attachment_path: Optional[str] = None

    submitted_at: Optional[datetime] = None

    approved_at: Optional[datetime] = None

    remarks: Optional[str] = None


class VendorQuoteCreate(VendorQuoteBase):
    pass


class VendorQuoteResponse(VendorQuoteBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True