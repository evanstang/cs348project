import React from 'react';


function TaskList({ tasks, onEdit, onDelete }) {
  return (
    <div>
      <h2>Task List</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h3>{task.name}</h3>
            <p>{task.description}</p>
            <p>
              <strong>Status:</strong> {task.status}
            </p>
            <p>
              <strong>Difficulty:</strong> {task.difficulty}
            </p>
            <p>
              <strong>Start Date:</strong> {task.start_date}
            </p>
            <p>
              <strong>End Date:</strong> {task.end_date}
            </p>
            <button onClick={() => onEdit(task)}>Edit</button>
            <button onClick={() => onDelete(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}



export default TaskList;
