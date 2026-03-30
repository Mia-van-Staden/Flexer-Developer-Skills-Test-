// Type definitions for the survey application

export interface Question {
  id: number;
  text: string;
  type: 'text' | 'number' | 'date';
}

export interface SurveyResponse {
  email: string;
  idNumber: string;
  answers: Record<number, string>;
}

export interface User {
  name: string;
  idNumber: string;
}
