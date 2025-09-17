import { useState, useEffect } from "react";
import "./ExpenseForm.css";

const ExpenseForm = ({ groups, expense, onExpenseAdded, onCancel }) => {
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
    "salute",
    "regali",
    "altro"
  ];

  // Ottieni i partecipanti del gruppo selezionato
  const groupParticipants = selectedGroup 
    ? groups.find(g => g.id === parseInt(selectedGroup))?.participants || []
    : [];

  // Popola il form se siamo in modalità modifica
  useEffect(() => {
    if (expense) {
      setSelectedGroup(expense.groupId.toString());
      setAmount(expense.amount.toString());
      setDescription(expense.description);
      setPayer(expense.payer);
      setCategory(expense.category);
      setDate(expense.date);
    }
  }, [expense]);

  const getCategoryIcon = (category) => {
    const icons = {
      cibo: "🍕",
      bevande: "🍷",
      trasporti: "🚗",
      alloggio: "🏨",
      intrattenimento: "🎬",
      shopping: "🛍️",
      salute: "💊",
      regali: "🎁",
      altro: "📦"
    };
    return icons[category] || "📦";
  };

  const getCategoryColor = (category) => {
    const colors = {
      cibo: "#FF6B6B",
      bevande: "#4ECDC4", 
      trasporti: "#45B7D1",
      alloggio: "#96CEB4",
      intrattenimento: "#FFEAA7",
      shopping: "#DDA0DD",
      salute: "#98D8C8",
      regali: "#F7DC6F",
      altro: "#BDC3C7"
    };
    return colors[category] || "#BDC3C7";
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedGroup || !amount || !description || !payer) {
      alert("Compila tutti i campi obbligatori!");
      return;
    }

    // Verifica che il pagante sia nei partecipanti del gruppo
    if (!groupParticipants.includes(payer)) {
      alert(`Il pagante "${payer}" non è tra i partecipanti del gruppo!`);
      return;
    }  

    const selectedGroupData = groups.find(
      (group) => group.id === parseInt(selectedGroup)
    );

    if (!selectedGroupData) {
      alert("Gruppo non trovato!");
      return;
    }

    const expenseData = {
      id: expense ? expense.id : Date.now(), // Mantieni ID se modifica
      groupId: parseInt(selectedGroup),
      amount: parseFloat(amount),
      description: description.trim(),
      payer: payer.trim(),
      category,
      date,
      participants: selectedGroupData.participants,
      splitType: "equal",
    };

    onExpenseAdded(expenseData);

    // Reset form solo se non siamo in modifica
    if (!expense) {
      setSelectedGroup("");
      setAmount("");
      setDescription("");
      setPayer("");
      setCategory("altro");
      setDate(new Date().toISOString().split("T")[0]);
    } else {
        // Se siamo in modifica, chiudi semplicemente il form
      onCancel();
    }

  };

  // Reset payer quando cambia il gruppo
  const handleGroupChange = (e) => {
    setSelectedGroup(e.target.value);
    setPayer(""); // Resetta il pagante quando cambia gruppo
  };

  return (
    <div className="expense-form-overlay">
      <div className="expense-form-container">
        <h3>{expense ? 'Modifica Spesa' : 'Aggiungi Nuova Spesa'}</h3>

        <form onSubmit={handleSubmit} className="expense-form">
          <div className="form-group">
            <label htmlFor="groupSelect">Gruppo *</label>
            <select
              id="groupSelect"
              value={selectedGroup}
              onChange={handleGroupChange}
              required
              disabled={!!expense} // Disabilita se in modifica
            >
              <option value="">Seleziona un gruppo</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name} ({group.participants.length} partecipanti)
                </option>
              ))}
            </select>
            {expense && (
              <p className="field-note">Il gruppo non può essere modificato</p>
            )}
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
                    {getCategoryIcon(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
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
                disabled={!selectedGroup || groupParticipants.length === 0}
              >
                <option value="">Seleziona chi ha pagato</option>
                {groupParticipants.map((participant, index) => (
                  <option key={index} value={participant}>
                    {participant}
                  </option>
                ))}
              </select>
              {!selectedGroup && (
                <p className="field-note">Seleziona prima un gruppo</p>
              )}
              {selectedGroup && groupParticipants.length === 0 && (
                <p className="field-error">Nessun partecipante in questo gruppo</p>
              )}
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
            <button 
              type="submit" 
              className="btn-submit"
              disabled={!selectedGroup || groupParticipants.length === 0}
            >
              {expense ? 'Aggiorna' : 'Aggiungi'} Spesa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;