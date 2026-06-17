from app.db.database import Base, engine

# Import all models
from app.models.role import Role
from app.models.user import User
from app.models.project import Project

Base.metadata.create_all(bind=engine)

print("Tables Created Successfully!")