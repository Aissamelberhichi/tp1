// src/components/TaskForm.js
import React, { useState } from 'react';
import { taskService } from '../services/api';

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      const newTask = await taskService.createTask({ title });
      setTitle('');
      if (onTaskAdded) onTaskAdded(newTask);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h2>Ajouter une tâche</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nouvelle tâche"
          disabled={submitting}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Ajout...' : 'Ajouter'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
