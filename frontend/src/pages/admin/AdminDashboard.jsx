import { Link } from 'react-router-dom';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './AdminPages.css';

const REVENUE_DATA = [
  { month:'Jan', revenue:18400, orders:142, users:68  },
  { month:'Feb', revenue:24200, orders:187, users:91  },
  { month:'Mar', revenue:21800, orders:169, users:74  },
  { month:'Apr', revenue:31100, orders:241, users:112 },
  { month:'May', revenue:42600, orders:329, users:143 },
  { month:'Jun', revenue:38900, orders:301, users:128 },
  { month:'Jul', revenue:51200, orders:396, users:167 },
  { month:'Aug', revenue:64800, orders:501, users:204 },
];

const RECENT_USERS = [
  { name:'Sophie Laurent', email:'sophie@example.com', role:'customer', joined:'May 15', orders:3  },
  { name:'James Morin',    email:'james@example.com',  role:'seller',   joined:'May 14', orders:0  },
  { name:'Aiko Kimura',    email:'aiko@example.com',   role:'customer', joined:'May 13', orders:1  },
  { name:'Clara Dubois',   email:'clara@example.com',  role:'customer', joined:'May 12', orders:5  },
  { name:'Bob Wilson',     email:'bob@example.com',    role:'customer', joined:'May 11', orders:2  },
];

const PENDING_SELLERS = [
  { store:'Nordic Knit',  owner:'Erik Larsen',  category:'Home & Living', applied:'May 14' },
  { store:'Studio Blank', owner:'Mei Chen',     category:'Art',           applied:'May 13' },
  { store:'Form & Flow',  owner:'Priya Patel',  category:'Sports',        applied:'May 12' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:'var(--surface-2)',border:'0.5px solid var(--border)',padding:'0.75rem 1rem'}}>
      <p style={{fontSize:'0.7rem',color:'var(--text-dim)',marginBottom:'0.35rem'}}>{label}</p>
      <p style={{fontSize:'0.9rem',color:'var(--gold)',fontFamily:'var(--font-display)'}}>
        ${payload[0].value.toLocaleString()}
      </p>
    </div>
  );
};

export default function AdminDashboard() {
  const totalRevenue = REVENUE_DATA.reduce((s,d)=>s+d.revenue,0);
  const totalOrders  = REVENUE_DATA.reduce((s,d)=>s+d.orders,0);
  const totalUsers   = REVENUE_DATA.reduce((s,d)=>s+d.users,0);

  return (
    <div className="ap-page">
      <div className="ap-header">
        <div>
          <span className="section-tag">Admin</span>
          <h1 className="ap-title">Platform <em>Dashboard</em></h1>
          <p className="ap-subtitle">Overview of all platform activity.</p>
        </div>
        <div className="ap-header__date">
          {new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
        </div>
      </div>

      {/* KPIs */}
      <div className="ap-kpis">
        {[
          { label:'Total Revenue',    val:`$${totalRevenue.toLocaleString()}`, change:'+22%', up:true,  link:'/admin/analytics' },
          { label:'Total Orders',     val:totalOrders,                         change:'+15%', up:true,  link:'/admin/orders'    },
          { label:'New Users (8mo)',  val:totalUsers,                          change:'+31%', up:true,  link:'/admin/users'     },
          { label:'Active Sellers',   val:'47',                                change:'+5',   up:true,  link:'/admin/sellers'   },
          { label:'Pending Sellers',  val:'3',                                 change:'',     up:null,  link:'/admin/sellers'   },
          { label:'Products Listed',  val:'1,284',                             change:'+68',  up:true,  link:'/admin/products'  },
          { label:'Avg Order Value',  val:'$129',                              change:'+8%',  up:true,  link:'/admin/analytics' },
          { label:'Platform Commission',val:'$7,842',                         change:'+19%', up:true,  link:'/admin/analytics' },
        ].map(({ label, val, change, up, link }) => (
          <Link key={label} to={link} className="ap-kpi-card">
            <p className="ap-kpi-label">{label}</p>
            <p className="ap-kpi-val">{val}</p>
            {change && (
              <span className={`ap-kpi-change ${up===true?'up':up===false?'down':''}`}>
                {up===true?'↑':up===false?'↓':''} {change} vs prev
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="ap-card">
        <div className="ap-card__head">
          <h2 className="ap-card__title">Platform Revenue</h2>
          <span className="ap-card__meta">Last 8 months</span>
        </div>
        <div style={{height:240}}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={REVENUE_DATA} margin={{top:5,right:10,left:0,bottom:0}}>
              <defs>
                <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#C9A84C" stopOpacity={0.18}/>
                  <stop offset="95%" stopColor="#C9A84C" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.07)"/>
              <XAxis dataKey="month" tick={{fontSize:11,fill:'#4A4438'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:'#4A4438'}} axisLine={false} tickLine={false}
                tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
              <Tooltip content={<CustomTooltip />}/>
              <Area type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={2}
                fill="url(#adminRevGrad)" dot={false} activeDot={{r:4,fill:'#C9A84C'}}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="ap-two-col">
        {/* Recent users */}
        <div className="ap-card">
          <div className="ap-card__head">
            <h2 className="ap-card__title">Recent Users</h2>
            <Link to="/admin/users" className="ap-link">View all →</Link>
          </div>
          <div className="ap-list">
            {RECENT_USERS.map(u => (
              <div key={u.email} className="ap-list-row">
                <div className="ap-avatar">{u.name.charAt(0)}</div>
                <div className="ap-list-row__info">
                  <p className="ap-list-row__name">{u.name}</p>
                  <p className="ap-list-row__sub">{u.email}</p>
                </div>
                <span className={`ap-role-badge ap-role-badge--${u.role}`}>{u.role}</span>
                <span className="ap-list-row__date">{u.joined}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending sellers */}
        <div className="ap-card">
          <div className="ap-card__head">
            <h2 className="ap-card__title">Pending Sellers</h2>
            <Link to="/admin/sellers" className="ap-link">Review all →</Link>
          </div>
          {PENDING_SELLERS.length === 0 ? (
            <p className="ap-muted">No pending applications.</p>
          ) : (
            <div className="ap-list">
              {PENDING_SELLERS.map(s => (
                <div key={s.store} className="ap-list-row">
                  <div className="ap-avatar ap-avatar--store">{s.store.charAt(0)}</div>
                  <div className="ap-list-row__info">
                    <p className="ap-list-row__name">{s.store}</p>
                    <p className="ap-list-row__sub">{s.owner} · {s.category}</p>
                  </div>
                  <div className="ap-list-row__actions">
                    <button className="ap-action-btn ap-action-btn--approve">Approve</button>
                    <button className="ap-action-btn ap-action-btn--reject">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
