// ============================================
// App.jsx — THE ROOT OF YOUR REACT APP
// ============================================
// This file does 3 things:
//   1. Sets up routing (URL → Page mapping)
//   2. Wraps everything in AuthProvider
//   3. Defines which routes are protected
//
// URL ROUTING means:
//   /login    → show LoginPage component
//   /register → show RegisterPage component
//   /dashboard → show Dashboard component (protected)
//   /         → redirect to /login
// ============================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// BrowserRouter = enables URL routing in React
// Routes = container, only ONE route renders at a time
// Route = maps a URL path to a component
// Navigate = immediately redirects to another URL

import { AuthProvider }    from './context/AuthContext';
import ProtectedRoute      from './components/ProtectedRoute';
import LoginPage           from './pages/LoginPage';
import RegisterPage        from './pages/RegisterPage';
import Dashboard           from './pages/Dashboard';

function App() {
  return (
    // BrowserRouter must wrap everything
    // It "listens" to URL changes and shows the right page
    <BrowserRouter>

      {/* AuthProvider must wrap everything too */}
      {/* So ALL pages can access user/token/login/logout */}
      <AuthProvider>

        {/* Routes = only the MATCHING route renders */}
        {/* If URL is /login → only LoginPage renders */}
        <Routes>

          {/* PUBLIC ROUTES — anyone can visit */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* PROTECTED ROUTE — only logged-in users */}
          {/* ProtectedRoute checks token before showing Dashboard */}
          {/* If no token → redirects to /login */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* DEFAULT ROUTE */}
          {/* If someone visits just "/" → redirect to /login */}
          {/* replace = don't add "/" to browser history */}
          <Route path="/" element={<Navigate to="/login" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;