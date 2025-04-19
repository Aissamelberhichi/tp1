// src/App.js
import React, { useState } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import './App.css';

function App() {
  const [refreshTasks, setRefreshTasks] = useState(false);

  const handleTaskAdded = () => {
    // Force TaskList to refresh by toggling the refreshTasks state
    setRefreshTasks(!refreshTasks);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gestionnaire de Tu00e2ches</h1>
      </header>
      <div className="container">
        <TaskForm onTaskAdded={handleTaskAdded} />
        <TaskList key={refreshTasks ? 'refresh' : 'initial'} />
      </div>
    </div>
  );
}

export default App;
