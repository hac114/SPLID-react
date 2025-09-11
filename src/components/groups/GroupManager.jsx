import "./GroupManager.css";

const GroupManager = () => {
  return (
    <div className="group-manager">
      <h2>Gestione Gruppi</h2>
      <div className="groups-grid">
        <div className="group-card">
          <h3>Vacanza Montagna</h3>
          <p>4 partecipanti</p>
          <span className="group-total">Totale: € 1.250,00</span>
        </div>

        <div className="group-card">
          <h3>Cena di Compleanno</h3>
          <p>6 partecipanti</p>
          <span className="group-total">Totale: € 480,00</span>
        </div>

        <div className="group-card new-group">
          <h3>+ Nuovo Gruppo</h3>
          <p>Crea un nuovo gruppo</p>
        </div>
      </div>
    </div>
  );
};

export default GroupManager;
