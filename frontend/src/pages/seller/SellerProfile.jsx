import { useState } from 'react';
import './SellerPages.css';

const MOCK_SELLER = {
  storeName: 'Maison Élite', storeSlug: 'maison-elite',
  category: 'Fashion & Apparel', status: 'approved',
  description: 'Luxury fashion and apparel from independent designers worldwide. Each piece is hand-selected for quality and craftsmanship.',
  email: 'sophie@maisonelite.com', phone: '+33 1 00 00 0001', website: 'maisonelite.com',
  country: 'France', city: 'Paris', address: '45 Avenue Montaigne, 75008',
  socials: { instagram: '@maisonelite', twitter: '@maisonelite', facebook: '' },
  logo: null, banner: null,
  metrics: { totalProducts: 12, totalOrders: 187, totalRevenue: 24831, averageRating: 4.9, reviewCount: 128 },
  commissionRate: 8,
  payout: { method: 'stripe', stripeConnected: true, nextPayout: 'June 1, 2025', pendingAmount: 3420 },
};

export default function SellerProfile() {
  const [form, setForm]     = useState(MOCK_SELLER);
  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [tab,     setTab]     = useState('store'); // store | payout | security

  const set = (k, v) => setForm(f => ({...f, [k]: v}));
  const setSocial = (k, v) => setForm(f => ({...f, socials:{...f.socials,[k]:v}}));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    // sellerService.update(form)
    setSaving(false); setEditing(false); setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="sl-page">
      <div className="sl-header">
        <div>
          <span className="section-tag">Seller Dashboard</span>
          <h1 className="sl-title">Store <em>Profile</em></h1>
        </div>
        {saved && <span style={{color:'#81b29a',fontSize:'0.78rem'}}>✓ Profile updated</span>}
      </div>

      {/* Store metrics */}
      <div className="sl-kpis">
        {[
          { label:'Total Products', val: form.metrics.totalProducts },
          { label:'Total Orders',   val: form.metrics.totalOrders   },
          { label:'Total Revenue',  val: `$${form.metrics.totalRevenue.toLocaleString()}` },
          { label:'Average Rating', val: `${form.metrics.averageRating} ★` },
          { label:'Total Reviews',  val: form.metrics.reviewCount   },
          { label:'Commission Rate',val: `${form.commissionRate}%`  },
        ].map(({ label, val }) => (
          <div key={label} className="sl-kpi-card">
            <p className="sl-kpi-label">{label}</p>
            <p className="sl-kpi-val">{val}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="sl-profile-tabs">
        {[['store','Store Info'],['payout','Payout'],['security','Security']].map(([val,label]) => (
          <button key={val} className={`sl-profile-tab ${tab===val?'active':''}`}
            onClick={() => setTab(val)}>{label}</button>
        ))}
      </div>

      {/* Store Info tab */}
      {tab === 'store' && (
        <div className="sl-card">
          <div className="sl-card__head">
            <h2 className="sl-card__title">Store Information</h2>
            {!editing && (
              <button className="sl-link" onClick={() => setEditing(true)}>Edit</button>
            )}
          </div>

          {/* Banner & logo */}
          <div className="sl-profile-media">
            <div className="sl-profile-banner">
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="0.8" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              <p className="sl-profile-banner__label">Store Banner</p>
              <button className="sl-btn-ghost sl-btn-sm">Upload</button>
            </div>
            <div className="sl-profile-logo">
              <span>{form.storeName.charAt(0)}</span>
              <button className="sl-btn-ghost sl-btn-sm" style={{fontSize:'0.65rem'}}>Change</button>
            </div>
          </div>

          {editing ? (
            <form className="sl-form" onSubmit={handleSave}>
              <div className="sl-grid-2">
                <div className="sl-field">
                  <label className="sl-label">Store name</label>
                  <input className="sl-input" type="text" value={form.storeName}
                    onChange={e=>set('storeName',e.target.value)} />
                </div>
                <div className="sl-field">
                  <label className="sl-label">Category</label>
                  <input className="sl-input" type="text" value={form.category}
                    onChange={e=>set('category',e.target.value)} />
                </div>
                <div className="sl-field">
                  <label className="sl-label">Email</label>
                  <input className="sl-input" type="email" value={form.email}
                    onChange={e=>set('email',e.target.value)} />
                </div>
                <div className="sl-field">
                  <label className="sl-label">Phone</label>
                  <input className="sl-input" type="tel" value={form.phone}
                    onChange={e=>set('phone',e.target.value)} />
                </div>
                <div className="sl-field">
                  <label className="sl-label">Website</label>
                  <input className="sl-input" type="text" value={form.website}
                    onChange={e=>set('website',e.target.value)} />
                </div>
                <div className="sl-field">
                  <label className="sl-label">City, Country</label>
                  <input className="sl-input" type="text" value={`${form.city}, ${form.country}`}
                    onChange={e=>set('city',e.target.value)} />
                </div>
              </div>
              <div className="sl-field">
                <label className="sl-label">Store description</label>
                <textarea className="sl-input sl-textarea" rows={4} value={form.description}
                  onChange={e=>set('description',e.target.value)} />
              </div>
              <div className="sl-grid-3">
                {['instagram','twitter','facebook'].map(s => (
                  <div key={s} className="sl-field">
                    <label className="sl-label">{s.charAt(0).toUpperCase()+s.slice(1)}</label>
                    <input className="sl-input" type="text" value={form.socials[s]}
                      onChange={e=>setSocial(s,e.target.value)} />
                  </div>
                ))}
              </div>
              <div style={{display:'flex',gap:'0.75rem'}}>
                <button type="submit" className="btn-primary sl-btn-sm" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
                <button type="button" className="btn-outline sl-btn-sm" onClick={() => setEditing(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="sl-info-rows">
              {[
                { label:'Store name',   val:form.storeName   },
                { label:'Store URL',    val:`mhdstore.com/${form.storeSlug}` },
                { label:'Category',     val:form.category    },
                { label:'Description',  val:form.description },
                { label:'Email',        val:form.email       },
                { label:'Phone',        val:form.phone       },
                { label:'Website',      val:form.website     },
                { label:'Location',     val:`${form.city}, ${form.country}` },
                { label:'Instagram',    val:form.socials.instagram||'—' },
                { label:'Twitter',      val:form.socials.twitter||'—'   },
              ].map(({ label, val }) => (
                <div key={label} className="sl-info-row">
                  <span className="sl-info-label">{label}</span>
                  <span className="sl-info-val">{val}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Payout tab */}
      {tab === 'payout' && (
        <div className="sl-card">
          <div className="sl-card__head"><h2 className="sl-card__title">Payout Settings</h2></div>
          <div className="sl-payout-status">
            <div className="sl-payout-status__icon">
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <p style={{fontSize:'0.88rem',color:'var(--text)'}}>Stripe Connect — <span style={{color:'#81b29a'}}>Connected</span></p>
              <p style={{fontSize:'0.75rem',color:'var(--text-dim)',marginTop:'0.15rem'}}>Payouts to your bank via Stripe</p>
            </div>
            <button className="btn-outline sl-btn-sm" style={{marginLeft:'auto'}}>Manage in Stripe</button>
          </div>
          <div className="sl-info-rows">
            {[
              { label:'Payout method',  val:'Stripe Connect'              },
              { label:'Commission rate',val:`${form.commissionRate}% per sale` },
              { label:'Next payout',    val:form.payout.nextPayout        },
              { label:'Pending amount', val:`$${form.payout.pendingAmount.toLocaleString()}` },
            ].map(({ label, val }) => (
              <div key={label} className="sl-info-row">
                <span className="sl-info-label">{label}</span>
                <span className="sl-info-val">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security tab */}
      {tab === 'security' && (
        <div className="sl-card">
          <div className="sl-card__head"><h2 className="sl-card__title">Account Security</h2></div>
          <div className="sl-info-rows">
            <div className="sl-info-row">
              <span className="sl-info-label">Password</span>
              <button className="sl-link">Change Password</button>
            </div>
            <div className="sl-info-row">
              <span className="sl-info-label">Two-factor auth</span>
              <span style={{color:'#f2cc8f',fontSize:'0.78rem'}}>Not enabled</span>
            </div>
          </div>
          <button className="btn-outline sl-btn-sm">Enable 2FA</button>
          <div className="sl-card sl-card--danger" style={{marginTop:'1rem',border:'0.5px solid rgba(224,122,95,0.25)'}}>
            <div className="sl-card__head"><h3 style={{color:'#e07a5f',fontSize:'1rem'}}>Danger Zone</h3></div>
            <p style={{fontSize:'0.82rem',color:'var(--text-muted)'}}>Permanently close your seller account and remove all listings.</p>
            <button style={{alignSelf:'flex-start',padding:'0.55rem 1.25rem',background:'transparent',border:'0.5px solid rgba(224,122,95,0.4)',color:'#e07a5f',cursor:'pointer',fontSize:'0.72rem',letterSpacing:'0.1em',textTransform:'uppercase',fontFamily:'var(--font-body)'}}>
              Close Seller Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
