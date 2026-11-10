import { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TiltCard from '../components/common/TiltCard';
import Spinner from '../components/common/Spinner';

const HeroScene = lazy(() => import('../components/3d/HeroScene'));

const features = [
  { icon: '🪐', title: 'Career Galaxy', desc: 'Explore your career options as an interactive 3D solar system. Each planet represents a path tailored for you.' },
  { icon: '🗺️', title: 'Roadmap Journey', desc: 'Get a personalized step-by-step roadmap. Track your progress on a 3D winding path.' },
  { icon: '🧪', title: 'What-If Simulator', desc: 'Add or remove skills to instantly see how your career fit scores change — no AI call needed.' },
  { icon: '⚖️', title: 'Career Compare', desc: 'Side-by-side comparison of any two career paths: fit scores, required and missing skills.' },
  { icon: '🤖', title: 'AI-Powered', desc: 'GPT-4o-mini analyzes your profile and generates deeply personalized career recommendations.' },
  { icon: '📊', title: 'Full History', desc: 'Track all your recommendations over time and see how your profile evolves.' },
];

const Landing = () => (
  <div>
    {/* Hero Section */}
    <section className="landing-hero" style={{ background: 'var(--gradient-hero)' }}>
      {/* 3D Scene */}
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>

      <div className="landing-hero-content" style={{ zIndex: 10, position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)',
            borderRadius: 999, padding: '6px 16px', marginBottom: 24,
            backdropFilter: 'blur(10px)',
          }}>
            <span style={{ fontSize: 12, color: '#a5b4fc', fontWeight: 600 }}>✨ AI-POWERED CAREER GUIDANCE</span>
          </div>

          <h1 className="landing-title" style={{ color: 'white' }}>
            Discover Your{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Perfect Career
            </span>
            <br />in 60 Seconds
          </h1>

          <p className="landing-subtitle">
            Tell us your skills, interests, and goals. Our AI analyzes your profile
            and maps out 4 personalized career paths — complete with roadmaps,
            resources, and an interactive 3D galaxy to explore.
          </p>

          <div className="landing-cta-group">
            <Link to="/register" className="btn btn-primary btn-lg" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
              🚀 Get Started Free
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
              Sign In
            </Link>
          </div>
        </motion.div>
      </div>
    </section>

    {/* Features Section */}
    <section className="landing-features" style={{ background: 'var(--color-bg)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}
        >
          <h2>Everything you need to <span className="glow-text">navigate your future</span></h2>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--space-4)', fontSize: 'var(--text-lg)' }}>
            Powerful tools to explore, plan, and track your career journey.
          </p>
        </motion.div>

        <div className="feature-grid">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <TiltCard>
                <div className="feature-card">
                  <div className="feature-icon">{f.icon}</div>
                  <h3 style={{ marginBottom: 'var(--space-2)', fontSize: 'var(--text-lg)' }}>{f.title}</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* CTA bottom */}
        <motion.div
          style={{ textAlign: 'center', marginTop: 'var(--space-16)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h2 style={{ marginBottom: 'var(--space-4)' }}>Ready to find your path?</h2>
          <Link to="/register" className="btn btn-primary btn-lg">
            Start for Free →
          </Link>
        </motion.div>
      </div>
    </section>
  </div>
);

export default Landing;
