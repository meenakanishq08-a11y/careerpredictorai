import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'At least 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await authAPI.register(form);
      login(res.data.data);
      toast.success('Account created! Welcome aboard 🎉');
      navigate('/profile');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
      <div className="orb" style={{ width: 350, height: 350, background: '#6366f1', top: '5%', right: '10%' }} />
      <div className="orb" style={{ width: 250, height: 250, background: '#06b6d4', bottom: '5%', left: '5%', animationDelay: '4s' }} />

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>🌟</div>
          <h2 className="auth-title" style={{ color: 'var(--color-text)' }}>Create Account</h2>
          <p className="auth-subtitle">Start your AI-powered career journey today</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {[
            { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Jane Doe' },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'jane@example.com' },
            { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
          ].map(({ name, label, type, placeholder }) => (
            <div className="form-group" key={name}>
              <label className="form-label">{label}</label>
              <input
                className="form-input"
                type={type} name={name} placeholder={placeholder}
                value={form[name]} onChange={handleChange}
                style={{ borderColor: errors[name] ? 'var(--color-danger)' : '' }}
              />
              {errors[name] && (
                <motion.p className="form-error" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                  {errors[name]}
                </motion.p>
              )}
            </div>
          ))}

          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <p className="auth-divider" style={{ marginTop: 'var(--space-6)', color: 'var(--color-text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
