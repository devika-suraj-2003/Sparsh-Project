from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.stock_ledger import StockLedger
from app.models.item_master import ItemMaster
from app.schemas.stock_ledger import StockLedgerResponse
from app.services.inventory.inventory_service import get_current_stock

router = APIRouter(
    prefix="",
    tags=["Inventory"]
)


@router.get(
    "/stock-ledger",
    response_model=list[StockLedgerResponse]
)
def get_stock_ledger(db: Session = Depends(get_db)):
    return (
        db.query(StockLedger)
        .order_by(StockLedger.created_at.desc())
        .all()
    )


@router.get(
    "/stock-ledger/{item_id}",
    response_model=list[StockLedgerResponse]
)
def get_item_ledger(
    item_id: int,
    db: Session = Depends(get_db)
):
    item = (
        db.query(ItemMaster)
        .filter(ItemMaster.item_id == item_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Item not found."
        )

    return (
        db.query(StockLedger)
        .filter(StockLedger.item_id == item_id)
        .order_by(StockLedger.created_at.desc())
        .all()
    )


@router.get("/stock/{item_id}")
def get_stock(
    item_id: int,
    db: Session = Depends(get_db)
):
    item = (
        db.query(ItemMaster)
        .filter(ItemMaster.item_id == item_id)
        .first()
    )

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Item not found."
        )

    return {
        "item_id": item_id,
        "current_stock": get_current_stock(db, item_id)
    }