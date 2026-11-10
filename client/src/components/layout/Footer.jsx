import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-content">
        <div>
          <div className="navbar-logo" style={{ marginBottom: '0.25rem' }}>🚀 CareerAI</div>
          <p className="footer-text">AI-powered career path recommendations.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
          <Link to="/" className="footer-text" style={{ color: 'var(--color-text-muted)' }}>Home</Link>
          <Link to="/dashboard" className="footer-text" style={{ color: 'var(--color-text-muted)' }}>Dashboard</Link>
        </div>
        <p className="footer-text">© 2024 CareerAI. Built with ❤️ &amp; GPT.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
