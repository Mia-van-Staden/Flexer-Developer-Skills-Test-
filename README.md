# Flexer Developer Skills Test - Survey Application

A survey app for felexer practical development skills, resting api, react/JS front end, c# backend

## Features
- 10 survey questions (3 number, 5 text, 2 date inputs)
- Questions appear in random order
- Email and ID number validation
- One question at a time with navigation
- Reset functionality
- Responsive design

## Quick Start

### Option 1: React/TypeScript Version
```bash
cd frontend
npm install
npm start
```
Then start the API:
```bash
cd SurveyAPI
dotnet run
```

### Option 2: Run Both at Same Time
```bash
cd frontend
npm install (If not yet done)
npm run start:all
```
This starts both the React app and API server simultaneously.

### Option 3: Plain JavaScript Version
1. Open `frontend/index.html` directly in your browser
2. Make sure the API is running (see above)

## API Endpoints
- `GET /api/survey/questions` - Get random questions
- `POST /api/survey/submit` - Submit survey responses

## Requirements Met
✅ 10 questions (3 number, 5 text, 2 date)
✅ Random question order  
✅ Email and ID validation
✅ Reset button
✅ Ajax calls (plain JS version)
✅ Console logging on submission
✅ Responsive UI

## Usage
1. Login with name, email, and ID number
2. Answer questions one by one
3. Use Back/Next buttons to navigate
4. Submit when all questions are answered
