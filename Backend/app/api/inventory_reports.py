from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.stock_ledger import StockLedger
from app.schemas.stock_ledger import StockLedgerResponse

router = APIRouter(
    prefix="/inventory-reports",
    tags=["Inventory Reports"]
)


@router.get(
    "/stock-movements",
    response_model=list[StockLedgerResponse]
)
def stock_movements(
    db: Session = Depends(get_db)
):
    return (
        db.query(StockLedger)
        .order_by(StockLedger.created_at.desc())
        .all()
    )