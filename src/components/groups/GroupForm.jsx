import { useState, useEffect } from "react";
import "./GroupForm.css";

const GroupForm = ({ users = [], group, onGroupAdded, onCancel, onAddNewUser, onNavigateToUsers }) => {
  const [groupName, setGroupName] = useState(group?.name || "");
  const [description, setDescription] = useState(group?.description || "");
  const [participants, setParticipants] = useState(group?.participants || []);
  const [newParticipant, setNewParticipant] = useState('');
  const [showUserRedirect, setShowUserRedirect] = useState(false);
  const [pendingParticipant, setPendingParticipant] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      alert("Inserisci un nome per il gruppo!");
      return;
    }

    if (participants.length === 0) {
      alert("Aggiungi almeno un partecipante!");
      return;
    }

    const newGroup = {
      id: group?.id || Date.now(),
      name: groupName.trim(),
      description: description.trim(),
      participants: participants,
      total: group?.total || 0,
      expenses: group?.expenses || [],
      createdAt: group?.createdAt || new Date().toISOString(),
    };

    onGroupAdded(newGroup);

    // Reset form solo se non è modifica
    if (!group) {
      setGroupName("");
      setDescription("");
      setParticipants([]);
      setNewParticipant("");
    }
  };

  const addParticipant = () => {
    const trimmedName = newParticipant.trim();
    
    if (!trimmedName) {
      alert("Inserisci un nome valido per il partecipante!");
      return;
    }
    
    if (participants.includes(trimmedName)) {
      alert("Questo partecipante è già stato aggiunto!");
      return;
    }
    
    // Verifica se l'utente esiste
    const userExists = users.some(user => user.name === trimmedName);
    
    if (!userExists) {
      setPendingParticipant(trimmedName);
      setShowUserRedirect(true);
      return;
    }
    
    // Se esiste, aggiungi normalmente
    setParticipants([...participants, trimmedName]);
    setNewParticipant("");
  };

  const addExistingUser = (userName) => {
    if (!participants.includes(userName)) {
      setParticipants([...participants, userName]);
    }
  };

  const removeParticipant = (index) => {
    const updatedParticipants = participants.filter((_, i) => i !== index);
    setParticipants(updatedParticipants);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addParticipant();
    }
  };

  return (
    <div className="group-form-overlay">
      <div className="group-form-container">
        <h3>{group ? 'Modifica Gruppo' : 'Crea Nuovo Gruppo'}</h3>

        {showUserRedirect && (
          <div className="user-redirect-modal">
            <div className="modal-content">
              <h4>Utente non trovato</h4>
              <p>
                L'utente "<strong>{pendingParticipant}</strong>" non esiste nella rubrica.
              </p>
              <p>Vuoi aggiungerlo alla rubrica utenti?</p>
              
              <div className="modal-actions">
                <button 
                  onClick={() => setShowUserRedirect(false)}
                  className="btn-cancel"
                >
                  Annulla
                </button>
                <button 
                  onClick={() => {
                    onCancel(); // Chiudi il form gruppo
                    if (onNavigateToUsers) {
                      onNavigateToUsers(pendingParticipant); // Reindirizza alla sezione utenti
                    } else {
                      console.error('onNavigateToUsers non è definita!');
                      alert(`Vai alla sezione utenti per creare: ${pendingParticipant}`);
                    }
                  }}
                  className="btn-confirm"
                >
                  ✅ Sì, aggiungi alla rubrica
                </button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="group-form">
          <div className="form-group">
            <label htmlFor="groupName">Nome Gruppo *</label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Es: Vacanza Montagna"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrizione</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrizione del gruppo (opzionale)"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Partecipanti *</label>
            
            {/* Selezione utenti esistenti */}
            <div className="existing-users-section">
              <label>Utenti esistenti:</label>
              <select 
                onChange={(e) => {
                  if (e.target.value) {
                    addExistingUser(e.target.value);
                  }
                }}
                className="users-select"
              >
                <option value="">Seleziona utenti esistenti</option>
                {users.map(user => (
                  <option key={user.id} value={user.name}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Aggiungi nuovo utente */}
            <div className="new-user-section">
              <label>Aggiungi nuovo partecipante:</label>
              <div className="participants-input">
                <input
                  type="text"
                  value={newParticipant}
                  onChange={(e) => setNewParticipant(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Nome nuovo partecipante"
                />
                <button
                  type="button"
                  onClick={addParticipant}
                  className="add-participant-btn"
                >
                  +
                </button>
              </div>
            </div>

            {/* Lista partecipanti selezionati */}
            {participants.length > 0 && (
              <div className="participants-list">
                <h4>Partecipanti aggiunti ({participants.length}):</h4>
                <ul>
                  {participants.map((participant, index) => (
                    <li key={index} className="participant-item">
                      <span>{participant}</span>
                      <button
                        type="button"
                        onClick={() => removeParticipant(index)}
                        className="remove-participant-btn"
                        title="Rimuovi partecipante"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">
              Annulla
            </button>
            <button type="submit" className="btn-submit">
              {group ? 'Aggiorna' : 'Crea'} Gruppo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupForm;
