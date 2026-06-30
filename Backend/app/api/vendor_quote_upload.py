from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    Depends
)
from app.models.vendor_quote import VendorQuote
from app.models.bom import BOM
from app.models.rfq import RFQ

from sqlalchemy.orm import Session
import pandas as pd
import os

from app.db.database import get_db

router = APIRouter(
    prefix="/vendor-quotes",
    tags=["Vendor Quote Upload"]
)

UPLOAD_DIR = "uploads"
os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)


@router.post("/upload")
async def upload_vendor_quote(

    rfq_id: int = Form(...),

    vendor_id: int = Form(...),

    file: UploadFile = File(...),

    db: Session = Depends(get_db)

):

    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)

    # ------------------------------------------
    # Read Standard Vendor Quote Template
    # ------------------------------------------

    quote_df = pd.read_excel(file_path)

    required_columns = [
        "Manufacturer Part Number",
        "Quantity",
        "Unit Price",
        "Lead Time (Days)",
        "MOQ",
        "Remarks"
    ]
    rfq = db.query(RFQ).filter(
        RFQ.rfq_id == rfq_id
    ).first()

    if not rfq:
        return {
            "detail": "RFQ not found."
        }

    version_id = rfq.version_id
    missing_columns = [
        column
        for column in required_columns
        if column not in quote_df.columns
    ]

    if missing_columns:
        return {
            "detail": f"Missing required columns: {missing_columns}"
        }

    imported = 0
    failed = []

    for _, row in quote_df.iterrows():

        mpn = str(
            row["Manufacturer Part Number"]
        ).strip().upper()

        bom = db.query(BOM).filter(
            BOM.version_id == version_id,
            BOM.manufacturer_part_number.ilike(mpn)
        ).first()

        if not bom:

            failed.append({
                "manufacturer_part_number": mpn,
                "reason": "Not found in BOM"
            })

            continue

        existing = db.query(VendorQuote).filter(
            VendorQuote.rfq_id == rfq_id,
            VendorQuote.vendor_id == vendor_id,
            VendorQuote.bom_id == bom.bom_id
        ).first()

        if existing:

            failed.append({
                "manufacturer_part_number": mpn,
                "reason": "Quote already exists"
            })

            continue

        quote = VendorQuote(

            rfq_id=rfq_id,

            vendor_id=vendor_id,

            bom_id=bom.bom_id,

            quoted_price=float(
                row["Unit Price"]
            ),

            moq=int(
                row["MOQ"]
            ),

            lead_time_days=int(
                row["Lead Time (Days)"]
            ),

            remarks=str(
                row["Remarks"]
            ) if pd.notna(row["Remarks"]) else None
        )

        db.add(quote)

        imported += 1

    db.commit()

    return {
        "message": "Vendor Quotes imported successfully",
        "records_imported": imported,
        "failed_records": failed
    }