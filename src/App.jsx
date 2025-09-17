import { useState } from 'react';
import './App.css';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import GroupManager from './components/groups/GroupManager';
import UserManager from './components/users/UserManager';
import SummaryManager from './components/summary/SummaryManager';
import BuffiManager from './components/buffi/BuffiManager';
import ExpenseForm from './components/expenses/ExpenseForm';
import ExpenseList from './components/expenses/ExpenseList';

function App() {
  const [currentView, setCurrentView] = useState('groups');
  const [selectedGroup, setSelectedGroup] = useState(null);
  
  // Dati di esempio per groups con spese più realistiche
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: "Vacanza Montagna",
      participants: ["Mario Rossi", "Luigi Verdi", "Giovanna Bianchi", "Sofia Neri"],
      total: 1250.0, // 200 + 150 + 400 + 500 = 1250
      description: "Weekend in montagna",
      expenses: [
        {
          id: 1,
          groupId: 1,
          amount: 200,
          description: "Affitto cabina",
          payer: "Mario Rossi",
          category: "alloggio",
          date: "2024-09-10",
          participants: ["Mario Rossi", "Luigi Verdi", "Giovanna Bianchi", "Sofia Neri"],
          splitType: "equal"
        },
        {
          id: 2,
          groupId: 1,
          amount: 150,
          description: "Spesa alimentari",
          payer: "Luigi Verdi", 
          category: "cibo",
          date: "2024-09-11",
          participants: ["Mario Rossi", "Luigi Verdi", "Giovanna Bianchi", "Sofia Neri"],
          splitType: "equal"
        },
        {
          id: 3,
          groupId: 1,
          amount: 400,
          description: "Impianti di risalita",
          payer: "Giovanna Bianchi",
          category: "intrattenimento",
          date: "2024-09-12",
          participants: ["Mario Rossi", "Luigi Verdi", "Giovanna Bianchi", "Sofia Neri"],
          splitType: "equal"
        },
        {
          id: 4,
          groupId: 1,
          amount: 500,
          description: "Cena al rifugio",
          payer: "Sofia Neri",
          category: "cibo",
          date: "2024-09-12",
          participants: ["Mario Rossi", "Luigi Verdi", "Giovanna Bianchi", "Sofia Neri"],
          splitType: "equal"
        }
      ]
    },
    {
      id: 2,
      name: "Cena di Compleanno", 
      participants: ["Marco Rossi", "Anna Verdi", "Luca Bianchi"],
      total: 480.0, // 120 + 180 + 180 = 480
      description: "Cena di compleanno di Marco",
      expenses: [
        {
          id: 5,
          groupId: 2,
          amount: 120,
          description: "Antipasti",
          payer: "Marco Rossi",
          category: "cibo", 
          date: "2024-09-12",
          participants: ["Marco Rossi", "Anna Verdi", "Luca Bianchi"],
          splitType: "equal"
        },
        {
          id: 6,
          groupId: 2,
          amount: 180,
          description: "Primi piatti",
          payer: "Anna Verdi",
          category: "cibo",
          date: "2024-09-12",
          participants: ["Marco Rossi", "Anna Verdi", "Luca Bianchi"],
          splitType: "equal"
        },
        {
          id: 7,
          groupId: 2,
          amount: 180,
          description: "Dolce e bevande",
          payer: "Luca Bianchi",
          category: "bevande",
          date: "2024-09-12",
          participants: ["Marco Rossi", "Anna Verdi", "Luca Bianchi"],
          splitType: "equal"
        }
      ]
    }
  ]);

  // Dati di esempio per users
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Mario Rossi",
      email: "mario.rossi@email.com",
      phone: "+39 123 456 7890",
      groups: ["Vacanza Montagna"],
      totalSpent: 325.50,
      totalOwed: 125.75,
      joinDate: "2024-01-15"
    },
    {
      id: 2,
      name: "Luigi Verdi",
      email: "luigi.verdi@email.com", 
      phone: "+39 987 654 3210",
      groups: ["Vacanza Montagna", "Cena Compleanno"],
      totalSpent: 480.00,
      totalOwed: 0.00,
      joinDate: "2024-02-20"
    },
    {
      id: 3,
      name: "Giovanna Bianchi",
      email: "giovanna.bianchi@email.com",
      phone: "+39 555 123 4567",
      groups: ["Vacanza Montagna"],
      totalSpent: 0.00,
      totalOwed: 87.50,
      joinDate: "2024-03-10"
    }
  ]);

  const handleGroupClick = (group) => {
    setSelectedGroup(group);
    setCurrentView('expenses');
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
        return <GroupManager groups={groups} onGroupClick={handleGroupClick} />;
      case 'users':
        return <UserManager users={users} />;
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