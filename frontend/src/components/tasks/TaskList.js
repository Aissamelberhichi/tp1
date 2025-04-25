// src/components/tasks/TaskList.js
import React, { useState, useEffect } from 'react';
import { taskService } from '../../services/api';
import './Tasks.css';

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
        setError('Erreur lors du chargement des tâches');
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="task-list">
      <h2>Liste des tâches</h2>
      {tasks.length === 0 ? (
        <p>Aucune tâche pour le moment</p>
      ) : (
        <ul className="task-items">
          {tasks.map(task => (
            <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <span className="task-title">{task.title}</span>
              <span className="task-status">
                {task.completed ? ' (Terminée)' : ' (En cours)'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
