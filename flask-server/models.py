from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Index

db = SQLAlchemy()

class Task(db.Model):
    __tablename__ = 'tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200))
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    status = db.Column(db.String(20), nullable=False)  # in-progress or completed
    difficulty = db.Column(db.Integer, nullable=False)  # 1/2/3

 
    __table_args__ = (
        # indexes for status and difficulty
        Index('idx_status', 'status'),
        Index('idx_difficulty', 'difficulty'),
        Index('idx_start_end_dates', 'start_date', 'end_date'),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            'start_date': self.start_date.strftime('%Y-%m-%d') if self.start_date else None,
            'end_date': self.end_date.strftime('%Y-%m-%d') if self.end_date else None,
            "status": self.status,
            "difficulty": self.difficulty,
        }
