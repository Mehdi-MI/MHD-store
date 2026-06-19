import { useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminPages.css';

const MOCK_PRODUCTS = [
  { id:1,  name:'Cashmere Blend Overcoat',  seller:'Maison Élite',  category:'Fashion',     price:349, stock:8,  status:'active',   approved:true,  rating:4.9, sales:47  },
  { id:2,  name:'Minimal Wireless Earbuds', seller:'TechVault',     category:'Electronics', price:189, stock:34, status:'active',   approved:true,  rating:4.8, sales:94  },
  { id:3,  name:'Hand-Thrown Ceramic Vase', seller:'Atelier Nord',  category:'Home',        price:124, stock:12, status:'active',   approved:true,  rating:4.6, sales:61  },
  { id:4,  name:'Leather Bifold Wallet',    seller:'Craft & Hide',  category:'Fashion',     price:95,  stock:34, status:'active',   approved:true,  rating:4.7, sales:203 },
  { id:5,  name:'Botanical Candle Set',     seller:'Grove & Wax',   category:'Home',        price:68,  stock:22, status:'active',   approved:true,  rating:4.9, sales:317 },
  { id:6,  name:'Smart Watch Series X',     seller:'TechVault',     category:'Electronics', price:299, stock:18, status:'active',   approved:false, rating:0,   sales:0   },
  { id:7,  name:'Rose Hip Face Serum',      seller:'Lumière Lab',   category:'Beauty',      price:58,  stock:45, status:'active',   approved:true,  rating:4.8, sales:229 },
  { id:8,  name:'Yoga Mat — Rubber',        seller:'Form & Flow',   category:'Sports',      price:110, stock:0,  status:'archived', approved:true,  rating:4.9, sales:184 },
];

const STATUS_STYLES = {
  active:   { bg:'rgba(129,178,154,0.12)', color:'#81b29a' },
  draft:    { bg:'rgba(242,204,143,0.12)', color:'#f2cc8f' },
  archived: { bg:'rgba(74,68,56,0.2)',     color:'#4A4438' },
};

export default function AdminProducts() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [filter,   setFilter]   = useState('all');
  const [search,   setSearch]   = useState('');

  const filtered = products.filter(p=>{
    const mF = filter==='all'||(filter==='pending'&&!p.approved&&p.status==='active')||(filter!=='pending'&&p.status===filter);
    const mS = !search||p.name.toLowerCase().includes(search.toLowerCase())||p.seller.toLowerCase().includes(search.toLowerCase());
    return mF&&mS;
  });

  const approveProduct = (id) => setProducts(p=>p.map(x=>x.id===id?{...x,approved:true}:x));
  const removeProduct  = (id) => setProducts(p=>p.filter(x=>x.id!==id));
  const toggleFeatured = (id) => setProducts(p=>p.map(x=>x.id===id?{...x,isFeatured:!x.isFeatured}:x));

  const pendingCount = products.filter(p=>!p.approved&&p.status==='active').length;

  return (
    <div className="ap-page">
      <div className="ap-header">
        <div>
          <span className="section-tag">Admin</span>
          <h1 className="ap-title">Products <em>Management</em></h1>
        </div>
        <div className="ap-header__stats">
          <span>{products.filter(p=>p.status==='active'&&p.approved).length} active</span>
          {pendingCount>0&&<span style={{color:'#f2cc8f'}}>{pendingCount} pending approval</span>}
          <span style={{color:'var(--text-dim)'}}>{products.filter(p=>p.status==='archived').length} archived</span>
        </div>
      </div>

      <div className="ap-toolbar">
        <div className="ap-filter-tabs">
          {[['all','All'],['active','Active'],['pending','Pending Approval'],['archived','Archived']].map(([val,label])=>(
            <button key={val} className={`ap-filter-tab ${filter===val?'active':''}`} onClick={()=>setFilter(val)}>
              {label}
              {val==='pending'&&pendingCount>0&&<span className="ap-filter-tab__alert">{pendingCount}</span>}
            </button>
          ))}
        </div>
        <div className="ap-search">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="search" placeholder="Search products…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
      </div>

      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead>
            <tr>
              <th>Product</th><th>Seller</th><th>Category</th><th>Price</th>
              <th>Stock</th><th>Sales</th><th>Rating</th><th>Status</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p=>{
              const ss=STATUS_STYLES[p.status]||STATUS_STYLES.active;
              return (
                <tr key={p.id}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
                      <div className="ap-product-img">
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="0.8" viewBox="0 0 24 24">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                      <div>
                        <p className="ap-table__name">{p.name}</p>
                        {!p.approved&&<span className="ap-badge ap-badge--warn">Needs review</span>}
                      </div>
                    </div>
                  </td>
                  <td className="ap-table__muted">{p.seller}</td>
                  <td className="ap-table__muted">{p.category}</td>
                  <td className="ap-table__gold">${p.price}</td>
                  <td className="ap-table__muted">
                    <span style={{color:p.stock===0?'#e07a5f':p.stock<=5?'#f2cc8f':'inherit'}}>{p.stock}</span>
                  </td>
                  <td className="ap-table__muted">{p.sales}</td>
                  <td className="ap-table__muted">
                    {p.rating>0?<><span style={{color:'var(--gold)'}}>★</span> {p.rating}</>:'—'}
                  </td>
                  <td><span className="ap-badge" style={{background:ss.bg,color:ss.color}}>{p.status}</span></td>
                  <td>
                    <div className="ap-table__actions">
                      {!p.approved&&(
                        <button className="ap-action-btn ap-action-btn--approve" onClick={()=>approveProduct(p.id)}>Approve</button>
                      )}
                      <Link to={`/products/${p.id}`} className="ap-action-btn">View</Link>
                      <button className="ap-action-btn ap-action-btn--danger" onClick={()=>removeProduct(p.id)}>Remove</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length===0&&<div className="ap-empty"><p>No products found</p></div>}
      </div>
    </div>
  );
}
