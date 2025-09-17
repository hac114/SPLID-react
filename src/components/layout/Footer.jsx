import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <h3>💰 Splid</h3>
            <p>La soluzione semplice per dividere le spese</p>
          </div>
          <div className="app-badges">
            <span className="badge">⭐ Facile</span>
            <span className="badge">⚡ Veloce</span>
            <span className="badge">🔒 Sicuro</span>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Contatti</h4>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <span>info@splidapp.com</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <span>+39 02 1234 5678</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">🏢</span>
              <span>Via Appia 123, Milano</span>
            </div>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Link Utili</h4>
          <ul className="footer-links">
            <li><a href="#guide">📖 Guida all'uso</a></li>
            <li><a href="#faq">❓ FAQ</a></li>
            <li><a href="#blog">📰 Blog</a></li>
            <li><a href="#api">🔌 API</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Seguici</h4>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Facebook">
              <span className="social-icon">📘</span>
              <span>Facebook</span>
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <span className="social-icon">📸</span>
              <span>Instagram</span>
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <span className="social-icon">🐦</span>
              <span>Twitter</span>
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {currentYear} Splid App. Tutti i diritti riservati.</p>
          <div className="legal-links">
            <a href="#privacy">Privacy Policy</a>
            <span className="divider">•</span>
            <a href="#terms">Termini di Servizio</a>
            <span className="divider">•</span>
            <a href="#cookies">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;