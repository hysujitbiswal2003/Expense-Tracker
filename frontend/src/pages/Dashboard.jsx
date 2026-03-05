// ============================================
// Dashboard.jsx — MAIN PAGE
// ============================================
// This is the "boss" page
// It manages ALL the expense data
// and passes it DOWN to child components
//
// DATA FLOW:
//   Dashboard fetches expenses from backend
//   Dashboard passes expenses → ExpenseList (to show them)
//   Dashboard passes function → ExpenseForm (to add new one)
//   Dashboard passes function → ExpenseList (to delete one)
//
// This pattern is called "lifting state up"
// The parent (Dashboard) owns the data
// Children just display or modify it
// ============================================

import { useState, useEffect } from 'react';
import Navbar      from '../components/Navbar';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import { getExpenses } from '../services/api';

function Dashboard() {

  // expenses = array of all expense objects
  // Starts empty, gets filled when page loads
  const [expenses, setExpenses] = useState([]);

  // loading = true while fetching from backend
  const [loading, setLoading]   = useState(true);

  // error = shown if fetching fails
  const [error, setError]       = useState('');

  // ============================================
  // FETCH EXPENSES ON PAGE LOAD
  // ============================================
  // useEffect with [] runs ONCE when component mounts
  // "mounts" = when component first appears on screen
  useEffect(() => {
    loadExpenses();
  }, []); // [] = "only run once when page loads"

  const loadExpenses = async () => {
    try {
      setLoading(true);
      // Call: GET /api/expenses
      // Backend returns ONLY this user's expenses
      // (filtered by user_id using JWT token)
      const data = await getExpenses();
      setExpenses(data); // store in state
    } catch (err) {
      setError('Failed to load expenses. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // CALLED BY ExpenseForm AFTER ADDING EXPENSE
  // ============================================
  // newExpense = expense object returned from backend
  // We add it to FRONT of array so newest shows first
  //
  // [newExpense, ...expenses] means:
  //   new expense + all existing expenses
  //   This is the spread operator — copies all items
  const handleExpenseAdded = (newExpense) => {
    setExpenses([newExpense, ...expenses]);
    // No need to re-fetch from backend!
    // We already have the data from backend's response
  };

  // ============================================
  // CALLED BY ExpenseList AFTER DELETING EXPENSE
  // ============================================
  // id = the id of the deleted expense
  // .filter() creates NEW array WITHOUT the deleted item
  // It keeps all expenses where expense.id is NOT equal to deleted id
  const handleExpenseDeleted = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
    // No need to re-fetch from backend!
    // We know which one was deleted, so we remove it locally
  };

  // ============================================
  // CALCULATE TOTAL
  // ============================================
  // .reduce() loops through array and accumulates a value
  // sum starts at 0
  // For each expense: sum = sum + expense.amount
  // Final result = total of all amounts
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // ============================================
  // JSX
  // ============================================
  return (
    // bg-gray-50 = light grey background for whole page
    <div className="min-h-screen bg-gray-50">

      {/* Navbar at the top */}
      {/* Gets user info from AuthContext directly */}
      <Navbar />

      {/* Main content - max width 2xl, centered */}
      <div className="max-w-2xl mx-auto p-6 space-y-5">

        {/* ===== TOTAL SPENT CARD ===== */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white text-center shadow-lg">
          <p className="text-purple-200 text-xs uppercase tracking-widest mb-2">
            Total Spent This Month
          </p>
          <h2 className="text-5xl font-bold tracking-tight">
            ₹{total.toFixed(2)}
          </h2>
          <p className="text-purple-200 text-sm mt-2">
            {expenses.length} transaction{expenses.length !== 1 ? 's' : ''}
            {/* Adds 's' if more than 1 transaction */}
            {/* "1 transaction" vs "3 transactions" */}
          </p>
        </div>

        {/* ===== ADD EXPENSE FORM ===== */}
        {/* Pass handleExpenseAdded as prop */}
        {/* ExpenseForm will call it after adding */}
        <ExpenseForm onExpenseAdded={handleExpenseAdded} />

        {/* ===== EXPENSE LIST ===== */}
        {/* Show loading / error / actual list */}
        {loading ? (
          // LOADING STATE
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-gray-400">
            <p className="text-3xl mb-3">⏳</p>
            <p>Loading your expenses...</p>
          </div>

        ) : error ? (
          // ERROR STATE
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-red-500">
            <p className="text-3xl mb-3">❌</p>
            <p>{error}</p>
          </div>

        ) : (
          // SUCCESS STATE — show expense list
          <ExpenseList
            expenses={expenses}                    // the data to show
            onExpenseDeleted={handleExpenseDeleted} // delete callback
            total={total}                          // for showing total in list
          />
        )}

      </div>
    </div>
  );
}

export default Dashboard;