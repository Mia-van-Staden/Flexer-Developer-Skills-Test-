import React, { useState } from 'react';
import { User } from '../types';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

/**
 * Login page component for user authentication
 */
const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [error, setError] = useState('');

  /**
   * Validates email format
   */
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Handles form submission for login
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim() || !email.trim() || !idNumber.trim()) {
      setError('Please fill in all fields');
      return;
    }

    // Email validation
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // ID number validation 
    if (idNumber.length !== 13 || isNaN(Number(idNumber))) {
      setError('ID number must be exactly 13 digits');
      return;
    }

    // Clear any previous errors
    setError('');
    
    // Call parent component with user data
    onLogin({ 
      name: name.trim(), 
      email: email.trim(),
      idNumber: idNumber.trim() 
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Survey Login</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              placeholder="Enter your name"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label" htmlFor="idNumber">
              ID Number:
            </label>
            <input
              type="text"
              id="idNumber"
              value={idNumber}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 13 && !isNaN(Number(value))) {
                  setIdNumber(value);
                }
              }}
              className="form-input"
              placeholder="Enter your ID number"
              maxLength={13}
            />
          </div>

          {error && <div className="error">{error}</div>}
          
          <button type="submit" className="btn">
            Start Survey
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
