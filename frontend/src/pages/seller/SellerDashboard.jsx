import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import './SellerPages.css';

const REVENUE_DATA = [
  { month:'Jan', revenue:2400, orders:18 },
  { month:'Feb', revenue:3200, orders:24 },
  { month:'Mar', revenue:2800, orders:21 },
  { month:'Apr', revenue:4100, orders:31 },
  { month:'May', revenue:5200, orders:39 },
  { month:'Jun', revenue:4800, orders:36 },
  { month:'Jul', revenue:6100, orders:46 },
  { month:'Aug', revenue:7200, orders:54 },
];

const RECENT_ORDERS = [
  { id:'MHD-2025-00042', product:'Cashmere Overcoat', buyer:'Sophie L.', amount:349, status:'delivered', date:'May 15' },
  { id:'MHD-2025-00039', product:'Linen Trousers',    buyer:'James M.',  amount:145, status:'shipped',   date:'May 14' },
  { id:'MHD-2025-00035', product:'Cashmere Overcoat', buyer:'Aiko K.',   amount:349, status:'processing',date:'May 13' },
  { id:'MHD-2025-00031', product:'Wool Scarf',         buyer:'Clara D.',  amount:89,  status:'pending',   date:'May 12' },
  { id:'MHD-2025-00028', product:'Linen Trousers',    buyer:'Bob W.',    amount:145, status:'delivered', date:'May 11' },
];

const TOP_PRODUCTS = [
  { name:'Cashmere Blend Overcoat', sales:47, revenue:16403, stock:8  },
  { name:'Linen Wide-Leg Trousers', sales:28, revenue:4060,  stock:22 },
  { name:'Merino Wool Scarf',       sales:19, revenue:1691,  stock:31 },
  { name:'Silk Blouse — Ivory',     sales:12, revenue:1548,  stock:5  },
];

const STATUS_STYLES = {
  pending:    { bg:'rgba(242,204,143,0.12)', color:'#f2cc8f' },
  processing: { bg:'rgba(129,178,154,0.12)', color:'#81b29a' },
  shipped:    { bg:'rgba(201,168,76,0.12)',  color:'#C9A84C' },
  delivered:  { bg:'rgba(129,178,154,0.15)', color:'#81b29a' },
  cancelled:  { bg:'rgba(224,122,95,0.12)',  color:'#e07a5f' },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'var(--surface-2)', border:'0.5px solid var(--border)', padding:'0.75rem 1rem' }}>
      <p style={{ fontSize:'0.72rem', color:'var(--text-dim)', marginBottom:'0.35rem' }}>{label}</p>
      <p style={{ fontSize:'0.9rem', color:'var(--gold)', fontFamily:'var(--font-display)' }}>
        ${payload[0].value.toLocaleString()}
      </p>
    </div>
  );
};

export default function SellerDashboard() {
  return (
    <div className="sl-page">
      <div className="sl-header">
        <div>
          <span className="section-tag">Seller Dashboard</span>
          <h1 className="sl-title">Good morning, <em>Maison Élite</em></h1>
          <p className="sl-subtitle">Here's what's happening with your store today.</p>
        </div>
        <Link to="/seller/products/new" className="btn-primary sl-btn-sm">
          + Add Product
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="sl-kpis">
        {[
          { label:'Total Revenue',  val:'$24,831', change:'+18%', up:true,  sub:'vs last month'   },
          { label:'Total Orders',   val:'187',      change:'+12%', up:true,  sub:'vs last month'   },
          { label:'Products Listed',val:'12',       change:'+2',   up:true,  sub:'this month'      },
          { label:'Avg. Rating',    val:'4.9 ★',    change:'',     up:null,  sub:'128 total reviews'},
          { label:'Conversion Rate',val:'3.2%',     change:'-0.3%',up:false, sub:'vs last month'   },
          { label:'Pending Payout', val:'$3,420',   change:'',     up:null,  sub:'Next: Jun 1'     },
        ].map(({ label, val, change, up, sub }) => (
          <div key={label} className="sl-kpi-card">
            <p className="sl-kpi-label">{label}</p>
            <p className="sl-kpi-val">{val}</p>
            <div className="sl-kpi-footer">
              {change && (
                <span className={`sl-kpi-change ${up===true?'up':up===false?'down':''}`}>
                  {up===true?'↑':up===false?'↓':''} {change}
                </span>
              )}
              <span className="sl-kpi-sub">{sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="sl-card">
        <div className="sl-card__head">
          <h2 className="sl-card__title">Revenue Overview</h2>
          <span className="sl-card__meta">Last 8 months</span>
        </div>
        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={REVENUE_DATA} margin={{ top:5, right:10, left:0, bottom:0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#C9A84C" stopOpacity={0.18}/>
                  <stop offset="95%" stopColor="#C9A84C" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.08)" />
              <XAxis dataKey="month" tick={{ fontSize:11, fill:'#4A4438' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11, fill:'#4A4438' }} axisLine={false} tickLine={false}
                tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={2}
                fill="url(#revenueGrad)" dot={false} activeDot={{ r:4, fill:'#C9A84C' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="sl-two-col">
        {/* Recent orders */}
        <div className="sl-card">
          <div className="sl-card__head">
            <h2 className="sl-card__title">Recent Orders</h2>
            <Link to="/seller/orders" className="sl-link">View all →</Link>
          </div>
          <div className="sl-orders-list">
            {RECENT_ORDERS.map(o => {
              const s = STATUS_STYLES[o.status] || STATUS_STYLES.pending;
              return (
                <div key={o.id} className="sl-order-row">
                  <div className="sl-order-row__info">
                    <p className="sl-order-row__id">{o.id}</p>
                    <p className="sl-order-row__product">{o.product} · {o.buyer}</p>
                  </div>
                  <span className="sl-order-row__status"
                    style={{ background: s.bg, color: s.color }}>
                    {o.status}
                  </span>
                  <p className="sl-order-row__amount">${o.amount}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top products */}
        <div className="sl-card">
          <div className="sl-card__head">
            <h2 className="sl-card__title">Top Products</h2>
            <Link to="/seller/products" className="sl-link">View all →</Link>
          </div>
          <div className="sl-top-products">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={p.name} className="sl-top-product">
                <span className="sl-top-product__rank">#{i+1}</span>
                <div className="sl-top-product__info">
                  <p className="sl-top-product__name">{p.name}</p>
                  <p className="sl-top-product__meta">{p.sales} sales · ${p.revenue.toLocaleString()}</p>
                </div>
                <span className={`sl-top-product__stock ${p.stock<=5?'low':''}`}>
                  {p.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
