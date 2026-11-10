import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      login(res.data.data);
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  return (
    <div className="auth-page">
      <div className="animated-bg" />
      {/* Orbs */}
      <div className="orb" style={{ width: 300, height: 300, background: '#6366f1', top: '10%', left: '5%' }} />
      <div className="orb" style={{ width: 200, height: 200, background: '#06b6d4', bottom: '10%', right: '5%', animationDelay: '3s' }} />

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>🚀</div>
          <h2 className="auth-title" style={{ color: 'var(--color-text)' }}>Welcome Back</h2>
          <p className="auth-subtitle">Sign in to continue your career journey</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className={`form-input ${errors.email ? 'error' : ''}`}
              type="email" name="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange}
              style={{ borderColor: errors.email ? 'var(--color-danger)' : '' }}
            />
            {errors.email && (
              <motion.p className="form-error" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                {errors.email}
              </motion.p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password" name="password" placeholder="••••••••"
              value={form.password} onChange={handleChange}
              style={{ borderColor: errors.password ? 'var(--color-danger)' : '' }}
            />
            {errors.password && (
              <motion.p className="form-error" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                {errors.password}
              </motion.p>
            )}
          </div>

          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <p className="auth-divider" style={{ marginTop: 'var(--space-6)', color: 'var(--color-text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">Create one free</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
