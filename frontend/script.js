// Survey Application - Plain JavaScript with Ajax

// Global Variables
let questions = [];
let answers = {};
let currentQuestionIndex = 0;
let user = null;

// DOM Elements
const loginPage = document.getElementById('loginPage');
const surveyPage = document.getElementById('surveyPage');
const successPage = document.getElementById('successPage');

const loginForm = document.getElementById('loginForm');
const surveyForm = document.getElementById('surveyForm');

const loginError = document.getElementById('loginError');
const surveyError = document.getElementById('surveyError');

// Navigation Elements
const backBtn = document.getElementById('backBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const logoutBtn = document.getElementById('logoutBtn');
const logoutSuccessBtn = document.getElementById('logoutSuccessBtn');

// Survey Elements
const progress = document.getElementById('progress');
const questionLabel = document.getElementById('questionLabel');
const questionInput = document.getElementById('questionInput');
const userInfo = document.getElementById('userInfo');

// API Configuration
const API_BASE_URL = '/api/survey';

// Utility Functions
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
}

function hideError(element) {
    element.textContent = '';
    element.style.display = 'none';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidIdNumber(idNumber) {
    return idNumber.trim().length > 0;
}

// Ajax Functions
function ajaxRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(options.method || 'GET', url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response);
                } catch (e) {
                    resolve(xhr.responseText);
                }
            } else {
                reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
            }
        };
        
        xhr.onerror = function() {
            reject(new Error('Network error'));
        };
        
        xhr.send(options.body ? JSON.stringify(options.body) : null);
    });
}

// API Calls
async function fetchQuestions() {
    try {
        const response = await ajaxRequest(`${API_BASE_URL}/questions`);
        return response;
    } catch (error) {
        console.error('Error fetching questions:', error);
        throw new Error('Failed to fetch questions. Please try again.');
    }
}

async function submitSurvey(data) {
    try {
        const response = await ajaxRequest(`${API_BASE_URL}/submit`, {
            method: 'POST',
            body: data
        });
        return response;
    } catch (error) {
        console.error('Error submitting survey:', error);
        throw new Error('Failed to submit survey. Please try again.');
    }
}

// Login Functions
function handleLogin(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const idNumber = document.getElementById('idNumber').value.trim();
    
    // Validation
    if (!name || !email || !idNumber) {
        showError(loginError, 'Please fill in all fields');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError(loginError, 'Please enter a valid email address');
        return;
    }
    
    if (idNumber.length !== 13 || isNaN(Number(idNumber))) {
        showError(loginError, 'ID number must be exactly 13 digits');
        return;
    }
    
    hideError(loginError);
    
    // Store user data
    user = { name, email, idNumber };
    
    // Load survey
    loadSurvey();
}

async function loadSurvey() {
    try {
        showPage('surveyPage');
        userInfo.textContent = `Welcome, ${user.name}!`;
        
        // Fetch questions
        questions = await fetchQuestions();
        
        // Reset state
        answers = {};
        currentQuestionIndex = 0;
        
        // Display first question
        displayQuestion();
        
    } catch (error) {
        showError(surveyError, error.message);
        showPage('loginPage');
    }
}

// Survey Functions
function displayQuestion() {
    if (questions.length === 0) return;
    
    const question = questions[currentQuestionIndex];
    
    // Update progress
    progress.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    
    // Update question label
    questionLabel.textContent = `${question.id}. ${question.text}`;
    questionLabel.htmlFor = `question-${question.id}`;
    
    // Create input based on question type
    const currentValue = answers[question.id] || '';
    
    switch (question.type) {
        case 'number':
            questionInput.innerHTML = `
                <input 
                    type="number" 
                    id="question-${question.id}"
                    value="${currentValue}"
                    placeholder="Enter ${question.text.toLowerCase()}"
                    required
                    onchange="handleAnswerChange(${question.id}, this.value)"
                />
            `;
            break;
        case 'date':
            questionInput.innerHTML = `
                <input 
                    type="date" 
                    id="question-${question.id}"
                    value="${currentValue}"
                    required
                    onchange="handleAnswerChange(${question.id}, this.value)"
                />
            `;
            break;
        default:
            questionInput.innerHTML = `
                <input 
                    type="text" 
                    id="question-${question.id}"
                    value="${currentValue}"
                    placeholder="Enter ${question.text.toLowerCase()}"
                    required
                    onchange="handleAnswerChange(${question.id}, this.value)"
                />
            `;
    }
    
    // Update navigation buttons
    updateNavigationButtons();
}

function handleAnswerChange(questionId, value) {
    answers[questionId] = value;
    hideError(surveyError);
}

function updateNavigationButtons() {
    // Back button
    backBtn.disabled = currentQuestionIndex === 0;
    
    // Next/Submit button
    if (currentQuestionIndex === questions.length - 1) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'block';
        submitBtn.style.display = 'none';
    }
}

function handleBack() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
        hideError(surveyError);
    }
}

function handleNext() {
    if (currentQuestionIndex < questions.length - 1) {
        // Check if current question is answered
        const currentQuestion = questions[currentQuestionIndex];
        if (!answers[currentQuestion.id]?.trim()) {
            showError(surveyError, 'Please answer the current question before proceeding.');
            return;
        }
        
        currentQuestionIndex++;
        displayQuestion();
        hideError(surveyError);
    }
}

async function handleSubmit(e) {
    e.preventDefault();
    
    // Use user data from login
    const email = user.email;
    const idNumber = user.idNumber;
    
    // Check if all questions are answered
    const unansweredQuestions = questions.filter(q => !answers[q.id]?.trim());
    if (unansweredQuestions.length > 0) {
        showError(surveyError, 'Please answer all questions before submitting.');
        return;
    }
    
    try {
        // Submit survey
        const response = await submitSurvey({
            email,
            idNumber,
            answers
        });
        
        // Log response to console
        console.log('Survey submitted successfully:', response);
        
        // Show success page
        showPage('successPage');
        
    } catch (error) {
        showError(surveyError, error.message);
    }
}

async function handleReset() {
    try {
        // Clear all data
        answers = {};
        currentQuestionIndex = 0;
        
        hideError(surveyError);
        
        // Reload and reshuffle questions
        questions = await fetchQuestions();
        displayQuestion();
        
    } catch (error) {
        showError(surveyError, error.message);
    }
}

function handleLogout() {
    // Reset all state
    questions = [];
    answers = {};
    currentQuestionIndex = 0;
    user = null;
    
    // Clear form
    loginForm.reset();
    surveyForm.reset();
    
    hideError(loginError);
    hideError(surveyError);
    
    // Show login page
    showPage('loginPage');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Login form
    loginForm.addEventListener('submit', handleLogin);
    
    // Survey form
    surveyForm.addEventListener('submit', handleSubmit);
    
    // Navigation buttons
    backBtn.addEventListener('click', handleBack);
    nextBtn.addEventListener('click', handleNext);
    resetBtn.addEventListener('click', handleReset);
    
    // Logout buttons
    logoutBtn.addEventListener('click', handleLogout);
    logoutSuccessBtn.addEventListener('click', handleLogout);
    
    // ID number input validation
    document.getElementById('idNumber').addEventListener('input', function(e) {
        const value = e.target.value;
        if (value.length <= 13 && !isNaN(Number(value))) {
            e.target.value = value;
        } else {
            e.target.value = value.slice(0, -1);
        }
    });
    
    // Show login page initially
    showPage('loginPage');
});

// Make handleAnswerChange globally available for inline onchange handlers
window.handleAnswerChange = handleAnswerChange;
