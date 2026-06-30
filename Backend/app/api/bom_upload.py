from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session
from app.services.upload_service import UploadService
import os
import pandas as pd

from app.db.database import get_db
from app.models.bom import BOM

router = APIRouter(
    prefix="/bom",
    tags=["BOM Upload"]
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_bom(
    version_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    # Save uploaded file
    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)

    # Read Excel without assuming headers
    raw_df = UploadService.save_uploaded_file(
        file_path
    )

    # Detect header row
    header_row = UploadService.detect_header(
        raw_df,
        required_columns=[
            "quantity",
            "reference"
        ]
)

    if header_row is None:
        return {
            "error": "Unable to detect BOM header row"
        }

    # Read BOM with detected header
    bom_df = UploadService.read_excel(
        file_path,
        header_row
    )

    # Column mapping
    column_mapping = {

        "reference_designator": [
            "reference",
            "reference designator",
            "refdes",
            "ref des"
        ],

        "manufacturer_part_number": [
            "manufacturer part number",
            "mpn",
            "manufacturer pn"
        ],

        "component_name": [
            "part",
            "component",
            "component name"
        ],

        "quantity_per_board": [
            "quantity",
            "qty",
            "quantity per board"
        ],

        "dnp": [
            "dnp",
            "do not populate"
        ]
    }

    detected_mapping = UploadService.detect_columns(
        bom_df,
        column_mapping
    )

    # Extract records
    bom_records = []

    for _, row in bom_df.iterrows():

        record = {
            "reference_designator": row.get(
                detected_mapping.get(
                    "reference_designator"
                )
            ),

            "manufacturer_part_number": row.get(
                detected_mapping.get(
                    "manufacturer_part_number"
                )
            ),

            "component_name": row.get(
                detected_mapping.get(
                    "component_name"
                )
            ),

            "quantity_per_board": row.get(
                detected_mapping.get(
                    "quantity_per_board"
                )
            ),

            "dnp": row.get(
                detected_mapping.get(
                    "dnp"
                )
            )
        }

        # Convert NaN → None
        for key, value in record.items():

            if pd.isna(value):
                record[key] = None

        # Skip completely empty rows
        if (
            not record["reference_designator"]
            and not record["manufacturer_part_number"]
            and not record["component_name"]
            and not record["quantity_per_board"]
        ):
            continue

        bom_records.append(record)

    # Validation
    validation_errors = []

    for index, record in enumerate(
        bom_records,
        start=1
    ):

        if not record["reference_designator"]:
            validation_errors.append(
                f"Row {index}: Missing Reference Designator"
            )

        if not record["manufacturer_part_number"]:
            validation_errors.append(
                f"Row {index}: Missing Manufacturer Part Number"
            )

        if not record["quantity_per_board"]:
            validation_errors.append(
                f"Row {index}: Missing Quantity"
            )

    if validation_errors:

        return {
            "validation_error_count": len(
                validation_errors
            ),
            "validation_errors": validation_errors
        }

    # Remove existing BOM for same version
    existing_bom = db.query(BOM).filter(
        BOM.version_id == version_id
    ).first()

    if existing_bom:
        return {
            "detail": "BOM already exists for this version. Please create a new version before uploading a new BOM."
        }

    # Import records
    imported_count = 0

    for line_no, record in enumerate(
        bom_records,
        start=1
    ):

        bom_item = BOM(

            version_id=version_id,

            line_no=line_no,

            reference_designator=record[
                "reference_designator"
            ],

            manufacturer_part_number=record[
                "manufacturer_part_number"
            ],

            component_name=record[
                "component_name"
            ],

            description=record[
                "component_name"
            ],

            quantity_per_board=int(
                record["quantity_per_board"]
            ),

            unit="Nos",

            dnp=True if record["dnp"] else False,

            remarks=None
        )

        db.add(bom_item)
        db.flush()  # Flush to assign bom_id

        imported_count += 1

    db.commit()

    return {
        "message": "BOM imported successfully",
        "version_id": version_id,
        "records_imported": imported_count
    }