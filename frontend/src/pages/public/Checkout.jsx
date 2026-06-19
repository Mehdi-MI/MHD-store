import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Checkout.css';

const MOCK_ITEMS = [
  { id:1, name:'Cashmere Blend Overcoat — Midnight', price:349, quantity:1, image:null, selectedSize:'M', selectedColor:'Midnight' },
  { id:4, name:'Leather Bifold Wallet — Cognac',     price:95,  quantity:2, image:null, selectedSize:null, selectedColor:'Cognac'   },
  { id:5, name:'Botanical Candle Collection',         price:68,  quantity:1, image:null, selectedSize:null, selectedColor:null       },
];

const STEPS = ['Shipping', 'Payment', 'Review'];

const COUNTRIES = ['United States','United Kingdom','France','Germany','Canada','Australia','Japan','Italy','Spain','Netherlands'];

export default function Checkout() {
  const navigate  = useNavigate();
  const [step,    setStep]    = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});

  const [shipping, setShipping] = useState({
    fullName:'', email:'', phone:'',
    country:'United States', city:'', state:'', postalCode:'', addressLine1:'', addressLine2:'',
    saveAddress: true,
  });

  const [payment, setPayment] = useState({
    method: 'card',   // 'card' | 'paypal'
    cardNumber:'', cardName:'', expiry:'', cvv:'',
    saveCard: false,
  });

  const setS = (k,v) => { setShipping(p=>({...p,[k]:v})); if(errors[k]) setErrors(e=>({...e,[k]:''})); };
  const setP = (k,v) => { setPayment(p=>({...p,[k]:v})); if(errors[k]) setErrors(e=>({...e,[k]:''})); };

  /* ── Calculations ── */
  const subtotal     = MOCK_ITEMS.reduce((s,i) => s+i.price*i.quantity, 0);
  const shippingCost = subtotal >= 150 ? 0 : 12;
  const tax          = Math.round(subtotal * 0.08 * 100) / 100;
  const total        = subtotal + shippingCost + tax;

  /* ── Validation ── */
  const validateShipping = () => {
    const e = {};
    if (!shipping.fullName.trim())    e.fullName    = 'Required';
    if (!shipping.email)              e.email       = 'Required';
    else if (!/\S+@\S+\.\S+/.test(shipping.email)) e.email = 'Invalid email';
    if (!shipping.phone.trim())       e.phone       = 'Required';
    if (!shipping.country)            e.country     = 'Required';
    if (!shipping.city.trim())        e.city        = 'Required';
    if (!shipping.postalCode.trim())  e.postalCode  = 'Required';
    if (!shipping.addressLine1.trim())e.addressLine1= 'Required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const validatePayment = () => {
    if (payment.method === 'paypal') return true;
    const e = {};
    if (!payment.cardNumber.replace(/\s/g,''))   e.cardNumber = 'Required';
    else if (payment.cardNumber.replace(/\s/g,'').length < 16) e.cardNumber = 'Invalid card number';
    if (!payment.cardName.trim())  e.cardName = 'Required';
    if (!payment.expiry)           e.expiry   = 'Required';
    if (!payment.cvv)              e.cvv      = 'Required';
    else if (payment.cvv.length < 3) e.cvv   = 'Invalid CVV';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const next = () => {
    if (step === 0 && !validateShipping()) return;
    if (step === 1 && !validatePayment())  return;
    setStep(s => s+1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const back = () => { setStep(s=>s-1); setErrors({}); };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1200));
      // dispatch(createOrder({ shipping, payment, items: MOCK_ITEMS }))
      navigate('/order/success');
    } catch {
      setErrors({ submit: 'Payment failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  /* ── Card number formatter ── */
  const formatCard = (v) => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
  const formatExpiry = (v) => {
    const d = v.replace(/\D/g,'').slice(0,4);
    return d.length > 2 ? d.slice(0,2)+'/'+d.slice(2) : d;
  };

  return (
    <div className="co-page">

      {/* ── Header ─────────────────────────────── */}
      <div className="co-header">
        <Link to="/" className="co-logo">MHD<span>Store</span></Link>
        <div className="co-stepper">
          {STEPS.map((label, i) => (
            <div key={label} className={`co-step ${i===step?'active':''} ${i<step?'done':''}`}>
              <div className="co-step__circle">
                {i < step
                  ? <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                  : i+1}
              </div>
              <span className="co-step__label">{label}</span>
              {i < STEPS.length-1 && <div className="co-step__line" />}
            </div>
          ))}
        </div>
        <Link to="/cart" className="co-header__back">← Back to cart</Link>
      </div>

      {/* ── Body ───────────────────────────────── */}
      <div className="co-body">

        {/* ── Left: form ──────────────────────── */}
        <div className="co-form-col">

          {/* STEP 0: Shipping */}
          {step === 0 && (
            <div className="co-section">
              <h2 className="co-section__title">Shipping Address</h2>

              <div className="co-grid-2">
                <div className={`co-field ${errors.fullName?'co-field--error':''}`}>
                  <label className="co-label">Full name *</label>
                  <input className="co-input" type="text" placeholder="Sophie Laurent"
                    value={shipping.fullName} onChange={e=>setS('fullName',e.target.value)} />
                  {errors.fullName && <p className="co-error">{errors.fullName}</p>}
                </div>
                <div className={`co-field ${errors.email?'co-field--error':''}`}>
                  <label className="co-label">Email *</label>
                  <input className="co-input" type="email" placeholder="you@example.com"
                    value={shipping.email} onChange={e=>setS('email',e.target.value)} />
                  {errors.email && <p className="co-error">{errors.email}</p>}
                </div>
              </div>

              <div className={`co-field ${errors.phone?'co-field--error':''}`}>
                <label className="co-label">Phone number *</label>
                <input className="co-input" type="tel" placeholder="+1 555 000 0000"
                  value={shipping.phone} onChange={e=>setS('phone',e.target.value)} />
                {errors.phone && <p className="co-error">{errors.phone}</p>}
              </div>

              <div className={`co-field ${errors.country?'co-field--error':''}`}>
                <label className="co-label">Country *</label>
                <select className="co-input co-select"
                  value={shipping.country} onChange={e=>setS('country',e.target.value)}>
                  {COUNTRIES.map(c=><option key={c}>{c}</option>)}
                </select>
              </div>

              <div className={`co-field ${errors.addressLine1?'co-field--error':''}`}>
                <label className="co-label">Address line 1 *</label>
                <input className="co-input" type="text" placeholder="123 Main Street"
                  value={shipping.addressLine1} onChange={e=>setS('addressLine1',e.target.value)} />
                {errors.addressLine1 && <p className="co-error">{errors.addressLine1}</p>}
              </div>

              <div className="co-field">
                <label className="co-label">Address line 2 <span className="co-optional">(optional)</span></label>
                <input className="co-input" type="text" placeholder="Apartment, suite, etc."
                  value={shipping.addressLine2} onChange={e=>setS('addressLine2',e.target.value)} />
              </div>

              <div className="co-grid-3">
                <div className={`co-field ${errors.city?'co-field--error':''}`}>
                  <label className="co-label">City *</label>
                  <input className="co-input" type="text" placeholder="New York"
                    value={shipping.city} onChange={e=>setS('city',e.target.value)} />
                  {errors.city && <p className="co-error">{errors.city}</p>}
                </div>
                <div className="co-field">
                  <label className="co-label">State</label>
                  <input className="co-input" type="text" placeholder="NY"
                    value={shipping.state} onChange={e=>setS('state',e.target.value)} />
                </div>
                <div className={`co-field ${errors.postalCode?'co-field--error':''}`}>
                  <label className="co-label">Postal code *</label>
                  <input className="co-input" type="text" placeholder="10001"
                    value={shipping.postalCode} onChange={e=>setS('postalCode',e.target.value)} />
                  {errors.postalCode && <p className="co-error">{errors.postalCode}</p>}
                </div>
              </div>

              <label className="co-checkbox">
                <input type="checkbox" checked={shipping.saveAddress}
                  onChange={e=>setS('saveAddress',e.target.checked)} />
                <span className="co-checkbox__box" />
                <span>Save this address for future orders</span>
              </label>
            </div>
          )}

          {/* STEP 1: Payment */}
          {step === 1 && (
            <div className="co-section">
              <h2 className="co-section__title">Payment Method</h2>

              {/* Method tabs */}
              <div className="co-payment-tabs">
                <button
                  className={`co-payment-tab ${payment.method==='card'?'active':''}`}
                  onClick={()=>setP('method','card')} type="button">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                  Credit / Debit Card
                </button>
                <button
                  className={`co-payment-tab ${payment.method==='paypal'?'active':''}`}
                  onClick={()=>setP('method','paypal')} type="button">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.076 21.337H4.42a.641.641 0 0 1-.633-.74L5.882 3.667a.641.641 0 0 1 .633-.544h5.367c2.398 0 4.064.533 4.95 1.583.871 1.03.995 2.37.37 3.985l-.018.049c-.682 1.9-1.918 3.22-3.675 3.929-.828.335-1.826.505-2.967.505H8.88l-.58 3.692a.641.641 0 0 1-.633.54l-.591-.069z"/>
                  </svg>
                  PayPal
                </button>
              </div>

              {/* Card form */}
              {payment.method === 'card' && (
                <div className="co-card-form">
                  <div className={`co-field ${errors.cardNumber?'co-field--error':''}`}>
                    <label className="co-label">Card number *</label>
                    <div className="co-card-input-wrap">
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
                        <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                      </svg>
                      <input className="co-input co-input--card" type="text"
                        placeholder="1234 5678 9012 3456" maxLength={19}
                        value={payment.cardNumber}
                        onChange={e=>setP('cardNumber',formatCard(e.target.value))} />
                    </div>
                    {errors.cardNumber && <p className="co-error">{errors.cardNumber}</p>}
                  </div>

                  <div className={`co-field ${errors.cardName?'co-field--error':''}`}>
                    <label className="co-label">Name on card *</label>
                    <input className="co-input" type="text" placeholder="Sophie Laurent"
                      value={payment.cardName} onChange={e=>setP('cardName',e.target.value)} />
                    {errors.cardName && <p className="co-error">{errors.cardName}</p>}
                  </div>

                  <div className="co-grid-2">
                    <div className={`co-field ${errors.expiry?'co-field--error':''}`}>
                      <label className="co-label">Expiry date *</label>
                      <input className="co-input" type="text" placeholder="MM/YY" maxLength={5}
                        value={payment.expiry}
                        onChange={e=>setP('expiry',formatExpiry(e.target.value))} />
                      {errors.expiry && <p className="co-error">{errors.expiry}</p>}
                    </div>
                    <div className={`co-field ${errors.cvv?'co-field--error':''}`}>
                      <label className="co-label">CVV *</label>
                      <input className="co-input" type="password" placeholder="•••" maxLength={4}
                        value={payment.cvv}
                        onChange={e=>setP('cvv',e.target.value.replace(/\D/g,'').slice(0,4))} />
                      {errors.cvv && <p className="co-error">{errors.cvv}</p>}
                    </div>
                  </div>

                  <label className="co-checkbox">
                    <input type="checkbox" checked={payment.saveCard}
                      onChange={e=>setP('saveCard',e.target.checked)} />
                    <span className="co-checkbox__box" />
                    <span>Save card for future purchases</span>
                  </label>

                  <div className="co-secure-note">
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    Your payment details are encrypted with 256-bit SSL
                  </div>
                </div>
              )}

              {payment.method === 'paypal' && (
                <div className="co-paypal-note">
                  <svg width="32" height="32" fill="var(--gold-dim)" viewBox="0 0 24 24">
                    <path d="M7.076 21.337H4.42a.641.641 0 0 1-.633-.74L5.882 3.667a.641.641 0 0 1 .633-.544h5.367c2.398 0 4.064.533 4.95 1.583.871 1.03.995 2.37.37 3.985l-.018.049c-.682 1.9-1.918 3.22-3.675 3.929-.828.335-1.826.505-2.967.505H8.88l-.58 3.692a.641.641 0 0 1-.633.54l-.591-.069z"/>
                  </svg>
                  <p>You will be redirected to PayPal to complete your payment securely after reviewing your order.</p>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Review */}
          {step === 2 && (
            <div className="co-section">
              <h2 className="co-section__title">Review Your Order</h2>

              {/* Shipping summary */}
              <div className="co-review-block">
                <div className="co-review-block__head">
                  <p className="co-review-block__label">Shipping to</p>
                  <button type="button" className="co-review-block__edit" onClick={()=>{setStep(0);setErrors({});}}>Edit</button>
                </div>
                <p className="co-review-block__val">{shipping.fullName}</p>
                <p className="co-review-block__val co-review-block__val--muted">
                  {shipping.addressLine1}{shipping.addressLine2?', '+shipping.addressLine2:''}, {shipping.city}{shipping.state?', '+shipping.state:''} {shipping.postalCode}, {shipping.country}
                </p>
                <p className="co-review-block__val co-review-block__val--muted">{shipping.email} · {shipping.phone}</p>
              </div>

              {/* Payment summary */}
              <div className="co-review-block">
                <div className="co-review-block__head">
                  <p className="co-review-block__label">Payment method</p>
                  <button type="button" className="co-review-block__edit" onClick={()=>{setStep(1);setErrors({});}}>Edit</button>
                </div>
                {payment.method === 'card'
                  ? <p className="co-review-block__val">Card ending in {payment.cardNumber.slice(-4) || '????'}</p>
                  : <p className="co-review-block__val">PayPal</p>}
              </div>

              {/* Items */}
              <div className="co-review-items">
                {MOCK_ITEMS.map(item => (
                  <div key={item.id} className="co-review-item">
                    <div className="co-review-item__img">
                      <div className="co-review-item__img-placeholder">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="0.8" viewBox="0 0 24 24">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                      <span className="co-review-item__qty">{item.quantity}</span>
                    </div>
                    <div className="co-review-item__info">
                      <p className="co-review-item__name">{item.name}</p>
                      <p className="co-review-item__meta">
                        {[item.selectedSize&&`Size: ${item.selectedSize}`, item.selectedColor&&`Colour: ${item.selectedColor}`].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                    <p className="co-review-item__price">${(item.price*item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {errors.submit && (
                <div className="co-error-alert">{errors.submit}</div>
              )}
            </div>
          )}

          {/* ── Navigation ──────────────────────── */}
          <div className="co-nav">
            {step > 0 && (
              <button type="button" className="btn-outline co-nav__back" onClick={back}>
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
                Back
              </button>
            )}
            {step < STEPS.length-1 ? (
              <button type="button" className="btn-primary co-nav__next" onClick={next}>
                Continue to {STEPS[step+1]}
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </button>
            ) : (
              <button type="button" className="btn-primary co-nav__next co-nav__place"
                onClick={handleSubmit} disabled={loading}>
                {loading
                  ? <><span className="co-spinner" />Processing…</>
                  : <>Place Order — ${total.toFixed(2)} <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></>
                }
              </button>
            )}
          </div>
        </div>

        {/* ── Right: order summary ─────────────── */}
        <aside className="co-summary">
          <h3 className="co-summary__title">Order Summary</h3>

          <div className="co-summary__items">
            {MOCK_ITEMS.map(item => (
              <div key={item.id} className="co-summary__item">
                <div className="co-summary__item-img">
                  <div className="co-summary__img-placeholder" />
                  <span className="co-summary__item-qty">{item.quantity}</span>
                </div>
                <p className="co-summary__item-name">{item.name}</p>
                <p className="co-summary__item-price">${(item.price*item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="co-summary__divider" />

          <div className="co-summary__lines">
            <div className="co-summary__line">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="co-summary__line">
              <span>Shipping</span>
              <span>{shippingCost===0 ? <span className="co-summary__free">Free</span> : `$${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="co-summary__line">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          </div>

          <div className="co-summary__divider" />

          <div className="co-summary__total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="co-summary__security">
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>Secure 256-bit SSL encryption</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
