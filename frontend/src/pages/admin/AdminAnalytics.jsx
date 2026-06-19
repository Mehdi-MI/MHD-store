import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import './AdminPages.css';

const REVENUE_DATA = [
  { month:'Jan', revenue:18400, commission:1472, orders:142, users:68  },
  { month:'Feb', revenue:24200, commission:1936, orders:187, users:91  },
  { month:'Mar', revenue:21800, commission:1744, orders:169, users:74  },
  { month:'Apr', revenue:31100, commission:2488, orders:241, users:112 },
  { month:'May', revenue:42600, commission:3408, orders:329, users:143 },
  { month:'Jun', revenue:38900, commission:3112, orders:301, users:128 },
  { month:'Jul', revenue:51200, commission:4096, orders:396, users:167 },
  { month:'Aug', revenue:64800, commission:5184, orders:501, users:204 },
];

const CATEGORY_DATA = [
  { name:'Fashion',     value:38, revenue:38200, color:'#C9A84C' },
  { name:'Electronics', value:24, revenue:24100, color:'#8B6F30' },
  { name:'Home',        value:19, revenue:19100, color:'#4A4438' },
  { name:'Beauty',      value:11, revenue:11050, color:'#2A2520' },
  { name:'Sports',      value:5,  revenue:5020,  color:'#1C1814' },
  { name:'Art',         value:3,  revenue:3015,  color:'#0F0C07' },
];

const TOP_SELLERS = [
  { store:'TechVault',    revenue:31200, orders:241, commission:2496 },
  { store:'Maison Élite', revenue:24831, orders:187, commission:1986 },
  { store:'Craft & Hide', revenue:11240, orders:89,  commission:899  },
  { store:'Atelier Nord', revenue:9420,  orders:61,  commission:754  },
  { store:'Lumière Lab',  revenue:7800,  orders:54,  commission:624  },
];

const PERIODS = ['7 days','30 days','90 days','12 months'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:'var(--surface-2)',border:'0.5px solid var(--border)',padding:'0.75rem 1rem',minWidth:'140px'}}>
      <p style={{fontSize:'0.7rem',color:'var(--text-dim)',marginBottom:'0.5rem'}}>{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{fontSize:'0.82rem',color:p.color||'var(--gold)',fontFamily:'var(--font-display)',marginBottom:'0.2rem'}}>
          {p.dataKey==='revenue'||p.dataKey==='commission' ? '$' : ''}{Number(p.value).toLocaleString()} <span style={{fontSize:'0.65rem',color:'var(--text-dim)'}}>{p.dataKey}</span>
        </p>
      ))}
    </div>
  );
};

