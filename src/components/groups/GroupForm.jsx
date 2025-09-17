import { useState, useEffect } from "react";
import "./GroupForm.css";

const GroupForm = ({ users = [], group, onGroupAdded, onCancel, onAddNewUser }) => {
  const [groupName, setGroupName] = useState(group?.name || "");
  const [description, setDescription] = useState(group?.description || "");
  const [participants, setParticipants] = useState(group?.participants || []);
  const [newParticipant, setNewParticipant] = useState('');
  
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
      id: Date.now(),
      name: groupName.trim(),
      description: description.trim(),
      participants: participants,
      total: 0,
      expenses: [],
      createdAt: new Date().toISOString(),
    };

    onGroupAdded(newGroup);

    // Reset form
    setGroupName("");
    setDescription("");
    setParticipants([]);
    setNewParticipant("");
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
    
    // Aggiungi alla rubrica se non esiste
    const userExists = users.some(user => user.name === trimmedName);
    if (!userExists && onAddNewUser) {
      onAddNewUser(trimmedName);
    }
    
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
        <h3>Crea Nuovo Gruppo</h3>

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
                <h4>Partecipanti aggiunti:</h4>
                <ul>
                  {participants.map((participant, index) => (
                    <li key={index} className="participant-item">
                      <span>{participant}</span>
                      <button
                        type="button"
                        onClick={() => removeParticipant(index)}
                        className="remove-participant-btn"
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
              Crea Gruppo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroupForm;
