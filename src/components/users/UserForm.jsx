import { useState, useEffect} from 'react';
import './UserForm.css';

const UserForm = ({ user, onSave, onCancel, preFillName }) => {
  const [name, setName] = useState(user?.name || preFillName || ''); // 👈 USA preFillName
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // 👇 EFFETTO PER PRE-COMPILARE AUTOMATICAMENTE
  useEffect(() => {
    if (preFillName && !user) {
      setName(preFillName);
      // Auto-genera email e telefono basati sul nome
      setEmail(`${preFillName.toLowerCase().replace(/\s+/g, '.')}@email.com`);
      setPhone('+39 000 000 0000');
    }
  }, [preFillName, user]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Inserisci un nome per l\'utente!');
      return;
    }

    const newUser = {
      id: user ? user.id : Date.now(), // 👈 MODIFICA: se c'è user usa il suo id
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      groups: user ? user.groups : [], // 👈 MODIFICA: mantieni i gruppi esistenti
      totalSpent: user ? user.totalSpent : 0, // 👈 MODIFICA: mantieni totalSpent
      totalOwed: user ? user.totalOwed : 0, // 👈 MODIFICA: mantieni totalOwed
      joinDate: user ? user.joinDate : new Date().toISOString().split('T')[0] // 👈 MODIFICA: formato data
    };

    onSave(newUser); // 👈 MODIFICA: cambia onUserAdded in onSave
    
    // 👇 SPOSTA IL RESET FUORI (viene gestito dal componente padre)
  };   

  return (
    <div className="user-form-overlay">
      <div className="user-form-container">
        <h3>{user ? 'Modifica Utente' : 'Aggiungi Nuovo Utente'}</h3>
        
        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label htmlFor="name">Nome Utente *</label>
            <input
              type="text"
              id="name"
              value={name}             
              onChange={(e) => setName(e.target.value)}
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
              {user ? 'Aggiorna' : 'Aggiungi'} Utente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;