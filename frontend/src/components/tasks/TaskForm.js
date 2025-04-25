// src/components/tasks/TaskForm.js
import React, { useState } from 'react';
import { taskService } from '../../services/api';
import './Tasks.css';

const TaskForm = ({ onTaskAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setSubmitting(true);
    setError('');
    
    // Log pour débogage
    console.log('Données du formulaire:', formData);
    console.log('Token d\'authentification:', localStorage.getItem('token'));
    
    try {
      const newTask = await taskService.createTask(formData);
      console.log('Tâche créée avec succès:', newTask);
      setFormData({ title: '', description: '' });
      if (onTaskAdded) onTaskAdded(newTask);
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      console.error('Détails de l\'erreur:', error.response?.data);
      setError(`Erreur lors de l'ajout de la tâche: ${error.response?.data?.message || error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="task-form">
      <h2>Ajouter une tâche</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="task-title">Titre de la tâche</label>
          <input
            type="text"
            id="task-title"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Entrez le titre de la tâche"
            disabled={submitting}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Entrez une description détaillée (optionnelle)"
            disabled={submitting}
            rows="4"
          />
        </div>
        
        <div className="form-group text-center">
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={submitting || !formData.title.trim()}
          >
            {submitting ? 'Ajout en cours...' : 'Ajouter la tâche'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
