from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.db.database import Base


class Version(Base):
    __tablename__ = "versions"

    version_id = Column(Integer, primary_key=True, index=True)

    board_id = Column(
        Integer,
        ForeignKey("boards.board_id"),
        nullable=False

    
    )
    bom_items = relationship("BOM")
    
    version_name = Column(String(100), nullable=False)

    description = Column(String(500), nullable=True)

    status = Column(String(50), default="Active")

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )