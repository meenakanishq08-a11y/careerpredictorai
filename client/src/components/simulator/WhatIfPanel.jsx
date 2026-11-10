import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { recommendAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import SkillTagInput from '../common/SkillTagInput';

const POPULAR_SKILLS = [
  'TypeScript', 'Docker', 'Python', 'Kubernetes', 'AWS', 
  'System Design', 'Figma', 'Machine Learning', 'GraphQL', 'Next.js'
];

const WhatIfPanel = ({ recommendationId, originalPaths, onSimulated }) => {
  const { toast } = useToast();
  const [extraSkills, setExtraSkills] = useState([]);
  const [removedSkills, setRemovedSkills] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    if (!extraSkills.length && !removedSkills.length) {
      toast.info('Add or remove skills above to run the simulator!');
      return;
    }
    setLoading(true);
    try {
      const res = await recommendAPI.simulate({ recommendationId, extraSkills, removedSkills });
      const simulated = res.data.data.simulated;
      setResults(simulated);
      onSimulated && onSimulated(simulated);
      toast.success('Simulation computed! 🪐 Galaxy & scores dynamically re-ranked.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  const addQuickSkill = (skill) => {
    if (!extraSkills.includes(skill)) {
      setExtraSkills([...extraSkills, skill]);
    }
  };

  const handleReset = () => {
    setExtraSkills([]);
    setRemovedSkills([]);
    setResults(null);
    onSimulated && onSimulated(null);
    toast.info('Simulator reset to original scores');
  };

  return (
    <div className="whatif-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
        <h3>🧪 Real-Time "What-If" Skill Simulator</h3>
        <span className="chip chip-cyan" style={{ fontSize: 11 }}>Deterministic • Zero Latency</span>
      </div>
      <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
        Simulate acquiring new high-leverage skills or removing legacy ones. Watch career fit scores recalculate and orbital planets re-scale instantly.
      </p>

      {/* Quick Add Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 'var(--space-5)' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase' }}>Quick Add:</span>
        {POPULAR_SKILLS.map((sk) => (
          <button
            key={sk}
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => addQuickSkill(sk)}
            style={{ fontSize: 11, padding: '3px 8px', borderRadius: 999 }}
          >
            + {sk}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-5)' }}>
        <div className="form-group">
          <label className="form-label">➕ Projected Skills to Acquire</label>
          <SkillTagInput
            value={extraSkills}
            onChange={setExtraSkills}
            placeholder="Type skill & press Enter (e.g. AWS, Docker)..."
          />
        </div>
        <div className="form-group">
          <label className="form-label">➖ Skills to De-prioritize</label>
          <SkillTagInput
            value={removedSkills}
            onChange={setRemovedSkills}
            placeholder="Type skill to remove from evaluation..."
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)', alignItems: 'center' }}>
        <button type="button" className="btn btn-primary" onClick={handleSimulate} disabled={loading}>
          {loading ? 'Recalculating Trajectories...' : '🔮 Calculate Re-ranked Trajectories'}
        </button>
        {results && (
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            Reset to Baseline
          </button>
        )}
      </div>

      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
          >
            <div className="whatif-results">
              {results.map((r, i) => (
                <motion.div
                  key={r.title}
                  className="whatif-result-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, color: 'var(--color-text)' }}>
                    {r.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--color-primary)' }}>
                      {r.fitScore}%
                    </div>
                    <div
                      className={r.delta > 0 ? 'delta-positive' : r.delta < 0 ? 'delta-negative' : 'delta-neutral'}
                      style={{ fontSize: 13 }}
                    >
                      {r.delta > 0 ? `▲ +${r.delta}` : r.delta < 0 ? `▼ ${r.delta}` : '— 0'} pts
                    </div>
                  </div>

                  <div style={{ height: 4, background: 'var(--color-bg-tertiary)', borderRadius: 999, marginTop: 8, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${r.fitScore}%`,
                      background: r.delta >= 0 ? 'var(--gradient-primary)' : 'var(--color-danger)',
                      borderRadius: 999,
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WhatIfPanel;
