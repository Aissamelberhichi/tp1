const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Route d'inscription
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Vérifier si l'utilisateur existe déjà avec le même username ou email
    // Nous allons vérifier chacun séparément puisque nous n'avons plus l'opérateur Op.or de Sequelize
    const existingUsername = await User.findOne({ where: { username } });
    const existingEmail = await User.findOne({ where: { email } });
    
    if (existingUsername || existingEmail) {
      return res.status(400).json({ 
        message: 'Un utilisateur avec ce nom d\'utilisateur ou cet email existe déjà' 
      });
    }
    
    // Créer un nouvel utilisateur
    const user = await User.create({
      username,
      email,
      password
    });
    
    // Générer un token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    
    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    if (error.name === 'UniqueConstraintError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription' });
  }
});

// Route de connexion
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Trouver l'utilisateur par nom d'utilisateur
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }
    
    // Vérifier le mot de passe
    const isPasswordValid = await user.checkPassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }
    
    // Générer un token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
    
    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
});

// Route pour récupérer le profil utilisateur
router.get('/profile', async (req, res) => {
  try {
    // Vérifier le token JWT (middleware à implémenter)
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Non autorisé: Token manquant' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
