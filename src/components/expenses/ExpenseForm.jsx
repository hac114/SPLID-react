import { useState } from "react";
import "./ExpenseForm.css";

const ExpenseForm = ({ groups, onExpenseAdded, onCancel }) => {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [payer, setPayer] = useState("");
  const [category, setCategory] = useState("altro");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const categories = [
    "cibo",
    "bevande",
    "trasporti",
    "alloggio",
    "intrattenimento",
    "shopping",
    "altro",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedGroup || !amount || !description || !payer) {
      alert("Compila tutti i campi obbligatori!");
      return;
    }

    const selectedGroupData = groups.find(
      (group) => group.id === parseInt(selectedGroup)
    );

    if (!selectedGroupData) {
      alert("Gruppo non trovato!");
      return;
    }

    const newExpense = {
      id: Date.now(),
      groupId: parseInt(selectedGroup),
      amount: parseFloat(amount),
      description: description.trim(),
      payer: payer.trim(),
      category,
      date,
      participants: selectedGroupData.participants,
      splitType: "equal", // divisione equa per default
    };

    onExpenseAdded(newExpense);

    // Reset form
    setAmount("");
    setDescription("");
    setPayer("");
    setCategory("altro");
  };

  return (
    <div className="expense-form-overlay">
      <div className="expense-form-container">
        <h3>Aggiungi Nuova Spesa</h3>

        <form onSubmit={handleSubmit} className="expense-form">
          <div className="form-group">
            <label htmlFor="groupSelect">Gruppo *</label>
            <select
              id="groupSelect"
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              required
            >
              <option value="">Seleziona un gruppo</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name} ({group.participants.length} partecipanti)
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="amount">Importo (€) *</label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Categoria</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrizione *</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrizione della spesa"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="payer">Pagato da *</label>
              <select
                id="payer"
                value={payer}
                onChange={(e) => setPayer(e.target.value)}
                required
              >
                <option value="">Seleziona chi ha pagato</option>
                {selectedGroup &&
                  groups
                    .find((g) => g.id === parseInt(selectedGroup))
                    ?.participants.map((participant, index) => (
                      <option key={index} value={participant}>
                        {participant}
                      </option>
                    ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Data</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">
              Annulla
            </button>
            <button type="submit" className="btn-submit">
              Aggiungi Spesa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
