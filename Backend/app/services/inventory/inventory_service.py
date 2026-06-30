from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.stock_ledger import StockLedger
from app.models.item_master import ItemMaster


def get_current_stock(db: Session, item_id: int) -> int:
    """
    Returns the latest available stock for an item.
    """

    latest = (
        db.query(StockLedger)
        .filter(StockLedger.item_id == item_id)
        .order_by(StockLedger.ledger_id.desc())
        .first()
    )

    if latest:
        return latest.balance_after

    return 0


def add_stock(
    db: Session,
    item_id: int,
    quantity: int,
    transaction_type: str,
    reference_type: str,
    reference_id: int | None = None,
    remarks: str | None = None,
):
    """
    Adds stock and creates a Stock Ledger entry.
    """
    print(">>> add_stock called")
    print("add_stock called")
    item = db.query(ItemMaster).filter(
        ItemMaster.item_id == item_id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Item not found."
        )

    current_stock = get_current_stock(db, item_id)

    ledger = StockLedger(
        item_id=item_id,
        transaction_type=transaction_type,
        reference_type=reference_type,
        reference_id=reference_id,
        quantity_in=quantity,
        quantity_out=0,
        balance_after=current_stock + quantity,
        remarks=remarks,
    )

    db.add(ledger)
    print(">>> Creating ledger for item:", item_id)
    db.commit()
    db.refresh(ledger)

    return ledger


def remove_stock(
    db: Session,
    item_id: int,
    quantity: int,
    transaction_type: str,
    reference_type: str,
    reference_id: int | None = None,
    remarks: str | None = None,
):
    """
    Removes stock and creates a Stock Ledger entry.
    """

    item = db.query(ItemMaster).filter(
        ItemMaster.item_id == item_id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Item not found."
        )

    current_stock = get_current_stock(db, item_id)

    if current_stock < quantity:
        raise HTTPException(
            status_code=400,
            detail="Insufficient stock."
        )

    ledger = StockLedger(
        item_id=item_id,
        transaction_type=transaction_type,
        reference_type=reference_type,
        reference_id=reference_id,
        quantity_in=0,
        quantity_out=quantity,
        balance_after=current_stock - quantity,
        remarks=remarks,
    )

    db.add(ledger)
    db.commit()
    db.refresh(ledger)

    return ledger