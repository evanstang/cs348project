from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from datetime import datetime
from sqlalchemy import Index

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Task(db.Model):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200))
    status = db.Column(db.String(50), nullable=False, default='in-progress')  # default 'in-progress'
    difficulty = db.Column(db.Integer, nullable=False, default=1)  # default difficulty level 1
    start_date = db.Column(db.Date, nullable=True)
    end_date = db.Column(db.Date, nullable=True)


    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "status": self.status,
            "difficulty": self.difficulty,
            "start_date": self.start_date,
            "end_date": self.end_date
        }

@app.route("/")
def home():
    return "This is my Project Task Tracker!!"

@app.route("/tasks", methods=["GET"])
def get_tasks():
    tasks = Task.query.all()
    return jsonify([task.to_dict() for task in tasks])

# creating a new task
@app.route("/tasks", methods=["POST"])
def create_task():
    data = request.get_json()
    new_task = Task(name=data["name"], description=data["description"], status=data['status'],
                    difficulty=data['difficulty'],
                    start_date=datetime.strptime(data['start_date'], '%Y-%m-%d'),
                    end_date=datetime.strptime(data['end_date'], '%Y-%m-%d'))
    db.session.add(new_task)
    db.session.commit()
    return jsonify(new_task.to_dict()), 201

# editing a task
@app.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
  data = request.get_json()
  task = Task.query.get_or_404(task_id)
    
   # update the fields including status and difficulty
  task.name = data["name"]
  task.description = data["description"]
  task.status = data["status"]  # update status field
  task.difficulty = data["difficulty"]  # update difficulty field
  task.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d') if 'start_date' in data else task.start_date
  task.end_date = datetime.strptime(data['end_date'], '%Y-%m-%d') if 'end_date' in data else task.end_date
    
  db.session.commit()
    
  return jsonify(task.to_dict())

@app.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted successfully"})

with app.app_context():
    db.create_all()
    if Task.query.count() == 0:
        sample_tasks = [
            Task(name='Task 1', description='Description for Task 1'),
            Task(name='Task 2', description='Description for Task 2'),
        ]
        db.session.bulk_save_objects(sample_tasks)
        db.session.commit()

# get data for dropdowns
@app.route("/tasks/names", methods=["GET"])
def get_task_names():
    task_names = db.session.query(Task.name).distinct().all()
    return jsonify([name[0] for name in task_names])

@app.route('/report', methods=['GET'])
def generate_report():
    # fet filters from query params
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    status = request.args.get('status')
    difficulty = request.args.get('difficulty')

    
    start_date = datetime.strptime(start_date, '%Y-%m-%d') if start_date else None
    end_date = datetime.strptime(end_date, '%Y-%m-%d') if end_date else None

    # query tasks based on date, status, and difficulty filters
    query = Task.query

    #  start date filter
    if start_date:
        query = query.filter(Task.start_date >= start_date)
    #  end date filter
    if end_date:
        query = query.filter(Task.end_date <= end_date)
    #  status filter
    if status:
        query = query.filter(Task.status == status)
    #  difficulty filter
    if difficulty:
        query = query.filter(Task.difficulty == int(difficulty))

    tasks = query.all()

    #  statistics
    total_tasks = len(tasks)
    completed_tasks = len([task for task in tasks if task.status == 'completed'])
    completion_rate = (completed_tasks / total_tasks) * 100 if total_tasks > 0 else 0
    avg_difficulty = sum(task.difficulty for task in tasks) / total_tasks if total_tasks > 0 else 0
    avg_duration = sum((task.end_date - task.start_date).days for task in tasks) / total_tasks if total_tasks > 0 else 0

    # return tasks and statistics
    statistics = {
        'total_tasks': total_tasks,
        'completion_rate': completion_rate,
        'avg_difficulty': avg_difficulty,
        'avg_duration_days': avg_duration
    }

    return jsonify({'tasks': [task.to_dict() for task in tasks], 'statistics': statistics})

if __name__ == "__main__":
    app.run(debug=True)
