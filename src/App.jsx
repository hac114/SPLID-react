import { useState } from 'react';
import './App.css';
import Header from './components/common/Header';
import Navbar from './components/layout/Navbar';
import GroupManager from './components/groups/GroupManager';
import UserManager from './components/users/UserManager';
import SummaryManager from './components/summary/SummaryManager';
import BuffiManager from './components/buffi/BuffiManager';

function App() {
  const [currentView, setCurrentView] = useState('groups');
  
  // Dati di esempio per groups
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: "Vacanza Montagna",
      participants: ["Mario Rossi", "Luigi Verdi", "Giovanna Bianchi", "Sofia Neri"],
      total: 1250.0,
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
          participants: ["Mario Rossi", "Luigi Verdi", "Giovanna Bianchi", "Sofia Neri"]
        },
        {
          id: 2,
          groupId: 1,
          amount: 150,
          description: "Spesa alimentari",
          payer: "Luigi Verdi", 
          category: "cibo",
          date: "2024-09-11",
          participants: ["Mario Rossi", "Luigi Verdi", "Giovanna Bianchi", "Sofia Neri"]
        }
      ]
    },
    {
      id: 2,
      name: "Cena di Compleanno", 
      participants: ["Marco Rossi", "Anna Verdi", "Luca Bianchi"],
      total: 480.0,
      description: "Cena di compleanno di Marco",
      expenses: [
        {
          id: 3,
          groupId: 2,
          amount: 120,
          description: "Ristorante",
          payer: "Marco Rossi",
          category: "cibo", 
          date: "2024-09-12",
          participants: ["Marco Rossi", "Anna Verdi", "Luca Bianchi"]
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

  const renderCurrentView = () => {
    switch (currentView) {
      case 'groups':
        return <GroupManager />;
      case 'users':
        return <UserManager />;
      case 'expenses':
        return <div className="coming-soon">🚧 Gestione Spese - In Arrivo</div>;
      case 'summary':
        return <SummaryManager groups={groups} users={users} />;
      case 'buffi':
        return <BuffiManager groups={groups} users={users} />;
      default:
        return <GroupManager />;
    }
  };

  return (
    <div className="app">
      <Header />
      <div className="app-layout">
        <Navbar currentView={currentView} onViewChange={setCurrentView} />
        <main className="main-content">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
}

export default App;