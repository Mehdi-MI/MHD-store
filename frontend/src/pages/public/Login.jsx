import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Auth.css';

export default function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || '/';

  const [form, setForm]       = useState({ email: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [apiError, setApiError] = useState('');

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: '' }));
    if (apiError)  setApiError('');
  };

  const validate = () => {
    const e = {};
    if (!form.email)                        e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password)                     e.password = 'Password is required';
    else if (form.password.length < 6)      e.password = 'Minimum 6 characters';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      // Replace with: await dispatch(loginUser(form)).unwrap();
      await new Promise(r => setTimeout(r, 800));
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(err?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-split">

        {/* ── Left panel (decorative) ── */}
        <div className="auth-visual" aria-hidden="true">
          <div className="auth-visual__inner">
            <Link to="/" className="auth-visual__logo">MHD<span>Store</span></Link>
            <div className="auth-visual__quote">
              <blockquote>"Commerce is the great leveller — quality speaks for itself."</blockquote>
              <cite>— MHD Store</cite>
            </div>
            <div className="auth-visual__grid">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="auth-visual__cell" />
              ))}
            </div>
          </div>
        </div>

        {/* ── Right panel (form) ── */}
        <div className="auth-form-panel">
          <div className="auth-form-wrap">

            {/* Header */}
            <div className="auth-header">
              <Link to="/" className="auth-back">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
                Back to store
              </Link>
              <span className="section-tag" style={{ marginTop: '2rem' }}>Welcome back</span>
              <h1 className="auth-title">Sign in to<br /><em>MHD Store</em></h1>
              <p className="auth-subtitle">
                Don't have an account?{' '}
                <Link to="/register" className="auth-link">Create one</Link>
              </p>
            </div>

            {/* API Error */}
            {apiError && (
              <div className="auth-alert" role="alert">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {apiError}
              </div>
            )}

            {/* Form */}
            <form className="auth-form" onSubmit={handleSubmit} noValidate>

              {/* Email */}
              <div className={`auth-field ${errors.email ? 'auth-field--error' : ''}`}>
                <label htmlFor="email" className="auth-label">Email address</label>
                <div className="auth-input-wrap">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input
                    id="email" type="email" autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                </div>
                {errors.email && <p id="email-error" className="auth-error">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className={`auth-field ${errors.password ? 'auth-field--error' : ''}`}>
                <div className="auth-label-row">
                  <label htmlFor="password" className="auth-label">Password</label>
                  <Link to="/forgot-password" className="auth-forgot">Forgot password?</Link>
                </div>
                <div className="auth-input-wrap">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    id="password" type={showPwd ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  <button type="button" className="auth-eye" onClick={() => setShowPwd(v => !v)}
                    aria-label={showPwd ? 'Hide password' : 'Show password'}>
                    {showPwd
                      ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
                {errors.password && <p id="password-error" className="auth-error">{errors.password}</p>}
              </div>

              {/* Remember me */}
              <label className="auth-remember">
                <input type="checkbox" />
                <span className="auth-remember__box" />
                <span>Remember me for 30 days</span>
              </label>

              {/* Submit */}
              <button type="submit" className="btn-primary auth-submit" disabled={loading}>
                {loading
                  ? <><span className="auth-spinner" />Signing in…</>
                  : 'Sign In'}
              </button>

              {/* Divider */}
              <div className="auth-divider"><span>or continue with</span></div>

              {/* OAuth */}
              <div className="auth-oauth">
                <button type="button" className="auth-oauth__btn">
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button type="button" className="auth-oauth__btn">
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
              </div>
            </form>

            {/* Footer */}
            <p className="auth-terms">
              By signing in, you agree to our{' '}
              <Link to="/terms">Terms of Service</Link> and{' '}
              <Link to="/privacy">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
