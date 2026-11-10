import { useState, useEffect, Suspense, lazy } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { recommendAPI } from '../services/api';
import Spinner from '../components/common/Spinner';
import WhatIfPanel from '../components/simulator/WhatIfPanel';
import CompareModal from '../components/simulator/CompareModal';

const CareerGalaxy   = lazy(() => import('../components/3d/CareerGalaxy'));
const RoadmapJourney = lazy(() => import('../components/3d/RoadmapJourney'));

const RecommendationResult = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [rec, setRec] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(0);
  const [simScores, setSimScores] = useState(null);
  const [showCompare, setShowCompare] = useState(false);

  useEffect(() => {
    recommendAPI.getOne(id).then((res) => {
      setRec(res.data.data);
    }).catch((err) => {
      toast.error(err.response?.data?.message || 'Could not load recommendation');
      navigate('/history');
    }).finally(() => setLoading(false));
  }, [id]);

  const toggleRoadmap = async (stepIndex) => {
    const cp = rec.careerPaths[selected];
    const currentCompleted = cp.learningRoadmap[stepIndex].completed;
    try {
      const res = await recommendAPI.updateRoadmap(id, { pathIndex: selected, stepIndex, completed: !currentCompleted });
      setRec(res.data.data);
      toast.success(currentCompleted ? 'Step marked as pending' : 'Step marked as complete! 🎉');
    } catch {
      toast.error('Could not update roadmap');
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Recommendation link copied to clipboard!');
  };

  if (loading) return <Spinner fullPage label="Rendering 3D Career Galaxy & AI Pathways..." />;
  if (!rec) return null;

  const activePath = rec.careerPaths[selected];
  const activeSimScore = simScores ? simScores[selected]?.fitScore : activePath.fitScore;
  const completedSteps = activePath.learningRoadmap.filter(s => s.completed).length;
  const roadmapPct = Math.round((completedSteps / (activePath.learningRoadmap.length || 1)) * 100);

  return (
    <div className="page-wrapper">
      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        
        {/* Header with Title and Quick Actions */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span className="chip chip-primary">✨ AI Career Diagnostics</span>
                <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  Generated on {new Date(rec.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 900, marginBottom: 6 }}>
                Career Trajectory &amp; Solar Matrix
              </h1>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>
                Explore your top 4 paths mapped in 3D orbit space. Click any planet to inspect competencies and milestones.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={copyShareLink}>
                🔗 Share
              </button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowCompare(true)}>
                ⚖️ Compare Roles
              </button>
              <button type="button" className="btn btn-secondary btn-sm no-print" onClick={() => window.print()}>
                🖨️ Export PDF
              </button>
            </div>
          </div>
        </motion.div>

        {/* Executive Summary Card */}
        <motion.div
          className="card"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            marginBottom: 'var(--space-6)',
            background: 'var(--gradient-card)',
            borderColor: 'rgba(99,102,241,0.25)',
            boxShadow: 'var(--shadow-glow-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
            <div style={{ fontSize: '2rem', flexShrink: 0, lineHeight: 1 }}>🧠</div>
            <div>
              <h3 style={{ marginBottom: 6, color: 'var(--color-primary)' }}>AI Synthesis &amp; Strategic Fit Analysis</h3>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: 'var(--text-sm)' }}>{rec.summary}</p>
            </div>
          </div>
        </motion.div>

        {/* 3D Career Galaxy Solar System */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
            <h2 style={{ fontSize: 'var(--text-xl)' }}>🌌 Interactive Career Galaxy</h2>
            <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
              Controls: Drag to rotate • Scroll to zoom • Click planet to select
            </span>
          </div>

          <Suspense fallback={<div style={{ height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Spinner label="Loading 3D space..." /></div>}>
            <CareerGalaxy
              careerPaths={rec.careerPaths}
              selectedIndex={selected}
              onSelect={setSelected}
              simulatedScores={simScores}
            />
          </Suspense>
        </motion.div>

        {/* Career Selector Tabs with Fit Badges */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 'var(--space-6)', overflowX: 'auto', paddingBottom: 6 }}>
          {rec.careerPaths.map((cp, i) => {
            const score = simScores ? simScores[i]?.fitScore : cp.fitScore;
            return (
              <button
                key={cp.title}
                type="button"
                className={`btn ${selected === i ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelected(i)}
                style={{ flexShrink: 0, padding: '10px 18px' }}
              >
                <span>{cp.title}</span>
                <span style={{
                  background: selected === i ? 'rgba(255,255,255,0.25)' : 'var(--color-primary-bg)',
                  color: selected === i ? '#ffffff' : 'var(--color-primary)',
                  padding: '2px 8px',
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 800
                }}>
                  {score}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Career Detailed Breakdown */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selected}
            className="career-detail-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            style={{ marginBottom: 'var(--space-8)' }}
          >
            {/* Header info */}
            <div className="career-detail-header">
              <div>
                <span className="chip chip-cyan" style={{ marginBottom: 6 }}>Priority Pathway #{selected + 1}</span>
                <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 8 }}>{activePath.title}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <div className="fit-score-bar" style={{ width: 160 }}>
                    <div className="fit-score-fill" style={{ width: `${activeSimScore}%` }} />
                  </div>
                  <span style={{ fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--color-primary)' }}>
                    {activeSimScore}% Compatibility Match
                  </span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div className="career-score-badge">{activeSimScore}%</div>
                <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Algorithmic Fit</span>
              </div>
            </div>

            {/* Market Insights Banner */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 12,
              padding: '16px',
              background: 'var(--color-bg)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              marginBottom: 'var(--space-6)'
            }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>💰 Compensation Band</span>
                <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-text)', marginTop: 2 }}>{activePath.salaryRange || '$95,000 - $155,000 / yr'}</p>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>📈 5-Yr Growth Outlook</span>
                <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-success)', marginTop: 2 }}>{activePath.growthOutlook || '+22% (High Growth)'}</p>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>🔥 Market Demand</span>
                <p style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-primary)', marginTop: 2 }}>{activePath.demandLevel || 'Very High'}</p>
              </div>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>🏢 Top Hiring Brands</span>
                <p style={{ fontWeight: 600, fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                  {(activePath.topCompanies || ['Google', 'Stripe', 'Amazon', 'Microsoft']).slice(0, 3).join(', ')}
                </p>
              </div>
            </div>

            {/* Strategic Rationales */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <h4 style={{ marginBottom: 10, color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', fontWeight: 700 }}>
                💡 Key Success Predictors &amp; Rationales
              </h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingLeft: 0, listStyle: 'none' }}>
                {activePath.reasons.map((r, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      gap: 10,
                      alignItems: 'flex-start',
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.5
                    }}
                  >
                    <span style={{ color: 'var(--color-success)', fontWeight: 800 }}>✓</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills Matrix: Required vs Missing Gaps */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
              <div style={{ padding: 16, background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <span style={{ color: 'var(--color-success)' }}>●</span>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-success)' }}>Competencies Required for this Role</h4>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {activePath.requiredSkills.map((s) => <span key={s} className="chip chip-success">{s}</span>)}
                </div>
              </div>

              <div style={{ padding: 16, background: 'var(--color-bg)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <span style={{ color: 'var(--color-warning)' }}>▲</span>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-warning)' }}>Target Skills to Acquire (Gaps)</h4>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {activePath.missingSkills.map((s) => <span key={s} className="chip chip-warning">{s}</span>)}
                </div>
              </div>
            </div>

            {/* Curated Authoritative Resources */}
            {activePath.resources?.length > 0 && (
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <h4 style={{ marginBottom: 10, color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', fontWeight: 700 }}>
                  📚 Recommended Masterclasses &amp; Documentation
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {activePath.resources.map((r) => (
                    <a key={r.url} href={r.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                      <span>🔗</span> {r.title}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Learning Roadmap: Phased Milestones with 3D Canvas */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <h4 style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--color-text)' }}>
                    🗺️ Actionable Learning Roadmap
                  </h4>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                    Track your milestones. Click checkboxes or 3D nodes to record your progress ({completedSteps}/{activePath.learningRoadmap.length} completed).
                  </p>
                </div>
                <span className="chip chip-primary">{roadmapPct}% Finished</span>
              </div>

              {/* 3D Visual Journey */}
              <Suspense fallback={<Spinner label="Loading roadmap space..." />}>
                <RoadmapJourney
                  steps={activePath.learningRoadmap}
                  onToggle={toggleRoadmap}
                  pathIndex={selected}
                />
              </Suspense>

              {/* Interactive Step-by-Step Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
                {activePath.learningRoadmap.map((step, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleRoadmap(idx)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 16px',
                      background: step.completed ? 'var(--color-success-bg)' : 'var(--color-bg)',
                      border: `1px solid ${step.completed ? 'var(--color-success)' : 'var(--color-border)'}`,
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={step.completed}
                      onChange={() => {}}
                      style={{ cursor: 'pointer', width: 16, height: 16 }}
                    />
                    <span style={{
                      fontSize: 13,
                      fontWeight: step.completed ? 600 : 500,
                      color: step.completed ? 'var(--color-text)' : 'var(--color-text-secondary)',
                      textDecoration: step.completed ? 'line-through' : 'none'
                    }}>
                      {step.step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Real-time What-If Skills Simulator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <WhatIfPanel
            recommendationId={id}
            originalPaths={rec.careerPaths}
            onSimulated={setSimScores}
          />
        </motion.div>
      </div>

      {/* Compare Modal */}
      {showCompare && (
        <CompareModal careerPaths={rec.careerPaths} onClose={() => setShowCompare(false)} />
      )}
    </div>
  );
};

export default RecommendationResult;
