import { useState } from 'react';
import './SellerPages.css';

const MOCK_INVENTORY = [
  { id:1, name:'Cashmere Blend Overcoat — Midnight', sku:'ME-OC-001-MID', stock:8,  lowThreshold:5,  variants:[{size:'XS',stock:2},{size:'S',stock:2},{size:'M',stock:2},{size:'L',stock:1},{size:'XL',stock:1}] },
  { id:2, name:'Linen Wide-Leg Trousers',            sku:'ME-TR-002',     stock:22, lowThreshold:10, variants:[{size:'XS',stock:5},{size:'S',stock:7},{size:'M',stock:6},{size:'L',stock:4}] },
  { id:3, name:'Merino Wool Scarf',                  sku:'ME-SC-003',     stock:31, lowThreshold:10, variants:[] },
  { id:4, name:'Silk Blouse — Ivory',                sku:'ME-BL-004-IVY', stock:5,  lowThreshold:5,  variants:[{size:'XS',stock:2},{size:'S',stock:2},{size:'M',stock:1}] },
  { id:5, name:'Cashmere Roll-Neck',                 sku:'ME-RN-005',     stock:0,  lowThreshold:5,  variants:[] },
  { id:6, name:'Wool Blend Blazer',                  sku:'ME-BZ-006',     stock:14, lowThreshold:5,  variants:[{size:'S',stock:4},{size:'M',stock:5},{size:'L',stock:3},{size:'XL',stock:2}] },
];

export default function Inventory() {
  const [inventory, setInventory] = useState(MOCK_INVENTORY);
  const [editId,    setEditId]    = useState(null);
  const [editStock, setEditStock] = useState('');
  const [filter,    setFilter]    = useState('all');
  const [expanded,  setExpanded]  = useState(null);

  const filtered = inventory.filter(p => {
    if (filter === 'low')  return p.stock > 0 && p.stock <= p.lowThreshold;
    if (filter === 'out')  return p.stock === 0;
    return true;
  });

  const saveStock = (id) => {
    const val = parseInt(editStock);
    if (!isNaN(val) && val >= 0) {
      setInventory(prev => prev.map(p => p.id === id ? {...p, stock: val} : p));
    }
    setEditId(null);
  };

  const outOfStock = inventory.filter(p => p.stock === 0).length;
  const lowStock   = inventory.filter(p => p.stock > 0 && p.stock <= p.lowThreshold).length;

  return (
    <div className="sl-page">
      <div className="sl-header">
        <div>
          <span className="section-tag">Seller Dashboard</span>
          <h1 className="sl-title">Inventory <em>Management</em></h1>
        </div>
        <div style={{display:'flex',gap:'1rem',alignItems:'center'}}>
          {outOfStock > 0 && <span style={{fontSize:'0.78rem',color:'#e07a5f'}}>{outOfStock} out of stock</span>}
          {lowStock   > 0 && <span style={{fontSize:'0.78rem',color:'#f2cc8f'}}>{lowStock} low stock</span>}
        </div>
      </div>

      {/* Alert banner */}
      {(outOfStock > 0 || lowStock > 0) && (
        <div className="sl-alert">
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>
            {outOfStock > 0 && <strong>{outOfStock} product{outOfStock!==1?'s':''} out of stock. </strong>}
            {lowStock   > 0 && <strong>{lowStock} product{lowStock!==1?'s':''} running low. </strong>}
            Update your stock levels to avoid missed sales.
          </span>
        </div>
      )}

      {/* Filter tabs */}
      <div className="sl-filter-tabs" style={{width:'fit-content'}}>
        {[['all','All'],['low','Low Stock'],['out','Out of Stock']].map(([val,label]) => (
          <button key={val} className={`sl-filter-tab ${filter===val?'active':''}`}
            onClick={() => setFilter(val)}>
            {label}
            <span className="sl-filter-tab__count">
              {val==='all'?inventory.length:val==='low'?lowStock:outOfStock}
            </span>
          </button>
        ))}
      </div>

      {/* Inventory table */}
      <div className="sl-table-wrap">
        <table className="sl-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Total Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => {
              const isOut  = p.stock === 0;
              const isLow  = p.stock > 0 && p.stock <= p.lowThreshold;
              const isEdit = editId === p.id;
              const hasVariants = p.variants.length > 0;
              const isExpanded  = expanded === p.id;

              return (
                <>
                  <tr key={p.id} className={isOut?'sl-table__row--danger':isLow?'sl-table__row--warn':''}>
                    <td>
                      <div className="sl-table__product">
                        <div className="sl-table__product-img">
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="0.8" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </div>
                        <div>
                          <p className="sl-table__product-name">{p.name}</p>
                          {hasVariants && (
                            <button className="sl-variants-toggle"
                              onClick={() => setExpanded(isExpanded ? null : p.id)}>
                              {isExpanded ? '▲' : '▼'} {p.variants.length} variants
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{fontSize:'0.75rem',color:'var(--text-dim)',fontFamily:'monospace'}}>{p.sku}</td>
                    <td>
                      {isEdit ? (
                        <div style={{display:'flex',gap:'0.4rem',alignItems:'center'}}>
                          <input className="sl-input sl-input--inline" type="number"
                            min="0" value={editStock}
                            onChange={e=>setEditStock(e.target.value)}
                            onKeyDown={e=>e.key==='Enter'&&saveStock(p.id)}
                            autoFocus />
                          <button className="sl-table__action-btn" onClick={()=>saveStock(p.id)}>✓</button>
                          <button className="sl-table__action-btn" onClick={()=>setEditId(null)}>✕</button>
                        </div>
                      ) : (
                        <span style={{
                          fontFamily:'var(--font-display)',fontSize:'1.1rem',
                          color: isOut?'#e07a5f':isLow?'#f2cc8f':'var(--text)'
                        }}>
                          {p.stock}
                        </span>
                      )}
                    </td>
                    <td>
                      {isOut && <span className="sl-inv-badge sl-inv-badge--out">Out of Stock</span>}
                      {isLow && !isOut && <span className="sl-inv-badge sl-inv-badge--low">Low Stock</span>}
                      {!isOut && !isLow && <span className="sl-inv-badge sl-inv-badge--ok">In Stock</span>}
                    </td>
                    <td>
                      <button className="sl-table__action-btn"
                        onClick={() => { setEditId(p.id); setEditStock(String(p.stock)); }}>
                        Update Stock
                      </button>
                    </td>
                  </tr>

                  {/* Variants expansion */}
                  {isExpanded && hasVariants && p.variants.map((v, i) => (
                    <tr key={`${p.id}-${i}`} className="sl-table__row--variant">
                      <td colSpan={2} style={{paddingLeft:'3rem',fontSize:'0.78rem',color:'var(--text-muted)'}}>
                        └ Size {v.size}
                      </td>
                      <td style={{fontSize:'0.82rem',color:v.stock===0?'#e07a5f':v.stock<=2?'#f2cc8f':'var(--text)'}}>
                        {v.stock}
                      </td>
                      <td colSpan={2}>
                        {v.stock === 0 && <span className="sl-inv-badge sl-inv-badge--out">Out</span>}
                        {v.stock > 0 && v.stock <= 2 && <span className="sl-inv-badge sl-inv-badge--low">Low</span>}
                      </td>
                    </tr>
                  ))}
                </>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="sl-empty"><p>No products match this filter</p></div>
        )}
      </div>
    </div>
  );
}
