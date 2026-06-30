from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.services.inventory.inventory_service import add_stock

from app.db.database import get_db


from app.models.goods_receipt import GoodsReceipt
from app.models.purchase_order import PurchaseOrder
from app.models.purchase_order_item import PurchaseOrderItem

from app.models.bom import BOM
from app.models.item_master import ItemMaster

from app.schemas.goods_receipt import (
    GoodsReceiptCreate,
    GoodsReceiptResponse
)

router = APIRouter(
    prefix="/goods-receipts",
    tags=["Goods Receipt"]
)


@router.post(
    "/",
    response_model=GoodsReceiptResponse
)
def create_goods_receipt(
    receipt: GoodsReceiptCreate,
    db: Session = Depends(get_db)
):

    po = db.query(PurchaseOrder).filter(
        PurchaseOrder.po_id == receipt.po_id
    ).first()

    if not po:
        raise HTTPException(
            status_code=404,
            detail="Purchase Order not found"
        )

    po_item = db.query(PurchaseOrderItem).filter(
        PurchaseOrderItem.item_id == receipt.po_item_id,
        PurchaseOrderItem.po_id == receipt.po_id
    ).first()

    if not po_item:
        raise HTTPException(
            status_code=404,
            detail="Purchase Order Item not found"
        )

    pending_quantity = (
        po_item.quantity -
        po_item.received_quantity
    )

    if receipt.accepted_quantity > pending_quantity:

        raise HTTPException(
            status_code=400,
            detail="Received quantity exceeds pending quantity."
        )

    count = db.query(GoodsReceipt).count() + 1

    year = datetime.now().year

    grn_number = f"GRN-{year}-{count:04d}"

    grn = GoodsReceipt(

        grn_number=grn_number,

        po_id=receipt.po_id,

        po_item_id=receipt.po_item_id,

        accepted_quantity=receipt.accepted_quantity,

        rejected_quantity=receipt.rejected_quantity,

        received_date=receipt.received_date,

        received_by=receipt.received_by,

        remarks=receipt.remarks
    )

    db.add(grn)

    po_item.received_quantity += receipt.accepted_quantity

    if po_item.received_quantity == po_item.quantity:

        po_item.status = "Received"

    else:

        po_item.status = "Partially Received"

    db.flush()
    bom = db.query(BOM).filter(
        BOM.bom_id == po_item.bom_id
    ).first()

    inventory_item = db.query(ItemMaster).filter(
        ItemMaster.manufacturer_part_number == bom.manufacturer_part_number
    ).first()

    if not inventory_item:
        raise HTTPException(
            status_code=404,
            detail="Item not found in Item Master."
        )
    add_stock(
        db=db,
        item_id=inventory_item.item_id,
        quantity=receipt.accepted_quantity,
        transaction_type="GOODS_RECEIPT",
        reference_type="GRN",
        reference_id=grn.grn_id,
        remarks=f"Goods Receipt {grn.grn_number}"
    )

    all_items = db.query(PurchaseOrderItem).filter(
        PurchaseOrderItem.po_id == receipt.po_id
    ).all()

    if all(
        item.received_quantity >= item.quantity
        for item in all_items
    ):
        po.status = "Completed"

    db.commit()

    db.refresh(grn)

    return grn


@router.get(
    "/",
    response_model=list[GoodsReceiptResponse]
)
def get_goods_receipts(
    db: Session = Depends(get_db)
):

    return db.query(GoodsReceipt).all()


@router.get(
    "/{grn_id}",
    response_model=GoodsReceiptResponse
)
def get_goods_receipt(
    grn_id: int,
    db: Session = Depends(get_db)
):

    grn = db.query(GoodsReceipt).filter(
        GoodsReceipt.grn_id == grn_id
    ).first()

    if not grn:

        raise HTTPException(
            status_code=404,
            detail="Goods Receipt not found"
        )

    return grn