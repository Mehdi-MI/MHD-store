import { useState } from 'react';
import './CustomerPages.css';

const MOCK_ADDRESSES = [
  { id:1, label:'Home',   fullName:'Sophie Laurent', addressLine1:'123 Rue de Rivoli', city:'Paris',    postalCode:'75001', country:'France',        phone:'+33 6 00 00 0001', isDefault:true  },
  { id:2, label:'Work',   fullName:'Sophie Laurent', addressLine1:'45 Avenue Montaigne',city:'Paris',   postalCode:'75008', country:'France',        phone:'+33 6 00 00 0001', isDefault:false },
  { id:3, label:'Other',  fullName:'Sophie Laurent', addressLine1:'88 Baker Street',   city:'London',   postalCode:'W1U 6TJ',country:'United Kingdom',phone:'+44 7911 000001', isDefault:false },
];

const EMPTY_FORM = { label:'Home', fullName:'', phone:'', country:'', city:'', state:'', postalCode:'', addressLine1:'', addressLine2:'' };

export default function Addresses() {
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES);
  const [showForm,  setShowForm]  = useState(false);
  const [editId,    setEditId]    = useState(null);
  const [form,      setForm]      = useState(EMPTY_FORM);
  const [errors,    setErrors]    = useState({});

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); if(errors[k]) setErrors(e=>({...e,[k]:''})); };

  const openAdd  = ()      => { setForm(EMPTY_FORM); setEditId(null); setErrors({}); setShowForm(true); };
  const openEdit = (addr)  => { setForm(addr); setEditId(addr.id); setErrors({}); setShowForm(true); };
  const cancel   = ()      => { setShowForm(false); setErrors({}); };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())     e.fullName     = 'Required';
    if (!form.phone.trim())        e.phone        = 'Required';
    if (!form.country.trim())      e.country      = 'Required';
    if (!form.city.trim())         e.city         = 'Required';
    if (!form.postalCode.trim())   e.postalCode   = 'Required';
    if (!form.addressLine1.trim()) e.addressLine1 = 'Required';
    setErrors(e); return !Object.keys(e).length;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (editId) {
      setAddresses(prev => prev.map(a => a.id === editId ? { ...form, id: editId } : a));
    } else {
      setAddresses(prev => [...prev, { ...form, id: Date.now(), isDefault: prev.length === 0 }]);
    }
    setShowForm(false);
  };

  const setDefault = (id) => setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
  const remove     = (id) => setAddresses(prev => prev.filter(a => a.id !== id));

  return (
    <div className="cp-page">
      <div className="cp-header">
        <div>
          <span className="section-tag">Account</span>
          <h1 className="cp-title">My <em>Addresses</em></h1>
        </div>
        {!showForm && (
          <button className="btn-primary cp-btn-sm" onClick={openAdd}>+ Add Address</button>
        )}
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div className="cp-card">
          <div className="cp-card__head">
            <h2 className="cp-card__title">{editId ? 'Edit Address' : 'New Address'}</h2>
          </div>
          <form className="cp-form" onSubmit={handleSave}>
            {/* Label */}
            <div className="cp-field">
              <label className="cp-label">Address label</label>
              <div className="cp-label-btns">
                {['Home','Work','Other'].map(l => (
                  <button type="button" key={l}
                    className={`cp-label-btn ${form.label===l?'active':''}`}
                    onClick={() => set('label',l)}>{l}</button>
                ))}
              </div>
            </div>
            <div className="cp-form__grid">
              {[
                { k:'fullName',     label:'Full name *',      type:'text',  placeholder:'Sophie Laurent' },
                { k:'phone',        label:'Phone *',          type:'tel',   placeholder:'+33 6 00 00 0001' },
                { k:'country',      label:'Country *',        type:'text',  placeholder:'France' },
                { k:'city',         label:'City *',           type:'text',  placeholder:'Paris' },
                { k:'state',        label:'State / Region',   type:'text',  placeholder:'Île-de-France' },
                { k:'postalCode',   label:'Postal code *',    type:'text',  placeholder:'75001' },
              ].map(({ k, label, type, placeholder }) => (
                <div key={k} className={`cp-field ${errors[k]?'error':''}`}>
                  <label className="cp-label">{label}</label>
                  <input className="cp-input" type={type} placeholder={placeholder}
                    value={form[k]||''} onChange={e=>set(k,e.target.value)} />
                  {errors[k] && <p className="cp-error">{errors[k]}</p>}
                </div>
              ))}
            </div>
            <div className="cp-field">
              <label className="cp-label">Address line 1 *</label>
              <input className={`cp-input ${errors.addressLine1?'error':''}`} type="text"
                placeholder="123 Main Street" value={form.addressLine1||''}
                onChange={e=>set('addressLine1',e.target.value)} />
              {errors.addressLine1 && <p className="cp-error">{errors.addressLine1}</p>}
            </div>
            <div className="cp-field">
              <label className="cp-label">Address line 2 <span style={{color:'var(--text-dim)',fontSize:'0.62rem'}}>(optional)</span></label>
              <input className="cp-input" type="text" placeholder="Apartment, suite…"
                value={form.addressLine2||''} onChange={e=>set('addressLine2',e.target.value)} />
            </div>
            <div className="cp-form__actions">
              <button type="submit" className="btn-primary cp-btn-sm">
                {editId ? 'Save Changes' : 'Add Address'}
              </button>
              <button type="button" className="btn-outline cp-btn-sm" onClick={cancel}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Address cards */}
      {addresses.length === 0 ? (
        <div className="cp-empty">
          <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="0.8" viewBox="0 0 24 24">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <p>No saved addresses yet</p>
        </div>
      ) : (
        <div className="cp-addresses-grid">
          {addresses.map(addr => (
            <div key={addr.id} className={`cp-address-card ${addr.isDefault?'cp-address-card--default':''}`}>
              {addr.isDefault && <span className="cp-address-card__badge">Default</span>}
              <div className="cp-address-card__label-tag">{addr.label}</div>
              <p className="cp-address-card__name">{addr.fullName}</p>
              <p className="cp-address-card__line">{addr.addressLine1}</p>
              {addr.addressLine2 && <p className="cp-address-card__line">{addr.addressLine2}</p>}
              <p className="cp-address-card__line">{addr.city}{addr.state?`, ${addr.state}`:''} {addr.postalCode}</p>
              <p className="cp-address-card__line">{addr.country}</p>
              <p className="cp-address-card__phone">{addr.phone}</p>
              <div className="cp-address-card__actions">
                <button className="cp-link-btn" onClick={() => openEdit(addr)}>Edit</button>
                {!addr.isDefault && (
                  <button className="cp-link-btn" onClick={() => setDefault(addr.id)}>Set as default</button>
                )}
                {!addr.isDefault && (
                  <button className="cp-link-btn cp-link-btn--danger" onClick={() => remove(addr.id)}>Remove</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
