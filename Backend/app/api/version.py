from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException

from app.db.dependencies import get_db
from app.models.version import Version
from app.schemas.version import VersionCreate, VersionResponse

router = APIRouter(tags=["Versions"])


@router.post("/versions", response_model=VersionResponse)
def create_version(
    version: VersionCreate,
    db: Session = Depends(get_db)
):

    new_version = Version(
        board_id=version.board_id,
        version_name=version.version_name,
        description=version.description
    )

    db.add(new_version)
    db.commit()
    db.refresh(new_version)

    return new_version

@router.get("/versions", response_model=list[VersionResponse])
def get_versions(db: Session = Depends(get_db)):
    return db.query(Version).all()

@router.get("/versions/{version_id}", response_model=VersionResponse)
def get_version(
    version_id: int,
    db: Session = Depends(get_db)
):
    version = db.query(Version).filter(Version.version_id == version_id).first()
    if not version:
        raise HTTPException(status_code=404, detail="Version not found")
    return version

@router.put("/versions/{version_id}", response_model=VersionResponse)
def update_version(
    version_id: int,
    version_data: VersionCreate,
    db: Session = Depends(get_db)
):

    version = db.query(Version).filter(
        Version.version_id == version_id
    ).first()

    if not version:
        raise HTTPException(
            status_code=404,
            detail="Version not found"
        )

    version.board_id = version_data.board_id
    version.version_name = version_data.version_name
    version.description = version_data.description

    db.commit()
    db.refresh(version)

    return version

@router.delete("/versions/{version_id}")
def delete_version(
        version_id: int,
        db: Session = Depends(get_db)
):
    version = db.query(Version).filter(
        Version.version_id == version_id
    ).first()

    if not version:
        raise HTTPException(
            status_code=404,
            detail="Version not found"
        )

    db.delete(version)
    db.commit()

    return {"message": "Version deleted successfully"}