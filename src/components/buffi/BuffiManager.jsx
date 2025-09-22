import { useMemo, useState, useEffect } from 'react';
import './BuffiManager.css';
import Podium from './Podium';

const BuffiManager = ({ groups, users }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  // useEffect per forzare l'aggiornamento
  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [groups, users]);

  // Calcola le statistiche degli utenti
  const userStats = useMemo(() => {
    console.log('Calcolo statistiche...', groups, users);
    console.log('📊 DETTAGLI Groups:', groups);
    console.log('👥 DETTAGLI Users:', users);
    // Log di TUTTE le spese di TUTTI i gruppi
    groups.forEach(group => {
    console.log(`--- Gruppo: ${group.name} ---`);
    group.expenses.forEach(expense => {
      console.log(`   Spesa: ${expense.description}, €${expense.amount}, Pagante: ${expense.payer}`);
    });
  });    
    
    const stats = users.map(user => {
      let totalSpent = 0;
      let expensesCount = 0;
      let groupsCount = 0;
      let biggestExpense = 0;

      // Calcola spese per ogni utente
      groups.forEach(group => {
        group.expenses.forEach(expense => {
          if (expense.payer === user.name) {
            totalSpent += expense.amount;
            expensesCount++;
            biggestExpense = Math.max(biggestExpense, expense.amount);
          }
        });

        // Conta gruppi a cui partecipa
        if (group.participants.includes(user.name)) {
          groupsCount++;
        }
      });

      return {
        ...user,
        totalSpent,
        expensesCount,
        groupsCount,
        biggestExpense,
        avgExpense: expensesCount > 0 ? totalSpent / expensesCount : 0
      };
    });

    // Ordina per spesa totale (decrescente)
    return stats.sort((a, b) => b.totalSpent - a.totalSpent);
  }, [groups, users, refreshKey]);

  const topSpenders = userStats.slice(0, 3);
  const allUsers = userStats.slice(3);

  // Statistiche divertenti
  const funStats = useMemo(() => {
    if (userStats.length === 0) return [];

    const totalSpent = userStats.reduce((sum, user) => sum + user.totalSpent, 0);
    const totalExpenses = userStats.reduce((sum, user) => sum + user.expensesCount, 0);
    const avgExpense = totalSpent / totalExpenses || 0;

    return [
      {
        title: "💰 Spesa Totale",
        value: `€ ${totalSpent.toFixed(2)}`,
        icon: "💰"
      },
      {
        title: "📊 Spesa Media",
        value: `€ ${avgExpense.toFixed(2)}`,
        icon: "📊"
      },
      {
        title: "🎯 Spese Totali",
        value: totalExpenses,
        icon: "🎯"
      },
      {
        title: "👥 Utenti Attivi",
        value: userStats.filter(u => u.expensesCount > 0).length,
        icon: "👥"
      }
    ];
  }, [userStats]);

  const getFunTitle = (user, index) => {
    const titles = [
      "Re dei Pagamenti 🤑",
      "Principe delle Spese 💸", 
      "Duca dei Debiti 🏦",
      "Barone dei Bonifici 💰",
      "Conte dei Conti 📊"
    ];
    return titles[index] || "Eroe dello Scontrino 🎖️";
  };

  const getFunFact = (user) => {
    if (user.expensesCount === 0) return "Ancora non ha speso un euro! 🐣";
    if (user.avgExpense > 100) return "Spende come un rockstar! 🎸";
    if (user.expensesCount > 10) return "Mastro dello scontrino! 🧾";
    if (user.biggestExpense > 500) return "Ha fatto tremare il POS! 💳";
    return "Contribuisce con stile! 💫";
  };

  return (
    <div key={refreshKey} className="buffi-manager">
      <div className="buffi-header">
        <h2>🏆 Podio dei Buffi</h2>
        <p>La classifica dei più generosi (o sprovveduti!)</p>
      </div>

      {/* Statistiche Generali */}
      <div className="fun-stats">
        {funStats.map((stat, index) => (
          <div key={index} className="fun-stat-card">
            <span className="stat-icon">{stat.icon}</span>
            <div className="stat-info">
              <span className="stat-title">{stat.title}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

    {/* SPAZIO FORZATO sopra il podio */}
  <div style={{ height: '50px', minHeight: '50px' }}></div>
  
  {/* Podio */}
  {topSpenders.length > 0 && (
    <div className="podium-section">
      <Podium topUsers={topSpenders} />
    </div>
  )}

      {/* Classifica Completa */}
      <div className="full-ranking">
        <h3>Classifica Completa</h3>
        <div className="ranking-list">
          {userStats.map((user, index) => (
            <div key={user.id} className="ranking-item">
              <div className="rank-position">
                <span className="rank-number">#{index + 1}</span>
                {index < 3 && <span className="rank-medal">{['🥇', '🥈', '🥉'][index]}</span>}
              </div>
              
              <div className="user-info">
                <h4>{user.name}</h4>
                <p className="user-title">{getFunTitle(user, index)}</p>
                <p className="user-funfact">{getFunFact(user)}</p>
              </div>

              <div className="user-stats">
                <div className="stat">
                  <span className="stat-label">Speso</span>
                  <span className="stat-value">€{user.totalSpent.toFixed(2)}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Spese</span>
                  <span className="stat-value">{user.expensesCount}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Media</span>
                  <span className="stat-value">€{user.avgExpense.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Messaggio se non ci sono spese */}
      {userStats.every(user => user.totalSpent === 0) && (
        <div className="no-expenses">
          <h3>🎪 Nessun buffo ancora!</h3>
          <p>Inizia ad aggiungere spese per vedere la classifica</p>
        </div>
      )}
    </div>
  );
};

export default BuffiManager;