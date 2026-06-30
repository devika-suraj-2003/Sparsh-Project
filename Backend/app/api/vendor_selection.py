from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.dependencies import get_db

from app.models.vendor_selection import VendorSelection
from app.models.vendor_quote import VendorQuote

from app.schemas.vendor_selection import (
    VendorSelectionCreate,
    VendorSelectionResponse,
)

router = APIRouter(tags=["Vendor Selection"])


@router.post(
    "/vendor-selection",
    response_model=VendorSelectionResponse
)
def create_vendor_selection(
    selection: VendorSelectionCreate,
    db: Session = Depends(get_db)
):

    # Rule 1:
    # RFQ can have only one active selection

    existing = (
        db.query(VendorSelection)
        .filter(
            VendorSelection.rfq_id == selection.rfq_id
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Vendor already selected for this RFQ"
        )

    # Rule 2:
    # Quote must exist

    quote = (
        db.query(VendorQuote)
        .filter(
            VendorQuote.id == selection.quote_id
        )
        .first()
    )

    if not quote:
        raise HTTPException(
            status_code=404,
            detail="Quote not found"
        )

    # Rule 3:
    # Quote must belong to selected vendor

    if quote.vendor_id != selection.vendor_id:
        raise HTTPException(
            status_code=400,
            detail="Selected quote does not belong to this vendor"
        )

    # Rule 4:
    # Quote must belong to same RFQ

    if quote.rfq_id != selection.rfq_id:
        raise HTTPException(
            status_code=400,
            detail="Quote does not belong to this RFQ"
        )

    vendor_selection = VendorSelection(
        rfq_id=selection.rfq_id,
        vendor_id=selection.vendor_id,
        quote_id=selection.quote_id,
        selected_by=selection.selected_by,
        selection_reason=selection.selection_reason,
        remarks=selection.remarks,
    )

    db.add(vendor_selection)

    # Update selected quote

    quote.quote_status = "Selected"

    # Reject remaining quotes

    other_quotes = (
        db.query(VendorQuote)
        .filter(
            VendorQuote.rfq_id == selection.rfq_id,
            VendorQuote.id != selection.quote_id
        )
        .all()
    )

    for q in other_quotes:
        q.quote_status = "Rejected"

    db.commit()
    db.refresh(vendor_selection)

    return vendor_selection

@router.put(
    "/vendor-selection/{selection_id}/approve",
    response_model=VendorSelectionResponse
)
def approve_vendor_selection(
    selection_id: int,
    db: Session = Depends(get_db)
):

    selection = (
        db.query(VendorSelection)
        .filter(
            VendorSelection.selection_id == selection_id
        )
        .first()
    )

    if not selection:
        raise HTTPException(
            status_code=404,
            detail="Vendor selection not found"
        )

    selection.approval_status = "Approved"

    db.commit()
    db.refresh(selection)

    return selection