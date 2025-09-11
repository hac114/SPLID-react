import "./ExpenseList.css";

const ExpenseList = ({ group, onClose }) => {
  if (!group) return null;

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

  return (
    <div className="expense-list-overlay">
      <div className="expense-list-container">
        <div className="expense-list-header">
          <h3>Spese di: {group.name}</h3>
          <button onClick={onClose} className="close-btn">
            ×
          </button>
        </div>

        <div className="expense-list-content">
          {group.expenses.length === 0 ? (
            <div className="no-expenses">
              <p>Nessuna spesa registrata</p>
              <small>Clicca sul gruppo per aggiungere la prima spesa</small>
            </div>
          ) : (
            <div className="expenses">
              {group.expenses.map((expense) => (
                <div key={expense.id} className="expense-item">
                  <div className="expense-main">
                    <div className="expense-description">
                      <h4>{expense.description}</h4>
                      <span className="expense-category">
                        {expense.category}
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
            <span>{formatAmount(group.total)}</span>
          </div>
          <div className="total-count">
            <strong>Numero spese:</strong>
            <span>{group.expenses.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;
