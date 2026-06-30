from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db

from app.models.finished_goods_receipt import FinishedGoodsReceipt
from app.models.production_entry import ProductionEntry
from app.models.work_order import WorkOrder
from app.models.item_master import ItemMaster

from app.schemas.finished_goods_receipt import (
    FinishedGoodsReceiptCreate,
    FinishedGoodsReceiptResponse,
)

from app.services.inventory.inventory_service import add_stock

router = APIRouter(
    prefix="/finished-goods-receipts",
    tags=["Finished Goods Receipt"]
)


@router.post(
    "/",
    response_model=FinishedGoodsReceiptResponse
)
def create_finished_goods_receipt(
    receipt: FinishedGoodsReceiptCreate,
    db: Session = Depends(get_db)
):

    production = db.query(ProductionEntry).filter(
        ProductionEntry.production_id == receipt.production_id
    ).first()

    if not production:
        raise HTTPException(
            status_code=404,
            detail="Production Entry not found."
        )

    work_order = db.query(WorkOrder).filter(
        WorkOrder.work_order_id == production.work_order_id
    ).first()

    if not work_order:
        raise HTTPException(
            status_code=404,
            detail="Work Order not found."
        )
    existing_received = db.query(FinishedGoodsReceipt).filter(
        FinishedGoodsReceipt.production_id == production.production_id
    ).all()

    total_received = sum(
        receipt.received_quantity
        for receipt in existing_received
    )

    if (
        total_received + receipt.received_quantity
        > production.produced_quantity
    ):
        raise HTTPException(
            status_code=400,
            detail="Received quantity exceeds produced quantity."
        )

    if work_order.status != "Completed":
        raise HTTPException(
            status_code=400,
            detail="Work Order is not completed."
        )

    item = db.query(ItemMaster).filter(
        ItemMaster.item_id == work_order.finished_item_id
    ).first()

    if not item:
        raise HTTPException(
            status_code=404,
            detail="Finished Good not found in Item Master."
        )

    count = db.query(FinishedGoodsReceipt).count() + 1

    year = datetime.now().year

    fgr_number = f"FGR-{year}-{count:04d}"

    fgr = FinishedGoodsReceipt(
        fgr_number=fgr_number,
        production_id=receipt.production_id,
        item_id=work_order.finished_item_id,
        received_quantity=receipt.received_quantity,
        receipt_date=receipt.receipt_date,
        received_by=receipt.received_by,
        remarks=receipt.remarks
    )

    db.add(fgr)
    db.flush()

    add_stock(
        db=db,
        item_id=work_order.finished_item_id,
        quantity=receipt.received_quantity,
        transaction_type="FINISHED_GOODS_RECEIPT",
        reference_type="FGR",
        reference_id=fgr.fgr_id,
        remarks=f"Finished Goods Receipt {fgr_number}"
    )

    work_order.status = "Closed"

    db.commit()
    db.refresh(fgr)

    return fgr


@router.get(
    "/",
    response_model=list[FinishedGoodsReceiptResponse]
)
def get_finished_goods_receipts(
    db: Session = Depends(get_db)
):
    return (
        db.query(FinishedGoodsReceipt)
        .order_by(FinishedGoodsReceipt.created_at.desc())
        .all()
    )


@router.get(
    "/{fgr_id}",
    response_model=FinishedGoodsReceiptResponse
)
def get_finished_goods_receipt(
    fgr_id: int,
    db: Session = Depends(get_db)
):

    receipt = db.query(FinishedGoodsReceipt).filter(
        FinishedGoodsReceipt.fgr_id == fgr_id
    ).first()

    if not receipt:
        raise HTTPException(
            status_code=404,
            detail="Finished Goods Receipt not found."
        )

    return receipt