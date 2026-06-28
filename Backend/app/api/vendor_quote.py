from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.dependencies import get_db

from app.models.vendor_quote import VendorQuote

from app.schemas.vendor_quote import (
    VendorQuoteCreate,
    VendorQuoteResponse
)

router = APIRouter(tags=["Vendor Quotes"])


@router.post(
    "/vendor-quotes",
    response_model=VendorQuoteResponse
)
def create_vendor_quote(
    quote: VendorQuoteCreate,
    db: Session = Depends(get_db)
):

    new_quote = VendorQuote(**quote.model_dump())

    db.add(new_quote)
    db.commit()
    db.refresh(new_quote)

    return new_quote


@router.get(
    "/vendor-quotes",
    response_model=list[VendorQuoteResponse]
)
def get_vendor_quotes(
    db: Session = Depends(get_db)
):
    return db.query(VendorQuote).all()


@router.get(
    "/vendor-quotes/{quote_id}",
    response_model=VendorQuoteResponse
)
def get_vendor_quote(
    quote_id: int,
    db: Session = Depends(get_db)
):

    quote = db.query(VendorQuote).filter(
        VendorQuote.id == quote_id
    ).first()

    if not quote:
        raise HTTPException(
            status_code=404,
            detail="Vendor quote not found"
        )

    return quote

@router.put(
    "/vendor-quotes/{quote_id}",
    response_model=VendorQuoteResponse
)
def update_vendor_quote(
    quote_id: int,
    quote_data: VendorQuoteCreate,
    db: Session = Depends(get_db)
):

    quote = db.query(VendorQuote).filter(
        VendorQuote.id == quote_id
    ).first()

    if not quote:
        raise HTTPException(
            status_code=404,
            detail="Vendor quote not found"
        )

    update_data = quote_data.model_dump()

    for key, value in update_data.items():
        setattr(quote, key, value)

    db.commit()
    db.refresh(quote)

    return quote

@router.delete("/vendor-quotes/{quote_id}")
def delete_vendor_quote(
    quote_id: int,
    db: Session = Depends(get_db)
):

    quote = db.query(VendorQuote).filter(
        VendorQuote.id == quote_id
    ).first()

    if not quote:
        raise HTTPException(
            status_code=404,
            detail="Vendor quote not found"
        )

    db.delete(quote)
    db.commit()

    return {
        "message": "Vendor quote deleted successfully"
    }