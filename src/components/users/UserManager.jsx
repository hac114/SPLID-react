import { useState } from 'react';
import './UserManager.css';
import UserForm from './UserForm';
import UserCard from './UserCard';

const UserManager = () => {
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
    }
  ]);

  const [showUserForm, setShowUserForm] = useState(false);

  const handleAddUser = (newUser) => {
    setUsers([...users, newUser]);
    setShowUserForm(false);
    alert(`Utente "${newUser.name}" aggiunto con successo!`);
  };

  const handleEditUser = (user) => {
    alert(`Modifica utente: ${user.name}`);
    // Implementa la modifica utente
  };

  const handleDeleteUser = (userId) => {
    if (confirm('Sei sicuro di voler eliminare questo utente?')) {
      setUsers(users.filter(user => user.id !== userId));
      alert('Utente eliminato con successo!');
    }
  };

  return (
    <div className="user-manager">
      <div className="user-manager-header">
        <h2>Gestione Utenti</h2>
        <button 
          className="add-user-btn"
          onClick={() => setShowUserForm(true)}
        >
          + Nuovo Utente
        </button>
      </div>

      <div className="users-grid">
        {users.map(user => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        ))}
        
        {users.length === 0 && (
          <div className="no-users">
            <p>Nessun utente registrato</p>
            <small>Clicca su "Nuovo Utente" per aggiungere il primo</small>
          </div>
        )}
      </div>

      {showUserForm && (
        <UserForm
          onUserAdded={handleAddUser}
          onCancel={() => setShowUserForm(false)}
        />
      )}
    </div>
  );
};

export default UserManager;