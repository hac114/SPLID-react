import './Header.css';

const Header = ({ currentView, onViewChange }) => {
  const menuItems = [
    { key: 'groups', label: '👥 Gruppi'},
    { key: 'users', label: '👤 Utenti'},
    { key: 'expenses', label: '💰 Spese'},
    { key: 'summary', label: '📊 Riepilogo'},
    { key: 'buffi', label: '🏆 Buffi'}
  ];

  return (
    <header className="app-header">     
      <div className="header-top">
        <div className="header-content">
          <h1>💰 Splid</h1>
          <p>La soluzione semplice per dividere le spese</p>
        </div>
      </div>
      
      <nav className="header-nav">
        <div className="nav-container">
          {menuItems.map((item) => (
            <button
              key={item.key}
              className={`nav-item ${currentView === item.key ? 'active' : ''}`}
              onClick={() => onViewChange(item.key)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
