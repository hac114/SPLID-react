import { useState } from "react";
import "./GroupManager.css";
import GroupForm from "./GroupForm";
import ExpenseForm from "../expenses/ExpenseForm";
import ExpenseList from "../expenses/ExpenseList";

const GroupManager = () => {
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: "Vacanza Montagna",
      participants: ["Mario", "Luigi", "Giovanna", "Sofia"],
      total: 1250.0,
      description: "Weekend in montagna",
      expenses: [],
    },
    {
      id: 2,
      name: "Cena di Compleanno",
      participants: ["Marco", "Anna", "Luca", "Elena", "Paolo", "Maria"],
      total: 480.0,
      description: "Cena di compleanno di Marco",
      expenses: [],
    },
  ]);

  const [showGroupForm, setShowGroupForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showExpenseList, setShowExpenseList] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedGroupForList, setSelectedGroupForList] = useState(null);

  const handleAddGroup = (newGroup) => {
    const groupWithDefaults = {
      ...newGroup,
      total: 0,
      expenses: [],
    };

    setGroups([...groups, groupWithDefaults]);
    setShowGroupForm(false);
    alert(`Gruppo "${newGroup.name}" creato con successo!`);
  };

  const handleAddExpense = (newExpense) => {
    const updatedGroups = groups.map((group) => {
      if (group.id === newExpense.groupId) {
        const updatedExpenses = [...group.expenses, newExpense];
        const newTotal = updatedExpenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        );

        return {
          ...group,
          expenses: updatedExpenses,
          total: newTotal,
        };
      }
      return group;
    });

    setGroups(updatedGroups);
    setShowExpenseForm(false);
    setSelectedGroup(null);
    alert("Spesa aggiunta con successo!");
  };

  const handleGroupClick = (group, event) => {
    // Controlla se il click è sul bottone "Aggiungi Spesa"
    if (event.target.classList.contains("add-expense-btn")) {
      setSelectedGroup(group);
      setShowExpenseForm(true);
    } else {
      // Altrimenti mostra la lista delle spese
      setSelectedGroupForList(group);
      setShowExpenseList(true);
    }
  };

  const handleAddExpenseClick = (group, event) => {
    event.stopPropagation(); // Previene la propagazione del click alla card
    setSelectedGroup(group);
    setShowExpenseForm(true);
  };

  return (    
    <div className="group-manager">
      <h2>Gestione Gruppi</h2>
      <div className="groups-grid">
        {groups.map((group) => (
          <div
            key={group.id}
            className="group-card"
            onClick={(e) => handleGroupClick(group, e)}
          >
            <h3>{group.name}</h3>
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
            <div className="expenses-count">{group.expenses.length} spese</div>

            <button
              className="add-expense-btn"
              onClick={(e) => handleAddExpenseClick(group, e)}
            >
              + Aggiungi Spesa
            </button>
          </div>
        ))}

        <div
          className="group-card new-group"
          onClick={() => setShowGroupForm(true)}
        >
          <h3>+ Nuovo Gruppo</h3>
          <p>Crea un nuovo gruppo</p>
        </div>
      </div>

      {showGroupForm && (
        <GroupForm
          onGroupAdded={handleAddGroup}
          onCancel={() => setShowGroupForm(false)}
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
