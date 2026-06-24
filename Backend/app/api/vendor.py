from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.models.vendor import Vendor
from app.schemas.vendor import (
    VendorCreate,
    VendorResponse,
)

router = APIRouter(tags=["Vendors"])


@router.post("/vendors", response_model=VendorResponse)
def create_vendor(
    vendor: VendorCreate,
    db: Session = Depends(get_db)
):

    new_vendor = Vendor(
        vendor_code=vendor.vendor_code,
        vendor_name=vendor.vendor_name,
        contact_person=vendor.contact_person,
        email=vendor.email,
        phone=vendor.phone,
        address=vendor.address,
    )

    db.add(new_vendor)
    db.commit()
    db.refresh(new_vendor)

    return new_vendor


@router.get("/vendors", response_model=list[VendorResponse])
def get_vendors(db: Session = Depends(get_db)):
    return db.query(Vendor).all()


@router.get("/vendors/{vendor_id}", response_model=VendorResponse)
def get_vendor(
    vendor_id: int,
    db: Session = Depends(get_db)
):

    vendor = db.query(Vendor).filter(
        Vendor.id == vendor_id
    ).first()

    if not vendor:
        raise HTTPException(
            status_code=404,
            detail="Vendor not found"
        )

    return vendor


@router.put("/vendors/{vendor_id}", response_model=VendorResponse)
def update_vendor(
    vendor_id: int,
    vendor_data: VendorCreate,
    db: Session = Depends(get_db)
):

    vendor = db.query(Vendor).filter(
        Vendor.id == vendor_id
    ).first()

    if not vendor:
        raise HTTPException(
            status_code=404,
            detail="Vendor not found"
        )

    vendor.vendor_code = vendor_data.vendor_code
    vendor.vendor_name = vendor_data.vendor_name
    vendor.contact_person = vendor_data.contact_person
    vendor.email = vendor_data.email
    vendor.phone = vendor_data.phone
    vendor.address = vendor_data.address

    db.commit()
    db.refresh(vendor)

    return vendor


@router.delete("/vendors/{vendor_id}")
def delete_vendor(
    vendor_id: int,
    db: Session = Depends(get_db)
):

    vendor = db.query(Vendor).filter(
        Vendor.id == vendor_id
    ).first()

    if not vendor:
        raise HTTPException(
            status_code=404,
            detail="Vendor not found"
        )

    db.delete(vendor)
    db.commit()

    return {"message": "Vendor deleted successfully"}