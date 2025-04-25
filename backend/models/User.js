const bcrypt = require('bcrypt');
const { getUsers, saveUsers, generateId } = require('../config/jsonDatabase');

class User {
  constructor(data) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Find a user by primary key (id)
  static async findByPk(id, options = {}) {
    const users = await getUsers();
    const user = users.find(u => u.id === id);
    
    if (!user) return null;
    
    // Handle attributes exclusion
    if (options.attributes && options.attributes.exclude) {
      const userObj = { ...user };
      options.attributes.exclude.forEach(attr => delete userObj[attr]);
      return new User(userObj);
    }
    
    return new User(user);
  }

  // Find one user by criteria
  static async findOne(options = {}) {
    const users = await getUsers();
    let foundUser = null;
    
    if (options.where) {
      // Handle simple where conditions
      foundUser = users.find(user => {
        for (const key in options.where) {
          // Handle OR conditions
          if (key === '[Op.or]' && Array.isArray(options.where[key])) {
            return options.where[key].some(condition => {
              for (const condKey in condition) {
                if (user[condKey] === condition[condKey]) {
                  return true;
                }
              }
              return false;
            });
          }
          // Handle simple equality
          if (user[key] !== options.where[key]) {
            return false;
          }
        }
        return true;
      });
    }
    
    return foundUser ? new User(foundUser) : null;
  }

  // Find all users matching criteria
  static async findAll(options = {}) {
    const users = await getUsers();
    let filteredUsers = [...users];
    
    // Apply where conditions
    if (options.where) {
      filteredUsers = filteredUsers.filter(user => {
        for (const key in options.where) {
          if (user[key] !== options.where[key]) {
            return false;
          }
        }
        return true;
      });
    }
    
    // Apply ordering
    if (options.order && options.order.length > 0) {
      const [field, direction] = options.order[0];
      filteredUsers.sort((a, b) => {
        if (direction === 'ASC') {
          return a[field] > b[field] ? 1 : -1;
        } else {
          return a[field] < b[field] ? 1 : -1;
        }
      });
    }
    
    return filteredUsers.map(user => new User(user));
  }

  // Create a new user
  static async create(userData) {
    const users = await getUsers();
    
    // Check for unique constraints
    const existingUsername = users.find(u => u.username === userData.username);
    if (existingUsername) {
      const error = new Error('Username already exists');
      error.name = 'UniqueConstraintError';
      throw error;
    }
    
    const existingEmail = users.find(u => u.email === userData.email);
    if (existingEmail) {
      const error = new Error('Email already exists');
      error.name = 'UniqueConstraintError';
      throw error;
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    userData.password = await bcrypt.hash(userData.password, salt);
    
    // Create new user object
    const newUser = {
      id: generateId(users),
      username: userData.username,
      email: userData.email,
      password: userData.password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to users array and save
    users.push(newUser);
    await saveUsers(users);
    
    return new User(newUser);
  }

  // Save changes to a user
  async save() {
    const users = await getUsers();
    const index = users.findIndex(u => u.id === this.id);
    
    if (index === -1) {
      throw new Error('User not found');
    }
    
    // Update the user data
    this.updatedAt = new Date().toISOString();
    users[index] = {
      ...users[index],
      username: this.username,
      email: this.email,
      password: this.password,
      updatedAt: this.updatedAt
    };
    
    await saveUsers(users);
    return this;
  }

  // Check if a field has changed
  changed(field) {
    // This is a simplified implementation
    return true;
  }

  // Check password
  async checkPassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  // Delete a user
  async destroy() {
    const users = await getUsers();
    const filteredUsers = users.filter(u => u.id !== this.id);
    
    if (filteredUsers.length === users.length) {
      throw new Error('User not found');
    }
    
    await saveUsers(filteredUsers);
    return true;
  }
}

module.exports = User;