export default function AdminAnalytics() {
  const [period, setPeriod] = useState('30 days');

  const totalRevenue    = REVENUE_DATA.reduce((s,d)=>s+d.revenue,    0);
  const totalCommission = REVENUE_DATA.reduce((s,d)=>s+d.commission, 0);
  const totalOrders     = REVENUE_DATA.reduce((s,d)=>s+d.orders,     0);
  const totalUsers      = REVENUE_DATA.reduce((s,d)=>s+d.users,      0);
  const avgOrderValue   = Math.round(totalRevenue / totalOrders);
  const commissionRate  = ((totalCommission / totalRevenue) * 100).toFixed(1);

  return (
    <div className="ap-page">
      <div className="ap-header">
        <div>
          <span className="section-tag">Admin</span>
          <h1 className="ap-title">Platform <em>Analytics</em></h1>
        </div>
        <div className="ap-period-tabs">
          {PERIODS.map(p => (
            <button key={p} className={`ap-period-tab ${period===p?'active':''}`}
              onClick={() => setPeriod(p)}>{p}</button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="ap-kpis">
        {[
          { label:'Gross Revenue',      val:`$${totalRevenue.toLocaleString()}`,    change:'+22%', up:true  },
          { label:'Platform Commission',val:`$${totalCommission.toLocaleString()}`, change:'+19%', up:true  },
          { label:'Total Orders',       val:totalOrders.toLocaleString(),           change:'+15%', up:true  },
          { label:'New Users',          val:totalUsers.toLocaleString(),            change:'+31%', up:true  },
          { label:'Avg Order Value',    val:`$${avgOrderValue}`,                    change:'+8%',  up:true  },
          { label:'Commission Rate',    val:`${commissionRate}%`,                   change:'',     up:null  },
          { label:'Active Sellers',     val:'47',                                   change:'+5',   up:true  },
          { label:'Active Products',    val:'1,284',                                change:'+68',  up:true  },
        ].map(({ label, val, change, up }) => (
          <div key={label} className="ap-kpi-card">
            <p className="ap-kpi-label">{label}</p>
            <p className="ap-kpi-val">{val}</p>
            {change && (
              <span className={`ap-kpi-change ${up===true?'up':up===false?'down':''}`}>
                {up===true?'↑':up===false?'↓':''} {change} vs prev
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Revenue + Commission chart */}
      <div className="ap-card">
        <div className="ap-card__head">
          <h2 className="ap-card__title">Revenue vs Commission</h2>
          <span className="ap-card__meta">{period}</span>
        </div>
        <div style={{height:260}}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={REVENUE_DATA} margin={{top:5,right:10,left:0,bottom:0}}>
              <defs>
                <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#C9A84C" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#C9A84C" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="comGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#81b29a" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#81b29a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.07)"/>
              <XAxis dataKey="month" tick={{fontSize:11,fill:'#4A4438'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:'#4A4438'}} axisLine={false} tickLine={false}
                tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
              <Tooltip content={<CustomTooltip />}/>
              <Area type="monotone" dataKey="revenue"    stroke="#C9A84C" strokeWidth={2} fill="url(#revGrad2)" dot={false} activeDot={{r:4}}/>
              <Area type="monotone" dataKey="commission" stroke="#81b29a" strokeWidth={2} fill="url(#comGrad)"  dot={false} activeDot={{r:4}}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Legend */}
        <div style={{display:'flex',gap:'1.5rem',paddingTop:'0.5rem'}}>
          {[{color:'#C9A84C',label:'Gross Revenue'},{color:'#81b29a',label:'Commission'}].map(({color,label})=>(
            <div key={label} style={{display:'flex',alignItems:'center',gap:'0.5rem',fontSize:'0.75rem',color:'var(--text-dim)'}}>
              <span style={{width:10,height:10,borderRadius:'50%',background:color,flexShrink:0}}/>
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="ap-two-col">
        {/* Orders & Users chart */}
        <div className="ap-card">
          <div className="ap-card__head"><h2 className="ap-card__title">Orders & New Users</h2></div>
          <div style={{height:220}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_DATA} margin={{top:5,right:10,left:0,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.07)"/>
                <XAxis dataKey="month" tick={{fontSize:11,fill:'#4A4438'}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11,fill:'#4A4438'}} axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTooltip />}/>
                <Bar dataKey="orders" fill="#8B6F30" radius={[2,2,0,0]}/>
                <Bar dataKey="users"  fill="#3a7d44" radius={[2,2,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{display:'flex',gap:'1.5rem'}}>
            {[{color:'#8B6F30',label:'Orders'},{color:'#3a7d44',label:'New Users'}].map(({color,label})=>(
              <div key={label} style={{display:'flex',alignItems:'center',gap:'0.5rem',fontSize:'0.75rem',color:'var(--text-dim)'}}>
                <span style={{width:10,height:10,borderRadius:'50%',background:color,flexShrink:0}}/>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by category */}
        <div className="ap-card">
          <div className="ap-card__head"><h2 className="ap-card__title">Revenue by Category</h2></div>
          <div style={{display:'flex',alignItems:'center',gap:'1.5rem',height:220}}>
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                  paddingAngle={3} dataKey="value">
                  {CATEGORY_DATA.map((entry,i)=><Cell key={i} fill={entry.color}/>)}
                </Pie>
                <Tooltip formatter={(v,n,p)=>[`${v}% · $${p.payload.revenue.toLocaleString()}`]}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{flex:1,display:'flex',flexDirection:'column',gap:'0.55rem'}}>
              {CATEGORY_DATA.map(({name,value,revenue,color})=>(
                <div key={name} style={{display:'flex',alignItems:'center',gap:'0.6rem'}}>
                  <span style={{width:8,height:8,borderRadius:'50%',background:color,flexShrink:0}}/>
                  <span style={{fontSize:'0.75rem',color:'var(--text-muted)',flex:1}}>{name}</span>
                  <span style={{fontSize:'0.72rem',color:'var(--text-dim)'}}>{value}%</span>
                  <span style={{fontSize:'0.75rem',color:'var(--gold)',minWidth:'55px',textAlign:'right'}}>${(revenue/1000).toFixed(1)}k</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top sellers table */}
      <div className="ap-card">
        <div className="ap-card__head"><h2 className="ap-card__title">Top Sellers by Revenue</h2></div>
        <div className="ap-table-wrap" style={{border:'none',background:'transparent'}}>
          <table className="ap-table">
            <thead>
              <tr><th>Rank</th><th>Store</th><th>Revenue</th><th>Orders</th><th>Commission</th><th>Share</th></tr>
            </thead>
            <tbody>
              {TOP_SELLERS.map((s,i)=>{
                const pct = Math.round((s.revenue/TOP_SELLERS[0].revenue)*100);
                return (
                  <tr key={s.store}>
                    <td style={{color:'var(--text-dim)',fontSize:'0.82rem'}}>#{i+1}</td>
                    <td className="ap-table__name">{s.store}</td>
                    <td className="ap-table__gold">${s.revenue.toLocaleString()}</td>
                    <td className="ap-table__muted">{s.orders}</td>
                    <td style={{color:'#81b29a',fontSize:'0.82rem'}}>${s.commission.toLocaleString()}</td>
                    <td style={{minWidth:'120px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                        <div style={{flex:1,height:4,background:'var(--surface-3)',borderRadius:2,overflow:'hidden'}}>
                          <div style={{height:'100%',width:`${pct}%`,background:'var(--gold)',borderRadius:2}}/>
                        </div>
                        <span style={{fontSize:'0.7rem',color:'var(--text-dim)',minWidth:'30px'}}>{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
