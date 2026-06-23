from fastapi import APIRouter, UploadFile, File
import os
import pandas as pd

router = APIRouter(
    prefix="/bom",
    tags=["BOM Upload"]
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_bom(file: UploadFile = File(...)):

    # Save uploaded file
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)

    # Read raw excel without assuming headers
    raw_df = pd.read_excel(
        file_path,
        header=None
    )

    # Detect header row
    header_row = None

    for index, row in raw_df.iterrows():

        row_values = [
            str(value).strip().lower()
            for value in row
            if pd.notna(value)
        ]

        if (
            "quantity" in row_values and
            "reference" in row_values
        ):
            header_row = index
            break

    # Safety check
    if header_row is None:
        return {
            "error": "Unable to detect BOM header row"
        }

    # Read BOM using detected header
    bom_df = pd.read_excel(
        file_path,
        header=header_row
    )

    # Column mapping definitions
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

    # Detect matching columns
    detected_mapping = {}

    for db_field, possible_names in column_mapping.items():

        for column in bom_df.columns:

            column_lower = str(column).strip().lower()

            if column_lower in possible_names:
                detected_mapping[db_field] = column
                break

    # Extract BOM records
    bom_records = []

    for _, row in bom_df.iterrows():

        record = {
            "reference_designator": row.get(
                detected_mapping.get("reference_designator")
            ),

            "manufacturer_part_number": row.get(
                detected_mapping.get("manufacturer_part_number")
            ),

            "component_name": row.get(
                detected_mapping.get("component_name")
            ),

            "quantity_per_board": row.get(
                detected_mapping.get("quantity_per_board")
            ),

            "dnp": row.get(
                detected_mapping.get("dnp")
            )
        }

        # Convert NaN to None
        for key, value in record.items():
            if pd.isna(value):
                record[key] = None
        if (
            not record["reference_designator"] and
            not record["manufacturer_part_number"] and
            not record["component_name"] and
            not record["quantity_per_board"]
        ):
            continue
        bom_records.append(record)

    # Validation
    validation_errors = []

    for index, record in enumerate(bom_records, start=1):

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

    # Return validation result
    return {
        "total_records": len(bom_records),
        "validation_error_count": len(validation_errors),
        "validation_errors": validation_errors[:20],
        "sample_records": bom_records[:5]
    }