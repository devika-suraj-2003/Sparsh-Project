from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db

from app.models.stock_adjustment import StockAdjustment

from app.schemas.stock_adjustment import (
    StockAdjustmentCreate,
    StockAdjustmentResponse,
)

from app.services.inventory.inventory_service import (
    add_stock,
    remove_stock,
)

router = APIRouter(
    prefix="/stock-adjustments",
    tags=["Stock Adjustment"]
)

@router.post(
    "/",
    response_model=StockAdjustmentResponse
)
def create_stock_adjustment(
    adjustment: StockAdjustmentCreate,
    db: Session = Depends(get_db)
):
    count = db.query(StockAdjustment).count() + 1

    year = datetime.now().year

    adjustment_number = f"SA-{year}-{count:04d}"

    if adjustment.adjustment_type == "INCREASE":
        add_stock(
            db=db,
            item_id=adjustment.item_id,
            quantity=adjustment.quantity,
            transaction_type="STOCK_ADJUSTMENT",
            reference_type="STOCK_ADJUSTMENT",
            reference_id=count,
            remarks=adjustment.remarks
        )

    elif adjustment.adjustment_type == "DECREASE":
        remove_stock(
            db=db,
            item_id=adjustment.item_id,
            quantity=adjustment.quantity,
            transaction_type="STOCK_ADJUSTMENT",
            reference_type="STOCK_ADJUSTMENT",
            reference_id=count,
            remarks=adjustment.remarks
        )

    adjustment_record = StockAdjustment(
        adjustment_number=adjustment_number,
        item_id=adjustment.item_id,
        quantity=adjustment.quantity,
        adjustment_type=adjustment.adjustment_type,
        adjustment_date=adjustment.adjustment_date,
        remarks=adjustment.remarks
    )

    db.add(adjustment_record)
    db.commit()
    db.refresh(adjustment_record)

    return adjustment_record