import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Suspense, lazy } from 'react';

const NotFound = () => (
  <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{ textAlign: 'center', padding: 'var(--space-12)' }}
    >
      <motion.div
        style={{ fontSize: '8rem', lineHeight: 1 }}
        animate={{ rotate: [0, -10, 10, -5, 5, 0], y: [0, -20, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      >
        🚀
      </motion.div>

      <motion.h1
        style={{ fontSize: 'clamp(5rem, 15vw, 10rem)', fontWeight: 900, margin: 'var(--space-4) 0' }}
        className="glow-text"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        404
      </motion.h1>

      <motion.h2
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        style={{ marginBottom: 'var(--space-4)', color: 'var(--color-text-secondary)' }}
      >
        Lost in the Career Galaxy
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-8)', maxWidth: 350, margin: '0 auto var(--space-8)' }}
      >
        The page you're looking for doesn't exist or has drifted into a black hole.
      </motion.p>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <Link to="/" className="btn btn-primary btn-lg">← Back to Home</Link>
      </motion.div>
    </motion.div>
  </div>
);

export default NotFound;
