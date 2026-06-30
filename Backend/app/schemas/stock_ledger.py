from datetime import datetime
from pydantic import BaseModel, ConfigDict


class StockLedgerResponse(BaseModel):
    ledger_id: int
    item_id: int
    transaction_type: str
    reference_type: str
    reference_id: int | None = None
    quantity_in: int
    quantity_out: int
    balance_after: int
    remarks: str | None = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)