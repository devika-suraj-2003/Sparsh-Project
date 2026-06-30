from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.dependencies import get_db

from app.models.purchase_requisition import PurchaseRequisition
from app.models.vendor_selection import VendorSelection

from app.schemas.purchase_requisition import (
    PurchaseRequisitionCreate,
    PurchaseRequisitionResponse,
    PurchaseRequisitionUpdate,
)

router = APIRouter(tags=["Purchase Requisition"])


@router.post(
    "/purchase-requisitions",
    response_model=PurchaseRequisitionResponse
)
def create_purchase_requisition(
    pr: PurchaseRequisitionCreate,
    db: Session = Depends(get_db)
):

    # Check Vendor Selection

    selection = (
        db.query(VendorSelection)
        .filter(
            VendorSelection.selection_id == pr.selection_id
        )
        .first()
    )

    if not selection:
        raise HTTPException(
            status_code=404,
            detail="Vendor Selection not found"
        )

    # Only approved selections can create PR

    if selection.approval_status != "Approved":
        raise HTTPException(
            status_code=400,
            detail="Vendor Selection is not approved"
        )

    # Prevent duplicate PRs

    existing = (
        db.query(PurchaseRequisition)
        .filter(
            PurchaseRequisition.selection_id == pr.selection_id
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Purchase Requisition already exists"
        )

    # Generate PR Number

    count = db.query(PurchaseRequisition).count() + 1

    year = datetime.now().year

    pr_number = f"PR-{year}-{count:04d}"

    purchase_requisition = PurchaseRequisition(
        pr_number=pr_number,
        selection_id=pr.selection_id,
        requested_by=pr.requested_by,
        required_date=pr.required_date,
        priority=pr.priority,
        remarks=pr.remarks,
    )

    db.add(purchase_requisition)
    db.commit()
    db.refresh(purchase_requisition)

    return purchase_requisition

@router.get(
    "/purchase-requisitions",
    response_model=list[PurchaseRequisitionResponse]
)
def get_purchase_requisitions(
    db: Session = Depends(get_db)
):

    return db.query(PurchaseRequisition).all()

@router.get(
    "/purchase-requisitions/{pr_id}",
    response_model=PurchaseRequisitionResponse
)
def get_purchase_requisition(
    pr_id: int,
    db: Session = Depends(get_db)
):

    pr = (
        db.query(PurchaseRequisition)
        .filter(
            PurchaseRequisition.pr_id == pr_id
        )
        .first()
    )

    if not pr:
        raise HTTPException(
            status_code=404,
            detail="Purchase Requisition not found"
        )

    return pr

@router.put(
    "/purchase-requisitions/{pr_id}",
    response_model=PurchaseRequisitionResponse
)
def update_purchase_requisition(
    pr_id: int,
    pr_data: PurchaseRequisitionUpdate,
    db: Session = Depends(get_db)
):

    pr = (
        db.query(PurchaseRequisition)
        .filter(
            PurchaseRequisition.pr_id == pr_id
        )
        .first()
    )

    if not pr:
        raise HTTPException(
            status_code=404,
            detail="Purchase Requisition not found"
        )

    # Do not allow updates after approval
    if pr.status == "Approved":
        raise HTTPException(
            status_code=400,
            detail="Approved Purchase Requisition cannot be modified"
        )

    pr.required_date = pr_data.required_date
    pr.priority = pr_data.priority
    pr.remarks = pr_data.remarks

    db.commit()
    db.refresh(pr)

    return pr

@router.delete("/purchase-requisitions/{pr_id}")
def delete_purchase_requisition(
    pr_id: int,
    db: Session = Depends(get_db)
):

    pr = (
        db.query(PurchaseRequisition)
        .filter(
            PurchaseRequisition.pr_id == pr_id
        )
        .first()
    )

    if not pr:
        raise HTTPException(
            status_code=404,
            detail="Purchase Requisition not found"
        )

    # Prevent deleting approved PRs
    if pr.status == "Approved":
        raise HTTPException(
            status_code=400,
            detail="Approved Purchase Requisition cannot be deleted"
        )

    db.delete(pr)
    db.commit()

    return {
        "message": "Purchase Requisition deleted successfully"
    }

@router.put(
    "/purchase-requisitions/{pr_id}/approve",
    response_model=PurchaseRequisitionResponse
)
def approve_purchase_requisition(
    pr_id: int,
    db: Session = Depends(get_db)
):

    pr = (
        db.query(PurchaseRequisition)
        .filter(
            PurchaseRequisition.pr_id == pr_id
        )
        .first()
    )

    if not pr:
        raise HTTPException(
            status_code=404,
            detail="Purchase Requisition not found"
        )

    pr.status = "Approved"

    db.commit()
    db.refresh(pr)

    return pr