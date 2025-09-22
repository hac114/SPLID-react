import { useState, useMemo } from 'react';
import './SummaryManager.css';
import BalanceCard from './BalanceCard';

const SummaryManager = ({ groups, users }) => {
  const [settledBalances, setSettledBalances] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');  

  // Calcola i saldi tra utenti
  const calculateBalances = useMemo(() => {
    const balances = [];
    const userTotals = {};

    // Calcola totale speso e dovuto per ogni utente
    groups.forEach(group => {
      group.expenses.forEach(expense => {
        const share = expense.amount / expense.participants.length;
        
        expense.participants.forEach(participant => {
          if (!userTotals[participant]) {
            userTotals[participant] = { spent: 0, owed: 0 };
          }
          
          if (participant === expense.payer) {
            userTotals[participant].spent += expense.amount;
          } else {
            userTotals[participant].owed += share;
          }
        });
      });
    });

    // Calcola i saldi netti
    const netBalances = {};
    Object.keys(userTotals).forEach(user => {
      netBalances[user] = userTotals[user].spent - userTotals[user].owed;
    });

    // Genera le transazioni per bilanciare i debiti
    const usersWithBalance = Object.keys(netBalances);
    for (let i = 0; i < usersWithBalance.length; i++) {
      for (let j = i + 1; j < usersWithBalance.length; j++) {
        const userA = usersWithBalance[i];
        const userB = usersWithBalance[j];
        const balanceA = netBalances[userA];
        const balanceB = netBalances[userB];

        if (balanceA > 0 && balanceB < 0) {
          const amount = Math.min(balanceA, -balanceB);
          balances.push({
            from: userB,
            to: userA,
            amount: amount,
            description: `${userB} deve a ${userA}`,
            date: new Date().toISOString()
          });
        } else if (balanceA < 0 && balanceB > 0) {
          const amount = Math.min(-balanceA, balanceB);
          balances.push({
            from: userA,
            to: userB,
            amount: amount,
            description: `${userA} deve a ${userB}`,
            date: new Date().toISOString()
          });
        }
      }
    }

    return balances;
  }, [groups]);

  const handleSettleBalance = (balance) => {
    setSettledBalances([...settledBalances, balance]);
    alert(`💰 Transazione saldata: ${balance.from} → ${balance.to}`);
  };

  const activeBalances = calculateBalances.filter(balance => 
    !settledBalances.some(settled => 
      settled.from === balance.from && 
      settled.to === balance.to && 
      settled.amount === balance.amount
    )
  );

  const filteredActiveBalances = activeBalances.filter(balance =>
    balance.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    balance.to.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBalance = activeBalances.reduce((sum, balance) => sum + balance.amount, 0);

  return (
    <div className="summary-manager">
      <div className="summary-header">
        <h2>Riepilogo Conti</h2>
        <div className="summary-stats">
          <div className="stat">
            <span className="stat-label">Transazioni attive</span>
            <span className="stat-value">{activeBalances.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Totale da saldare</span>
            <span className="stat-value">€ {totalBalance.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Cerca utenti per nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredActiveBalances.length === 0 ? (
        <div className="no-balances">
          <h3>
            {searchTerm ? '🔍 Nessun risultato trovato' : '🎉 Tutti i conti sono in regola!'}
          </h3>
          <p>
            {searchTerm 
              ? 'Prova con un altro nome' 
              : 'Non ci sono debiti pendenti tra gli utenti'
            }
          </p>
        </div>
      ) : (
        <>
          <div className="balances-grid">
            {filteredActiveBalances.map((balance, index) => ( 
              <BalanceCard
                key={index}
                balance={balance}
                onSettle={handleSettleBalance}
              />
            ))}
          </div>

          <div className="summary-total">
            <h3>Totale debiti da saldare: € {totalBalance.toFixed(2)}</h3>
          </div>
        </>
      )}

      {settledBalances.length > 0 && (
        <div className="settled-section">
          <h3>Transazioni saldate ({settledBalances.length})</h3>
          <div className="settled-list">
            {settledBalances.map((balance, index) => (
              <div key={index} className="settled-item">
                <span>{balance.from} → {balance.to}: </span>
                <span className="settled-amount">€ {balance.amount.toFixed(2)}</span>
                <span className="settled-date">
                  {new Date(balance.date).toLocaleDateString('it-IT')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryManager;