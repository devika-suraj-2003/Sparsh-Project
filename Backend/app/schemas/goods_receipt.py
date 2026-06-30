from pydantic import BaseModel
from datetime import date, datetime


class GoodsReceiptCreate(BaseModel):
    po_id: int
    po_item_id: int
    accepted_quantity: int
    rejected_quantity: int = 0
    received_date: date
    received_by: int | None = None
    remarks: str | None = None


class GoodsReceiptUpdate(BaseModel):
    accepted_quantity: int
    rejected_quantity: int
    received_date: date
    remarks: str | None = None


class GoodsReceiptResponse(BaseModel):
    grn_id: int
    grn_number: str
    po_id: int
    po_item_id: int
    accepted_quantity: int
    rejected_quantity: int
    received_date: date
    received_by: int | None = None
    status: str
    remarks: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True