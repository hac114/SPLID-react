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
  const [groupSearchTerm, setGroupSearchTerm] = useState('');
  const [preFillUserName, setPreFillUserName] = useState('');
  const [editingGroupId, setEditingGroupId] = useState(null);

  // DEBUG
  useEffect(() => {
    console.log('BUFFI - Groups updated:', groups);
  }, [groups]);

  useEffect(() => {
    console.log('BUFFI - Users updated:', users);
  }, [users]);

  useEffect(() => {
    console.log('App - preFillUserName state:', preFillUserName);
  }, [preFillUserName]);   

  const validateExpense = (expense) => {
    const group = groups.find(g => g.id === expense.groupId);
    if (!group) return "Gruppo non trovato";
    
    // Verifica che il pagante sia nei partecipanti del gruppo
    if (!group.participants.includes(expense.payer)) {
      return `Il pagante "${expense.payer}" non è nei partecipanti del gruppo`;
    }    
    
    const userExists = users.some(user => 
      user.name.toLowerCase() === expense.payer.toLowerCase().trim()
    );
    
    if (!userExists) {
      return `L'utente "${expense.payer}" non esiste nella rubrica`;
    }
    
    return null;
  };  

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    setCurrentView('expenses');
  };

  const handleCreateGroup = (newGroup) => {
    console.log('Creazione gruppo in App:', newGroup); // Debug
    setGroups(prevGroups => [...prevGroups, newGroup]);
  };
  
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

  const handleEditGroup = (group) => {
    console.log('Modifica gruppo:', group);    
    alert(`Funzione di modifica gruppo per: ${group.name}`);
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
    
  const handleCreateUser = (newUser) => {
    console.log('Creazione utente in App:', newUser);
    setUsers(prevUsers => [...prevUsers, newUser]);
    setPreFillUserName(''); // RESETTA IL PRE-FILL DOPO LA CREAZIONE 
    
     // SE C'ERA UN GRUPPO IN MODIFICA, DOVREBBE TORNARE AD ESSO
    if (editingGroupId) {
      setCurrentView('groups');
      setEditingGroupId(null);
    }
  };

  const handleUpdateUser = (updatedUser) => {
    setUsers(prevUsers => 
      prevUsers.map(user => user.id === updatedUser.id ? updatedUser : user)
    );
  };

  const handleDeleteUser = (userId) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };  
  
  const handleAddExpenseClick = () => {
    setCurrentView('addExpense');
  }; 

  const handleAddNewUser = (userName) => {    
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
          
          // CREA UN NUOVO OGGETTO per forzare il re-render
          return {
            ...group,
            expenses: updatedExpenses, // Questo è un nuovo array
            total: total
          };
        }
        return group; // Questo mantiene lo stesso riferimento per gli altri gruppi
      })
    );
  };

  const handleDeleteExpense = (expenseId, groupId) => {
    setGroups(prevGroups =>
      prevGroups.map(group => {
        if (group.id === groupId) {
          const updatedExpenses = group.expenses.filter(expense => expense.id !== expenseId);
          const total = updatedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
          
          // CREA UN NUOVO OGGETTO
          return {
            ...group,
            expenses: updatedExpenses, // Nuovo array
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
            onUpdateGroup={handleUpdateGroup}
            onDeleteGroup={handleDeleteGroup}
            onAddExpense={handleAddExpense}
            onAddNewUser={handleAddNewUser}
            onNavigateToUsers={(userName, groupId) => { 
              console.log('onNavigateToUsers called with:', userName);
              setCurrentView('users');
              setPreFillUserName(userName);
              setEditingGroupId(groupId);
            }}
          />
        );
      case 'users':
        console.log('Rendering UserManager with preFillUserName:', preFillUserName);
        return (
          <UserManager
            users={users}            
            onCreateUser={handleCreateUser}
            onUpdateUser={handleUpdateUser}
            onDeleteUser={handleDeleteUser}
            preFillUserName={preFillUserName}            
          />
        );
      case 'expenses':
        // Se non c'è un gruppo selezionato, mostra la lista dei gruppi
        if (!selectedGroup) {
          return (
            <div className="group-selection">
              <div className="group-selection-header">
                <h2>Seleziona un Gruppo per vedere le Spese</h2>
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Cerca gruppi per nome, descrizione o partecipante..."
                    value={groupSearchTerm}
                    onChange={(e) => setGroupSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>
              
              <div className="groups-grid">
                {groups
                  .filter(group => 
                    group.name.toLowerCase().includes(groupSearchTerm.toLowerCase()) ||
                    group.description?.toLowerCase().includes(groupSearchTerm.toLowerCase()) ||
                    group.participants.some(participant => 
                      participant.toLowerCase().includes(groupSearchTerm.toLowerCase())
                    )
                  )
                  .map((group) => (
                    <div key={group.id} className="group-card" onClick={() => handleGroupClick(group)}>
                      <div className="card-header">
                        <h3>{group.name}</h3>
                        <div className="group-actions">
                          <button
                            className="edit-group-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditGroup(group);
                            }}
                            title="Modifica gruppo"
                          >
                            ✏️
                          </button>
                          <button
                            className="delete-group-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteGroup(group.id);
                            }}
                            title="Elimina gruppo"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      {group.description && (
                        <p className="group-description">{group.description}</p>
                      )}
                      
                      <div className="participants-preview">
                        {group.participants.slice(0, 3).map((participant, index) => (
                          <span key={index} className="participant-tag">
                            {participant}
                          </span>
                        ))}
                        {group.participants.length > 3 && (
                          <span className="more-participants">
                            +{group.participants.length - 3} altri
                          </span>
                        )}
                      </div>
                      
                      <div className="group-stats">
                        <span className="group-total">
                          Totale: € {group.total.toFixed(2)}
                        </span>
                        <span className="expenses-count">
                          {group.expenses.length} spese
                        </span>
                      </div>

                      <button
                        className="view-expenses-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGroupClick(group);
                        }}
                      >
                        👁️ Vedi Spese
                      </button>
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
            key={`${selectedGroup.id}-${selectedGroup.expenses.length}`} // 👈 KEY UNICA 
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