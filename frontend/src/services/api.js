// src/services/api.js - Service pour interagir avec l'API
import axios from 'axios';
const API_URL = 'http://localhost:5000/api';

// Créer une instance axios avec la configuration de base
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Fonctions pour interagir avec l'API d'authentification
export const authService = {
  // Inscription d'un nouvel utilisateur
  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  },

  // Connexion d'un utilisateur
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  },

  // Récupérer le profil de l'utilisateur
  getProfile: async () => {
    try {
      const response = await apiClient.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      throw error;
    }
  }
};

// Fonctions pour interagir avec l'API des tâches
export const taskService = {
  // Récupérer toutes les tâches
  getAllTasks: async () => {
    try {
      const response = await apiClient.get('/tasks');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des tâches:', error);
      throw error;
    }
  },

  // Ajouter une nouvelle tâche
  createTask: async (taskData) => {
    try {
      const response = await apiClient.post('/tasks', taskData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
      throw error;
    }
  }
};

// Intercepteur pour l'authentification
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default apiClient;
