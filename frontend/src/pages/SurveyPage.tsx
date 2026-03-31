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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
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
   * moving back to previous question
   */
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setError('');
    }
  };

  /**
   * moving on to nect question
   */
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setError('');
    }
  };

  /**
   * Handles resetting the survey
   */
  const handleReset = async () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setError('');
    setSubmitted(false);
    
    // Reload and reshuffle questions
    try {
      const fetchedQuestions = await fetchQuestions();
      setQuestions(fetchedQuestions);
    } catch (err) {
      setError('Failed to reload questions. Please try again.');
    }
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
      const response = await submitSurvey({
        email: user.email,
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
            className="form-input"
            placeholder={`Enter ${question.text.toLowerCase()}`}
            required
          />
        );
      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="form-input"
            required
          />
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="form-input"
            placeholder={`Enter ${question.text.toLowerCase()}`}
            required
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="survey-container">
        <div className="loading">Loading questions...</div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="survey-container">
        <div className="success-card">
          <h2 className="success-title">Thank You!</h2>
          <p className="success-message">Your survey has been submitted successfully.</p>
          <button onClick={onLogout} className="btn">
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="survey-container">
      <div className="survey-card">
        <div className="survey-header">
          <h1 className="survey-title">Survey Questions</h1>
          <p className="user-info">Welcome, {user.name}</p>
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>

        <form onSubmit={handleSubmit} className="survey-form">
          {/* Progress indicator */}
          <div className="progress-indicator">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          
          {/* Current question */}
          {questions.length > 0 && (
            <div key={questions[currentQuestionIndex].id} className="question-group">
              <label className="question-label" htmlFor={`question-${questions[currentQuestionIndex].id}`}>
                {questions[currentQuestionIndex].id}. {questions[currentQuestionIndex].text}
              </label>
              {renderInput(questions[currentQuestionIndex])}
            </div>
          )}

          {error && <div className="error">{error}</div>}
          
          {/* Navigation buttons */}
          <div className="navigation">
            <button 
              type="button" 
              onClick={handleBack}
              className={`btn btn-back ${currentQuestionIndex === 0 ? 'disabled' : ''}`}
              disabled={currentQuestionIndex === 0}
            >
              Back
            </button>
            
            <div className="right-buttons">
              <button 
                type="button" 
                onClick={handleReset}
                className="btn btn-reset"
              >
                Reset
              </button>
              
              {currentQuestionIndex === questions.length - 1 ? (
                <button 
                  type="submit" 
                  className="btn" 
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Submit Survey'}
                </button>
              ) : (
                <button 
                  type="button" 
                  onClick={handleNext}
                  className="btn"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SurveyPage;
