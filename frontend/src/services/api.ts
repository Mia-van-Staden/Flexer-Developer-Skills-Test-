import { Question, SurveyResponse } from '../types';

// API service for communicating with the backend
const API_BASE_URL = '/api/survey';

/**
 * @returns Array of shuffled questions
 */
export const fetchQuestions = async (): Promise<Question[]> => {
  const response = await fetch(`${API_BASE_URL}/questions`);
  if (!response.ok) {
    throw new Error('Failed to fetch questions');
  }
  return response.json();
};

/**
 * @param response - Survey response data
 * @returns  Confirmation message
 */
export const submitSurvey = async (response: SurveyResponse): Promise<string[]> => {
  const res = await fetch(`${API_BASE_URL}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(response),
  });

  if (!res.ok) {
    throw new Error('Failed to submit survey');
  }
  
  return res.json();
};
