const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { syncDatabase } = require('./models');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// Routes d'authentification
app.use('/api/auth', authRoutes);

// Routes des tâches
app.use('/api/tasks', taskRoutes);



// Synchroniser la base de données et démarrer le serveur
const PORT = process.env.PORT || 5000;

syncDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
