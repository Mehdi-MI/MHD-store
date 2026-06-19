import { useState } from 'react';
import { Link } from 'react-router-dom';
import './SellerPages.css';

const MOCK_PRODUCTS = [
  { id:1,  name:'Cashmere Blend Overcoat — Midnight', price:349, stock:8,  status:'active',   sales:47, rating:4.9, badge:'New'  },
  { id:2,  name:'Linen Wide-Leg Trousers',            price:145, stock:22, status:'active',   sales:28, rating:4.6, badge:null   },
  { id:3,  name:'Merino Wool Scarf',                  price:89,  stock:31, status:'active',   sales:19, rating:4.7, badge:null   },
  { id:4,  name:'Silk Blouse — Ivory',                price:129, stock:5,  status:'active',   sales:12, rating:4.8, badge:null   },
  { id:5,  name:'Cashmere Roll-Neck',                 price:220, stock:0,  status:'archived', sales:8,  rating:4.5, badge:null   },
  { id:6,  name:'Wool Blend Blazer',                  price:310, stock:14, status:'draft',    sales:0,  rating:0,   badge:null   },
];

const STATUS_STYLES = {
  active:   { bg:'rgba(129,178,154,0.12)', color:'#81b29a' },
  draft:    { bg:'rgba(242,204,143,0.12)', color:'#f2cc8f' },
  archived: { bg:'rgba(74,68,56,0.2)',     color:'#4A4438' },
};

export default function MyProducts() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [filter,   setFilter]   = useState('all');
  const [search,   setSearch]   = useState('');
  const [selected, setSelected] = useState([]);

  const filtered = products.filter(p => {
    const matchFilter = filter === 'all' || p.status === filter;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const toggleSelect = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(i=>i!==id) : [...prev,id]);
  const selectAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map(p=>p.id));

  const bulkArchive = () => {
    setProducts(prev => prev.map(p => selected.includes(p.id) ? {...p,status:'archived'} : p));
    setSelected([]);
  };

  return (
    <div className="sl-page">
      <div className="sl-header">
        <div>
          <span className="section-tag">Seller Dashboard</span>
          <h1 className="sl-title">My <em>Products</em></h1>
        </div>
        <Link to="/seller/products/new" className="btn-primary sl-btn-sm">+ Add Product</Link>
      </div>

      {/* Toolbar */}
      <div className="sl-toolbar">
        <div className="sl-filter-tabs">
          {['all','active','draft','archived'].map(f => (
            <button key={f} className={`sl-filter-tab ${filter===f?'active':''}`}
              onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase()+f.slice(1)}
              <span className="sl-filter-tab__count">
                {f==='all' ? products.length : products.filter(p=>p.status===f).length}
              </span>
            </button>
          ))}
        </div>
        <div className="sl-toolbar__right">
          {selected.length > 0 && (
            <button className="sl-btn-ghost sl-btn-danger" onClick={bulkArchive}>
              Archive ({selected.length})
            </button>
          )}
          <div className="sl-search">
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="search" placeholder="Search products…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Products table */}
      <div className="sl-table-wrap">
        <table className="sl-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox"
                  checked={selected.length === filtered.length && filtered.length > 0}
                  onChange={selectAll} />
              </th>
              <th>Product</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Sales</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const s = STATUS_STYLES[p.status];
              return (
                <tr key={p.id} className={selected.includes(p.id)?'sl-table__row--selected':''}>
                  <td>
                    <input type="checkbox"
                      checked={selected.includes(p.id)}
                      onChange={() => toggleSelect(p.id)} />
                  </td>
                  <td>
                    <div className="sl-table__product">
                      <div className="sl-table__product-img">
                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="0.8" viewBox="0 0 24 24">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                      <div>
                        <p className="sl-table__product-name">{p.name}</p>
                        {p.badge && <span className="sl-table__badge">{p.badge}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="sl-table__price">${p.price}</td>
                  <td>
                    <span className={`sl-table__stock ${p.stock===0?'out':p.stock<=5?'low':''}`}>
                      {p.stock === 0 ? 'Out of stock' : p.stock}
                    </span>
                  </td>
                  <td className="sl-table__val">{p.sales}</td>
                  <td className="sl-table__val">
                    {p.rating > 0 ? <><span style={{color:'var(--gold)'}}>★</span> {p.rating}</> : '—'}
                  </td>
                  <td>
                    <span className="sl-table__status" style={{ background:s.bg, color:s.color }}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div className="sl-table__actions">
                      <Link to={`/seller/products/${p.id}/edit`} className="sl-table__action-btn">Edit</Link>
                      <button className="sl-table__action-btn sl-table__action-btn--danger"
                        onClick={() => setProducts(prev => prev.filter(x=>x.id!==p.id))}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="sl-empty">
            <p>No products found</p>
            <Link to="/seller/products/new" className="btn-outline sl-btn-sm">Add your first product</Link>
          </div>
        )}
      </div>
    </div>
  );
}
