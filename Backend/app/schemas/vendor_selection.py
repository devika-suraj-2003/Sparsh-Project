from pydantic import BaseModel
from datetime import datetime


class VendorSelectionCreate(BaseModel):
    rfq_id: int
    vendor_id: int
    quote_id: int

    selected_by: int | None = None

    selection_reason: str | None = None

    remarks: str | None = None


class VendorSelectionResponse(BaseModel):
    selection_id: int

    rfq_id: int
    vendor_id: int
    quote_id: int

    selected_by: int | None = None

    selection_reason: str | None = None

    approval_status: str

    remarks: str | None = None

    created_at: datetime

    class Config:
        from_attributes = True