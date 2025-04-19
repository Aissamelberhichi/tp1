// src/components/TaskList.js
import React, { useState, useEffect } from 'react';
import { taskService } from '../services/api';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await taskService.getAllTasks();
        setTasks(data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des tu00e2ches');
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Liste des tu00e2ches</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title}
            {task.completed ? ' (Terminu00e9e)' : ' (En cours)'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
