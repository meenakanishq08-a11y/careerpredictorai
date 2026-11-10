import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { recommendAPI } from '../services/api';
import Spinner from '../components/common/Spinner';

const ConfirmModal = ({ onConfirm, onCancel, title }) => (
  <div className="modal-overlay" onClick={onCancel}>
    <motion.div
      className="modal-box confirm-dialog"
      initial={{ scale: 0.85 }} animate={{ scale: 1 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>🗑️</div>
      <h3 style={{ marginBottom: 'var(--space-2)' }}>Delete Recommendation?</h3>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
        This will permanently delete "{title}". This cannot be undone.
      </p>
      <div className="confirm-dialog-actions">
        <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn btn-danger" onClick={onConfirm}>Delete</button>
      </div>
    </motion.div>
  </div>
);

const History = () => {
  const { toast }   = useToast();
  const [items, setItems]       = useState([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [totalPages, setPages]  = useState(1);
  const [loading, setLoading]   = useState(true);
  const [delTarget, setDelTarget] = useState(null);
  const LIMIT = 6;

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const res = await recommendAPI.history(p, LIMIT);
      const { items: its, total: tot, totalPages: tp } = res.data.data;
      setItems(its);
      setTotal(tot);
      setPages(tp);
      setPage(p);
    } catch {
      toast.error('Could not load history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); }, []);

  const handleDelete = async () => {
    if (!delTarget) return;
    try {
      await recommendAPI.delete(delTarget._id);
      toast.success('Recommendation deleted');
      setDelTarget(null);
      load(page);
    } catch {
      toast.error('Delete failed');
    }
  };

  if (loading) return <Spinner fullPage label="Loading history..." />;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 'var(--space-8)' }}>
          <h1>Recommendation History</h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)' }}>
            {total} recommendation{total !== 1 ? 's' : ''} generated
          </p>
        </motion.div>

        {items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🌌</div>
            <h3>No recommendations yet</h3>
            <p>Generate your first career path recommendation from the Dashboard.</p>
            <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: 'var(--space-4)' }}>
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-6)' }}>
              <AnimatePresence>
                {items.map((rec, i) => (
                  <motion.div
                    key={rec._id}
                    className="history-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {/* Top match badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                      <span className="chip chip-primary">
                        🏆 {rec.careerPaths?.[0]?.title}
                      </span>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                        {new Date(rec.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)', lineHeight: 1.6 }}>
                      {rec.summary?.slice(0, 120)}...
                    </p>

                    {/* Score bars mini */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
                      {rec.careerPaths?.slice(0, 3).map((cp) => (
                        <div key={cp.title} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', width: 130, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {cp.title}
                          </span>
                          <div style={{ flex: 1, height: 4, background: 'var(--color-bg-tertiary)', borderRadius: 999, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${cp.fitScore}%`, background: 'var(--gradient-primary)', borderRadius: 999 }} />
                          </div>
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)', fontWeight: 700, width: 30, textAlign: 'right' }}>{cp.fitScore}%</span>
                        </div>
                      ))}
                    </div>

                    <div className="history-card-actions">
                      <Link to={`/recommendations/${rec._id}`} className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>
                        View →
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setDelTarget(rec)}
                      >
                        🗑️
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button className="page-btn" onClick={() => load(page - 1)} disabled={page === 1}>‹</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => load(p)}>{p}</button>
                ))}
                <button className="page-btn" onClick={() => load(page + 1)} disabled={page === totalPages}>›</button>
              </div>
            )}
          </>
        )}
      </div>

      {delTarget && (
        <ConfirmModal
          title={delTarget.careerPaths?.[0]?.title || 'this recommendation'}
          onConfirm={handleDelete}
          onCancel={() => setDelTarget(null)}
        />
      )}
    </div>
  );
};

export default History;
