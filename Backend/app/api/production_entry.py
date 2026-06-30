from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db

from app.models.production_entry import ProductionEntry
from app.models.work_order import WorkOrder

from app.schemas.production_entry import (
    ProductionEntryCreate,
    ProductionEntryResponse,
)

router = APIRouter(
    prefix="/production-entries",
    tags=["Production Entry"]
)


@router.post(
    "/",
    response_model=ProductionEntryResponse
)
def create_production_entry(
    production: ProductionEntryCreate,
    db: Session = Depends(get_db)
):

    work_order = db.query(WorkOrder).filter(
        WorkOrder.work_order_id == production.work_order_id
    ).first()

    if not work_order:
        raise HTTPException(
            status_code=404,
            detail="Work Order not found."
        )

    if work_order.status != "In Progress":
        raise HTTPException(
            status_code=400,
            detail="Work Order is not in progress."
        )

    entry = ProductionEntry(
        work_order_id=production.work_order_id,
        produced_quantity=production.produced_quantity,
        rejected_quantity=production.rejected_quantity,
        production_date=production.production_date,
        remarks=production.remarks
    )

    db.add(entry)

    work_order.status = "Completed"

    db.commit()
    db.refresh(entry)

    return entry


@router.get(
    "/",
    response_model=list[ProductionEntryResponse]
)
def get_production_entries(
    db: Session = Depends(get_db)
):
    return (
        db.query(ProductionEntry)
        .order_by(ProductionEntry.created_at.desc())
        .all()
    )


@router.get(
    "/{production_id}",
    response_model=ProductionEntryResponse
)
def get_production_entry(
    production_id: int,
    db: Session = Depends(get_db)
):

    entry = db.query(ProductionEntry).filter(
        ProductionEntry.production_id == production_id
    ).first()

    if not entry:
        raise HTTPException(
            status_code=404,
            detail="Production Entry not found."
        )

    return entry