import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { profileAPI, recommendAPI } from '../services/api';
import SkillTagInput from '../components/common/SkillTagInput';
import Spinner from '../components/common/Spinner';

const STEPS = ['Education', 'Skills & Interests', 'Preferences'];

const emptyEdu = () => ({ degree: '', institution: '', year: '', score: '' });

const SAMPLE_PERSONAS = [
  {
    name: '🚀 Web Engineer',
    data: {
      education: [{ degree: 'B.Tech in Computer Science', institution: 'State Tech Institute', year: 2023, score: '3.8 GPA' }],
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'MongoDB', 'HTML5/CSS3', 'REST APIs', 'Git'],
      interests: ['Full-Stack Development', 'Cloud Architecture', 'Open Source', 'System Scalability'],
      experienceYears: 2,
      workStyle: 'hybrid',
      preferredDomains: ['Tech & SaaS', 'Startups', 'E-commerce'],
      careerGoal: 'Become a Senior Full-Stack Engineer and lead system architecture design.'
    }
  },
  {
    name: '🧠 AI / Data Specialist',
    data: {
      education: [{ degree: 'B.S. in Data Science & Mathematics', institution: 'University of Science', year: 2022, score: '3.9 GPA' }],
      skills: ['Python', 'SQL', 'PyTorch', 'Pandas', 'NumPy', 'Machine Learning', 'Data Visualization', 'Scikit-Learn'],
      interests: ['Generative AI', 'Deep Learning', 'Big Data', 'Predictive Modeling'],
      experienceYears: 2,
      workStyle: 'remote',
      preferredDomains: ['Artificial Intelligence', 'HealthTech', 'FinTech'],
      careerGoal: 'Build cutting-edge enterprise AI systems and production LLM pipelines.'
    }
  },
  {
    name: '🎨 Product Designer (UI/UX)',
    data: {
      education: [{ degree: 'B.Des in Interaction Design', institution: 'Design Academy', year: 2023, score: 'First Class' }],
      skills: ['Figma', 'UI Design', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Usability Testing'],
      interests: ['Design Systems', 'User Psychology', 'Micro-interactions', 'Accessibility (WCAG)'],
      experienceYears: 1,
      workStyle: 'hybrid',
      preferredDomains: ['Consumer Apps', 'SaaS', 'EdTech'],
      careerGoal: 'Lead end-to-end product design for high-impact consumer products.'
    }
  },
  {
    name: '💼 Product & Business Lead',
    data: {
      education: [{ degree: 'B.B.A. & Minor in Computer Applications', institution: 'School of Business', year: 2021, score: '3.7 GPA' }],
      skills: ['Product Strategy', 'Agile/Scrum', 'User Research', 'SQL Analytics', 'Roadmapping', 'PRD Writing', 'A/B Testing'],
      interests: ['Product Growth', 'Tech Innovation', 'Market Strategy', 'User Engagement'],
      experienceYears: 3,
      workStyle: 'hybrid',
      preferredDomains: ['FinTech', 'Enterprise Software', 'B2B SaaS'],
      careerGoal: 'Lead product strategy as a Senior PM or Director of Product.'
    }
  }
];

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [genLoad, setGenLoad] = useState(false);

  const [form, setForm] = useState({
    education: [emptyEdu()],
    skills: [],
    interests: [],
    experienceYears: 0,
    workStyle: 'hybrid',
    preferredDomains: [],
    careerGoal: '',
  });

  useEffect(() => {
    profileAPI.get().then((res) => {
      if (res.data.data) {
        const p = res.data.data;
        setForm({
          education: p.education?.length ? p.education : [emptyEdu()],
          skills: p.skills || [],
          interests: p.interests || [],
          experienceYears: p.experienceYears ?? 0,
          workStyle: p.workStyle || 'hybrid',
          preferredDomains: p.preferredDomains || [],
          careerGoal: p.careerGoal || '',
        });
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const updateEdu = (i, field, val) => {
    const edu = [...form.education];
    edu[i] = { ...edu[i], [field]: val };
    setForm({ ...form, education: edu });
  };

  const addEdu = () => setForm({ ...form, education: [...form.education, emptyEdu()] });
  const removeEdu = (i) => setForm({ ...form, education: form.education.filter((_, idx) => idx !== i) });

  const applyPersona = (persona) => {
    setForm({ ...persona.data });
    toast.success(`Loaded "${persona.name}" template! Click Save when ready.`);
  };

  const handleSave = async (autoNavigate = false) => {
    setSaving(true);
    try {
      await profileAPI.update(form);
      toast.success('Profile saved successfully! ✨');
      if (autoNavigate) {
        setGenLoad(true);
        const rec = await recommendAPI.generate();
        toast.success('Recommendations generated! 🚀');
        navigate(`/recommendations/${rec.data.data._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
      setGenLoad(false);
    }
  };

  if (loading) return <Spinner fullPage label="Loading profile..." />;

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: 860, padding: 'var(--space-8) var(--space-6)' }}>
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
            <h1>Your Career Profile</h1>
            <span className="chip chip-primary" style={{ padding: '6px 14px', fontSize: 13 }}>
              🎯 AI Calibration Profile
            </span>
          </div>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-6)', fontSize: 'var(--text-sm)' }}>
            The AI uses your background, specific skills, and career interests to generate 4 tailored paths with personalized roadmaps.
          </p>
        </motion.div>

        {/* 1-Click Sample Profiles Pill Bar */}
        <motion.div 
          className="card" 
          style={{ marginBottom: 'var(--space-8)', padding: 'var(--space-4) var(--space-5)', background: 'var(--color-bg-secondary)', border: '1px dashed var(--color-primary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ⚡ 1-Click Demo Profiles:
            </span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {SAMPLE_PERSONAS.map(p => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => applyPersona(p)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: 12, padding: '4px 10px' }}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Step Indicator */}
        <div className="step-indicator" style={{ marginBottom: 'var(--space-6)' }}>
          {STEPS.map((s, i) => (
            <div className="step-item" key={s}>
              <button
                type="button"
                className={`step-circle ${i === step ? 'active' : i < step ? 'done' : ''}`}
                onClick={() => setStep(i)}
              >
                {i < step ? '✓' : i + 1}
              </button>
              {i < STEPS.length - 1 && <div className={`step-line ${i < step ? 'done' : ''}`} />}
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)', color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: 'var(--text-sm)' }}>
          Step {step + 1} of {STEPS.length}: {STEPS[step]}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {/* STEP 0: Education */}
            {step === 0 && (
              <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
                  <div>
                    <h3>🎓 Academic Background</h3>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>Degrees, diplomas, certifications or ongoing studies</p>
                  </div>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={addEdu}>+ Add Degree</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {form.education.map((edu, i) => (
                    <div
                      key={i}
                      style={{
                        padding: 'var(--space-4)',
                        background: 'var(--color-bg)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <span style={{ fontWeight: 600, fontSize: 13, color: 'var(--color-text-secondary)' }}>Education Entry #{i + 1}</span>
                        {form.education.length > 1 && (
                          <button type="button" className="btn btn-danger btn-sm" onClick={() => removeEdu(i)}>Remove</button>
                        )}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
                        <div className="form-group">
                          <label className="form-label">Degree / Field</label>
                          <input
                            className="form-input"
                            placeholder="e.g. B.Tech Computer Science"
                            value={edu.degree}
                            onChange={(e) => updateEdu(i, 'degree', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Institution / College</label>
                          <input
                            className="form-input"
                            placeholder="e.g. Stanford / State University"
                            value={edu.institution}
                            onChange={(e) => updateEdu(i, 'institution', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Graduation Year</label>
                          <input
                            className="form-input"
                            type="number"
                            placeholder="2024"
                            value={edu.year}
                            onChange={(e) => updateEdu(i, 'year', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">GPA / Grade (Optional)</label>
                          <input
                            className="form-input"
                            placeholder="e.g. 3.8 / 85%"
                            value={edu.score}
                            onChange={(e) => updateEdu(i, 'score', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 1: Skills & Interests */}
            {step === 1 && (
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                    <h3>💡 Known Technical & Soft Skills</h3>
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{form.skills.length} added</span>
                  </div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', marginBottom: 12 }}>
                    Type a skill and press <b>Enter</b> or comma to tag it (e.g. Python, React, SQL, Cloud, Figma).
                  </p>
                  <SkillTagInput
                    value={form.skills}
                    onChange={(v) => setForm({ ...form, skills: v })}
                    placeholder="Type skill & press Enter (e.g. React, Python, Docker)..."
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                    <h3>🎯 Areas of Passion & Interest</h3>
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{form.interests.length} added</span>
                  </div>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', marginBottom: 12 }}>
                    What domains excite you most? (e.g. Artificial Intelligence, Web3, FinTech, Autonomous Systems).
                  </p>
                  <SkillTagInput
                    value={form.interests}
                    onChange={(v) => setForm({ ...form, interests: v })}
                    placeholder="Type interest & press Enter..."
                  />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                    <h3>🌐 Target Industry Sectors</h3>
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{form.preferredDomains.length} added</span>
                  </div>
                  <SkillTagInput
                    value={form.preferredDomains}
                    onChange={(v) => setForm({ ...form, preferredDomains: v })}
                    placeholder="e.g. SaaS, Startups, Gaming, HealthTech..."
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Preferences */}
            {step === 2 && (
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                  <div className="form-group">
                    <label className="form-label">📅 Relevant Experience (Years)</label>
                    <input
                      className="form-input"
                      type="number" min={0} max={40}
                      value={form.experienceYears}
                      onChange={(e) => setForm({ ...form, experienceYears: Number(e.target.value) })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">🏢 Work Arrangement</label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {['remote', 'hybrid', 'onsite'].map((style) => (
                        <button
                          key={style}
                          type="button"
                          className={`btn ${form.workStyle === style ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                          onClick={() => setForm({ ...form, workStyle: style })}
                          style={{ flex: 1, textTransform: 'capitalize' }}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">🎯 3-5 Year Career Objective & Vision</label>
                  <textarea
                    className="form-input"
                    placeholder="e.g. Want to lead architecture of large scale AI cloud applications and mentor junior engineers..."
                    rows={4}
                    value={form.careerGoal}
                    onChange={(e) => setForm({ ...form, careerGoal: e.target.value })}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer Navigation Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-8)', flexWrap: 'wrap', gap: 12 }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
          >
            ← Previous Step
          </button>

          <div style={{ display: 'flex', gap: 10 }}>
            {step < STEPS.length - 1 ? (
              <button type="button" className="btn btn-primary" onClick={() => setStep((s) => s + 1)}>
                Next Step →
              </button>
            ) : (
              <>
                <button type="button" className="btn btn-secondary" onClick={() => handleSave(false)} disabled={saving}>
                  {saving ? 'Saving...' : '💾 Save Changes'}
                </button>
                <button type="button" className="btn btn-primary" onClick={() => handleSave(true)} disabled={saving || genLoad}>
                  {genLoad ? 'Generating AI Paths...' : '🚀 Save & Generate AI Paths'}
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
