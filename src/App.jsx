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

  // 👇 Aggiungi questa funzione dopo gli useEffect di debug
  const validateExpense = (expense) => {
    const group = groups.find(g => g.id === expense.groupId);
    if (!group) return "Gruppo non trovato";
    
    // Verifica che il pagante sia nei partecipanti del gruppo
    if (!group.participants.includes(expense.payer)) {
      return `Il pagante "${expense.payer}" non è nei partecipanti del gruppo`;
    }
    
    /* // Verifica che il pagante esista nella rubrica utenti
    if (!users.some(user => user.name === expense.payer)) {
      return `L'utente "${expense.payer}" non esiste nella rubrica`;
    }
    
    return null; // Tutto ok */

    // 👇 MODIFICA QUESTA PARTE - Controllo più flessibile
    const userExists = users.some(user => 
      user.name.toLowerCase() === expense.payer.toLowerCase().trim()
    );
    
    if (!userExists) {
      return `L'utente "${expense.payer}" non esiste nella rubrica`;
    }
    
    return null; // Tutto ok
  };  

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    setCurrentView('expenses');
  };

  const handleCreateGroup = (newGroup) => {
    console.log('Creazione gruppo in App:', newGroup); // 👈 Debug
    setGroups(prevGroups => [...prevGroups, newGroup]);
  };

  // Dopo handleCreateGroup, aggiungi:
  const handleUpdateGroup = (updatedGroup) => {
    setGroups(prevGroups => 
      prevGroups.map(group => group.id === updatedGroup.id ? updatedGroup : group)
    );
  };

  const handleDeleteGroup = (groupId) => {
    if (window.confirm('Sei sicuro di voler eliminare questo gruppo? Tutte le spese associate verranno eliminate.')) {
      setGroups(prevGroups => prevGroups.filter(group => group.id !== groupId));
    }
  };

  const handleAddExpense = (newExpense) => {
    const validationError = validateExpense(newExpense);
    if (validationError) {
      alert(`Errore: ${validationError}`);
      return;
    }

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

    // 👇 Aggiungi queste funzioni dopo handleAddExpense
  const handleCreateUser = (newUser) => {
    setUsers(prevUsers => [...prevUsers, { ...newUser, id: Date.now() }]);
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers(prevUsers => 
      prevUsers.map(user => user.id === updatedUser.id ? updatedUser : user)
    );
  };

  const handleDeleteUser = (userId) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };
  
  
  // Aggiungi queste funzioni mancanti dopo handleDeleteUser
  const handleBackToExpenses = () => {
    setCurrentView('expenses');
  };

  const handleBackToGroups = () => {
    setCurrentView('groups');
    setSelectedGroup(null);
  };

  const handleAddExpenseClick = () => {
    setCurrentView('addExpense');
  };

 /*  const handleBackToExpenses = () => {
    setCurrentView('expenses');
  };

  const handleBackToGroups = () => {
    setCurrentView('groups');
    setSelectedGroup(null);
  }; */

  const handleAddNewUser = (userName) => {
    // Verifica che l'utente non esista già
    if (users.some(user => user.name === userName)) {
      return;
    }
    
    const newUser = {
      id: Date.now(),
      name: userName,
      email: `${userName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      phone: "+39 000 000 0000",
      groups: [],
      totalSpent: 0,
      totalOwed: 0,
      joinDate: new Date().toISOString().split('T')[0]
    };
    
    setUsers(prevUsers => [...prevUsers, newUser]);
    console.log(`Utente "${userName}" aggiunto alla rubrica`);
  };

  const handleUpdateExpense = (updatedExpense) => {
    setGroups(prevGroups =>
      prevGroups.map(group => {
        if (group.id === updatedExpense.groupId) {
          const updatedExpenses = group.expenses.map(expense =>
            expense.id === updatedExpense.id ? updatedExpense : expense
          );
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
  };

  const handleDeleteExpense = (expenseId, groupId) => {
    setGroups(prevGroups =>
      prevGroups.map(group => {
        if (group.id === groupId) {
          const updatedExpenses = group.expenses.filter(expense => expense.id !== expenseId);
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
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    if (view !== 'expenses') {
      setSelectedGroup(null);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'groups':
        return (
          <GroupManager
            groups={groups}
            users={users}
            onGroupClick={handleGroupClick}
            onCreateGroup={handleCreateGroup}
            onUpdateGroup={handleUpdateGroup} // 👈 Aggiungi questa
            onDeleteGroup={handleDeleteGroup} // 👈 E questa
            onAddExpense={handleAddExpense}
            onAddNewUser={handleAddNewUser}
          />
        );
      case 'users':
        return (
          <UserManager
            users={users}
            //setUsers={setUsers}
            onCreateUser={handleCreateUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}            
          />
        );
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
            onDeleteExpense={handleDeleteExpense}
            onEditExpense={handleUpdateExpense}
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
      <Header currentView={currentView} onViewChange={handleViewChange} />    
        <main className="main-content">
          {renderCurrentView()}
        </main>      
      <Footer />
    </div>
  );
}

export default App;