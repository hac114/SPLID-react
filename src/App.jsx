import { useState, useEffect } from 'react';
import './App.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import GroupManager from './components/groups/GroupManager';
import UserManager from './components/users/UserManager';
import SummaryManager from './components/summary/SummaryManager';
import BuffiManager from './components/buffi/BuffiManager';
import ExpenseForm from './components/expenses/ExpenseForm';
import ExpenseList from './components/expenses/ExpenseList';
import { useInitialData } from './hooks/useInitialData';

function App() {
  const [currentView, setCurrentView] = useState('groups');
  const [selectedGroup, setSelectedGroup] = useState(null);

  const [groups, setGroups, users, setUsers] = useInitialData();

  // 👇 INSERISCI QUI I USEFFECT PER DEBUG
  useEffect(() => {
    console.log('BUFFI - Groups updated:', groups);
  }, [groups]);

  useEffect(() => {
    console.log('BUFFI - Users updated:', users);
  }, [users]);
  // 👆 FINE DEBUG

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    setCurrentView('expenses');
  };

  const handleCreateGroup = (newGroup) => {
  setGroups(prevGroups => [...prevGroups, newGroup]);
  };

  const handleAddExpense = (newExpense) => {
    setGroups(prevGroups => 
      prevGroups.map(group => {
        if (group.id === newExpense.groupId) {
          const updatedExpenses = [...group.expenses, newExpense];
          const total = updatedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
          
          return {
            ...group,
            expenses: updatedExpenses,
            total: total
          };
        }
        return group;
      })
    );
    setCurrentView('expenses');
  };

  const handleAddExpenseClick = () => {
    setCurrentView('addExpense');
  };

  const handleBackToExpenses = () => {
    setCurrentView('expenses');
  };

  const handleBackToGroups = () => {
    setCurrentView('groups');
    setSelectedGroup(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'groups':
        return (
          <GroupManager groups={groups}
            onGroupClick={handleGroupClick}
            onCreateGroup={handleCreateGroup}
            onAddExpense={handleAddExpense}
          />
        );
      case 'users':
        return <UserManager users={users} setUsers={setUsers}/>;
      case 'expenses':
        // Se non c'è un gruppo selezionato, mostra la lista dei gruppi
        if (!selectedGroup) {
          return (
            <div className="group-selection">
              <h2>Seleziona un Gruppo per vedere le Spese</h2>
              <div className="groups-list">
                {groups.map((group) => (
                  <div key={group.id} className="group-card" onClick={() => handleGroupClick(group)}>
                    <h3>{group.name}</h3>
                    <p>{group.participants.length} partecipanti</p>
                    <p>{group.expenses.length} spese</p>
                    <p>Totale: €{group.total.toFixed(2)}</p>
                  </div>
                ))}
              </div>
              {groups.length === 0 && (
                <div className="no-groups-message">
                  <p>Nessun gruppo disponibile</p>
                  <button onClick={() => setCurrentView('groups')}>Crea un gruppo</button>
                </div>
              )}
            </div>
          );
        }
        
        // Se c'è un gruppo selezionato, mostra l'ExpenseList
        return (
          <ExpenseList 
            group={selectedGroup} 
            onClose={() => setSelectedGroup(null)}
            onAddExpense={handleAddExpenseClick}
          />
        );
      case 'addExpense':
        return (
          <ExpenseForm
            groups={groups}
            onExpenseAdded={handleAddExpense}
            onCancel={() => setCurrentView('expenses')}
          />
        );
      case 'summary':
        return <SummaryManager groups={groups} users={users} />;
      case 'buffi':
        return <BuffiManager groups={groups} users={users} />;
      default:
        return <GroupManager groups={groups} onGroupClick={handleGroupClick} />;
    }
  };

  return (
    <div className="app">
      <Header currentView={currentView} onViewChange={setCurrentView} />    
        <main className="main-content">
          {renderCurrentView()}
        </main>      
      <Footer />
    </div>
  );
}

export default App;