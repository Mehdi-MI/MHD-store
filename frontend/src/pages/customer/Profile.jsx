import { useState } from 'react';
import './CustomerPages.css';

const MOCK_USER = {
  fullName: 'Sophie Laurent', email: 'sophie@example.com',
  phone: '+33 6 00 00 0001', avatar: null,
  joinedAt: '2024-03-15', totalOrders: 12, totalSpent: 1840,
};

export default function Profile() {
  const [form, setForm]     = useState({ fullName: MOCK_USER.fullName, email: MOCK_USER.email, phone: MOCK_USER.phone });
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    // dispatch(updateProfile(form))
    setSaving(false);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="cp-page">
      <div className="cp-header">
        <div>
          <span className="section-tag">Account</span>
          <h1 className="cp-title">My <em>Profile</em></h1>
        </div>
        {saved && <div className="cp-success-toast">✓ Profile updated</div>}
      </div>

      {/* Stats */}
      <div className="cp-stats">
        {[
          { label:'Member since', val: new Date(MOCK_USER.joinedAt).toLocaleDateString('en-GB',{month:'long',year:'numeric'}) },
          { label:'Total orders',  val: MOCK_USER.totalOrders },
          { label:'Total spent',   val: `$${MOCK_USER.totalSpent.toLocaleString()}` },
        ].map(({ label, val }) => (
          <div key={label} className="cp-stat">
            <span className="cp-stat__label">{label}</span>
            <span className="cp-stat__val">{val}</span>
          </div>
        ))}
      </div>

      {/* Avatar section */}
      <div className="cp-card">
        <div className="cp-card__head">
          <h2 className="cp-card__title">Profile Photo</h2>
        </div>
        <div className="cp-avatar-row">
          <div className="cp-avatar">
            {MOCK_USER.avatar
              ? <img src={MOCK_USER.avatar} alt={MOCK_USER.fullName} />
              : <span>{MOCK_USER.fullName.charAt(0)}</span>}
          </div>
          <div>
            <button className="btn-outline cp-btn-sm">Upload Photo</button>
            <p className="cp-hint">JPG, PNG or WebP. Max 2MB.</p>
          </div>
        </div>
      </div>

      {/* Personal info */}
      <div className="cp-card">
        <div className="cp-card__head">
          <h2 className="cp-card__title">Personal Information</h2>
          {!editing && (
            <button className="cp-edit-btn" onClick={() => setEditing(true)}>Edit</button>
          )}
        </div>

        {editing ? (
          <form className="cp-form" onSubmit={handleSave}>
            <div className="cp-form__grid">
              <div className="cp-field">
                <label className="cp-label">Full name</label>
                <input className="cp-input" type="text" value={form.fullName}
                  onChange={e => set('fullName', e.target.value)} />
              </div>
              <div className="cp-field">
                <label className="cp-label">Email address</label>
                <input className="cp-input" type="email" value={form.email}
                  onChange={e => set('email', e.target.value)} />
              </div>
              <div className="cp-field">
                <label className="cp-label">Phone number</label>
                <input className="cp-input" type="tel" value={form.phone}
                  onChange={e => set('phone', e.target.value)} />
              </div>
            </div>
            <div className="cp-form__actions">
              <button type="submit" className="btn-primary cp-btn-sm" disabled={saving}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
              <button type="button" className="btn-outline cp-btn-sm"
                onClick={() => { setEditing(false); setForm({ fullName: MOCK_USER.fullName, email: MOCK_USER.email, phone: MOCK_USER.phone }); }}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="cp-info-grid">
            {[
              { label:'Full name',   val: form.fullName },
              { label:'Email',       val: form.email    },
              { label:'Phone',       val: form.phone || '—' },
            ].map(({ label, val }) => (
              <div key={label} className="cp-info-row">
                <span className="cp-info-label">{label}</span>
                <span className="cp-info-val">{val}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Password */}
      <div className="cp-card">
        <div className="cp-card__head">
          <h2 className="cp-card__title">Password</h2>
          <button className="cp-edit-btn">Change Password</button>
        </div>
        <p className="cp-muted">Last changed 3 months ago</p>
      </div>

      {/* Danger zone */}
      <div className="cp-card cp-card--danger">
        <div className="cp-card__head">
          <h2 className="cp-card__title cp-card__title--danger">Danger Zone</h2>
        </div>
        <p className="cp-muted">Permanently delete your account and all associated data. This action cannot be undone.</p>
        <button className="cp-danger-btn">Delete Account</button>
      </div>
    </div>
  );
}
