import { useParams, Link } from 'react-router-dom';
import './CustomerPages.css';

const MOCK_ORDER = {
  id: 'MHD-2025-00042',
  date: '2025-05-15T10:32:00Z',
  status: 'delivered',
  paymentStatus: 'paid',
  paymentMethod: 'Visa ending in 4242',
  deliveredAt: '2025-05-19',
  tracking: { carrier:'DHL', number:'1234567890', url:'https://dhl.com' },
  shippingAddress: { fullName:'Sophie Laurent', addressLine1:'123 Rue de Rivoli', city:'Paris', postalCode:'75001', country:'France', phone:'+33 6 00 00 0001' },
  items: [
    { id:1, name:'Cashmere Blend Overcoat — Midnight', seller:'Maison Élite', price:349, quantity:1, selectedSize:'M', selectedColor:'Midnight' },
    { id:4, name:'Leather Bifold Wallet — Cognac',     seller:'Craft & Hide',  price:95,  quantity:2, selectedColor:'Cognac' },
    { id:5, name:'Botanical Candle Collection',         seller:'Grove & Wax',   price:68,  quantity:1 },
  ],
  subtotal: 607.00, shipping: 0, tax: 48.56, discount: 0, total: 655.56,
  timeline: [
    { status:'Order placed',    date:'May 15, 2025 · 10:32 AM', done:true  },
    { status:'Payment confirmed',date:'May 15, 2025 · 10:33 AM', done:true  },
    { status:'Order prepared',  date:'May 16, 2025 · 2:10 PM',  done:true  },
    { status:'Shipped',         date:'May 17, 2025 · 9:00 AM',  done:true  },
    { status:'Delivered',       date:'May 19, 2025 · 11:45 AM', done:true  },
  ],
};

const STATUS_COLORS = {
  delivered: { bg:'rgba(129,178,154,0.15)', color:'#81b29a' },
  shipped:   { bg:'rgba(201,168,76,0.12)',  color:'#C9A84C' },
  pending:   { bg:'rgba(242,204,143,0.12)', color:'#f2cc8f' },
  cancelled: { bg:'rgba(224,122,95,0.12)',  color:'#e07a5f' },
};

export default function OrderDetails() {
  const { id } = useParams();
  const order  = MOCK_ORDER; // replace with: useSelector + dispatch(fetchOrderById(id))
  const s = STATUS_COLORS[order.status] || STATUS_COLORS.pending;

  return (
    <div className="cp-page">
      {/* Breadcrumb */}
      <nav className="cp-breadcrumb">
        <Link to="/profile/orders">My Orders</Link>
        <span>›</span>
        <span>{order.id}</span>
      </nav>

      <div className="cp-header">
        <div>
          <span className="section-tag">Order</span>
          <h1 className="cp-title" style={{fontSize:'clamp(1.5rem,2.5vw,2rem)'}}>{order.id}</h1>
          <p className="cp-muted" style={{marginTop:'0.25rem'}}>
            Placed on {new Date(order.date).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}
          </p>
        </div>
        <span className="cp-status-badge" style={{ background: s.bg, color: s.color }}>
          {order.status.charAt(0).toUpperCase()+order.status.slice(1)}
        </span>
      </div>

      <div className="cp-od-layout">
        {/* Left column */}
        <div className="cp-od-left">

          {/* Timeline */}
          <div className="cp-card">
            <div className="cp-card__head"><h2 className="cp-card__title">Order Timeline</h2></div>
            <div className="cp-timeline">
              {order.timeline.map(({ status, date, done }, i) => (
                <div key={i} className={`cp-timeline-item ${done?'done':''}`}>
                  <div className="cp-timeline-item__dot" />
                  {i < order.timeline.length-1 && <div className="cp-timeline-item__line" />}
                  <div className="cp-timeline-item__info">
                    <p className="cp-timeline-item__status">{status}</p>
                    <p className="cp-timeline-item__date">{date}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tracking */}
            {order.tracking.number && (
              <div className="cp-tracking-box">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
                <div>
                  <p className="cp-tracking-box__label">{order.tracking.carrier} tracking</p>
                  <a href={order.tracking.url} target="_blank" rel="noopener noreferrer"
                    className="cp-tracking-box__num">{order.tracking.number}</a>
                </div>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="cp-card">
            <div className="cp-card__head"><h2 className="cp-card__title">Items Ordered</h2></div>
            <div className="cp-od-items">
              {order.items.map(item => (
                <div key={item.id} className="cp-od-item">
                  <div className="cp-od-item__img">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="0.8" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                  <div className="cp-od-item__info">
                    <Link to={`/products/${item.id}`} className="cp-od-item__name">{item.name}</Link>
                    <p className="cp-od-item__seller">{item.seller}</p>
                    <p className="cp-od-item__meta">
                      Qty: {item.quantity}
                      {item.selectedSize  && ` · Size: ${item.selectedSize}`}
                      {item.selectedColor && ` · ${item.selectedColor}`}
                    </p>
                  </div>
                  <p className="cp-od-item__price">${(item.price*item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="cp-od-right">

          {/* Price breakdown */}
          <div className="cp-card">
            <div className="cp-card__head"><h2 className="cp-card__title">Order Summary</h2></div>
            <div className="cp-price-lines">
              {[
                { label:'Subtotal',  val:`$${order.subtotal.toFixed(2)}`  },
                { label:'Shipping',  val: order.shipping===0 ? 'Free' : `$${order.shipping.toFixed(2)}` },
                { label:'Tax',       val:`$${order.tax.toFixed(2)}`       },
              ].map(({ label, val }) => (
                <div key={label} className="cp-price-line">
                  <span>{label}</span><span>{val}</span>
                </div>
              ))}
            </div>
            <div className="cp-price-total">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
            <div className="cp-payment-info">
              <p className="cp-info-label">Payment method</p>
              <p className="cp-info-val">{order.paymentMethod}</p>
              <span className="cp-payment-status cp-payment-status--paid">✓ Paid</span>
            </div>
          </div>

          {/* Shipping address */}
          <div className="cp-card">
            <div className="cp-card__head"><h2 className="cp-card__title">Shipped To</h2></div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.2rem' }}>
              <p className="cp-info-val">{order.shippingAddress.fullName}</p>
              <p className="cp-muted">{order.shippingAddress.addressLine1}</p>
              <p className="cp-muted">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
              <p className="cp-muted">{order.shippingAddress.country}</p>
              <p className="cp-muted">{order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Actions */}
          {order.status === 'delivered' && (
            <div className="cp-card">
              <div className="cp-card__head"><h2 className="cp-card__title">Actions</h2></div>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.65rem' }}>
                <button className="btn-outline cp-btn-sm" style={{justifyContent:'center'}}>Request Return</button>
                <button className="btn-outline cp-btn-sm" style={{justifyContent:'center'}}>Download Invoice</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
