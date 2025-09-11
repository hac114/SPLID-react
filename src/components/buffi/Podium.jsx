import './Podium.css';

const Podium = ({ topUsers }) => {
  const getMedal = (position) => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈'; 
      case 3: return '🥉';
      default: return '🎖️';
    }
  };

  const getPodiumClass = (position) => {
    switch (position) {
      case 1: return 'first';
      case 2: return 'second';
      case 3: return 'third';
      default: return '';
    }
  };

  return (
    <div className="podium">
      <div className="podium-container">
        {/* Secondo posto */}
        {topUsers[1] && (
          <div className={`podium-place second`}>
            <div className="podium-spot">
              <span className="medal">{getMedal(2)}</span>
              <h4>{topUsers[1].name}</h4>
              <div className="podium-amount">€{topUsers[1].totalSpent.toFixed(2)}</div>
              <div className="podium-stats">
                <small>{topUsers[1].expensesCount} spese</small>
              </div>
            </div>
            <div className="podium-stand second-stand"></div>
          </div>
        )}

        {/* Primo posto */}
        {topUsers[0] && (
          <div className={`podium-place first`}>
            <div className="podium-spot">
              <span className="medal">{getMedal(1)}</span>
              <h4>{topUsers[0].name}</h4>
              <div className="podium-amount">€{topUsers[0].totalSpent.toFixed(2)}</div>
              <div className="podium-stats">
                <small>{topUsers[0].expensesCount} spese</small>
              </div>
            </div>
            <div className="podium-stand first-stand"></div>
          </div>
        )}

        {/* Terzo posto */}
        {topUsers[2] && (
          <div className={`podium-place third`}>
            <div className="podium-spot">
              <span className="medal">{getMedal(3)}</span>
              <h4>{topUsers[2].name}</h4>
              <div className="podium-amount">€{topUsers[2].totalSpent.toFixed(2)}</div>
              <div className="podium-stats">
                <small>{topUsers[2].expensesCount} spese</small>
              </div>
            </div>
            <div className="podium-stand third-stand"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Podium;