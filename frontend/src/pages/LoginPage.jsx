// ============================================
// LoginPage.jsx — LOGIN SCREEN
// ============================================
// What it does:
//   1. Shows a form with username + password
//   2. User fills and submits
//   3. Calls backend POST /api/auth/login
//   4. Backend returns JWT token
//   5. We save token → redirect to dashboard
// ============================================

import { useState } from 'react';

// useNavigate = go to another page after login
// Link = clickable link (like <a> but for React Router)
import { useNavigate, Link } from 'react-router-dom';

import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

function LoginPage() {

  // formData = what user types in the form
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  // Get login function from AuthContext
  const { login } = useAuth();

  // Get navigate function to redirect after login
  const navigate = useNavigate();

  // Updates formData when user types
  // Works for ALL input fields because we use name attribute
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Runs when user clicks Login button
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page refresh
    setError('');
    setLoading(true);

    try {
      // Call: POST http://localhost:8080/api/auth/login
      // Sends: { username: "sujit", password: "password123" }
      // Gets back: { token: "eyJ...", username: "sujit", message: "Login successful!" }
      const response = await loginUser(formData);

      // Save token + username to context + localStorage
      login(response.token, response.username);

      // Redirect to dashboard
      navigate('/dashboard');

    } catch (err) {
      // err.response?.data = error text from backend
      // e.g. "User not found!" or "Invalid password!"
      setError(err.response?.data || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Full screen purple gradient background
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center p-4">

      {/* White card — centered on screen */}
      {/* max-w-md = maximum width on large screens */}
      {/* w-full = full width on small screens */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">

        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">💰</div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
          <p className="text-gray-500 mt-1 text-sm">
            Login to track your expenses
          </p>
        </div>

        {/* Error Box — only visible when error exists */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm text-center">
            {error}
          </div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"           // must match formData key
              value={formData.username} // controlled input
              onChange={handleChange}
              placeholder="Enter your username"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"           // hides characters with dots
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 rounded-xl transition duration-200 mt-2"
          >
            {loading ? '⏳ Logging in...' : 'Login →'}
          </button>
        </form>

        {/* Link to Register Page */}
        <p className="text-center text-gray-500 mt-6 text-sm">
          Don't have an account?{' '}
          {/* Link = like <a> but doesn't refresh the page */}
          <Link
            to="/register"
            className="text-purple-600 font-semibold hover:underline"
          >
            Create one here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;