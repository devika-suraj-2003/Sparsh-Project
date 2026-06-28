from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime


class RFQVendorBase(BaseModel):
    rfq_id: int
    vendor_id: int

    sent_date: Optional[date] = None
    responded_date: Optional[date] = None

    status: Optional[str] = "Pending"

    remarks: Optional[str] = None


class RFQVendorCreate(RFQVendorBase):
    pass


class RFQVendorResponse(RFQVendorBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True