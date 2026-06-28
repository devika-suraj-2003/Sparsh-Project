from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.dependencies import get_db

from app.models.rfq_vendor import RFQVendor
from app.schemas.rfq_vendor import (
    RFQVendorCreate,
    RFQVendorResponse
)

router = APIRouter(tags=["RFQ Vendors"])


@router.post("/rfq-vendors", response_model=RFQVendorResponse)
def create_rfq_vendor(
    data: RFQVendorCreate,
    db: Session = Depends(get_db)
):

    rfq_vendor = RFQVendor(**data.model_dump())

    db.add(rfq_vendor)
    db.commit()
    db.refresh(rfq_vendor)

    return rfq_vendor


@router.get("/rfq-vendors", response_model=list[RFQVendorResponse])
def get_rfq_vendors(db: Session = Depends(get_db)):
    return db.query(RFQVendor).all()


@router.get("/rfq-vendors/{id}", response_model=RFQVendorResponse)
def get_rfq_vendor(
    id: int,
    db: Session = Depends(get_db)
):

    rfq_vendor = db.query(RFQVendor).filter(
        RFQVendor.id == id
    ).first()

    if not rfq_vendor:
        raise HTTPException(
            status_code=404,
            detail="RFQ Vendor not found"
        )

    return rfq_vendor


@router.put("/rfq-vendors/{id}", response_model=RFQVendorResponse)
def update_rfq_vendor(
    id: int,
    data: RFQVendorCreate,
    db: Session = Depends(get_db)
):

    rfq_vendor = db.query(RFQVendor).filter(
        RFQVendor.id == id
    ).first()

    if not rfq_vendor:
        raise HTTPException(
            status_code=404,
            detail="RFQ Vendor not found"
        )

    for key, value in data.model_dump().items():
        setattr(rfq_vendor, key, value)

    db.commit()
    db.refresh(rfq_vendor)

    return rfq_vendor


@router.delete("/rfq-vendors/{id}")
def delete_rfq_vendor(
    id: int,
    db: Session = Depends(get_db)
):

    rfq_vendor = db.query(RFQVendor).filter(
        RFQVendor.id == id
    ).first()

    if not rfq_vendor:
        raise HTTPException(
            status_code=404,
            detail="RFQ Vendor not found"
        )

    db.delete(rfq_vendor)
    db.commit()

    return {
        "message": "RFQ Vendor deleted successfully"
    }