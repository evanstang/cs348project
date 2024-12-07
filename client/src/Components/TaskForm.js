import React, { useState, useEffect } from 'react';

function TaskForm({ onAdd, onEdit, selectedTask }) {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState('in-progress'); // default is in-progress
  const [taskDifficulty, setTaskDifficulty] = useState(1); // default is 1
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // form fields if editing an existing task
  useEffect(() => {
    if (selectedTask) {
      setTaskName(selectedTask.name);
      setTaskDescription(selectedTask.description);
      setTaskStatus(selectedTask.status);
      setTaskDifficulty(selectedTask.difficulty);
      setStartDate(selectedTask.start_date);
      setEndDate(selectedTask.end_date);
    }
  }, [selectedTask]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTask = {
      name: taskName,
      description: taskDescription,
      status: taskStatus,
      difficulty: parseInt(taskDifficulty),
      start_date: startDate,
      end_date: endDate,
    };

    if (selectedTask) {
      onEdit({ ...newTask, id: selectedTask.id }); // update the existing task
    } else {
      onAdd(newTask); // add new task
    }

    // reset form after submission
    setTaskName('');
    setTaskDescription('');
    setTaskStatus('in-progress');
    setTaskDifficulty(1);
    setStartDate('');
    setEndDate('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Task Name:
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          required
        />
      </label>
      <label>
        Task Description:
        <input
          type="text"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          required
        />
      </label>
      <label>
        Task Status:
        <select
          value={taskStatus}
          onChange={(e) => setTaskStatus(e.target.value)}
        >
          <option value="in-progress">In-Progress</option>
          <option value="completed">Completed</option>
        </select>
      </label>
      <label>
        Difficulty Level:
        <select
          value={taskDifficulty}
          onChange={(e) => setTaskDifficulty(e.target.value)}
        >
          <option value="1">1 (Easy)</option>
          <option value="2">2 (Medium)</option>
          <option value="3">3 (Hard)</option>
        </select>
      </label>
      <label>
        Start Date:
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </label>
      <label>
        End Date:
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </label>
      <button type="submit">{selectedTask ? 'Update Task' : 'Add Task'}</button>
    </form>
  );
}

export default TaskForm;
