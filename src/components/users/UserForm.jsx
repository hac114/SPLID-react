import { useState } from 'react';
import './UserForm.css';

const UserForm = ({ onUserAdded, onCancel }) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!userName.trim()) {
      alert('Inserisci un nome per l\'utente!');
      return;
    }

    const newUser = {
      id: Date.now(),
      name: userName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      groups: [],
      totalSpent: 0,
      totalOwed: 0,
      joinDate: new Date().toISOString()
    };

    onUserAdded(newUser);
    
    // Reset form
    setUserName('');
    setEmail('');
    setPhone('');
  };

  return (
    <div className="user-form-overlay">
      <div className="user-form-container">
        <h3>Aggiungi Nuovo Utente</h3>
        
        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label htmlFor="userName">Nome Utente *</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Nome e cognome"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@esempio.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Telefono</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+39 123 456 7890"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">
              Annulla
            </button>
            <button type="submit" className="btn-submit">
              Aggiungi Utente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;