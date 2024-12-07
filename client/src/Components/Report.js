import React, { useState, useEffect } from "react";

function Report() {
  const [tasks, setTasks] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [taskNames, setTaskNames] = useState([]);
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    name: "",
    status: "",
    difficulty: "",
  });

  useEffect(() => {
    //  task names for dropdown
    fetch("/tasks/names")
      .then((res) => res.json())
      .then((data) => setTaskNames(data));
  }, []);

  const handleGenerateReport = () => {
    const query = new URLSearchParams(filters).toString();
    fetch(`/report?${query}`)
      .then((res) => res.json())
      .then((data) => {
        setTasks(data.tasks);
        setStatistics(data.statistics);
      });
  };

  return (
    <div>
      <h2>Generate Report</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleGenerateReport();
        }}
      >
        <label>
          Start Date:
          <input
            type="date"
            value={filters.start_date}
            onChange={(e) =>
              setFilters({ ...filters, start_date: e.target.value })
            }
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={filters.end_date}
            onChange={(e) =>
              setFilters({ ...filters, end_date: e.target.value })
            }
          />
        </label>

        <label>
          Status:
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
          >
            <option value="">Any</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        <label>
          Difficulty:
          <select
            value={filters.difficulty}
            onChange={(e) =>
              setFilters({ ...filters, difficulty: e.target.value })
            }
          >
            <option value="">Any</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </label>

        <button type="submit">Generate</button>
      </form>

      <h3>Report Results</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.name}:</strong> {task.description}
          </li>
        ))}
      </ul>

      <h4>Statistics</h4>
      <p>Total Tasks: {statistics.total_tasks}</p>
      <p>Completion Rate: {statistics.completion_rate}%</p>
      <p>Average Difficulty Level: {statistics.avg_difficulty}</p>
      <p>Average Duration: {statistics.avg_duration_days} days</p>
    </div>
  );
}

export default Report;
