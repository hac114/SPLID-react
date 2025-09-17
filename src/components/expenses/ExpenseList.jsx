import { useState } from "react";
import "./ExpenseList.css";
import ExpenseForm from "../expenses/ExpenseForm"; // 👈 ASSICURATI CHE L'IMPORT SIA CORRETTO

const ExpenseList = ({ group, onClose, onAddExpense, onDeleteExpense, onEditExpense }) => {
  if (!group) return null;

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingExpense, setEditingExpense] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatAmount = (amount) => {
    return `€ ${amount.toFixed(2)}`;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      cibo: "🍕",
      bevande: "🍷",
      trasporti: "🚗",
      alloggio: "🏨",
      intrattenimento: "🎬",
      shopping: "🛍️",
      salute: "💊",
      regali: "🎁",
      altro: "📦"
    };
    return icons[category] || "📦";
  };

  const getCategoryColor = (category) => {
    const colors = {
      cibo: "#FF6B6B",
      bevande: "#4ECDC4", 
      trasporti: "#45B7D1",
      alloggio: "#96CEB4",
      intrattenimento: "#FFEAA7",
      shopping: "#DDA0DD",
      salute: "#98D8C8",
      regali: "#F7DC6F",
      altro: "#BDC3C7"
    };
    return colors[category] || "#BDC3C7";
  };

  const filteredExpenses = selectedCategory === 'all' 
    ? group.expenses 
    : group.expenses.filter(expense => expense.category === selectedCategory);

  const availableCategories = ['all', ...new Set(group.expenses.map(expense => expense.category))];

  const handleDelete = (expenseId) => {
    if (window.confirm('Sei sicuro di voler eliminare questa spesa?')) {
      onDeleteExpense(expenseId, group.id);
    }
  };

  const handleEdit = (expense) => {
    console.log('Modifica spesa:', expense); // 👈 DEBUG
    setEditingExpense(expense);
  };

  const handleSaveEdit = (updatedExpense) => {
    onEditExpense(updatedExpense);
    setEditingExpense(null);
  };

  return (
    <div className="expense-list-overlay">
      <div className="expense-list-container">
        <div className="expense-list-header">
          <h3>Spese di: {group.name}</h3>
          <div className="header-actions">
            <button onClick={onAddExpense} className="btn-add-expense">
              + Aggiungi Spesa
            </button>
            <button onClick={onClose} className="close-btn">
              ×
            </button>
          </div>
        </div>

        {group.expenses.length > 0 && (
          <div className="category-filter">
            <label htmlFor="categoryFilter">Filtra per categoria:</label>
            <select
              id="categoryFilter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {availableCategories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Tutte le categorie' : `${getCategoryIcon(category)} ${category}`}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="expense-list-content">
          {filteredExpenses.length === 0 ? (
            <div className="no-expenses">
              <p>
                {selectedCategory === 'all' 
                  ? 'Nessuna spesa registrata' 
                  : `Nessuna spesa nella categoria "${selectedCategory}"`}
              </p>
              <small>Clicca su "Aggiungi Spesa" per inserire la prima</small>
            </div>
          ) : (
            <div className="expenses">
              {filteredExpenses.map((expense) => (
                <div key={expense.id} className="expense-item">
                  <div className="expense-main">
                    <div className="expense-description">
                      <h4>{expense.description}</h4>
                      <span 
                        className="expense-category"
                        style={{ backgroundColor: getCategoryColor(expense.category) }}
                      >
                        {getCategoryIcon(expense.category)} {expense.category}
                      </span>
                    </div>
                    <div className="expense-amount">
                      {formatAmount(expense.amount)}
                    </div>
                  </div>

                  <div className="expense-details">
                    <div className="expense-payer">
                      <span>Pagato da: </span>
                      <strong>{expense.payer}</strong>
                    </div>
                    <div className="expense-date">
                      {formatDate(expense.date)}
                    </div>
                    <div className="expense-split">
                      <span>
                        {expense.participants.length} partecipanti (€{" "}
                        {(expense.amount / expense.participants.length).toFixed(2)} cadauno)
                      </span>
                    </div>
                  </div>

                  <div className="expense-actions">
                    <button 
                      onClick={() => handleEdit(expense)} 
                      className="btn-edit"
                      title="Modifica spesa"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDelete(expense.id)} 
                      className="btn-delete"
                      title="Elimina spesa"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="expense-list-summary">
          <div className="total-expenses">
            <strong>Totale spese:</strong>
            <span>{formatAmount(
              filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
            )}</span>
          </div>
          <div className="total-count">
            <strong>Numero spese:</strong>
            <span>{filteredExpenses.length}</span>
          </div>
          {selectedCategory !== 'all' && (
            <div className="filter-info">
              <small>Filtrato per: {selectedCategory}</small>
            </div>
          )}
        </div>
      </div>

      {/* 👇 UNICO MODAL - RIMOSSO IL DOPPIO MODAL */}
      {editingExpense && (
        <ExpenseForm
          groups={[group]} // Solo il gruppo corrente
          expense={editingExpense} // Spesa da modificare
          onExpenseAdded={(updatedExpense) => {
            console.log('Spesa aggiornata:', updatedExpense); // 👈 DEBUG
            onEditExpense(updatedExpense);
            setEditingExpense(null);
          }}
          onCancel={() => {
            console.log('Modifica annullata'); // 👈 DEBUG
            setEditingExpense(null);
          }}
        />
      )}
    </div>
  );
};

export default ExpenseList;