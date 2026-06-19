import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';

/* ── Mock cart data — replace with useSelector(selectCartItems) ── */
const MOCK_ITEMS = [
  {
    id: 1, name: 'Cashmere Blend Overcoat — Midnight',
    price: 349, originalPrice: 480,
    image: null, quantity: 1,
    selectedSize: 'M', selectedColor: 'Midnight',
    seller: { store_name: 'Maison Élite' },
    stock: 8,
  },
  {
    id: 4, name: 'Leather Bifold Wallet — Cognac',
    price: 95, originalPrice: 130,
    image: null, quantity: 2,
    selectedSize: null, selectedColor: 'Cognac',
    seller: { store_name: 'Craft & Hide' },
    stock: 34,
  },
  {
    id: 5, name: 'Botanical Candle Collection',
    price: 68, originalPrice: null,
    image: null, quantity: 1,
    selectedSize: null, selectedColor: null,
    seller: { store_name: 'Grove & Wax' },
    stock: 12,
  },
];

const SHIPPING_THRESHOLD = 150;
const SHIPPING_COST      = 12.00;

export default function Cart() {
  const navigate = useNavigate();
  const [items,   setItems]   = useState(MOCK_ITEMS);
  const [coupon,  setCoupon]  = useState('');
  const [couponApplied, setCouponApplied] = useState(null);
  const [couponError,   setCouponError]   = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [removingId,    setRemovingId]    = useState(null);

  /* ── Calculations ── */
  const subtotal       = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discountAmount = couponApplied
    ? couponApplied.type === 'percentage'
      ? (subtotal * couponApplied.value) / 100
      : couponApplied.value
    : 0;
  const afterDiscount  = subtotal - discountAmount;
  const shippingCost   = afterDiscount >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total          = afterDiscount + shippingCost;
  const totalItems     = items.reduce((s, i) => s + i.quantity, 0);
  const savings        = items.reduce((s, i) => {
    if (!i.originalPrice) return s;
    return s + (i.originalPrice - i.price) * i.quantity;
  }, 0);

  /* ── Handlers ── */
  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.min(qty, i.stock) } : i));
    // dispatch(updateQuantity({ productId: id, quantity: qty }))
  };

  const removeItem = async (id) => {
    setRemovingId(id);
    await new Promise(r => setTimeout(r, 400));
    setItems(prev => prev.filter(i => i.id !== id));
    setRemovingId(null);
    // dispatch(removeFromCart(id))
  };

  const clearCart = () => {
    setItems([]);
    setCouponApplied(null);
    // dispatch(clearCart())
  };

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    await new Promise(r => setTimeout(r, 600));
    // Replace with: const res = await couponService.validate(coupon)
    if (coupon.toUpperCase() === 'WELCOME10') {
      setCouponApplied({ code: 'WELCOME10', type: 'percentage', value: 10, label: '10% off' });
    } else if (coupon.toUpperCase() === 'SAVE20') {
      setCouponApplied({ code: 'SAVE20', type: 'fixed', value: 20, label: '$20 off' });
    } else {
      setCouponError('Invalid or expired coupon code.');
    }
    setCouponLoading(false);
  };

  const removeCoupon = () => {
    setCouponApplied(null);
    setCoupon('');
    setCouponError('');
  };

  if (items.length === 0) {
    return <CartEmpty />;
  }

  return (
    <div className="cart-page">

      {/* ── Header ─────────────────────────────── */}
      <div className="cart-header">
        <div className="cart-header__inner">
          <div>
            <span className="section-tag">Your Cart</span>
            <h1 className="cart-header__title">
              Shopping <em>Cart</em>
            </h1>
          </div>
          <div className="cart-header__meta">
            <span className="cart-header__count">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
            <button className="cart-header__clear" onClick={clearCart}>Clear cart</button>
          </div>
        </div>
      </div>

      {/* ── Body ───────────────────────────────── */}
      <div className="cart-body">

        {/* ── Items list ─────────────────────── */}
        <div className="cart-items">

          {/* Progress bar */}
          {afterDiscount < SHIPPING_THRESHOLD && (
            <div className="cart-shipping-bar">
              <div className="cart-shipping-bar__text">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
                Add <strong>${(SHIPPING_THRESHOLD - afterDiscount).toFixed(2)}</strong> more for free shipping
              </div>
              <div className="cart-shipping-bar__track">
                <div
                  className="cart-shipping-bar__fill"
                  style={{ width: `${Math.min((afterDiscount / SHIPPING_THRESHOLD) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {afterDiscount >= SHIPPING_THRESHOLD && (
            <div className="cart-shipping-bar cart-shipping-bar--unlocked">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              You've unlocked <strong>free shipping!</strong>
            </div>
          )}

          {/* Cart items */}
          {items.map(item => (
            <div
              key={item.id}
              className={`cart-item ${removingId === item.id ? 'cart-item--removing' : ''}`}
            >
              {/* Image */}
              <div className="cart-item__img">
                {item.image
                  ? <img src={item.image} alt={item.name} />
                  : (
                    <div className="cart-item__img-placeholder">
                      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="0.8" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                  )}
              </div>

              {/* Info */}
              <div className="cart-item__info">
                <p className="cart-item__seller">{item.seller.store_name}</p>
                <Link to={`/products/${item.id}`} className="cart-item__name">
                  {item.name}
                </Link>
                <div className="cart-item__variants">
                  {item.selectedSize  && <span>Size: <strong>{item.selectedSize}</strong></span>}
                  {item.selectedColor && <span>Colour: <strong>{item.selectedColor}</strong></span>}
                </div>

                {/* Mobile price */}
                <div className="cart-item__price-mobile">
                  <span className="cart-item__price">${(item.price * item.quantity).toFixed(2)}</span>
                  {item.originalPrice && (
                    <span className="cart-item__original">${(item.originalPrice * item.quantity).toFixed(2)}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="cart-item__actions">
                  {/* Qty stepper */}
                  <div className="cart-item__qty">
                    <button
                      className="cart-item__qty-btn"
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >−</button>
                    <span className="cart-item__qty-val">{item.quantity}</span>
                    <button
                      className="cart-item__qty-btn"
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      aria-label="Increase quantity"
                    >+</button>
                  </div>

                  <button className="cart-item__remove" onClick={() => removeItem(item.id)}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4h6v2"/>
                    </svg>
                    Remove
                  </button>

                  <Link to={`/profile/wishlist`} className="cart-item__save">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                    Save for later
                  </Link>
                </div>
              </div>

              {/* Desktop price */}
              <div className="cart-item__price-col">
                <span className="cart-item__price">${(item.price * item.quantity).toFixed(2)}</span>
                {item.originalPrice && (
                  <span className="cart-item__original">${(item.originalPrice * item.quantity).toFixed(2)}</span>
                )}
                {item.originalPrice && (
                  <span className="cart-item__saving">
                    Save ${((item.originalPrice - item.price) * item.quantity).toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          ))}

          {/* Continue shopping */}
          <div className="cart-continue">
            <Link to="/products" className="btn-ghost">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* ── Order summary ───────────────────── */}
        <aside className="cart-summary">
          <h2 className="cart-summary__title">Order Summary</h2>

          {/* Coupon */}
          <div className="cart-coupon">
            <p className="cart-coupon__label">Coupon Code</p>
            {couponApplied ? (
              <div className="cart-coupon__applied">
                <div className="cart-coupon__applied-info">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span><strong>{couponApplied.code}</strong> — {couponApplied.label}</span>
                </div>
                <button className="cart-coupon__remove" onClick={removeCoupon}>×</button>
              </div>
            ) : (
              <div className="cart-coupon__input-wrap">
                <input
                  type="text"
                  className={`cart-coupon__input ${couponError ? 'error' : ''}`}
                  placeholder="Enter code (try WELCOME10)"
                  value={coupon}
                  onChange={e => { setCoupon(e.target.value.toUpperCase()); setCouponError(''); }}
                  onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                />
                <button
                  className="cart-coupon__apply"
                  onClick={applyCoupon}
                  disabled={couponLoading || !coupon.trim()}
                >
                  {couponLoading ? '…' : 'Apply'}
                </button>
              </div>
            )}
            {couponError && <p className="cart-coupon__error">{couponError}</p>}
          </div>

          <div className="cart-summary__divider" />

          {/* Line items */}
          <div className="cart-summary__lines">
            <div className="cart-summary__line">
              <span>Subtotal ({totalItems} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="cart-summary__line cart-summary__line--discount">
                <span>Coupon ({couponApplied.code})</span>
                <span>−${discountAmount.toFixed(2)}</span>
              </div>
            )}
            {savings > 0 && (
              <div className="cart-summary__line cart-summary__line--savings">
                <span>You're saving</span>
                <span>${savings.toFixed(2)}</span>
              </div>
            )}
            <div className="cart-summary__line">
              <span>Shipping</span>
              <span>
                {shippingCost === 0
                  ? <span className="cart-summary__free">Free</span>
                  : `$${shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="cart-summary__line cart-summary__line--tax">
              <span>Tax</span>
              <span>Calculated at checkout</span>
            </div>
          </div>

          <div className="cart-summary__divider" />

          {/* Total */}
          <div className="cart-summary__total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          {/* Checkout CTA */}
          <button
            className="btn-primary cart-summary__checkout"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </button>

          {/* Trust badges */}
          <div className="cart-summary__trust">
            {[
              { icon: '🔒', text: 'SSL Secure Checkout' },
              { icon: '↩', text: '30-Day Free Returns' },
              { icon: '🚚', text: 'Free shipping over $150' },
            ].map(({ icon, text }) => (
              <div key={text} className="cart-summary__trust-item">
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Payment icons */}
          <div className="cart-summary__payments">
            {['Visa', 'Mastercard', 'PayPal', 'Stripe'].map(p => (
              <span key={p} className="cart-summary__payment-badge">{p}</span>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ── Empty cart state ── */
function CartEmpty() {
  return (
    <div className="cart-empty">
      <div className="cart-empty__icon">
        <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="0.7" viewBox="0 0 24 24">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
      </div>
      <h2>Your cart is empty</h2>
      <p>Looks like you haven't added anything yet.</p>
      <Link to="/products" className="btn-primary">
        Start Shopping
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
        </svg>
      </Link>
      <div className="cart-empty__suggestions">
        <p>Or browse a category</p>
        <div className="cart-empty__cats">
          {['Fashion','Electronics','Home & Living','Beauty'].map(c => (
            <Link key={c} to={`/categories/${c.toLowerCase().replace(/ & /g,'-').replace(/ /g,'-')}`} className="cart-empty__cat">
              {c}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
