import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import SurveyPage from './pages/SurveyPage';
import { User } from './types';

/**
 * Handles user authentication flow between login and survey pages
 */
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  /**
   * Handles user login by storing user data in state
   * @param userData - User information from login form
   */
  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  /**
   * Handles user logout by clearing user data from state
   */
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="App">
      {user ? (
        <SurveyPage user={user} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
