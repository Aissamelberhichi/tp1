const { getTasks, saveTasks, generateId } = require('../config/jsonDatabase');

class Task {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.completed = data.completed !== undefined ? data.completed : false;
    this.userId = data.userId;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  // Find a task by primary key (id)
  static async findByPk(id) {
    const tasks = await getTasks();
    const task = tasks.find(t => t.id === id);
    return task ? new Task(task) : null;
  }

  // Find one task by criteria
  static async findOne(options = {}) {
    const tasks = await getTasks();
    let foundTask = null;
    
    if (options.where) {
      foundTask = tasks.find(task => {
        for (const key in options.where) {
          if (task[key] !== options.where[key]) {
            return false;
          }
        }
        return true;
      });
    }
    
    return foundTask ? new Task(foundTask) : null;
  }

  // Find all tasks matching criteria
  static async findAll(options = {}) {
    const tasks = await getTasks();
    let filteredTasks = [...tasks];
    
    // Apply where conditions
    if (options.where) {
      filteredTasks = filteredTasks.filter(task => {
        for (const key in options.where) {
          if (task[key] !== options.where[key]) {
            return false;
          }
        }
        return true;
      });
    }
    
    // Apply ordering
    if (options.order && options.order.length > 0) {
      const [field, direction] = options.order[0];
      filteredTasks.sort((a, b) => {
        if (direction === 'ASC') {
          return a[field] > b[field] ? 1 : -1;
        } else {
          return a[field] < b[field] ? 1 : -1;
        }
      });
    }
    
    return filteredTasks.map(task => new Task(task));
  }

  // Create a new task
  static async create(taskData) {
    const tasks = await getTasks();
    
    // Create new task object
    const newTask = {
      id: generateId(tasks),
      title: taskData.title,
      description: taskData.description || '',
      completed: taskData.completed !== undefined ? taskData.completed : false,
      userId: taskData.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to tasks array and save
    tasks.push(newTask);
    await saveTasks(tasks);
    
    return new Task(newTask);
  }

  // Save changes to a task
  async save() {
    const tasks = await getTasks();
    const index = tasks.findIndex(t => t.id === this.id);
    
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    // Update the task data
    this.updatedAt = new Date().toISOString();
    tasks[index] = {
      ...tasks[index],
      title: this.title,
      description: this.description,
      completed: this.completed,
      updatedAt: this.updatedAt
    };
    
    await saveTasks(tasks);
    return this;
  }

  // Delete a task
  async destroy() {
    const tasks = await getTasks();
    const filteredTasks = tasks.filter(t => t.id !== this.id);
    
    if (filteredTasks.length === tasks.length) {
      throw new Error('Task not found');
    }
    
    await saveTasks(filteredTasks);
    return true;
  }
}

module.exports = Task;
