// ============================================
// AuthContext.jsx — GLOBAL LOGIN STATE
// ============================================
// PROBLEM without Context:
//   Dashboard needs to know "who is logged in"
//   Navbar needs to show the username
//   ProtectedRoute needs to check if logged in
//   If you pass this data through props, every
//   component needs to receive it → very messy!
//
// SOLUTION with Context:
//   Store "who is logged in" in ONE place
//   ANY component can read it directly
//   No need to pass through every component!
//
// Real world example:
//   Like a school notice board — one board,
//   everyone can read it, no need to tell each person!
// ============================================

import { createContext, useState, useContext, useEffect } from 'react';

// STEP 1: Create the context (empty container)
// Think of it as creating the notice board
const AuthContext = createContext(null);

// ============================================
// STEP 2: Create the Provider
// ============================================
// Provider = the component that HOLDS the data
// It wraps your whole app (see App.jsx)
// { children } = everything inside the Provider tag
// i.e. all your pages and components
export function AuthProvider({ children }) {

  // user = stores logged-in user's info { username: "sujit" }
  // null = no one is logged in initially
  const [user, setUser] = useState(null);

  // token = stores the JWT token string
  // null = no token initially
  const [token, setToken] = useState(null);

  // loading = true while we check if user was already logged in
  // We need this to prevent "flash" of login page
  // before we check localStorage
  const [loading, setLoading] = useState(true);

  // ============================================
  // CHECK IF ALREADY LOGGED IN
  // ============================================
  // useEffect runs ONCE when the app first loads
  // [] at the end = "run only once, not repeatedly"
  // 
  // WHY? If user refreshes the page, React state resets!
  // But localStorage persists! So we read from there.
  useEffect(() => {
    // Check if we saved a token last time user logged in
    const savedToken    = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');

    // If both exist → user was already logged in
    if (savedToken && savedUsername) {
      setToken(savedToken);
      setUser({ username: savedUsername });
    }

    // Done checking → set loading to false
    setLoading(false);
  }, []); // [] means run once on component mount

  // ============================================
  // LOGIN FUNCTION
  // ============================================
  // Called after successful login or register
  // tokenValue = JWT token from backend
  // username = logged-in username
  const login = (tokenValue, username) => {
    // Save to localStorage so it persists after refresh
    localStorage.setItem('token', tokenValue);
    localStorage.setItem('username', username);

    // Save to state so components re-render immediately
    setToken(tokenValue);
    setUser({ username });
  };

  // ============================================
  // LOGOUT FUNCTION
  // ============================================
  // Clears everything — state AND localStorage
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUser(null);
  };

  // ============================================
  // PROVIDE VALUES TO ALL CHILDREN
  // ============================================
  // Everything in this 'value' object is accessible
  // by ANY component that uses useAuth()
  return (
    <AuthContext.Provider value={{
      user,            // { username: "sujit" } or null
      token,           // "eyJhbGci..." or null
      loading,         // true while checking localStorage
      login,           // function to call after login
      logout,          // function to call on logout
      isAuthenticated: !!token, // converts token to true/false
      // !! converts any value to boolean
      // !!null = false (not logged in)
      // !!"eyJ..." = true (logged in)
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// ============================================
// STEP 3: Custom Hook
// ============================================
// Instead of writing useContext(AuthContext) everywhere,
// we create a shortcut called useAuth()
// Any component just writes: const { user } = useAuth()
export function useAuth() {
  return useContext(AuthContext);
}