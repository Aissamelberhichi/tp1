const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Task, User } = require('../models');

// Middleware d'authentification
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Non autorisé: Token manquant' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    res.status(401).json({ message: 'Token invalide' });
  }
};

// Route pour récupérer toutes les tâches de l'utilisateur connecté
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    
    res.json(tasks);
  } catch (error) {
    console.error('Erreur lors de la récupération des tâches:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour récupérer une tâche spécifique
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }
    
    res.json(task);
  } catch (error) {
    console.error('Erreur lors de la récupération de la tâche:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour créer une nouvelle tâche
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Le titre est requis' });
    }
    
    const newTask = await Task.create({
      title,
      description,
      completed: false,
      userId: req.user.id
    });
    
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Erreur lors de la création de la tâche:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour mettre à jour une tâche
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    
    const task = await Task.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }
    
    // Mettre à jour les champs
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (completed !== undefined) task.completed = completed;
    
    await task.save();
    
    res.json(task);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la tâche:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Route pour supprimer une tâche
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { 
        id: req.params.id,
        userId: req.user.id
      }
    });
    
    if (!task) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }
    
    await task.destroy();
    
    res.json({ message: 'Tâche supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la tâche:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
