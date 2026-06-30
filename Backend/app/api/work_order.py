from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.models.item_master import ItemMaster

from app.db.database import get_db

from app.models.version import Version
from app.models.work_order import WorkOrder

from app.schemas.work_order import (
    WorkOrderCreate,
    WorkOrderResponse,
)

router = APIRouter(
    prefix="/work-orders",
    tags=["Work Order"]
)


@router.post(
    "/",
    response_model=WorkOrderResponse
)
def create_work_order(
    work_order: WorkOrderCreate,
    db: Session = Depends(get_db)
):
    version = (
        db.query(Version)
        .filter(Version.version_id == work_order.version_id)
        .first()
    )

    if not version:
        raise HTTPException(
            status_code=404,
            detail="Version not found"
        )

    count = db.query(WorkOrder).count() + 1

    year = datetime.now().year
    finished_item_id=work_order.finished_item_id,
    finished_item = db.query(ItemMaster).filter(
        ItemMaster.item_id == po.finished_item_id
    ).first()

    if not finished_item:
        raise HTTPException(
            status_code=404,
            detail="Finished Item not found."
        )

    work_order_number = f"WO-{year}-{count:04d}"

    wo = WorkOrder(
        work_order_number=work_order_number,
        version_id=work_order.version_id,
        planned_quantity=work_order.planned_quantity,
        start_date=work_order.start_date,
        target_date=work_order.target_date,
        remarks=work_order.remarks
    )

    db.add(wo)
    db.commit()
    db.refresh(wo)

    return wo

@router.get(
    "/",
    response_model=list[WorkOrderResponse]
)
def get_work_orders(
    db: Session = Depends(get_db)
):
    return (
        db.query(WorkOrder)
        .order_by(WorkOrder.created_at.desc())
        .all()
    )

@router.get(
    "/{work_order_id}",
    response_model=WorkOrderResponse
)
def get_work_order(
    work_order_id: int,
    db: Session = Depends(get_db)
):
    work_order = (
        db.query(WorkOrder)
        .filter(WorkOrder.work_order_id == work_order_id)
        .first()
    )

    if not work_order:
        raise HTTPException(
            status_code=404,
            detail="Work Order not found"
        )

    return work_order

@router.put(
    "/{work_order_id}/release",
    response_model=WorkOrderResponse
)
def release_work_order(
    work_order_id: int,
    db: Session = Depends(get_db)
):
    work_order = (
        db.query(WorkOrder)
        .filter(WorkOrder.work_order_id == work_order_id)
        .first()
    )

    if not work_order:
        raise HTTPException(
            status_code=404,
            detail="Work Order not found"
        )

    if work_order.status != "Planned":
        raise HTTPException(
            status_code=400,
            detail="Only Planned work orders can be released."
        )

    work_order.status = "Released"

    db.commit()
    db.refresh(work_order)

    return work_order