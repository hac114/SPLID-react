import { useState } from "react";
import "./GroupForm.css";

const GroupForm = ({ onGroupAdded, onCancel }) => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [participants, setParticipants] = useState([""]);
  const [newParticipant, setNewParticipant] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!groupName.trim()) {
      alert("Inserisci un nome per il gruppo!");
      return;
    }

    // Filtra partecipanti vuoti
    const validParticipants = participants.filter((p) => p.trim() !== "");

    const newGroup = {
      id: Date.now(),
      name: groupName.trim(),
      description: description.trim(),
      participants: validParticipants,
      totalExpenses: 0,
      createdAt: new Date().toISOString(),
    };

    onGroupAdded(newGroup);

    // Reset form
    setGroupName("");
    setDescription("");
    setParticipants([""]);
    setNewParticipant("");
  };

  const addParticipant = () => {
    if (newParticipant.trim()) {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant("");
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
            <label>Partecipanti</label>
            <div className="participants-input">
              <input
                type="text"
                value={newParticipant}
                onChange={(e) => setNewParticipant(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nome partecipante"
              />
              <button
                type="button"
                onClick={addParticipant}
                className="add-participant-btn"
              >
                +
              </button>
            </div>

            {participants.filter((p) => p.trim() !== "").length > 0 && (
              <div className="participants-list">
                <h4>Partecipanti aggiunti:</h4>
                <ul>
                  {participants.map(
                    (participant, index) =>
                      participant.trim() !== "" && (
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
                      )
                  )}
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
