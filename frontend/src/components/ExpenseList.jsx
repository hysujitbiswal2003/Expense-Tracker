// ============================================
// ExpenseList.jsx — SHOWS ALL EXPENSES
// ============================================
// Receives expenses array from Dashboard
// Shows each expense as a card
// Has delete button on each card
//
// PROPS received from Dashboard:
//   expenses = array of expense objects
//   onExpenseDeleted = function to call after deleting
//   total = total amount spent (number)
// ============================================

import { deleteExpense } from '../services/api';

// Maps category names to emojis for visual display
// When category = "Food" → show 🍔
// Using an object is cleaner than multiple if/else
const categoryEmoji = {
  Food:          '🍔',
  Transport:     '🚗',
  Entertainment: '🎬',
  Shopping:      '🛍️',
  Health:        '💊',
  Other:         '📦',
};

function ExpenseList({ expenses, onExpenseDeleted, total }) {

  // ============================================
  // DELETE HANDLER
  // ============================================
  const handleDelete = async (id) => {

    // Show browser confirm dialog before deleting
    // If user clicks Cancel → return early, don't delete
    if (!window.confirm('Are you sure you want to delete this expense?')) return;

    try {
      // Call backend: DELETE /api/expenses/{id}
      await deleteExpense(id);

      // Tell Dashboard this expense was deleted
      // Dashboard will remove it from the list using .filter()
      onExpenseDeleted(id);

    } catch (err) {
      alert('Failed to delete expense. Please try again.');
    }
  };

  // ============================================
  // JSX
  // ============================================
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      {/* Header: Title + Total */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b">
        <h3 className="text-lg font-semibold text-gray-800">
          Transaction History
        </h3>
        <span className="text-sm text-gray-500">
          Total:{' '}
          {/* toFixed(2) = always show 2 decimal places */}
          {/* Example: 100 → "100.00" | 99.5 → "99.50" */}
          <strong className="text-purple-700">₹{total.toFixed(2)}</strong>
        </span>
      </div>

      {/* ============================================ */}
      {/* CONDITIONAL RENDERING */}
      {/* Show empty message OR list depending on data */}
      {/* ============================================ */}

      {expenses.length === 0 ? (
        // EMPTY STATE — no expenses yet
        <div className="text-center py-12 text-gray-400">
          <p className="text-5xl mb-3">📭</p>
          <p className="font-medium">No expenses yet!</p>
          <p className="text-sm mt-1">Add your first expense above</p>
        </div>

      ) : (
        // EXPENSE LIST — has expenses to show
        <div className="space-y-3">

          {/* .map() loops through every expense */}
          {/* For each expense → create one expense card */}
          {/* key={expense.id} is REQUIRED by React */}
          {/* It helps React track which item is which */}
          {/* when updating the list efficiently */}
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-purple-50 transition duration-200 group"
            >

              {/* ===== LEFT SIDE ===== */}
              <div className="flex items-center gap-3">

                {/* Category Emoji Circle */}
                <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
                  {/* categoryEmoji["Food"] = "🍔" */}
                  {/* || "📦" = fallback if category not found */}
                  {categoryEmoji[expense.category] || '📦'}
                </div>

                {/* Expense Details */}
                <div>
                  {/* Title */}
                  <p className="font-medium text-gray-800 text-sm">
                    {expense.title}
                  </p>

                  {/* Category + optional description */}
                  <p className="text-xs text-gray-400 mt-0.5">
                    {expense.category}
                    {/* Only show description if it exists */}
                    {/* && = "and" — only renders if true */}
                    {expense.description && ` · ${expense.description}`}
                  </p>
                </div>
              </div>

              {/* ===== RIGHT SIDE ===== */}
              <div className="flex items-center gap-3">

                {/* Amount */}
                <span className="font-bold text-purple-700">
                  ₹{expense.amount.toFixed(2)}
                </span>

                {/* Delete Button */}
                {/* () => handleDelete(expense.id) passes the id */}
                {/* If you wrote onClick={handleDelete} without () => */}
                {/* it would call handleDelete immediately on render! */}
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="w-7 h-7 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition duration-200 text-lg font-bold"
                  title="Delete expense"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExpenseList;