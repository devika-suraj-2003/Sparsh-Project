from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.purchase_order_item import PurchaseOrderItem
from app.models.bom import BOM
from app.models.rfq import RFQ
from app.models.vendor_quote import VendorQuote

from app.db.dependencies import get_db

from app.models.purchase_order import PurchaseOrder
from app.models.purchase_requisition import PurchaseRequisition
from app.models.vendor_selection import VendorSelection

from app.schemas.purchase_order import (
    PurchaseOrderCreate,
    PurchaseOrderUpdate,
    PurchaseOrderResponse,
)

router = APIRouter(tags=["Purchase Order"])


# -----------------------------------------
# CREATE PURCHASE ORDER
# -----------------------------------------

@router.post(
    "/purchase-orders",
    response_model=PurchaseOrderResponse
)
def create_purchase_order(
    po: PurchaseOrderCreate,
    db: Session = Depends(get_db)
):

    pr = db.query(PurchaseRequisition).filter(
        PurchaseRequisition.pr_id == po.pr_id
    ).first()

    if not pr:
        raise HTTPException(
            status_code=404,
            detail="Purchase Requisition not found"
        )

    if pr.status != "Approved":
        raise HTTPException(
            status_code=400,
            detail="Purchase Requisition is not approved"
        )

    existing = db.query(PurchaseOrder).filter(
        PurchaseOrder.pr_id == po.pr_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Purchase Order already exists"
        )

    selection = db.query(VendorSelection).filter(
        VendorSelection.selection_id == pr.selection_id
    ).first()

    if not selection:
        raise HTTPException(
            status_code=404,
            detail="Vendor Selection not found"
        )

    vendor_id = selection.vendor_id

    count = db.query(PurchaseOrder).count() + 1

    year = datetime.now().year

    po_number = f"PO-{year}-{count:04d}"

    purchase_order = PurchaseOrder(
        po_number=po_number,
        pr_id=po.pr_id,
        vendor_id=selection.vendor_id,
        order_date=po.order_date,
        expected_delivery_date=po.expected_delivery_date,
        remarks=po.remarks
    )

    db.add(purchase_order)
    db.flush()      # Get po_id before commit

    # ------------------------------------------
    # Get RFQ through Purchase Requisition
    # ------------------------------------------

    selection = db.query(VendorSelection).filter(
        VendorSelection.selection_id == pr.selection_id
    ).first()

    rfq = db.query(RFQ).filter(
        RFQ.rfq_id == selection.rfq_id
    ).first()

    # ------------------------------------------
    # Read all BOM components of this Version
    # ------------------------------------------

    bom_items = db.query(BOM).filter(
        BOM.version_id == rfq.version_id
    ).all()

    # ------------------------------------------
    # Create Purchase Order Items
    # ------------------------------------------

    for bom in bom_items:

        quote = db.query(VendorQuote).filter(
            VendorQuote.rfq_id == rfq.rfq_id,
            VendorQuote.vendor_id == selection.vendor_id,
            VendorQuote.bom_id == bom.bom_id
        ).first()

        if not quote:
            continue

        quantity = bom.quantity_per_board

        unit_price = quote.quoted_price

        po_item = PurchaseOrderItem(
            po_id=purchase_order.po_id,
            bom_id=bom.bom_id,
            quantity=quantity,
            unit_price=unit_price,
            line_total=quantity * unit_price,
            received_quantity=0,
            status="Pending"
        )

        db.add(po_item)

    db.commit()
    db.refresh(purchase_order)

    return purchase_order

# -----------------------------------------
# GET ALL
# -----------------------------------------

@router.get(
    "/purchase-orders",
    response_model=list[PurchaseOrderResponse]
)
def get_purchase_orders(
    db: Session = Depends(get_db)
):

    return db.query(PurchaseOrder).all()


# -----------------------------------------
# GET BY ID
# -----------------------------------------

@router.get(
    "/purchase-orders/{po_id}",
    response_model=PurchaseOrderResponse
)
def get_purchase_order(
    po_id: int,
    db: Session = Depends(get_db)
):

    po = db.query(PurchaseOrder).filter(
        PurchaseOrder.po_id == po_id
    ).first()

    if not po:
        raise HTTPException(
            status_code=404,
            detail="Purchase Order not found"
        )

    return po


# -----------------------------------------
# UPDATE
# -----------------------------------------

@router.put(
    "/purchase-orders/{po_id}",
    response_model=PurchaseOrderResponse
)
def update_purchase_order(
    po_id: int,
    po_data: PurchaseOrderUpdate,
    db: Session = Depends(get_db)
):

    po = db.query(PurchaseOrder).filter(
        PurchaseOrder.po_id == po_id
    ).first()

    if not po:
        raise HTTPException(
            status_code=404,
            detail="Purchase Order not found"
        )

    if po.status == "Approved":
        raise HTTPException(
            status_code=400,
            detail="Approved Purchase Order cannot be modified"
        )

    po.order_date = po_data.order_date
    po.expected_delivery_date = po_data.expected_delivery_date
    po.remarks = po_data.remarks

    db.commit()
    db.refresh(po)

    return po


# -----------------------------------------
# DELETE
# -----------------------------------------

@router.delete(
    "/purchase-orders/{po_id}"
)
def delete_purchase_order(
    po_id: int,
    db: Session = Depends(get_db)
):

    po = db.query(PurchaseOrder).filter(
        PurchaseOrder.po_id == po_id
    ).first()

    if not po:
        raise HTTPException(
            status_code=404,
            detail="Purchase Order not found"
        )

    if po.status == "Approved":
        raise HTTPException(
            status_code=400,
            detail="Approved Purchase Order cannot be deleted"
        )

    db.delete(po)
    db.commit()

    return {
        "message": "Purchase Order deleted successfully"
    }


# -----------------------------------------
# APPROVE
# -----------------------------------------

@router.put(
    "/purchase-orders/{po_id}/approve",
    response_model=PurchaseOrderResponse
)
def approve_purchase_order(
    po_id: int,
    db: Session = Depends(get_db)
):

    po = db.query(PurchaseOrder).filter(
        PurchaseOrder.po_id == po_id
    ).first()

    if not po:
        raise HTTPException(
            status_code=404,
            detail="Purchase Order not found"
        )

    po.status = "Approved"

    db.commit()
    db.refresh(po)

    return po