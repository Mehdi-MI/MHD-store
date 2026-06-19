import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SellerRegister.css';

const STEPS = ['Account', 'Store', 'Details', 'Review'];

const CATEGORIES = [
  'Fashion & Apparel','Electronics','Home & Living',
  'Beauty & Care','Sports & Outdoor','Art & Collectibles',
  'Books & Stationery','Food & Drink','Other',
];

export default function SellerRegister() {
  const navigate  = useNavigate();
  const [step,    setStep]    = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});
  const [showPwd, setShowPwd] = useState(false);

  const [form, setForm] = useState({
    // Step 0 — Account
    fullName: '', email: '', password: '',
    // Step 1 — Store
    storeName: '', storeSlug: '', category: '', description: '',
    // Step 2 — Details
    phone: '', country: '', city: '', address: '',
    agreed: false,
  });

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: '' }));
    // Auto-generate slug from store name
    if (k === 'storeName') {
      setForm(f => ({
        ...f, storeName: v,
        storeSlug: v.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      }));
    }
  };

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!form.fullName.trim())            e.fullName = 'Required';
      if (!form.email)                      e.email    = 'Required';
      else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
      if (!form.password)                   e.password = 'Required';
      else if (form.password.length < 8)   e.password = 'Min 8 characters';
    }
    if (step === 1) {
      if (!form.storeName.trim())           e.storeName    = 'Required';
      if (!form.category)                   e.category     = 'Required';
      if (!form.description.trim())         e.description  = 'Required';
      else if (form.description.length < 30) e.description = 'Min 30 characters';
    }
    if (step === 2) {
      if (!form.phone.trim())               e.phone   = 'Required';
      if (!form.country.trim())             e.country = 'Required';
      if (!form.city.trim())                e.city    = 'Required';
    }
    if (step === 3) {
      if (!form.agreed)                     e.agreed = 'You must accept the seller agreement';
    }
    setErrors(e);
    return !Object.keys(e).length;
  };

  const next = () => { if (validateStep()) setStep(s => s + 1); };
  const back = () => { setStep(s => s - 1); setErrors({}); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setLoading(true);
    try {
      // Replace with: await sellerService.register(form)
      await new Promise(r => setTimeout(r, 1000));
      navigate('/seller/dashboard');
    } catch {
      setErrors({ submit: 'Something went wrong. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const charCount = form.description.length;

  return (
    <div className="sr-page">

      {/* ── Header ──────────────────────────────── */}
      <div className="sr-header">
        <Link to="/" className="sr-logo">MHD<span>Store</span></Link>
        <div className="sr-header__right">
          <span className="sr-header__label">Already a seller?</span>
          <Link to="/login" className="btn-outline sr-header__login">Sign In</Link>
        </div>
      </div>

      <div className="sr-body">

        {/* ── Left info panel ─────────────────── */}
        <aside className="sr-aside">
          <div className="sr-aside__inner">
            <span className="section-tag">For Sellers</span>
            <h2 className="sr-aside__title">
              Start selling on<br /><em>MHD Store</em>
            </h2>
            <p className="sr-aside__sub">
              Join 840+ independent sellers reaching thousands of discerning buyers every day.
            </p>

            <div className="sr-perks">
              {[
                { icon: '✦', title: 'Zero setup fee',       sub: 'Only pay a small commission when you sell' },
                { icon: '✦', title: 'Powerful dashboard',   sub: 'Manage products, orders and analytics in one place' },
                { icon: '✦', title: 'Fast payouts',         sub: 'Receive payments within 2 business days' },
                { icon: '✦', title: 'Global reach',         sub: 'Sell to buyers in 50+ countries worldwide' },
                { icon: '✦', title: 'Dedicated support',    sub: '24/7 seller support team at your disposal' },
              ].map(({ icon, title, sub }) => (
                <div key={title} className="sr-perk">
                  <span className="sr-perk__icon">{icon}</span>
                  <div>
                    <p className="sr-perk__title">{title}</p>
                    <p className="sr-perk__sub">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="sr-testimonial">
              <p className="sr-testimonial__text">
                "I went from zero to $12K/month in four months. The MHD dashboard makes managing everything effortless."
              </p>
              <div className="sr-testimonial__author">
                <div className="sr-testimonial__avatar">JM</div>
                <div>
                  <p className="sr-testimonial__name">James Morin</p>
                  <p className="sr-testimonial__role">Seller — Craft & Hide</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Right form ──────────────────────── */}
        <div className="sr-form-panel">

          {/* Progress stepper */}
          <div className="sr-stepper">
            {STEPS.map((label, i) => (
              <div key={label} className={`sr-step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
                <div className="sr-step__circle">
                  {i < step ? (
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : (i + 1)}
                </div>
                <span className="sr-step__label">{label}</span>
                {i < STEPS.length - 1 && <div className="sr-step__line" />}
              </div>
            ))}
          </div>

          <form className="sr-form" onSubmit={handleSubmit} noValidate>

            {/* ── Step 0: Account ─────────────── */}
            {step === 0 && (
              <div className="sr-step-body">
                <h3 className="sr-step-title">Create your account</h3>
                <p className="sr-step-sub">This will be your personal login to the seller dashboard.</p>

                <div className="sr-field">
                  <label className="sr-label">Full name</label>
                  <input className={`sr-input ${errors.fullName?'error':''}`} type="text"
                    placeholder="Sophie Laurent" value={form.fullName}
                    onChange={e => set('fullName', e.target.value)} />
                  {errors.fullName && <p className="sr-error">{errors.fullName}</p>}
                </div>

                <div className="sr-field">
                  <label className="sr-label">Email address</label>
                  <input className={`sr-input ${errors.email?'error':''}`} type="email"
                    placeholder="you@example.com" value={form.email}
                    onChange={e => set('email', e.target.value)} />
                  {errors.email && <p className="sr-error">{errors.email}</p>}
                </div>

                <div className="sr-field">
                  <label className="sr-label">Password</label>
                  <div className={`sr-input-wrap ${errors.password?'error':''}`}>
                    <input type={showPwd?'text':'password'}
                      placeholder="Min. 8 characters" value={form.password}
                      onChange={e => set('password', e.target.value)} />
                    <button type="button" onClick={() => setShowPwd(v=>!v)} className="sr-eye">
                      {showPwd
                        ? <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                        : <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      }
                    </button>
                  </div>
                  {errors.password && <p className="sr-error">{errors.password}</p>}
                </div>
              </div>
            )}

            {/* ── Step 1: Store ───────────────── */}
            {step === 1 && (
              <div className="sr-step-body">
                <h3 className="sr-step-title">Set up your store</h3>
                <p className="sr-step-sub">This is how buyers will discover and identify your store.</p>

                <div className="sr-field">
                  <label className="sr-label">Store name</label>
                  <input className={`sr-input ${errors.storeName?'error':''}`} type="text"
                    placeholder="e.g. Maison Élite" value={form.storeName}
                    onChange={e => set('storeName', e.target.value)} />
                  {errors.storeName && <p className="sr-error">{errors.storeName}</p>}
                </div>

                <div className="sr-field">
                  <label className="sr-label">Store URL</label>
                  <div className="sr-slug-wrap">
                    <span className="sr-slug-prefix">mhdstore.com/</span>
                    <input className="sr-input sr-input--slug" type="text"
                      value={form.storeSlug}
                      onChange={e => set('storeSlug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,''))} />
                  </div>
                </div>

                <div className="sr-field">
                  <label className="sr-label">Primary category</label>
                  <select className={`sr-input sr-select ${errors.category?'error':''}`}
                    value={form.category} onChange={e => set('category', e.target.value)}>
                    <option value="">Select a category…</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.category && <p className="sr-error">{errors.category}</p>}
                </div>

                <div className="sr-field">
                  <label className="sr-label">
                    Store description
                    <span className="sr-char-count">{charCount}/500</span>
                  </label>
                  <textarea className={`sr-input sr-textarea ${errors.description?'error':''}`}
                    placeholder="Tell buyers about your store, your products and what makes you unique…"
                    value={form.description} maxLength={500}
                    onChange={e => set('description', e.target.value)} rows={4} />
                  {errors.description && <p className="sr-error">{errors.description}</p>}
                </div>
              </div>
            )}

            {/* ── Step 2: Details ─────────────── */}
            {step === 2 && (
              <div className="sr-step-body">
                <h3 className="sr-step-title">Business details</h3>
                <p className="sr-step-sub">Required for payouts and shipping configuration.</p>

                <div className="sr-field">
                  <label className="sr-label">Phone number</label>
                  <input className={`sr-input ${errors.phone?'error':''}`} type="tel"
                    placeholder="+1 555 000 0000" value={form.phone}
                    onChange={e => set('phone', e.target.value)} />
                  {errors.phone && <p className="sr-error">{errors.phone}</p>}
                </div>

                <div className="sr-grid-2">
                  <div className="sr-field">
                    <label className="sr-label">Country</label>
                    <input className={`sr-input ${errors.country?'error':''}`} type="text"
                      placeholder="United States" value={form.country}
                      onChange={e => set('country', e.target.value)} />
                    {errors.country && <p className="sr-error">{errors.country}</p>}
                  </div>
                  <div className="sr-field">
                    <label className="sr-label">City</label>
                    <input className={`sr-input ${errors.city?'error':''}`} type="text"
                      placeholder="New York" value={form.city}
                      onChange={e => set('city', e.target.value)} />
                    {errors.city && <p className="sr-error">{errors.city}</p>}
                  </div>
                </div>

                <div className="sr-field">
                  <label className="sr-label">Business address <span className="sr-optional">(optional)</span></label>
                  <input className="sr-input" type="text"
                    placeholder="123 Main St, Suite 100" value={form.address}
                    onChange={e => set('address', e.target.value)} />
                </div>

                <div className="sr-info-box">
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  Your personal address is never shown to buyers. It's used solely for payout and tax purposes.
                </div>
              </div>
            )}

            {/* ── Step 3: Review ──────────────── */}
            {step === 3 && (
              <div className="sr-step-body">
                <h3 className="sr-step-title">Review & submit</h3>
                <p className="sr-step-sub">Review your details before submitting your seller application.</p>

                {/* Summary cards */}
                <div className="sr-summary">
                  <div className="sr-summary__card">
                    <p className="sr-summary__label">Account</p>
                    <p className="sr-summary__val">{form.fullName}</p>
                    <p className="sr-summary__val sr-summary__val--muted">{form.email}</p>
                    <button type="button" className="sr-summary__edit" onClick={() => { setStep(0); setErrors({}); }}>Edit</button>
                  </div>
                  <div className="sr-summary__card">
                    <p className="sr-summary__label">Store</p>
                    <p className="sr-summary__val">{form.storeName}</p>
                    <p className="sr-summary__val sr-summary__val--muted">{form.category}</p>
                    <button type="button" className="sr-summary__edit" onClick={() => { setStep(1); setErrors({}); }}>Edit</button>
                  </div>
                  <div className="sr-summary__card">
                    <p className="sr-summary__label">Location</p>
                    <p className="sr-summary__val">{form.city}, {form.country}</p>
                    <p className="sr-summary__val sr-summary__val--muted">{form.phone}</p>
                    <button type="button" className="sr-summary__edit" onClick={() => { setStep(2); setErrors({}); }}>Edit</button>
                  </div>
                </div>

                {/* Agreement */}
                <div className="sr-field">
                  <label className={`sr-agree ${errors.agreed?'sr-agree--error':''}`}>
                    <input type="checkbox" checked={form.agreed}
                      onChange={e => set('agreed', e.target.checked)} />
                    <span className="sr-agree__box" />
                    <span>
                      I have read and agree to the{' '}
                      <Link to="/seller-agreement" className="sr-link">Seller Agreement</Link>,{' '}
                      <Link to="/terms" className="sr-link">Terms of Service</Link> and{' '}
                      <Link to="/privacy" className="sr-link">Privacy Policy</Link>.
                    </span>
                  </label>
                  {errors.agreed && <p className="sr-error">{errors.agreed}</p>}
                </div>

                {errors.submit && (
                  <div className="auth-alert" role="alert">
                    {errors.submit}
                  </div>
                )}
              </div>
            )}

            {/* ── Navigation buttons ──────────── */}
            <div className="sr-nav">
              {step > 0 && (
                <button type="button" className="btn-outline sr-nav__back" onClick={back}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                  Back
                </button>
              )}
              {step < STEPS.length - 1 ? (
                <button type="button" className="btn-primary sr-nav__next" onClick={next}>
                  Continue
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </button>
              ) : (
                <button type="submit" className="btn-primary sr-nav__next" disabled={loading}>
                  {loading
                    ? <><span className="auth-spinner" />Submitting…</>
                    : <>Submit Application <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></>
                  }
                </button>
              )}
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
