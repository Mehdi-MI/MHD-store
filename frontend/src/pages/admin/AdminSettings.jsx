import { useState } from 'react';
import './AdminPages.css';

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);

  const [general, setGeneral] = useState({
    siteName:'MHD Store', siteEmail:'admin@mhdstore.com',
    supportEmail:'support@mhdstore.com', currency:'USD',
    timezone:'Europe/Paris', maintenanceMode:false,
  });

  const [commission, setCommission] = useState({
    defaultRate:8, minRate:5, maxRate:20,
    payoutSchedule:'weekly', payoutMinAmount:50,
  });

  const [seller, setSeller] = useState({
    requireApproval:true, requireProductApproval:true,
    maxProductsPerSeller:100, allowedCategories:'all',
  });

  const [notifications, setNotifications] = useState({
    newSellerAlert:true, newOrderAlert:false,
    lowStockAlert:true, flaggedReviewAlert:true,
  });

  const [email, setEmail] = useState({
    provider:'smtp', smtpHost:'smtp.gmail.com', smtpPort:'587',
    smtpUser:'noreply@mhdstore.com',
  });

  const setG = (k,v) => setGeneral(p=>({...p,[k]:v}));
  const setC = (k,v) => setCommission(p=>({...p,[k]:v}));
  const setS = (k,v) => setSeller(p=>({...p,[k]:v}));
  const setN = (k,v) => setNotifications(p=>({...p,[k]:v}));
  const setE = (k,v) => setEmail(p=>({...p,[k]:v}));

  const handleSave = async () => {
    await new Promise(r=>setTimeout(r,600));
    setSaved(true); setTimeout(()=>setSaved(false),3000);
  };

  return (
    <div className="ap-page">
      <div className="ap-header">
        <div>
          <span className="section-tag">Admin</span>
          <h1 className="ap-title">Platform <em>Settings</em></h1>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
          {saved&&<span style={{color:'#81b29a',fontSize:'0.78rem'}}>✓ Settings saved</span>}
          <button className="btn-primary ap-btn-sm" onClick={handleSave}>Save All Changes</button>
        </div>
      </div>

      {/* General */}
      <div className="ap-card">
        <div className="ap-card__head"><h2 className="ap-card__title">General Settings</h2></div>
        <div className="ap-form">
          <div className="ap-grid-2">
            {[
              {k:'siteName',     label:'Site name',      type:'text' },
              {k:'siteEmail',    label:'Admin email',    type:'email'},
              {k:'supportEmail', label:'Support email',  type:'email'},
              {k:'timezone',     label:'Timezone',       type:'text' },
            ].map(({k,label,type})=>(
              <div key={k} className="ap-field">
                <label className="ap-label">{label}</label>
                <input className="ap-input" type={type} value={general[k]}
                  onChange={e=>setG(k,e.target.value)}/>
              </div>
            ))}
            <div className="ap-field">
              <label className="ap-label">Default currency</label>
              <select className="ap-input ap-select" value={general.currency} onChange={e=>setG('currency',e.target.value)}>
                {['USD','EUR','GBP','JPY','CAD'].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="ap-toggle-row">
            <div>
              <p className="ap-toggle-label">Maintenance Mode</p>
              <p className="ap-toggle-sub">Temporarily take the storefront offline for maintenance</p>
            </div>
            <button className={`ap-toggle ${general.maintenanceMode?'ap-toggle--on':''}`}
              onClick={()=>setG('maintenanceMode',!general.maintenanceMode)}
              role="switch" aria-checked={general.maintenanceMode}>
              <span className="ap-toggle__thumb"/>
            </button>
          </div>
          {general.maintenanceMode&&(
            <div className="ap-alert ap-alert--warn">
              ⚠ Maintenance mode is ON. The storefront is hidden from all visitors.
            </div>
          )}
        </div>
      </div>

      {/* Commission */}
      <div className="ap-card">
        <div className="ap-card__head"><h2 className="ap-card__title">Commission & Payouts</h2></div>
        <div className="ap-form">
          <div className="ap-grid-3">
            {[
              {k:'defaultRate',  label:'Default commission (%)', min:0, max:50 },
              {k:'minRate',      label:'Min rate (%)',            min:0, max:50 },
              {k:'maxRate',      label:'Max rate (%)',            min:0, max:50 },
              {k:'payoutMinAmount',label:'Min payout ($)',        min:0, max:1000},
            ].map(({k,label,min,max})=>(
              <div key={k} className="ap-field">
                <label className="ap-label">{label}</label>
                <input className="ap-input" type="number" min={min} max={max}
                  value={commission[k]} onChange={e=>setC(k,Number(e.target.value))}/>
              </div>
            ))}
            <div className="ap-field">
              <label className="ap-label">Payout schedule</label>
              <select className="ap-input ap-select" value={commission.payoutSchedule}
                onChange={e=>setC('payoutSchedule',e.target.value)}>
                {['daily','weekly','biweekly','monthly'].map(s=>(
                  <option key={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="ap-info-box">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Individual sellers can be assigned custom commission rates from their seller profile page.
          </div>
        </div>
      </div>

      {/* Seller settings */}
      <div className="ap-card">
        <div className="ap-card__head"><h2 className="ap-card__title">Seller Settings</h2></div>
        <div className="ap-form">
          <div className="ap-toggles">
            {[
              {k:'requireApproval',        label:'Require seller approval',        sub:'New sellers must be manually approved before going live'},
              {k:'requireProductApproval', label:'Require product approval',       sub:'New products must be reviewed before becoming visible'},
            ].map(({k,label,sub})=>(
              <div key={k} className="ap-toggle-row">
                <div>
                  <p className="ap-toggle-label">{label}</p>
                  <p className="ap-toggle-sub">{sub}</p>
                </div>
                <button className={`ap-toggle ${seller[k]?'ap-toggle--on':''}`}
                  onClick={()=>setS(k,!seller[k])} role="switch" aria-checked={seller[k]}>
                  <span className="ap-toggle__thumb"/>
                </button>
              </div>
            ))}
          </div>
          <div className="ap-field" style={{maxWidth:220}}>
            <label className="ap-label">Max products per seller</label>
            <input className="ap-input" type="number" min="1" max="1000"
              value={seller.maxProductsPerSeller} onChange={e=>setS('maxProductsPerSeller',Number(e.target.value))}/>
          </div>
        </div>
      </div>

      {/* Admin notifications */}
      <div className="ap-card">
        <div className="ap-card__head"><h2 className="ap-card__title">Admin Notifications</h2></div>
        <div className="ap-toggles">
          {[
            {k:'newSellerAlert',      label:'New seller application',  sub:'Alert when a new seller registers'},
            {k:'newOrderAlert',       label:'New order placed',        sub:'Alert on every new order'},
            {k:'lowStockAlert',       label:'Low stock warnings',      sub:'Alert when products drop below threshold'},
            {k:'flaggedReviewAlert',  label:'Flagged review',          sub:'Alert when a review is flagged for moderation'},
          ].map(({k,label,sub})=>(
            <div key={k} className="ap-toggle-row">
              <div>
                <p className="ap-toggle-label">{label}</p>
                <p className="ap-toggle-sub">{sub}</p>
              </div>
              <button className={`ap-toggle ${notifications[k]?'ap-toggle--on':''}`}
                onClick={()=>setN(k,!notifications[k])} role="switch" aria-checked={notifications[k]}>
                <span className="ap-toggle__thumb"/>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Email */}
      <div className="ap-card">
        <div className="ap-card__head"><h2 className="ap-card__title">Email Configuration</h2></div>
        <div className="ap-form">
          <div className="ap-field" style={{maxWidth:200}}>
            <label className="ap-label">Provider</label>
            <select className="ap-input ap-select" value={email.provider} onChange={e=>setE('provider',e.target.value)}>
              {['smtp','sendgrid','mailgun','ses'].map(p=><option key={p}>{p}</option>)}
            </select>
          </div>
          <div className="ap-grid-3">
            {[
              {k:'smtpHost',label:'SMTP host', placeholder:'smtp.gmail.com'},
              {k:'smtpPort',label:'SMTP port', placeholder:'587'},
              {k:'smtpUser',label:'From address', placeholder:'noreply@mhdstore.com'},
            ].map(({k,label,placeholder})=>(
              <div key={k} className="ap-field">
                <label className="ap-label">{label}</label>
                <input className="ap-input" type="text" placeholder={placeholder}
                  value={email[k]} onChange={e=>setE(k,e.target.value)}/>
              </div>
            ))}
          </div>
          <button className="btn-outline ap-btn-sm" style={{alignSelf:'flex-start'}}>Send Test Email</button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="ap-card ap-card--danger">
        <div className="ap-card__head">
          <h2 className="ap-card__title" style={{color:'#e07a5f'}}>Danger Zone</h2>
        </div>
        <div className="ap-form">
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'1rem',flexWrap:'wrap'}}>
            <div>
              <p style={{fontSize:'0.85rem',color:'var(--text)'}}>Clear all sessions</p>
              <p style={{fontSize:'0.75rem',color:'var(--text-dim)',marginTop:'0.15rem'}}>Force all users to re-login immediately</p>
            </div>
            <button className="ap-danger-btn">Clear Sessions</button>
          </div>
          <div className="ap-divider"/>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'1rem',flexWrap:'wrap'}}>
            <div>
              <p style={{fontSize:'0.85rem',color:'var(--text)'}}>Purge cache</p>
              <p style={{fontSize:'0.75rem',color:'var(--text-dim)',marginTop:'0.15rem'}}>Clear all server-side caches and CDN assets</p>
            </div>
            <button className="ap-danger-btn">Purge Cache</button>
          </div>
          <div className="ap-divider"/>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'1rem',flexWrap:'wrap'}}>
            <div>
              <p style={{fontSize:'0.85rem',color:'var(--text)'}}>Export all data</p>
              <p style={{fontSize:'0.75rem',color:'var(--text-dim)',marginTop:'0.15rem'}}>Download a full platform data export as CSV/JSON</p>
            </div>
            <button className="ap-danger-btn">Export Data</button>
          </div>
        </div>
      </div>

      {/* Save */}
      <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
        <button className="btn-primary" onClick={handleSave}>Save All Changes</button>
        {saved&&<span style={{color:'#81b29a',fontSize:'0.78rem'}}>✓ All settings saved successfully</span>}
      </div>
    </div>
  );
}
