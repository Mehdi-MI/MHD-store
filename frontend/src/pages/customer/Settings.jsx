import { useState } from 'react';
import './CustomerPages.css';

export default function Settings() {
  const [notifs, setNotifs] = useState({
    orderUpdates:   true,  promotions:    false,
    newArrivals:    true,  sellerNews:    false,
    priceDrops:     true,  newsletter:    false,
  });
  const [privacy, setPrivacy] = useState({
    showWishlist: false, showActivity: false,
  });
  const [lang,     setLang]     = useState('en');
  const [currency, setCurrency] = useState('USD');
  const [saved,    setSaved]    = useState(false);

  const toggleNotif  = (k) => setNotifs(n => ({ ...n, [k]: !n[k] }));
  const togglePrivacy= (k) => setPrivacy(p => ({ ...p, [k]: !p[k] }));

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 500));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="cp-page">
      <div className="cp-header">
        <div>
          <span className="section-tag">Account</span>
          <h1 className="cp-title">Account <em>Settings</em></h1>
        </div>
        {saved && <div className="cp-success-toast">✓ Settings saved</div>}
      </div>

      {/* Notifications */}
      <div className="cp-card">
        <div className="cp-card__head"><h2 className="cp-card__title">Notifications</h2></div>
        <p className="cp-muted" style={{marginBottom:'1.5rem'}}>Manage how and when we contact you.</p>
        <div className="cp-toggles">
          {[
            { k:'orderUpdates', label:'Order updates',    sub:'Shipping, delivery and status changes'   },
            { k:'promotions',   label:'Promotions',       sub:'Sales, discounts and special offers'     },
            { k:'newArrivals',  label:'New arrivals',     sub:'New products from sellers you follow'    },
            { k:'priceDrops',   label:'Price drops',      sub:'Items on your wishlist go on sale'       },
            { k:'sellerNews',   label:'Seller news',      sub:'Updates from your favourite sellers'     },
            { k:'newsletter',   label:'Newsletter',       sub:'Weekly editorial digest from MHD Store'  },
          ].map(({ k, label, sub }) => (
            <div key={k} className="cp-toggle-row">
              <div>
                <p className="cp-toggle-label">{label}</p>
                <p className="cp-toggle-sub">{sub}</p>
              </div>
              <button
                className={`cp-toggle ${notifs[k]?'cp-toggle--on':''}`}
                onClick={() => toggleNotif(k)}
                role="switch" aria-checked={notifs[k]}
                aria-label={label}>
                <span className="cp-toggle__thumb" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="cp-card">
        <div className="cp-card__head"><h2 className="cp-card__title">Privacy</h2></div>
        <div className="cp-toggles">
          {[
            { k:'showWishlist', label:'Public wishlist',  sub:'Allow others to see your wishlist'       },
            { k:'showActivity', label:'Activity status',  sub:'Show when you were last active'          },
          ].map(({ k, label, sub }) => (
            <div key={k} className="cp-toggle-row">
              <div>
                <p className="cp-toggle-label">{label}</p>
                <p className="cp-toggle-sub">{sub}</p>
              </div>
              <button
                className={`cp-toggle ${privacy[k]?'cp-toggle--on':''}`}
                onClick={() => togglePrivacy(k)}
                role="switch" aria-checked={privacy[k]}
                aria-label={label}>
                <span className="cp-toggle__thumb" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="cp-card">
        <div className="cp-card__head"><h2 className="cp-card__title">Preferences</h2></div>
        <div className="cp-form__grid">
          <div className="cp-field">
            <label className="cp-label">Language</label>
            <select className="cp-input cp-select" value={lang} onChange={e => setLang(e.target.value)}>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="es">Español</option>
              <option value="ja">日本語</option>
            </select>
          </div>
          <div className="cp-field">
            <label className="cp-label">Currency</label>
            <select className="cp-input cp-select" value={currency} onChange={e => setCurrency(e.target.value)}>
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
              <option value="GBP">GBP — British Pound</option>
              <option value="JPY">JPY — Japanese Yen</option>
              <option value="CAD">CAD — Canadian Dollar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Save */}
      <button className="btn-primary" style={{alignSelf:'flex-start'}} onClick={handleSave}>
        Save Settings
      </button>
    </div>
  );
}
