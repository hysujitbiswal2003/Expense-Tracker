// ============================================
// Navbar.jsx — TOP NAVIGATION BAR
// ============================================
// Shows on the Dashboard page
// Displays: Logo | Username | Logout button
// ============================================

// useAuth = get logged-in user's info
import { useAuth } from '../context/AuthContext';

// useNavigate = programmatically go to another page
import { useNavigate } from 'react-router-dom';

function Navbar() {

  // Get user info and logout function from context
  // user = { username: "sujit" }
  // logout = function that clears token + user
  const { user, logout } = useAuth();

  // useNavigate gives us a function to change pages
  const navigate = useNavigate();

  // ============================================
  // LOGOUT HANDLER
  // ============================================
  // 1. Call logout() → clears token from state + localStorage
  // 2. Navigate to /login → redirect to login page
  const handleLogout = () => {
    logout();           // clear all auth data
    navigate('/login'); // go to login page
  };

  return (
    // nav = HTML5 semantic element for navigation
    // shadow-sm = subtle shadow at the bottom
    // flex justify-between = logo on left, user info on right
    <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">

      {/* ===== LEFT SIDE: Logo ===== */}
      <div className="flex items-center gap-2">
        {/* Money bag emoji as our logo */}
        <span className="text-2xl">💰</span>
        <span className="text-xl font-bold text-purple-700">
          Expense Tracker
        </span>
      </div>

      {/* ===== RIGHT SIDE: Username + Logout ===== */}
      <div className="flex items-center gap-4">

        {/* Show logged-in username */}
        {/* user?.username means: if user exists, show username */}
        {/* The ? is "optional chaining" — prevents crash if user is null */}
        <span className="text-gray-600 text-sm">
          Hello, <strong className="text-purple-700">{user?.username}</strong>!
        </span>

        {/* Logout button */}
        {/* onClick calls handleLogout when clicked */}
        <button
          onClick={handleLogout}
          className="bg-red-100 hover:bg-red-200 text-red-600 text-sm font-medium px-4 py-2 rounded-lg transition duration-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;