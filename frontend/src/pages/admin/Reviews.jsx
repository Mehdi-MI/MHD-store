import { useState } from 'react';
import './AdminPages.css';

const MOCK_REVIEWS = [
  { id:1, product:'Cashmere Blend Overcoat', buyer:'Sophie L.', seller:'Maison Élite', rating:5, comment:'Absolutely impeccable quality. Worth every penny.', date:'May 15', status:'approved', helpful:12 },
  { id:2, product:'Leather Bifold Wallet',   buyer:'James M.',  seller:'Craft & Hide',  rating:5, comment:'Incredibly well made. The leather has aged beautifully.', date:'May 14', status:'approved', helpful:8  },
  { id:3, product:'Minimal Earbuds',         buyer:'Aiko K.',   seller:'TechVault',     rating:2, comment:'Stopped working after 2 weeks. Very disappointed.', date:'May 13', status:'flagged',  helpful:3  },
  { id:4, product:'Ceramic Vase Set',        buyer:'Clara D.',  seller:'Atelier Nord',  rating:4, comment:'Beautiful pieces, slightly smaller than expected.', date:'May 12', status:'approved', helpful:6  },
  { id:5, product:'Botanical Candles',       buyer:'Bob W.',    seller:'Grove & Wax',   rating:1, comment:'FAKE PRODUCT BUY ELSEWHERE!!! SCAM!!!', date:'May 11', status:'flagged',  helpful:0  },
  { id:6, product:'Rose Hip Serum',          buyer:'Marie P.',  seller:'Lumière Lab',   rating:5, comment:'My skin has never looked better. Genuinely magical.', date:'May 10', status:'approved', helpful:19 },
];

const RATING_STARS = (r) => '★'.repeat(r)+'☆'.repeat(5-r);
const STATUS_STYLES = {
  approved: { bg:'rgba(129,178,154,0.12)', color:'#81b29a' },
  flagged:  { bg:'rgba(224,122,95,0.12)',  color:'#e07a5f' },
  hidden:   { bg:'rgba(74,68,56,0.2)',     color:'#4A4438' },
};

export default function Reviews() {
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [filter,  setFilter]  = useState('all');
  const [search,  setSearch]  = useState('');

  const filtered = reviews.filter(r=>{
    const mF = filter==='all'||r.status===filter;
    const mS = !search||r.product.toLowerCase().includes(search.toLowerCase())||r.buyer.toLowerCase().includes(search.toLowerCase());
    return mF&&mS;
  });

  const updateStatus = (id, status) => setReviews(p=>p.map(r=>r.id===id?{...r,status}:r));
  const remove       = (id)         => setReviews(p=>p.filter(r=>r.id!==id));

  return (
    <div className="ap-page">
      <div className="ap-header">
        <div>
          <span className="section-tag">Admin</span>
          <h1 className="ap-title">Reviews <em>Moderation</em></h1>
        </div>
        <div className="ap-header__stats">
          <span>{reviews.filter(r=>r.status==='approved').length} approved</span>
          <span style={{color:'#e07a5f'}}>{reviews.filter(r=>r.status==='flagged').length} flagged</span>
        </div>
      </div>

      <div className="ap-toolbar">
        <div className="ap-filter-tabs">
          {['all','approved','flagged','hidden'].map(f=>(
            <button key={f} className={`ap-filter-tab ${filter===f?'active':''}`} onClick={()=>setFilter(f)}>
              {f.charAt(0).toUpperCase()+f.slice(1)}
              {f==='flagged'&&reviews.filter(r=>r.status==='flagged').length>0&&(
                <span className="ap-filter-tab__alert">{reviews.filter(r=>r.status==='flagged').length}</span>
              )}
            </button>
          ))}
        </div>
        <div className="ap-search">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="search" placeholder="Search reviews…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
      </div>

      <div className="ap-reviews-list">
        {filtered.map(r=>{
          const ss=STATUS_STYLES[r.status];
          return (
            <div key={r.id} className={`ap-review-card ${r.status==='flagged'?'ap-review-card--flagged':''}`}>
              <div className="ap-review-card__head">
                <div>
                  <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'0.3rem'}}>
                    <div className="ap-avatar ap-avatar--sm">{r.buyer.charAt(0)}</div>
                    <span className="ap-table__name">{r.buyer}</span>
                    <span style={{fontSize:'0.72rem',color:'var(--text-dim)'}}>on</span>
                    <span style={{fontSize:'0.82rem',color:'var(--text-muted)'}}>{r.product}</span>
                    <span style={{fontSize:'0.7rem',color:'var(--gold)'}}>{RATING_STARS(r.rating)}</span>
                  </div>
                  <p style={{fontSize:'0.72rem',color:'var(--text-dim)'}}>
                    Seller: {r.seller} · {r.date} · {r.helpful} found helpful
                  </p>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'0.75rem',flexShrink:0}}>
                  <span className="ap-badge" style={{background:ss.bg,color:ss.color}}>{r.status}</span>
                </div>
              </div>
              <p className="ap-review-card__comment">{r.comment}</p>
              <div className="ap-review-card__actions">
                {r.status==='flagged'&&(
                  <button className="ap-action-btn ap-action-btn--approve" onClick={()=>updateStatus(r.id,'approved')}>Approve</button>
                )}
                {r.status!=='hidden'&&(
                  <button className="ap-action-btn ap-action-btn--warn" onClick={()=>updateStatus(r.id,'hidden')}>Hide</button>
                )}
                {r.status==='hidden'&&(
                  <button className="ap-action-btn ap-action-btn--approve" onClick={()=>updateStatus(r.id,'approved')}>Restore</button>
                )}
                <button className="ap-action-btn ap-action-btn--danger" onClick={()=>remove(r.id)}>Delete</button>
              </div>
            </div>
          );
        })}
        {filtered.length===0&&<div className="ap-empty"><p>No reviews found</p></div>}
      </div>
    </div>
  );
}
