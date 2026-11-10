import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { profileAPI, recommendAPI } from '../services/api';
import ProgressRing from '../components/common/ProgressRing';
import Spinner from '../components/common/Spinner';

const calcCompletion = (profile) => {
  if (!profile) return 0;
  let score = 0;
  if (profile.skills?.length) score += 25;
  if (profile.interests?.length) score += 20;
  if (profile.education?.length && profile.education[0]?.degree) score += 20;
  if (profile.careerGoal) score += 15;
  if (profile.experienceYears > 0) score += 10;
  if (profile.preferredDomains?.length) score += 10;
  return Math.min(100, score);
};

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [genLoad, setGenLoad] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, rRes] = await Promise.all([
          profileAPI.get(),
          recommendAPI.history(1, 1),
        ]);
        setProfile(pRes.data.data);
        setLatest(rRes.data.data.items?.[0] || null);
      } catch {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleGenerate = async () => {
    if (!profile || (!profile.skills?.length && !profile.education?.length)) {
      toast.info('Please configure your skills or pick a 1-click persona in Profile first!');
      navigate('/profile');
      return;
    }
    setGenLoad(true);
    try {
      const res = await recommendAPI.generate();
      toast.success('AI Career Galaxy generated! 🚀');
      navigate(`/recommendations/${res.data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
    } finally {
      setGenLoad(false);
    }
  };

  if (loading) return <Spinner fullPage label="Loading your personalized dashboard..." />;

  const completion = calcCompletion(profile);

  return (
    <div className="page-wrapper">
      <div className="container" style={{ padding: 'var(--space-8) var(--space-6)' }}>
        
        {/* Welcome Greeting */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 'var(--space-8)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span className="chip chip-primary">Executive Workspace</span>
          </div>
          <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 900 }}>
            Welcome back, <span className="glow-text">{user?.name?.split(' ')[0] || 'Explorer'} 👋</span>
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)', fontSize: 'var(--text-base)' }}>
            Your AI career diagnostic portal is ready. Review profile metrics, analyze roadmaps, or generate fresh recommendations.
          </p>
        </motion.div>

        <div className="dashboard-grid">
          
          {/* Left Column: Profile Completeness & Quick Health */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <motion.div className="card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                <h3>Profile Health</h3>
                <span className="chip chip-primary">{completion}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-5)' }}>
                <ProgressRing value={completion} max={100} size={140} strokeWidth={10} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-5)' }}>
                {[
                  { label: 'Technical Skills Tagged', done: !!profile?.skills?.length, count: profile?.skills?.length },
                  { label: 'Academic History', done: !!profile?.education?.length && !!profile?.education?.[0]?.degree },
                  { label: 'Passion Areas & Interests', done: !!profile?.interests?.length },
                  { label: 'Target Objective Defined', done: !!profile?.careerGoal },
                  { label: 'Experience Calibrated', done: (profile?.experienceYears ?? 0) > 0 },
                ].map(({ label, done, count }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, padding: '4px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span>{done ? '✅' : '⚪'}</span>
                      <span style={{ color: done ? 'var(--color-text)' : 'var(--color-text-muted)' }}>{label}</span>
                    </div>
                    {count !== undefined && done && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-primary)' }}>{count} tags</span>
                    )}
                  </div>
                ))}
              </div>

              <Link to="/profile" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>
                {completion < 100 ? '⚡ Complete Profile (or 1-Click Demo) →' : '✏️ Edit Profile Data'}
              </Link>
            </motion.div>

            {/* Quick Stat Highlights */}
            <motion.div className="stat-card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="stat-card-icon">🪐</div>
              <div>
                <div className="stat-card-value">{latest ? 'Active' : 'Pending'}</div>
                <div className="stat-card-label">Career Galaxy Model</div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: AI Action Panel & Latest Recommendation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            
            {/* Generate AI Recommendations Banner */}
            <motion.div
              className="card"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              style={{
                background: 'linear-gradient(145deg, rgba(99,102,241,0.08), rgba(14,165,233,0.08))',
                borderColor: 'rgba(99,102,241,0.25)',
                textAlign: 'center',
                padding: 'var(--space-10) var(--space-6)',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>🌌</div>
              <h2 style={{ marginBottom: 'var(--space-2)' }}>Generate AI Career Matrix</h2>
              <p style={{ color: 'var(--color-text-secondary)', maxWidth: 540, margin: '0 auto var(--space-6)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
                Synthesize your full background into 4 high-affinity career pathways with interactive 3D orbit planets, actionable roadmap milestones, and salary outlooks.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-generate"
                onClick={handleGenerate}
                disabled={genLoad}
              >
                {genLoad ? (
                  <>
                    <span className="spinner spinner-sm" style={{ display: 'inline-block', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', width: 18, height: 18, animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
                    Analyzing Profile &amp; Synthesizing Galaxies...
                  </>
                ) : (
                  '🚀 Compute 4 Custom Career Trajectories'
                )}
              </button>
            </motion.div>

            {/* Latest Generated Path Highlight */}
            {latest ? (
              <motion.div className="card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="chip chip-success">Latest Result</span>
                    <h3>Current Top Pathways</h3>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                    {new Date(latest.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 16, lineHeight: 1.6 }}>
                  {latest.summary?.slice(0, 180)}...
                </p>

                {/* 4 Cards Mini Matrix */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10, marginBottom: 'var(--space-5)' }}>
                  {latest.careerPaths?.map((cp) => (
                    <div key={cp.title} style={{ padding: 12, background: 'var(--color-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {cp.title}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Match</span>
                        <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--color-primary)' }}>{cp.fitScore}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <Link to={`/recommendations/${latest._id}`} className="btn btn-primary btn-sm" style={{ padding: '8px 18px' }}>
                    Open 3D Galaxy Viewer →
                  </Link>
                  <Link to="/history" className="btn btn-secondary btn-sm" style={{ padding: '8px 18px' }}>
                    View Archive
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="card"
                style={{ textAlign: 'center', padding: 'var(--space-10)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <div style={{ fontSize: '3rem', opacity: 0.6 }}>🔭</div>
                <h3 style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-3)' }}>No Career Matrix Generated Yet</h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginTop: 6 }}>
                  Configure your skills in Profile or choose one of our 1-click persona presets to view your recommendations.
                </p>
                <Link to="/profile" className="btn btn-secondary btn-sm" style={{ marginTop: 14 }}>
                  Setup Profile Now →
                </Link>
              </motion.div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
