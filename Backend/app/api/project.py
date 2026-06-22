from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException

from app.db.dependencies import get_db
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectResponse

router = APIRouter(tags=["Projects"])


@router.post("/projects", response_model=ProjectResponse)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    
    new_project = Project(
        project_code=project.project_code,
        project_name=project.project_name,
        customer_name=project.customer_name,
        description=project.description,
        start_date=project.start_date,
        target_date=project.target_date,
    )

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return new_project
@router.get("/projects", response_model=list[ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    return db.query(Project).all()

@router.get("/projects/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)):

    project = db.query(Project).filter(
        Project.project_id == project_id
    ).first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    return project

@router.put("/projects/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    project_data: ProjectCreate,
    db: Session = Depends(get_db)
):

    project = db.query(Project).filter(
        Project.project_id == project_id
    ).first()

    project.project_code = project_data.project_code
    project.project_name = project_data.project_name
    project.customer_name = project_data.customer_name
    project.description = project_data.description
    project.start_date = project_data.start_date
    project.target_date = project_data.target_date

    db.commit()
    db.refresh(project)

    return project

@router.delete("/projects/{project_id}")
def delete_project(
    project_id: int,
    db: Session = Depends(get_db)
):

    project = db.query(Project).filter(
        Project.project_id == project_id
    ).first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    db.delete(project)
    db.commit()

    return {"message": "Project deleted successfully"}