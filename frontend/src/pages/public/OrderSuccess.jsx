import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './OrderSuccess.css';

const MOCK_ORDER = {
  orderNumber: 'MHD-2025-00042',
  estimatedDelivery: 'June 5 – June 8, 2025',
  email: 'sophie@example.com',
  total: 619.96,
  items: [
    { id:1, name:'Cashmere Blend Overcoat — Midnight', price:349, quantity:1, selectedSize:'M' },
    { id:4, name:'Leather Bifold Wallet — Cognac',     price:95,  quantity:2, selectedColor:'Cognac' },
    { id:5, name:'Botanical Candle Collection',         price:68,  quantity:1 },
  ],
};

export default function OrderSuccess() {
  const circleRef = useRef(null);

  /* Animate the checkmark circle on mount */
  useEffect(() => {
    const el = circleRef.current;
    if (el) {
      setTimeout(() => el.classList.add('os-check--visible'), 100);
    }
  }, []);

  return (
    <div className="os-page">
      <div className="os-inner">

        {/* ── Success icon ─────────────────────── */}
        <div className="os-check" ref={circleRef}>
          <svg className="os-check__svg" viewBox="0 0 52 52">
            <circle className="os-check__circle" cx="26" cy="26" r="25" fill="none"/>
            <path  className="os-check__tick"   fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>

        {/* ── Heading ──────────────────────────── */}
        <div className="os-heading">
          <span className="section-tag">Order Confirmed</span>
          <h1 className="os-title">Thank you for<br /><em>your order</em></h1>
          <p className="os-subtitle">
            We've received your order and sent a confirmation to <strong>{MOCK_ORDER.email}</strong>.
          </p>
        </div>

        {/* ── Order number card ─────────────────── */}
        <div className="os-order-card">
          <div className="os-order-card__row">
            <div className="os-order-card__block">
              <p className="os-order-card__label">Order number</p>
              <p className="os-order-card__val">{MOCK_ORDER.orderNumber}</p>
            </div>
            <div className="os-order-card__block">
              <p className="os-order-card__label">Estimated delivery</p>
              <p className="os-order-card__val">{MOCK_ORDER.estimatedDelivery}</p>
            </div>
            <div className="os-order-card__block">
              <p className="os-order-card__label">Order total</p>
              <p className="os-order-card__val os-order-card__val--gold">${MOCK_ORDER.total.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* ── Tracking steps ────────────────────── */}
        <div className="os-tracking">
          <h2 className="os-tracking__title">What happens next?</h2>
          <div className="os-tracking__steps">
            {[
              { icon: <ConfirmIcon />, label: 'Order Confirmed',   sub: 'We\'ve received and verified your order', done: true  },
              { icon: <ProcessIcon />, label: 'Being Prepared',    sub: 'Seller is picking and packing your items', done: false },
              { icon: <ShipIcon   />, label: 'Shipped',           sub: 'Your order is on its way to you',         done: false },
              { icon: <DelivIcon  />, label: 'Delivered',         sub: `Expected by ${MOCK_ORDER.estimatedDelivery}`, done: false },
            ].map(({ icon, label, sub, done }, i, arr) => (
              <div key={label} className="os-tracking__step">
                <div className={`os-tracking__icon ${done ? 'done' : ''}`}>{icon}</div>
                <div className="os-tracking__info">
                  <p className="os-tracking__step-label">{label}</p>
                  <p className="os-tracking__step-sub">{sub}</p>
                </div>
                {i < arr.length - 1 && <div className={`os-tracking__line ${done ? 'done' : ''}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* ── Items summary ─────────────────────── */}
        <div className="os-items">
          <h2 className="os-items__title">Items ordered</h2>
          <div className="os-items__list">
            {MOCK_ORDER.items.map(item => (
              <div key={item.id} className="os-item">
                <div className="os-item__img">
                  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="0.7" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                </div>
                <div className="os-item__info">
                  <p className="os-item__name">{item.name}</p>
                  <p className="os-item__meta">
                    Qty: {item.quantity}
                    {item.selectedSize  && ` · Size: ${item.selectedSize}`}
                    {item.selectedColor && ` · ${item.selectedColor}`}
                  </p>
                </div>
                <p className="os-item__price">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Actions ──────────────────────────── */}
        <div className="os-actions">
          <Link to="/profile/orders" className="btn-primary">
            Track Your Order
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </Link>
          <Link to="/products" className="btn-outline">
            Continue Shopping
          </Link>
        </div>

        {/* ── Support note ─────────────────────── */}
        <p className="os-support">
          Need help? <Link to="/contact">Contact our support team</Link> or email us at{' '}
          <a href="mailto:support@mhdstore.com">support@mhdstore.com</a>
        </p>

      </div>
    </div>
  );
}

/* Icons */
function ConfirmIcon() {
  return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>;
}
function ProcessIcon() {
  return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
}
function ShipIcon() {
  return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
}
function DelivIcon() {
  return <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
}
