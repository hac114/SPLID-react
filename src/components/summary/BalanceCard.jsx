import './BalanceCard.css';

const BalanceCard = ({ balance, onSettle }) => {
  const getBalanceClass = (amount) => {
    if (amount > 0) return 'positive';
    if (amount < 0) return 'negative';
    return 'zero';
  };

  const formatAmount = (amount) => {
    return `€ ${Math.abs(amount).toFixed(2)}`;
  };

  return (
    <div className={`balance-card ${getBalanceClass(balance.amount)}`}>
      <div className="balance-header">
        <h4>{balance.from} → {balance.to}</h4>
        <span className={`balance-amount ${getBalanceClass(balance.amount)}`}>
          {formatAmount(balance.amount)}
        </span>
      </div>
      
      <div className="balance-details">
        <p>{balance.description}</p>
        <span className="balance-date">
          {new Date(balance.date).toLocaleDateString('it-IT')}
        </span>
      </div>

      {balance.amount !== 0 && (
        <button 
          className="settle-btn"
          onClick={() => onSettle(balance)}
        >
          ✅ Contrassegna come saldato
        </button>
      )}
    </div>
  );
};

export default BalanceCard;