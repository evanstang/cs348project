import React, { useState, useEffect } from 'react';
import TaskForm from './Components/TaskForm';
import TaskList from './Components/TaskList';
import Report from './Components/Report';

function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetch('/tasks')  
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  // add task function
  const addTask = (task) => {
    fetch('/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    })
      .then((res) => res.json())
      .then((data) => setTasks([...tasks, data]));
  };

  // edit task function
  const editTask = (updatedTask) => {
    fetch(`/tasks/${updatedTask.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    })
      .then(() => {
        const updatedTasks = tasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        );
        setTasks(updatedTasks);
        setSelectedTask(null); // reset the task after editing
      });
  };

  // delete task function
  const deleteTask = (taskId) => {
    fetch(`/tasks/${taskId}`, {
      method: 'DELETE',
    }).then(() => {
      setTasks(tasks.filter((task) => task.id !== taskId));
    });
  };

  //  selecting a task to edit
  const handleEdit = (task) => {
    setSelectedTask(task);
  };

  return (
    <div>
      <h1>Task Management</h1>
      <TaskForm
        onAdd={addTask}
        onEdit={editTask}
        selectedTask={selectedTask}
      />
      <TaskList tasks={tasks} onEdit={handleEdit} onDelete={deleteTask} />
      <Report />
    </div>
  );
}

export default App;
