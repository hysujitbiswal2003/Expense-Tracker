// ============================================
// api.js — ALL BACKEND COMMUNICATION HAPPENS HERE
// ============================================
// This file is like a "phone book" for your backend
// Every function here makes ONE specific API call
// Other files just import and call these functions
// They don't need to know HOW the call is made!
// ============================================

// axios is a library that makes HTTP requests easy
// It's like fetch() but better — handles errors, headers automatically
import axios from 'axios';

// ============================================
// BACKEND URL CONFIGURATION
// ============================================
// import.meta.env.VITE_API_URL checks for an environment variable
// In development (your computer): no env variable → uses localhost:8080
// In production (Railway): env variable is set → uses Railway URL
// This way the same code works in both places!
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// ============================================
// CREATE AXIOS INSTANCE
// ============================================
// Instead of configuring every request separately,
// we create ONE instance with default settings
// All requests made with 'api' will use these defaults
const api = axios.create({
  baseURL: API_BASE_URL,         // all URLs will start with this
  headers: {
    'Content-Type': 'application/json', // we're sending JSON data
  },
});

// ============================================
// REQUEST INTERCEPTOR — THE MAGIC PART!
// ============================================
// This runs AUTOMATICALLY before EVERY single request
// You don't have to manually add token to each request
// 
// HOW JWT WORKS:
// 1. User logs in → backend gives token
// 2. We save token in localStorage (browser storage)
// 3. EVERY future request → this interceptor reads token
//    and adds it to the header automatically
// 4. Backend reads header → knows who you are!
//
// Without this interceptor, you'd have to write
// headers: { Authorization: `Bearer ${token}` }
// in EVERY single API call — very repetitive!
api.interceptors.request.use((config) => {
  // Read token from browser's localStorage
  const token = localStorage.getItem('token');
  
  // If token exists, add it to Authorization header
  if (token) {
    // 'Bearer' is a standard prefix for JWT tokens
    // Backend's JwtAuthFilter reads this header
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // MUST return config, otherwise request won't be sent!
  return config;
});

// ============================================
// AUTH API FUNCTIONS
// ============================================

// REGISTER — creates a new user account
// userData = { username, email, password }
// Returns = { token, username, message }
export const registerUser = async (userData) => {
  // POST request to: http://localhost:8080/api/auth/register
  const response = await api.post('/auth/register', userData);
  return response.data; // return just the data, not the whole response
};

// LOGIN — logs in with existing account
// credentials = { username, password }
// Returns = { token, username, message }
export const loginUser = async (credentials) => {
  // POST request to: http://localhost:8080/api/auth/login
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// ============================================
// EXPENSE API FUNCTIONS
// ============================================

// GET ALL EXPENSES — fetches all expenses for logged-in user
// Token is added automatically by the interceptor above!
// Returns = array of expense objects
export const getExpenses = async () => {
  // GET request to: http://localhost:8080/api/expenses
  const response = await api.get('/expenses');
  return response.data;
};

// ADD EXPENSE — creates a new expense
// expenseData = { title, amount, category, description }
// Returns = the saved expense object with id and createdAt
export const addExpense = async (expenseData) => {
  // POST request to: http://localhost:8080/api/expenses
  const response = await api.post('/expenses', expenseData);
  return response.data;
};

// DELETE EXPENSE — removes an expense by its id
// id = the expense's id number (e.g. 1, 2, 3)
// Returns = "Expense deleted!" message
export const deleteExpense = async (id) => {
  // DELETE request to: http://localhost:8080/api/expenses/1
  const response = await api.delete(`/expenses/${id}`);
  return response.data;
};

export default api;