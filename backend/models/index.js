const { initializeDatabase } = require('../config/jsonDatabase');
const User = require('./User');
const Task = require('./Task');

// Initialize the JSON database
const syncDatabase = async () => {
  try {
    await initializeDatabase();
    console.log('JSON database initialized successfully');
  } catch (error) {
    console.error('Error initializing JSON database:', error);
  }
};

module.exports = {
  User,
  Task,
  syncDatabase
};
