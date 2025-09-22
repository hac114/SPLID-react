import { useState, useEffect } from "react";
import "./ExpenseList.css";
import ExpenseForm from "../expenses/ExpenseForm";

const ExpenseList = ({ group, onClose, onAddExpense, onDeleteExpense, onEditExpense }) => {
  if (!group) return null;

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [editingExpense, setEditingExpense] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // DEBUG
  useEffect(() => {
    console.log('ExpenseList - Group object changed:', group);
  }, [group]);

  useEffect(() => {
    console.log('ExpenseList - Expenses array changed:', group.expenses);
  }, [group.expenses]);

  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [group]);

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

  // FILTRO PER RICERCA
  const searchedExpenses = filteredExpenses.filter(expense =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.payer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableCategories = ['all', ...new Set(group.expenses.map(expense => expense.category))];

  const handleDelete = (expenseId) => {
    if (window.confirm('Sei sicuro di voler eliminare questa spesa?')) {
      onDeleteExpense(expenseId, group.id);
    }
  };

  const handleEdit = (expense) => {
    console.log('Modifica spesa:', expense);
    setEditingExpense(expense);
  };

  return (
    <div className="expense-list-overlay" key={refreshKey}>
      <div className="expense-list-container">
        <div className="expense-list-header">
          <div className="header-title">
            <h3>Spese di: {group.name}</h3>
            <span className="expense-count">{group.expenses.length} spese</span>
          </div>
          <div className="header-actions">
            <button onClick={onAddExpense} className="btn-add-expense">
              + Aggiungi Spesa
            </button>
            <button onClick={onClose} className="close-btn">
              ×
            </button>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="expense-search-box">
          <input
            type="text"
            placeholder="Cerca spese per descrizione, pagante o categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {group.expenses.length > 0 && (
          <div className="filters-container">
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
            
            {(searchTerm || selectedCategory !== 'all') && (
              <div className="active-filters">
                <small>
                  Filtri attivi: 
                  {searchTerm && ` "${searchTerm}"`}
                  {searchTerm && selectedCategory !== 'all' && ' • '}
                  {selectedCategory !== 'all' && ` ${selectedCategory}`}
                </small>
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="clear-filters-btn"
                >
                  ❌
                </button>
              </div>
            )}
          </div>
        )}

        <div className="expense-list-content">
          {searchedExpenses.length === 0 ? (
            <div className="no-expenses">
              <p>
                {searchTerm || selectedCategory !== 'all' 
                  ? 'Nessuna spesa trovata con i filtri attivi' 
                  : 'Nessuna spesa registrata'
                }
              </p>
              <small>
                {searchTerm || selectedCategory !== 'all'
                  ? 'Prova a modificare i filtri di ricerca'
                  : 'Clicca su "Aggiungi Spesa" per inserire la prima'
                }
              </small>
            </div>
          ) : (
            <div className="expenses">
              {searchedExpenses.map((expense) => (
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
              searchedExpenses.reduce((sum, expense) => sum + expense.amount, 0)
            )}</span>
          </div>
          <div className="total-count">
            <strong>Numero spese:</strong>
            <span>{searchedExpenses.length}</span>
          </div>
        </div>
      </div>

      {editingExpense && (
        <ExpenseForm
          groups={[group]}
          expense={editingExpense}
          onExpenseAdded={(updatedExpense) => {
            console.log('Spesa aggiornata:', updatedExpense);
            onEditExpense(updatedExpense);
            setEditingExpense(null);
          }}
          onCancel={() => {
            console.log('Modifica annullata');
            setEditingExpense(null);
          }}
        />
      )}
    </div>
  );
};

export default ExpenseList;