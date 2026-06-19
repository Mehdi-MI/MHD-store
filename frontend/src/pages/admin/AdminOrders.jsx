import { useState } from 'react';
import './AdminPages.css';

const MOCK_ORDERS = [
  { id:'MHD-2025-00042', buyer:'Sophie L.',  seller:'Maison Élite', total:349, items:1, status:'delivered',  payment:'paid',    date:'May 15' },
  { id:'MHD-2025-00041', buyer:'James M.',   seller:'TechVault',    total:189, items:1, status:'shipped',    payment:'paid',    date:'May 15' },
  { id:'MHD-2025-00039', buyer:'Aiko K.',    seller:'Atelier Nord', total:124, items:1, status:'processing', payment:'paid',    date:'May 14' },
  { id:'MHD-2025-00038', buyer:'Clara D.',   seller:'Craft & Hide', total:95,  items:2, status:'pending',    payment:'paid',    date:'May 14' },
  { id:'MHD-2025-00035', buyer:'Bob W.',     seller:'Grove & Wax',  total:68,  items:1, status:'delivered',  payment:'paid',    date:'May 13' },
  { id:'MHD-2025-00031', buyer:'Marie P.',   seller:'TechVault',    total:299, items:1, status:'cancelled',  payment:'refunded',date:'May 12' },
  { id:'MHD-2025-00028', buyer:'Erik L.',    seller:'Maison Élite', total:220, items:1, status:'delivered',  payment:'paid',    date:'May 11' },
];

const STATUS_STYLES = {
  pending:    { bg:'rgba(242,204,143,0.12)', color:'#f2cc8f' },
  processing: { bg:'rgba(129,178,154,0.12)', color:'#81b29a' },
  shipped:    { bg:'rgba(201,168,76,0.12)',  color:'#C9A84C' },
  delivered:  { bg:'rgba(129,178,154,0.15)', color:'#81b29a' },
  cancelled:  { bg:'rgba(224,122,95,0.12)',  color:'#e07a5f' },
};

const PAYMENT_STYLES = {
  paid:     { color:'#81b29a' },
  refunded: { color:'#e07a5f' },
  pending:  { color:'#f2cc8f' },
};

export default function AdminOrders() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = MOCK_ORDERS.filter(o=>{
    const mF = filter==='all'||o.status===filter;
    const mS = !search||o.id.toLowerCase().includes(search.toLowerCase())||o.buyer.toLowerCase().includes(search.toLowerCase());
    return mF&&mS;
  });

  const total = MOCK_ORDERS.reduce((s,o)=>s+o.total,0);

  return (
    <div className="ap-page">
      <div className="ap-header">
        <div>
          <span className="section-tag">Admin</span>
          <h1 className="ap-title">Orders <em>Management</em></h1>
        </div>
        <div className="ap-header__stats">
          <span>{MOCK_ORDERS.length} total orders</span>
          <span style={{color:'var(--gold)'}}>${total.toLocaleString()} revenue</span>
          <span style={{color:'#e07a5f'}}>{MOCK_ORDERS.filter(o=>o.status==='cancelled').length} cancelled</span>
        </div>
      </div>

      <div className="ap-toolbar">
        <div className="ap-filter-tabs">
          {['all','pending','processing','shipped','delivered','cancelled'].map(f=>(
            <button key={f} className={`ap-filter-tab ${filter===f?'active':''}`} onClick={()=>setFilter(f)}>
              {f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>
        <div className="ap-search">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="search" placeholder="Search orders…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
      </div>

      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead>
            <tr><th>Order ID</th><th>Buyer</th><th>Seller</th><th>Date</th><th>Total</th><th>Items</th><th>Payment</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(o=>{
              const ss=STATUS_STYLES[o.status]||STATUS_STYLES.pending;
              const ps=PAYMENT_STYLES[o.payment]||{color:'var(--text-dim)'};
              return (
                <tr key={o.id}>
                  <td><span style={{fontFamily:'monospace',fontSize:'0.75rem',color:'var(--text-dim)'}}>{o.id}</span></td>
                  <td className="ap-table__muted">{o.buyer}</td>
                  <td className="ap-table__muted">{o.seller}</td>
                  <td className="ap-table__muted">{o.date}</td>
                  <td className="ap-table__gold">${o.total}</td>
                  <td className="ap-table__muted">{o.items}</td>
                  <td><span style={{fontSize:'0.72rem',color:ps.color,letterSpacing:'0.06em',textTransform:'uppercase'}}>{o.payment}</span></td>
                  <td><span className="ap-badge" style={{background:ss.bg,color:ss.color}}>{o.status}</span></td>
                  <td>
                    <div className="ap-table__actions">
                      <button className="ap-action-btn">View</button>
                      {o.status==='delivered'&&<button className="ap-action-btn">Invoice</button>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length===0&&<div className="ap-empty"><p>No orders found</p></div>}
      </div>
    </div>
  );
}
