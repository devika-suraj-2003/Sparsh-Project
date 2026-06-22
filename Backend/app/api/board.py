from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.db.dependencies import get_db
from app.models.board import Board
from app.schemas.board import BoardCreate, BoardResponse

router = APIRouter(tags=["Boards"])


@router.post("/boards", response_model=BoardResponse)
def create_board(
    board: BoardCreate,
    db: Session = Depends(get_db)
):

    new_board = Board(
        project_id=board.project_id,
        board_name=board.board_name,
        description=board.description
    )

    db.add(new_board)
    db.commit()
    db.refresh(new_board)

    return new_board

@router.get("/boards", response_model=list[BoardResponse])
def get_boards(db: Session = Depends(get_db)):
    return db.query(Board).all()

@router.get("/boards/{board_id}", response_model=BoardResponse)
def get_board(
    board_id: int,
    db: Session = Depends(get_db)
):

    board = db.query(Board).filter(
        Board.board_id == board_id
    ).first()

    if not board:
        raise HTTPException(
            status_code=404,
            detail="Board not found"
        )

    return board
@router.put("/boards/{board_id}", response_model=BoardResponse)
def update_board(
    board_id: int,
    board_data: BoardCreate,
    db: Session = Depends(get_db)
):

    board = db.query(Board).filter(
        Board.board_id == board_id
    ).first()

    if not board:
        raise HTTPException(
            status_code=404,
            detail="Board not found"
        )

    board.project_id = board_data.project_id
    board.board_name = board_data.board_name
    board.description = board_data.description

    db.commit()
    db.refresh(board)

    return board
@router.delete("/boards/{board_id}")
def delete_board(
    board_id: int,
    db: Session = Depends(get_db)
):

    board = db.query(Board).filter(
        Board.board_id == board_id
    ).first()

    if not board:
        raise HTTPException(
            status_code=404,
            detail="Board not found"
        )

    db.delete(board)
    db.commit()

    return {"message": "Board deleted successfully"}