import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CompareModal = ({ careerPaths, onClose }) => {
  const [leftIdx, setLeftIdx] = useState(0);
  const [rightIdx, setRightIdx] = useState(1);

  const left = careerPaths[leftIdx] || careerPaths[0];
  const right = careerPaths[rightIdx] || careerPaths[1] || careerPaths[0];

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-box"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <div>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800 }}>⚖️ Side-by-Side Career Evaluation</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>Compare compatibility, compensation, skill curves, and growth potential</p>
            </div>
            <button type="button" className="modal-close" onClick={onClose}>✕</button>
          </div>

          {/* Selectors */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
            {[
              { idx: leftIdx, setIdx: setLeftIdx, label: 'Primary Comparison Target' },
              { idx: rightIdx, setIdx: setRightIdx, label: 'Benchmark Competitor' }
            ].map(({ idx, setIdx, label }) => (
              <div key={label} className="form-group">
                <label className="form-label">{label}</label>
                <select
                  className="form-input"
                  value={idx}
                  onChange={(e) => setIdx(Number(e.target.value))}
                >
                  {careerPaths.map((cp, i) => (
                    <option key={cp.title} value={i}>{cp.title} ({cp.fitScore}% match)</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          {/* Side by side comparison cards */}
          <div className="compare-grid">
            {[left, right].map((cp, side) => (
              <div key={side} className="compare-col">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 'var(--text-lg)' }}>{cp.title}</h3>
                  <span className="chip chip-primary">{cp.fitScore}% Match</span>
                </div>

                {/* Fit Score Bar */}
                <div className="compare-score-bar" style={{ marginBottom: 16 }}>
                  <div className="compare-score-fill" style={{ width: `${cp.fitScore}%` }} />
                </div>

                {/* Key Metrics Table */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: 12, background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Salary Band:</span>
                    <strong style={{ color: 'var(--color-text)' }}>{cp.salaryRange || '$95k - $150k'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Growth Rate:</span>
                    <strong style={{ color: 'var(--color-success)' }}>{cp.growthOutlook || '+22%'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Market Demand:</span>
                    <strong style={{ color: 'var(--color-primary)' }}>{cp.demandLevel || 'High'}</strong>
                  </div>
                </div>

                {/* Required Skills */}
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-success)', textTransform: 'uppercase' }}>
                    Required Core Skills:
                  </span>
                  <div className="compare-skills-list">
                    {cp.requiredSkills.map((s) => (
                      <span key={s} className="chip chip-success" style={{ fontSize: 11 }}>{s}</span>
                    ))}
                  </div>
                </div>

                {/* Missing Skills */}
                <div style={{ marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-warning)', textTransform: 'uppercase' }}>
                    Identified Gaps to Bridge:
                  </span>
                  <div className="compare-skills-list">
                    {cp.missingSkills.map((s) => (
                      <span key={s} className="chip chip-warning" style={{ fontSize: 11 }}>{s}</span>
                    ))}
                  </div>
                </div>

                {/* Rationale Snippet */}
                <div style={{ marginTop: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>
                    Strategic Rationale:
                  </span>
                  <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4, lineHeight: 1.5 }}>
                    {cp.reasons?.[0] || 'High baseline synergy identified with current profile metrics.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CompareModal;
