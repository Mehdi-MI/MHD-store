import { useState } from 'react';
import './AdminPages.css';

const MOCK_SELLERS = [
  { id:1, store:'Maison Élite',  owner:'James Morin',   category:'Fashion',      status:'approved',  products:12, revenue:24831, rating:4.9, joined:'2024-01-08' },
  { id:2, store:'Craft & Hide',  owner:'Sophie Laurent',category:'Fashion',      status:'approved',  products:8,  revenue:9420,  rating:4.7, joined:'2024-02-14' },
  { id:3, store:'Atelier Nord',  owner:'Aiko Kimura',   category:'Home',         status:'approved',  products:15, revenue:11240, rating:4.6, joined:'2024-03-01' },
  { id:4, store:'TechVault',     owner:'Bob Wilson',    category:'Electronics',  status:'approved',  products:22, revenue:31200, rating:4.5, joined:'2024-01-20' },
  { id:5, store:'Nordic Knit',   owner:'Erik Larsen',   category:'Home',         status:'pending',   products:0,  revenue:0,     rating:0,   joined:'2024-05-14' },
  { id:6, store:'Studio Blank',  owner:'Mei Chen',      category:'Art',          status:'pending',   products:0,  revenue:0,     rating:0,   joined:'2024-05-13' },
  { id:7, store:'Grove & Wax',   owner:'Clara Dubois',  category:'Beauty',       status:'suspended', products:6,  revenue:4200,  rating:4.2, joined:'2024-02-28' },
];

const STATUS_STYLES = {
  approved:  { bg:'rgba(129,178,154,0.12)', color:'#81b29a' },
  pending:   { bg:'rgba(242,204,143,0.12)', color:'#f2cc8f' },
  suspended: { bg:'rgba(224,122,95,0.12)',  color:'#e07a5f' },
  rejected:  { bg:'rgba(74,68,56,0.2)',     color:'#4A4438' },
};

export default function Sellers() {
  const [sellers, setSellers] = useState(MOCK_SELLERS);
  const [filter,  setFilter]  = useState('all');
  const [search,  setSearch]  = useState('');

  const filtered = sellers.filter(s=>{
    const mF = filter==='all'||s.status===filter;
    const mS = !search||s.store.toLowerCase().includes(search.toLowerCase())||s.owner.toLowerCase().includes(search.toLowerCase());
    return mF && mS;
  });

  const updateStatus = (id, status) => setSellers(p=>p.map(s=>s.id===id?{...s,status}:s));

  return (
    <div className="ap-page">
      <div className="ap-header">
        <div>
          <span className="section-tag">Admin</span>
          <h1 className="ap-title">Sellers <em>Management</em></h1>
        </div>
        <div className="ap-header__stats">
          <span style={{color:'#81b29a'}}>{sellers.filter(s=>s.status==='approved').length} approved</span>
          <span style={{color:'#f2cc8f'}}>{sellers.filter(s=>s.status==='pending').length} pending</span>
          <span style={{color:'#e07a5f'}}>{sellers.filter(s=>s.status==='suspended').length} suspended</span>
        </div>
      </div>

      <div className="ap-toolbar">
        <div className="ap-filter-tabs">
          {['all','approved','pending','suspended'].map(f=>(
            <button key={f} className={`ap-filter-tab ${filter===f?'active':''}`} onClick={()=>setFilter(f)}>
              {f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>
        <div className="ap-search">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="search" placeholder="Search sellers…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
      </div>

      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead>
            <tr>
              <th>Store</th><th>Owner</th><th>Category</th><th>Products</th>
              <th>Revenue</th><th>Rating</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s=>{
              const ss=STATUS_STYLES[s.status];
              return (
                <tr key={s.id}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
                      <div className="ap-avatar ap-avatar--store">{s.store.charAt(0)}</div>
                      <p className="ap-table__name">{s.store}</p>
                    </div>
                  </td>
                  <td className="ap-table__muted">{s.owner}</td>
                  <td className="ap-table__muted">{s.category}</td>
                  <td className="ap-table__muted">{s.products}</td>
                  <td className="ap-table__gold">{s.revenue>0?`$${s.revenue.toLocaleString()}`:'—'}</td>
                  <td className="ap-table__muted">
                    {s.rating>0?<><span style={{color:'var(--gold)'}}>★</span> {s.rating}</>:'—'}
                  </td>
                  <td><span className="ap-badge" style={{background:ss.bg,color:ss.color}}>{s.status}</span></td>
                  <td>
                    <div className="ap-table__actions">
                      {s.status==='pending'&&<>
                        <button className="ap-action-btn ap-action-btn--approve" onClick={()=>updateStatus(s.id,'approved')}>Approve</button>
                        <button className="ap-action-btn ap-action-btn--danger"  onClick={()=>updateStatus(s.id,'rejected')}>Reject</button>
                      </>}
                      {s.status==='approved'&&(
                        <button className="ap-action-btn ap-action-btn--warn" onClick={()=>updateStatus(s.id,'suspended')}>Suspend</button>
                      )}
                      {s.status==='suspended'&&(
                        <button className="ap-action-btn ap-action-btn--approve" onClick={()=>updateStatus(s.id,'approved')}>Restore</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length===0&&<div className="ap-empty"><p>No sellers found</p></div>}
      </div>
    </div>
  );
}
