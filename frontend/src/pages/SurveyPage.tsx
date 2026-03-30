import React, { useState, useEffect } from 'react';
import { Question, User } from '../types';
import { fetchQuestions, submitSurvey } from '../services/api';

interface SurveyPageProps {
  user: User;
  onLogout: () => void;
}

/**
 * Survey page component for displaying and collecting question responses
 */
const SurveyPage: React.FC<SurveyPageProps> = ({ user, onLogout }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  /**
   * Fetch questions from API when component mounts
   */
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const fetchedQuestions = await fetchQuestions();
        setQuestions(fetchedQuestions);
      } catch (err) {
        setError('Failed to load questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  /**
   * Handles input changes for form fields
   */
  const handleInputChange = (questionId: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  /**
   * Validates all questions are answered and submits to API
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all questions are answered
    const unansweredQuestions = questions.filter(q => !answers[q.id]?.trim());
    if (unansweredQuestions.length > 0) {
      setError('Please answer all questions before submitting.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Map user.name to email field as expected by API
      const response = await submitSurvey({
        email: user.name,
        idNumber: user.idNumber,
        answers,
      });
      
      setSubmitted(true);
      console.log('Survey submitted successfully:', response);
    } catch (err) {
      setError('Failed to submit survey. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Renders appropriate input field based on question type
   */
  const renderInput = (question: Question) => {
    const value = answers[question.id] || '';
    
    switch (question.type) {
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            style={styles.input}
            placeholder={`Enter ${question.text.toLowerCase()}`}
          />
        );
      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            style={styles.input}
          />
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            style={styles.input}
            placeholder={`Enter ${question.text.toLowerCase()}`}
          />
        );
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading questions...</div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={styles.container}>
        <div style={styles.successCard}>
          <h2 style={styles.successTitle}>Thank You!</h2>
          <p style={styles.successMessage}>Your survey has been submitted successfully.</p>
          <button onClick={onLogout} style={styles.button}>
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.surveyCard}>
        <div style={styles.header}>
          <h1 style={styles.title}>Survey Questions</h1>
          <p style={styles.userInfo}>Welcome, {user.name}</p>
          <button onClick={onLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {questions.map((question) => (
            <div key={question.id} style={styles.questionGroup}>
              <label style={styles.label} htmlFor={`question-${question.id}`}>
                {question.id}. {question.text}
              </label>
              {renderInput(question)}
            </div>
          ))}

          {error && <div style={styles.error}>{error}</div>}
          
          <button 
            type="submit" 
            style={styles.button} 
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Survey'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Simple inline styles for clean, minimal UI
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif',
    padding: '2rem',
  },
  loading: {
    fontSize: '1.2rem',
    color: '#666',
  },
  surveyCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '600px',
  },
  header: {
    marginBottom: '2rem',
    borderBottom: '1px solid #eee',
    paddingBottom: '1rem',
  },
  title: {
    color: '#333',
    marginBottom: '0.5rem',
  },
  userInfo: {
    color: '#666',
    margin: '0',
  },
  logoutButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  questionGroup: {
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
  successCard: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  successTitle: {
    color: '#28a745',
    marginBottom: '1rem',
  },
  successMessage: {
    color: '#666',
    marginBottom: '2rem',
  },
};

export default SurveyPage;
