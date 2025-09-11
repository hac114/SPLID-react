import './Navbar.css';

const Navbar = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: 'groups', label: 'Gruppi', icon: '🏠' },
    { id: 'users', label: 'Utenti', icon: '👥' },
    { id: 'expenses', label: 'Spese', icon: '💰' },
    { id: 'summary', label: 'Riepilogo', icon: '📊' },
    { id: 'buffi', label: 'Buffi', icon: '🏆' }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h2>💰 SPLID</h2>
      </div>
      
      <ul className="navbar-menu">
        {menuItems.map(item => (
          <li key={item.id} className="nav-item">
            <button
              className={`nav-link ${currentView === item.id ? 'active' : ''}`}
              onClick={() => onViewChange(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="navbar-user">
        <span className="user-name">Admin</span>
        <div className="user-avatar">👤</div>
      </div>
    </nav>
  );
};

export default Navbar;