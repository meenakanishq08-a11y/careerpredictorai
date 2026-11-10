import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ThemeToggle';

const Navbar = () => {
  const { isAuth, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">🚀 CareerAI</Link>

        {/* Mobile menu button */}
        <button className="mobile-menu-btn" onClick={() => setMenuOpen((o) => !o)}>
          {menuOpen ? '✕' : '☰'}
        </button>

        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {isAuth ? (
            <>
              <li><NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</NavLink></li>
              <li><NavLink to="/profile" onClick={() => setMenuOpen(false)}>Profile</NavLink></li>
              <li><NavLink to="/history" onClick={() => setMenuOpen(false)}>History</NavLink></li>
            </>
          ) : (
            <>
              <li><NavLink to="/">Home</NavLink></li>
            </>
          )}
        </ul>

        <div className="navbar-actions">
          <ThemeToggle />
          {isAuth ? (
            <>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                👋 {user?.name?.split(' ')[0]}
              </span>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
