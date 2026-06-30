from pydantic import BaseModel
from datetime import date, datetime


class PurchaseOrderCreate(BaseModel):
    pr_id: int
    order_date: date
    expected_delivery_date: date
    remarks: str | None = None


class PurchaseOrderUpdate(BaseModel):
    order_date: date
    expected_delivery_date: date
    remarks: str | None = None


class PurchaseOrderResponse(BaseModel):
    po_id: int
    po_number: str
    pr_id: int
    vendor_id: int
    order_date: date
    expected_delivery_date: date
    status: str
    remarks: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True