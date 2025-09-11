import "./Header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-logo">
        <h1>💰 SPLID</h1>
        <span>Gestione Spese di Gruppo</span>
      </div>
      <nav className="header-nav">
        <a href="#gruppi" className="nav-link">
          Gruppi
        </a>
        <a href="#spese" className="nav-link">
          Spese
        </a>
        <a href="#riepilogo" className="nav-link">
          Riepilogo
        </a>
        <a href="#buffi" className="nav-link">
          Buffi
        </a>
      </nav>
    </header>
  );
};

export default Header;
