// ============================================
// ProtectedRoute.jsx — PAGE GUARD
// ============================================
// PURPOSE:
//   Some pages should ONLY be visible when logged in
//   Example: Dashboard — only logged-in users should see it
//
// HOW IT WORKS:
//   Wrap any page with <ProtectedRoute>
//   If logged in  → show the page normally
//   If NOT logged in → redirect to /login automatically
//
// Real world example:
//   Like a security guard at a building entrance
//   Has badge (token) → let in
//   No badge → send to reception (login page)
// ============================================

// Navigate = React Router component that redirects to another URL
import { Navigate } from 'react-router-dom';

// useAuth = our custom hook to check if user is logged in
import { useAuth } from '../context/AuthContext';

// children = the actual page component (Dashboard etc.)
function ProtectedRoute({ children }) {

  // Get authentication state from our context
  const { isAuthenticated, loading } = useAuth();

  // ============================================
  // CASE 1: Still loading
  // ============================================
  // When app first loads, we check localStorage
  // During this check, loading = true
  // We show a loading screen to prevent flicker
  // Without this, user might briefly see login page
  // before being redirected to dashboard!
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-4">💰</div>
          <p className="text-purple-600 text-xl font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  // ============================================
  // CASE 2: Not logged in
  // ============================================
  // isAuthenticated = false means no token
  // Navigate component redirects to /login
  // replace = replaces current history entry
  //   (so back button doesn't bring user back to dashboard)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ============================================
  // CASE 3: Logged in ✅
  // ============================================
  // User has a valid token → show the actual page
  // children = whatever page is wrapped by ProtectedRoute
  // e.g. <Dashboard /> in App.jsx
  return children;
}

export default ProtectedRoute;