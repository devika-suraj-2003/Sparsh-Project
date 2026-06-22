from app.db.database import Base, engine

# Import all models
from app.models.role import Role
from app.models.user import User
from app.models.project import Project
from app.models.board import Board
from app.models.version import Version

Base.metadata.create_all(bind=engine)

print("Tables Created Successfully!")