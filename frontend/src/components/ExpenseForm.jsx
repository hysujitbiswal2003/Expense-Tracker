// ============================================
// ExpenseForm.jsx — ADD EXPENSE FORM
// ============================================
// This component shows the form to add a new expense
// When submitted → calls backend API → tells Dashboard
// about the new expense via onExpenseAdded prop
//
// PROPS received from Dashboard:
//   onExpenseAdded = function to call after adding expense
//   Dashboard uses this to update the expense list
// ============================================

import { useState } from 'react';
import { addExpense } from '../services/api';

function ExpenseForm({ onExpenseAdded }) {

  // form = stores all input field values
  // We use ONE state object for all fields
  // This is cleaner than 4 separate useState calls
  const [form, setForm] = useState({
    title:       '',     // expense name
    amount:      '',     // how much money
    category:    'Food', // default category
    description: '',     // optional note
  });

  // loading = true while waiting for API response
  const [loading, setLoading] = useState(false);

  // error = validation or API error message
  const [error, setError] = useState('');

  // ============================================
  // HANDLE INPUT CHANGES
  // ============================================
  // Called every time user types in any field
  // e.target.name  = the field's name attribute (title/amount/etc)
  // e.target.value = what user typed
  //
  // ...form = spread operator, copies ALL existing values
  // [e.target.name]: e.target.value = updates ONLY the changed field
  //
  // Example: user types "Coffee" in title field
  // Before: { title: '',       amount: '', category: 'Food', description: '' }
  // After:  { title: 'Coffee', amount: '', category: 'Food', description: '' }
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ============================================
  // HANDLE FORM SUBMIT
  // ============================================
  const handleSubmit = async (e) => {
    // Prevents page from refreshing on form submit
    // Default HTML form behavior is to refresh the page
    e.preventDefault();

    // Clear previous errors
    setError('');

    // ===== CLIENT-SIDE VALIDATION =====
    // Check before calling backend — saves time!
    if (!form.title.trim()) {
      // .trim() removes spaces — prevents " " as valid title
      setError('Please enter a title');
      return; // stop here, don't call backend
    }
    if (!form.amount || parseFloat(form.amount) <= 0) {
      // parseFloat converts "100" string to 100 number
      setError('Please enter a valid amount greater than 0');
      return;
    }

    // ===== CALL BACKEND API =====
    setLoading(true);
    try {
      // Send expense data to: POST /api/expenses
      // Backend saves it to MySQL and returns the saved expense
      const newExpense = await addExpense({
        title:       form.title,
        amount:      parseFloat(form.amount), // must send number, not string
        category:    form.category,
        description: form.description,
      });

      // Tell Dashboard about the new expense
      // Dashboard will add it to the top of the list
      onExpenseAdded(newExpense);

      // Reset form to empty state
      setForm({ title: '', amount: '', category: 'Food', description: '' });

    } catch (err) {
      // err.response?.data = error message from backend
      // || = if that's empty, show this default message
      setError(err.response?.data || 'Failed to add expense. Try again.');
    } finally {
      // always runs whether success or error
      setLoading(false);
    }
  };

  // ============================================
  // JSX — WHAT GETS SHOWN ON SCREEN
  // ============================================
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      {/* Form Title */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b">
        Add New Expense
      </h3>

      {/* Error Message — only shows if error is not empty */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* THE FORM */}
      <form onSubmit={handleSubmit} className="space-y-3">

        {/* ROW 1: Title + Amount side by side */}
        <div className="grid grid-cols-2 gap-3">

          {/* Title Input */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Title *
            </label>
            <input
              type="text"
              name="title"            // matches form.title
              value={form.title}      // controlled by state
              onChange={handleChange} // updates state on keypress
              placeholder="e.g. Lunch, Netflix, Rent"
              className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Amount Input */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Amount (₹) *
            </label>
            <input
              type="number"           // only allows numbers
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="e.g. 250"
              min="0"                 // no negative numbers
              step="0.01"             // allows decimals like 99.99
              className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        {/* ROW 2: Category + Description side by side */}
        <div className="grid grid-cols-2 gap-3">

          {/* Category Dropdown */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Category
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {/* Each option = one category choice */}
              <option value="Food">🍔 Food</option>
              <option value="Transport">🚗 Transport</option>
              <option value="Entertainment">🎬 Entertainment</option>
              <option value="Shopping">🛍️ Shopping</option>
              <option value="Health">💊 Health</option>
              <option value="Other">📦 Other</option>
            </select>
          </div>

          {/* Description Input (optional) */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Description (optional)
            </label>
            <input
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Extra notes..."
              className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading} // can't click twice while loading
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          {/* Shows different text based on loading state */}
          {loading ? 'Adding...' : '+ Add Expense'}
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;