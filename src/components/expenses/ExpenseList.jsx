import { useState } from "react";
import "./ExpenseList.css";

const ExpenseList = ({ group, onClose }) => {
  if (!group) return null;

  const [selectedCategory, setSelectedCategory] = useState('all');

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

   // 👇 Filtra le spese in base alla categoria selezionata
  const filteredExpenses = selectedCategory === 'all' 
    ? group.expenses 
    : group.expenses.filter(expense => expense.category === selectedCategory);

  // 👇 Ottieni tutte le categorie uniche dalle spese del gruppo
  const availableCategories = ['all', ...new Set(group.expenses.map(expense => expense.category))];

  return (
    <div className="expense-list-overlay">
      <div className="expense-list-container">
        <div className="expense-list-header">
          <h3>Spese di: {group.name}</h3>
          <button onClick={onClose} className="close-btn">
            ×
          </button>
        </div>

        {/* 👇 Aggiungi il filtro categoria */}
        {group.expenses.length > 0 && (
          <div className="category-filter">
            <label htmlFor="categoryFilter">Filtra per categoria:</label>
            <select
              id="categoryFilter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {availableCategories.map(category => (
                <option
                  key={category}
                  value={category}
                  data-icon={category !== 'all' ? getCategoryIcon(category) : '📋'}
                >
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
              <small>Clicca sul gruppo per aggiungere la prima spesa</small>
            </div>
          ) : (
            <div className="expenses">
              {filteredExpenses.map((expense) => (
                <div key={expense.id} className="expense-item">
                  <div className="expense-main">
                    <div className="expense-description">
                      <h4>{expense.description}</h4>
                      <span className="expense-category">
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
                        {(expense.amount / expense.participants.length).toFixed(
                          2
                        )}{" "}
                        cadauno)
                      </span>
                    </div>
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
    </div>
  );
};

export default ExpenseList;