import { useState } from 'react';
import './UserManager.css';
import UserForm from './UserForm';
import UserCard from './UserCard';

const UserManager = ({ users, onCreateUser, onUpdateUser, onDeleteUser }) => {
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddUser = (newUser) => {
    onCreateUser(newUser);
    setShowUserForm(false);
    alert(`Utente "${newUser.name}" aggiunto con successo!`);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleUpdateUser = (updatedUser) => {
    onUpdateUser(updatedUser);
    setEditingUser(null);
    alert(`Utente "${updatedUser.name}" aggiornato con successo!`);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Sei sicuro di voler eliminare questo utente?')) {
      onDeleteUser(userId);
      alert('Utente eliminato con successo!');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className="search-box">
        <input
          type="text"
          placeholder="Cerca utenti..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="users-grid">
        {filteredUsers.map(user => (
          <UserCard
            key={user.id}
            user={user}
            onEdit={() => handleEditUser(user)}
            onDelete={() => handleDeleteUser(user.id)}
          />
        ))}
        
        {filteredUsers.length === 0 && (
          <div className="no-users">
            <p>{searchTerm ? 'Nessun utente trovato' : 'Nessun utente registrato'}</p>
            <small>{searchTerm ? 'Prova con un altro nome' : 'Clicca su "Nuovo Utente" per aggiungere il primo'}</small>
          </div>
        )}
      </div>

      {showUserForm && (
        <UserForm
          onSave={handleAddUser}
          onCancel={() => setShowUserForm(false)}
        />
      )}

      {editingUser && (
        <UserForm
          user={editingUser}
          onSave={handleUpdateUser}
          onCancel={() => setEditingUser(null)}
        />
      )}
    </div>
  );
};

export default UserManager;