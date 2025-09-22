import { useState } from "react";
import "./GroupManager.css";
import GroupForm from "./GroupForm";
import ExpenseForm from "../expenses/ExpenseForm";
import ExpenseList from "../expenses/ExpenseList";

const GroupManager = ({ 
  groups, 
  users, 
  onGroupClick, 
  onCreateGroup, 
  onUpdateGroup,
  onDeleteGroup,
  onAddExpense, 
  onAddNewUser,
  onNavigateToUsers 
}) => {
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showExpenseList, setShowExpenseList] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedGroupForList, setSelectedGroupForList] = useState(null);
  const [editingGroup, setEditingGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.participants.some(participant => 
      participant.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAddGroup = (newGroup) => {
    console.log('Nuovo gruppo ricevuto:', newGroup);

    const groupWithDefaults = {
      ...newGroup,
      total: 0,
      id: Date.now(),
      expenses: [],
    };

    console.log('Gruppo con defaults:', groupWithDefaults);

    onCreateGroup(groupWithDefaults);
    setShowGroupForm(false);
    alert(`Gruppo "${newGroup.name}" creato con successo!`);
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group);
  };

  const handleUpdateGroup = (updatedGroup) => {
    onUpdateGroup(updatedGroup);
    setEditingGroup(null);
    alert(`Gruppo "${updatedGroup.name}" aggiornato con successo!`);
  };

  const handleDeleteGroup = (groupId, groupName) => {
    if (window.confirm(`Sei sicuro di voler eliminare il gruppo "${groupName}"? Tutte le spese associate verranno eliminate.`)) {
      onDeleteGroup(groupId);
      alert('Gruppo eliminato con successo!');
    }
  };

  const handleAddExpense = (newExpense) => {
    onAddExpense(newExpense);
    setShowExpenseForm(false);
    setSelectedGroup(null);
    alert("Spesa aggiunta con successo!");
  };

  const handleGroupClick = (group, event) => {
    if (event.target.classList.contains("add-expense-btn") || 
        event.target.classList.contains("edit-group-btn") ||
        event.target.classList.contains("delete-group-btn")) {
      return; // Non fare nulla se clicca sui pulsanti azione
    }
    
    onGroupClick(group);
    setSelectedGroupForList(group);
    setShowExpenseList(true);
  };

  const handleAddExpenseClick = (group, event) => {
    event.stopPropagation();
    setSelectedGroup(group);
    setShowExpenseForm(true);
  };

  const handleEditGroupClick = (group, event) => {
    event.stopPropagation();
    handleEditGroup(group);
  };

  const handleDeleteGroupClick = (group, event) => {
    event.stopPropagation();
    handleDeleteGroup(group.id, group.name);
  };

  const handleUserRedirect = (userName) => {
    console.log('Redirecting to users with:', userName);
    if (onNavigateToUsers) {
      onNavigateToUsers(userName); // 👈 QUI SI PASSA IL NOME
    } else {
      console.error('onNavigateToUsers is not defined!');
    }
  };

  return (    
    <div className="group-manager">
      <div className="group-manager-header">
        <h2>Gestione Gruppi</h2>
        <button 
          className="add-group-btn primary-btn"
          onClick={() => setShowGroupForm(true)}
        >
          + Nuovo Gruppo
        </button>
      </div>

      <div className="search-box">
        <input
          type="text"
          placeholder="Cerca gruppi per nome, descrizione o partecipante..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="groups-grid">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className="group-card"
            onClick={(e) => handleGroupClick(group, e)}
          >
            <div className="card-header">
              <h3>{group.name}</h3>
              <div className="group-actions">
                <button
                  className="edit-group-btn"
                  onClick={(e) => handleEditGroupClick(group, e)}
                  title="Modifica gruppo"
                >
                  ✏️
                </button>
                <button
                  className="delete-group-btn"
                  onClick={(e) => handleDeleteGroupClick(group, e)}
                  title="Elimina gruppo"
                >
                  🗑️
                </button>
              </div>
            </div>

            <p>{group.participants.length} partecipanti</p>
            
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
            
            <span className="group-total">
              Totale: € {group.total.toFixed(2)}
            </span>
            
            <div className="expenses-count">
              {group.expenses.length} spese
            </div>

            <button
              className="add-expense-btn"
              onClick={(e) => handleAddExpenseClick(group, e)}
            >
              + Aggiungi Spesa
            </button>
          </div>
        ))}

        {filteredGroups.length === 0 && (
          <div className="no-groups">
            <p>{searchTerm ? 'Nessun gruppo trovato' : 'Nessun gruppo disponibile'}</p>
            <small>
              {searchTerm 
                ? 'Prova con un altro termine di ricerca' 
                : 'Clicca su "Nuovo Gruppo" per crearne uno'
              }
            </small>
          </div>
        )}
      </div>

      {showGroupForm && (
        <GroupForm
          users={users}
          onGroupAdded={handleAddGroup}
          onCancel={() => setShowGroupForm(false)}
          onAddNewUser={onAddNewUser}
          onNavigateToUsers={handleUserRedirect} 
        />
      )}

      {editingGroup && (
        <GroupForm
          users={users}
          group={editingGroup}
          onGroupAdded={handleUpdateGroup}
          onCancel={() => setEditingGroup(null)}
          onAddNewUser={onAddNewUser}
          onNavigateToUsers={handleUserRedirect} 
        />
      )}

      {showExpenseForm && selectedGroup && (
        <ExpenseForm
          groups={groups}
          onExpenseAdded={handleAddExpense}
          onCancel={() => {
            setShowExpenseForm(false);
            setSelectedGroup(null);
          }}
        />
      )}

      {showExpenseList && selectedGroupForList && (
        <ExpenseList
          group={selectedGroupForList}
          onClose={() => {
            setShowExpenseList(false);
            setSelectedGroupForList(null);
          }}
        />
      )}
    </div>
  );
};

export default GroupManager;