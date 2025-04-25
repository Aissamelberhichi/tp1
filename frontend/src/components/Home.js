import React, { useState } from 'react';
import TaskList from './tasks/TaskList';
import TaskForm from './tasks/TaskForm';

const Home = ({ user }) => {
  const [refreshTasks, setRefreshTasks] = useState(false);

  const handleTaskAdded = () => {
    // Force TaskList to refresh by toggling the refreshTasks state
    setRefreshTasks(!refreshTasks);
  };

  return (
    <div className="container">
      <div className="welcome-section">
        <h1>Bienvenue {user?.username}</h1>
        <p>Vous êtes maintenant connecté à l'application.</p>
      </div>
      
      <div className="task-container">
        <TaskForm onTaskAdded={handleTaskAdded} />
        <TaskList key={refreshTasks ? 'refresh' : 'initial'} />
      </div>
    </div>
  );
};

export default Home;
