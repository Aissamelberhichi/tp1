const fs = require('fs').promises;
const path = require('path');

// Paths to our JSON data files
const usersFilePath = path.join(__dirname, '../data/users.json');
const tasksFilePath = path.join(__dirname, '../data/tasks.json');

// Helper function to read JSON data
async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is empty, return empty array
    if (error.code === 'ENOENT' || error.message.includes('Unexpected end of JSON input')) {
      return [];
    }
    throw error;
  }
}

// Helper function to write JSON data
async function writeJsonFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Get all users
async function getUsers() {
  return await readJsonFile(usersFilePath);
}

// Get all tasks
async function getTasks() {
  return await readJsonFile(tasksFilePath);
}

// Save users
async function saveUsers(users) {
  await writeJsonFile(usersFilePath, users);
}

// Save tasks
async function saveTasks(tasks) {
  await writeJsonFile(tasksFilePath, tasks);
}

// Generate a unique ID for new records
function generateId(items) {
  if (items.length === 0) return 1;
  return Math.max(...items.map(item => item.id)) + 1;
}

// Initialize the database with empty files if they don't exist
async function initializeDatabase() {
  try {
    // Ensure the data directory exists
    const dataDir = path.join(__dirname, '../data');
    try {
      await fs.mkdir(dataDir, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }

    // Initialize users.json if it doesn't exist
    try {
      await fs.access(usersFilePath);
    } catch (error) {
      await writeJsonFile(usersFilePath, []);
    }

    // Initialize tasks.json if it doesn't exist
    try {
      await fs.access(tasksFilePath);
    } catch (error) {
      await writeJsonFile(tasksFilePath, []);
    }

    console.log('JSON database initialized successfully');
  } catch (error) {
    console.error('Error initializing JSON database:', error);
  }
}

module.exports = {
  getUsers,
  getTasks,
  saveUsers,
  saveTasks,
  generateId,
  initializeDatabase
};
