from datetime import date, datetime
from pydantic import BaseModel, ConfigDict


class FinishedGoodsReceiptCreate(BaseModel):
    production_id: int
    received_quantity: int
    receipt_date: date
    received_by: int
    remarks: str | None = None


class FinishedGoodsReceiptResponse(BaseModel):
    fgr_id: int
    fgr_number: str
    production_id: int
    item_id: int
    received_quantity: int
    receipt_date: date
    received_by: int
    remarks: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)