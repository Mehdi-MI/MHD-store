import { useState } from 'react';
import { Link } from 'react-router-dom';
import './CustomerPages.css';

const MOCK_ORDERS = [
  { id:'MHD-2025-00042', date:'2025-05-15', status:'delivered',  total:619.96, items:3, image:null },
  { id:'MHD-2025-00031', date:'2025-04-28', status:'shipped',    total:189.00, items:1, image:null },
  { id:'MHD-2025-00018', date:'2025-03-10', status:'delivered',  total:95.00,  items:2, image:null },
  { id:'MHD-2025-00009', date:'2025-02-20', status:'cancelled',  total:349.00, items:1, image:null },
  { id:'MHD-2025-00003', date:'2025-01-05', status:'delivered',  total:124.00, items:1, image:null },
];

const STATUS_COLORS = {
  pending:    { bg:'rgba(242,204,143,0.12)', color:'#f2cc8f', label:'Pending'    },
  confirmed:  { bg:'rgba(129,178,154,0.12)', color:'#81b29a', label:'Confirmed'  },
  processing: { bg:'rgba(129,178,154,0.12)', color:'#81b29a', label:'Processing' },
  shipped:    { bg:'rgba(201,168,76,0.12)',  color:'#C9A84C', label:'Shipped'    },
  delivered:  { bg:'rgba(129,178,154,0.15)', color:'#81b29a', label:'Delivered'  },
  cancelled:  { bg:'rgba(224,122,95,0.12)',  color:'#e07a5f', label:'Cancelled'  },
  refunded:   { bg:'rgba(139,111,48,0.12)',  color:'#8B6F30', label:'Refunded'   },
};

const FILTERS = ['All','Pending','Shipped','Delivered','Cancelled'];

export default function Orders() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = MOCK_ORDERS.filter(o => {
    const matchFilter = filter === 'All' || o.status === filter.toLowerCase();
    const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="cp-page">
      <div className="cp-header">
        <div>
          <span className="section-tag">Account</span>
          <h1 className="cp-title">My <em>Orders</em></h1>
        </div>
      </div>

      {/* Filters & search */}
      <div className="cp-toolbar">
        <div className="cp-filter-tabs">
          {FILTERS.map(f => (
            <button key={f}
              className={`cp-filter-tab ${filter===f?'active':''}`}
              onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
        <div className="cp-search">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="search" placeholder="Search by order number…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="cp-empty">
          <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="0.8" viewBox="0 0 24 24">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
          </svg>
          <p>No orders found</p>
          <Link to="/products" className="btn-outline cp-btn-sm">Start Shopping</Link>
        </div>
      ) : (
        <div className="cp-orders-list">
          {filtered.map(order => {
            const s = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
            return (
              <div key={order.id} className="cp-order-card">
                {/* Image placeholder */}
                <div className="cp-order-card__img">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="0.8" viewBox="0 0 24 24">
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                </div>

                <div className="cp-order-card__info">
                  <div className="cp-order-card__top">
                    <span className="cp-order-card__num">{order.id}</span>
                    <span className="cp-order-card__status"
                      style={{ background: s.bg, color: s.color }}>
                      {s.label}
                    </span>
                  </div>
                  <p className="cp-order-card__meta">
                    {new Date(order.date).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}
                    {' · '}{order.items} item{order.items!==1?'s':''}
                  </p>
                  <p className="cp-order-card__total">${order.total.toFixed(2)}</p>
                </div>

                <div className="cp-order-card__actions">
                  <Link to={`/profile/orders/${order.id}`} className="btn-outline cp-btn-sm">
                    View Details
                  </Link>
                  {order.status === 'delivered' && (
                    <button className="cp-link-btn">Write a review</button>
                  )}
                  {(order.status === 'pending' || order.status === 'confirmed') && (
                    <button className="cp-link-btn cp-link-btn--danger">Cancel order</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
