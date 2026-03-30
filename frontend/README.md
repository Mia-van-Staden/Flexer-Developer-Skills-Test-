# Survey Frontend Application

A React TypeScript frontend for the Survey API that provides a clean, simple interface for users to log in and complete surveys.

## Features

- **Login Page**: Collects user name and ID number before accessing the survey
- **Survey Questions**: Displays questions fetched from the API with appropriate input types
- **Randomized Questions**: Questions are shuffled each time the page loads (handled by API)
- **Form Validation**: Ensures all questions are answered before submission
- **Clean UI**: Minimal, responsive design with inline styles
- **Modular Structure**: Well-organized code with TypeScript types and service separation

## Project Structure

```
Flexer-Developer-Skills-Test-/
├── SurveyAPI/                 # .NET Web API backend
│   ├── Controllers/
│   ├── Models/
│   └── Properties/
├── frontend/                  # React TypeScript frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   └── SurveyPage.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── index.css
│   ├── package.json
│   └── README.md
└── README.md
```

## Prerequisites

- **Node.js** (version 14 or higher)
- **npm** (version 6 or higher)
- **.NET SDK** (version 6.0 or higher)

## Complete Setup and Running Instructions

### Option 1: Quick Start (Both Frontend and Backend Together)

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install frontend dependencies** (only needed once):
   ```bash
   npm install
   ```

3. **Start both frontend and backend simultaneously**:
   ```bash
   npm run start:all
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

### Option 2: Manual Start (Separate Terminals)

#### Step 1: Start the Backend API

1. **Open Terminal 1** and navigate to the SurveyAPI directory:
   ```bash
   cd SurveyAPI
   ```

2. **Start the .NET API server**:
   ```bash
   dotnet run
   ```

3. **Wait for the API to start** - you should see output indicating it's running on `http://localhost:5139`

#### Step 2: Start the Frontend

1. **Open Terminal 2** and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. **Install dependencies** (only needed once):
   ```bash
   npm install
   ```

3. **Start the React development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## API Integration

The frontend communicates with the Survey API through the following endpoints:

- `GET /api/survey/questions` - Fetches randomized survey questions
- `POST /api/survey/submit` - Submits completed survey responses

The API proxy is configured in `package.json` to forward requests to `http://localhost:5139`.

## Usage

1. **Login**: Enter your name and ID number on the login page
2. **Complete Survey**: Answer all questions displayed on the survey page
3. **Submit**: Click the submit button to send your responses
4. **Confirmation**: View the success message and logout option

## Development Notes

- The application uses TypeScript for type safety
- Inline styles are used for simplicity and to avoid external CSS dependencies
- Error handling is implemented for API failures
- Form validation ensures all required fields are completed
- Questions are automatically randomized by the backend API

## Available Scripts

- `npm start` - Runs the frontend only in development mode
- `npm run start:all` - Runs both frontend and backend simultaneously
- `npm run build` - Builds the frontend for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## Troubleshooting

- **API Connection Issues**: Ensure the Survey API backend is running on `http://localhost:5139`
- **Port Conflicts**: If port 3000 is in use, React will automatically try the next available port
- **Dependency Issues**: Try deleting `node_modules` and running `npm install` again
- **.NET Issues**: Make sure you have the .NET SDK installed and can run `dotnet` commands
- **Concurrently Issues**: If `npm run start:all` fails, use Option 2 (manual start with separate terminals)
