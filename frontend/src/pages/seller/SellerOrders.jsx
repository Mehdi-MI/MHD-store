import { useState } from 'react';
import './SellerPages.css';

const MOCK_ORDERS = [
  { id:'MHD-2025-00042', product:'Cashmere Blend Overcoat', buyer:'Sophie L.', amount:349, qty:1, status:'delivered',  date:'May 15, 2025', size:'M', color:'Midnight' },
  { id:'MHD-2025-00039', product:'Linen Wide-Leg Trousers', buyer:'James M.',  amount:145, qty:1, status:'shipped',    date:'May 14, 2025', size:'S', color:null       },
  { id:'MHD-2025-00035', product:'Cashmere Blend Overcoat', buyer:'Aiko K.',   amount:349, qty:1, status:'processing', date:'May 13, 2025', size:'L', color:'Camel'    },
  { id:'MHD-2025-00031', product:'Merino Wool Scarf',        buyer:'Clara D.',  amount:89,  qty:2, status:'pending',    date:'May 12, 2025', size:null,color:null       },
  { id:'MHD-2025-00028', product:'Linen Wide-Leg Trousers', buyer:'Bob W.',    amount:145, qty:1, status:'delivered',  date:'May 11, 2025', size:'M', color:null       },
  { id:'MHD-2025-00021', product:'Silk Blouse — Ivory',     buyer:'Marie P.',  amount:129, qty:1, status:'cancelled',  date:'May 9, 2025',  size:'XS',color:'Ivory'   },
];

const STATUS_STYLES = {
  pending:    { bg:'rgba(242,204,143,0.12)', color:'#f2cc8f' },
  processing: { bg:'rgba(129,178,154,0.12)', color:'#81b29a' },
  shipped:    { bg:'rgba(201,168,76,0.12)',  color:'#C9A84C' },
  delivered:  { bg:'rgba(129,178,154,0.15)', color:'#81b29a' },
  cancelled:  { bg:'rgba(224,122,95,0.12)',  color:'#e07a5f' },
};

const NEXT_STATUS = {
  pending: 'processing', processing: 'shipped', shipped: 'delivered',
};

export default function SellerOrders() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = orders.filter(o => {
    const matchF = filter === 'all' || o.status === filter;
    const matchS = !search || o.id.includes(search) || o.buyer.toLowerCase().includes(search.toLowerCase()) || o.product.toLowerCase().includes(search.toLowerCase());
    return matchF && matchS;
  });

  const advance = (id) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      const next = NEXT_STATUS[o.status];
      return next ? {...o, status: next} : o;
    }));
  };

  return (
    <div className="sl-page">
      <div className="sl-header">
        <div>
          <span className="section-tag">Seller Dashboard</span>
          <h1 className="sl-title">My <em>Orders</em></h1>
        </div>
        <div className="sl-header__stats">
          {[
            { label:'Pending',   val: orders.filter(o=>o.status==='pending').length,    color:'#f2cc8f' },
            { label:'Shipped',   val: orders.filter(o=>o.status==='shipped').length,    color:'#C9A84C' },
            { label:'Delivered', val: orders.filter(o=>o.status==='delivered').length,  color:'#81b29a' },
          ].map(({ label, val, color }) => (
            <div key={label} className="sl-header__stat">
              <span style={{ color, fontFamily:'var(--font-display)', fontSize:'1.4rem', fontWeight:600 }}>{val}</span>
              <span className="sl-header__stat-label">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="sl-toolbar">
        <div className="sl-filter-tabs">
          {['all','pending','processing','shipped','delivered','cancelled'].map(f => (
            <button key={f} className={`sl-filter-tab ${filter===f?'active':''}`}
              onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>
        <div className="sl-search">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="search" placeholder="Search orders…"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="sl-table-wrap">
        <table className="sl-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Product</th>
              <th>Buyer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => {
              const s = STATUS_STYLES[o.status] || STATUS_STYLES.pending;
              const next = NEXT_STATUS[o.status];
              return (
                <tr key={o.id}>
                  <td><span className="sl-table__id">{o.id}</span></td>
                  <td>
                    <p className="sl-table__product-name" style={{fontSize:'0.82rem'}}>{o.product}</p>
                    <p style={{fontSize:'0.7rem',color:'var(--text-dim)',marginTop:'0.1rem'}}>
                      Qty: {o.qty}{o.size?` · ${o.size}`:''}{o.color?` · ${o.color}`:''}
                    </p>
                  </td>
                  <td style={{fontSize:'0.82rem',color:'var(--text-muted)'}}>{o.buyer}</td>
                  <td style={{fontSize:'0.75rem',color:'var(--text-dim)'}}>{o.date}</td>
                  <td className="sl-table__price">${o.amount}</td>
                  <td>
                    <span className="sl-table__status" style={{background:s.bg,color:s.color}}>
                      {o.status}
                    </span>
                  </td>
                  <td>
                    {next ? (
                      <button className="sl-table__action-btn" onClick={() => advance(o.id)}>
                        Mark {next}
                      </button>
                    ) : (
                      <span style={{fontSize:'0.7rem',color:'var(--text-dim)'}}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="sl-empty"><p>No orders found</p></div>
        )}
      </div>
    </div>
  );
}
