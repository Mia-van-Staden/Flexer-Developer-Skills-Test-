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
  const [idNumber, setIdNumber] = useState('');
  const [error, setError] = useState('');

  /**
   * Handles form submission for login
   */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim() || !idNumber.trim()) {
      setError('Please fill in all fields');
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
    onLogin({ name: name.trim(), idNumber: idNumber.trim() });
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginCard}>
        <h1 style={styles.title}>Survey Login</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="name">
              Name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              placeholder="Enter your name"
            />
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="idNumber">
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
              style={styles.input}
              placeholder="Enter your ID number"
              maxLength={13}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}
          
          <button type="submit" style={styles.button}>
            Start Survey
          </button>
        </form>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif',
  },
  loginCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '0.5rem',
    color: '#555',
    fontWeight: 'bold',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  error: {
    color: '#dc3545',
    fontSize: '0.875rem',
    textAlign: 'center',
  },
};

export default LoginPage;
