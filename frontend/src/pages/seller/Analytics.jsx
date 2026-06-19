import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import './SellerPages.css';

const REVENUE_DATA = [
  { month:'Jan', revenue:2400, orders:18, visitors:340 },
  { month:'Feb', revenue:3200, orders:24, visitors:420 },
  { month:'Mar', revenue:2800, orders:21, visitors:390 },
  { month:'Apr', revenue:4100, orders:31, visitors:510 },
  { month:'May', revenue:5200, orders:39, visitors:680 },
  { month:'Jun', revenue:4800, orders:36, visitors:620 },
  { month:'Jul', revenue:6100, orders:46, visitors:790 },
  { month:'Aug', revenue:7200, orders:54, visitors:930 },
];

const CATEGORY_DATA = [
  { name:'Overcoats',  value:47, color:'#C9A84C' },
  { name:'Trousers',   value:28, color:'#8B6F30' },
  { name:'Scarves',    value:19, color:'#4A4438' },
  { name:'Blouses',    value:12, color:'#231F1A' },
];

const TOP_COUNTRIES = [
  { country:'France',         revenue:8400, orders:52 },
  { country:'United Kingdom', revenue:6200, orders:38 },
  { country:'United States',  revenue:5100, orders:31 },
  { country:'Germany',        revenue:2800, orders:17 },
  { country:'Japan',          revenue:2100, orders:13 },
];

const PERIODS = ['7 days','30 days','90 days','12 months'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:'var(--surface-2)',border:'0.5px solid var(--border)',padding:'0.75rem 1rem'}}>
      <p style={{fontSize:'0.7rem',color:'var(--text-dim)',marginBottom:'0.4rem'}}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{fontSize:'0.85rem',color:p.color||'var(--gold)',fontFamily:'var(--font-display)'}}>
          {p.name === 'revenue' ? '$' : ''}{p.value.toLocaleString()} {p.name !== 'revenue' ? p.name : ''}
        </p>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [period, setPeriod] = useState('30 days');

  const totalRevenue = REVENUE_DATA.reduce((s,d) => s+d.revenue, 0);
  const totalOrders  = REVENUE_DATA.reduce((s,d) => s+d.orders,  0);
  const totalVisitors= REVENUE_DATA.reduce((s,d) => s+d.visitors,0);
  const convRate     = ((totalOrders / totalVisitors) * 100).toFixed(1);

  return (
    <div className="sl-page">
      <div className="sl-header">
        <div>
          <span className="section-tag">Seller Dashboard</span>
          <h1 className="sl-title">Store <em>Analytics</em></h1>
        </div>
        <div className="sl-period-tabs">
          {PERIODS.map(p => (
            <button key={p} className={`sl-period-tab ${period===p?'active':''}`}
              onClick={() => setPeriod(p)}>{p}</button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="sl-kpis">
        {[
          { label:'Total Revenue',  val:`$${totalRevenue.toLocaleString()}`,   change:'+18%', up:true  },
          { label:'Total Orders',   val:totalOrders,                           change:'+12%', up:true  },
          { label:'Visitors',       val:totalVisitors.toLocaleString(),        change:'+24%', up:true  },
          { label:'Conversion Rate',val:`${convRate}%`,                        change:'-0.3%',up:false },
        ].map(({ label, val, change, up }) => (
          <div key={label} className="sl-kpi-card">
            <p className="sl-kpi-label">{label}</p>
            <p className="sl-kpi-val">{val}</p>
            <span className={`sl-kpi-change ${up?'up':'down'}`}>{up?'↑':'↓'} {change} vs prev period</span>
          </div>
        ))}
      </div>

      {/* Revenue + Orders chart */}
      <div className="sl-card">
        <div className="sl-card__head">
          <h2 className="sl-card__title">Revenue & Orders</h2>
          <span className="sl-card__meta">{period}</span>
        </div>
        <div style={{height:260}}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={REVENUE_DATA} margin={{top:5,right:10,left:0,bottom:0}}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#C9A84C" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#C9A84C" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.07)" />
              <XAxis dataKey="month" tick={{fontSize:11,fill:'#4A4438'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:'#4A4438'}} axisLine={false} tickLine={false}
                tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
              <Tooltip content={<CustomTooltip />}/>
              <Area type="monotone" dataKey="revenue" stroke="#C9A84C" strokeWidth={2}
                fill="url(#revGrad)" dot={false} activeDot={{r:4,fill:'#C9A84C'}}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="sl-two-col">
        {/* Orders bar chart */}
        <div className="sl-card">
          <div className="sl-card__head"><h2 className="sl-card__title">Orders per Month</h2></div>
          <div style={{height:220}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_DATA} margin={{top:5,right:10,left:0,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(201,168,76,0.07)"/>
                <XAxis dataKey="month" tick={{fontSize:11,fill:'#4A4438'}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11,fill:'#4A4438'}} axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTooltip />}/>
                <Bar dataKey="orders" fill="#8B6F30" radius={[2,2,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by category (pie) */}
        <div className="sl-card">
          <div className="sl-card__head"><h2 className="sl-card__title">Sales by Category</h2></div>
          <div style={{display:'flex',alignItems:'center',gap:'1.5rem',height:220}}>
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                  paddingAngle={3} dataKey="value">
                  {CATEGORY_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color}/>
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v} sales`]}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{display:'flex',flexDirection:'column',gap:'0.6rem',flex:1}}>
              {CATEGORY_DATA.map(({ name, value, color }) => (
                <div key={name} style={{display:'flex',alignItems:'center',gap:'0.6rem'}}>
                  <span style={{width:8,height:8,borderRadius:'50%',background:color,flexShrink:0}}/>
                  <span style={{fontSize:'0.78rem',color:'var(--text-muted)',flex:1}}>{name}</span>
                  <span style={{fontSize:'0.78rem',color:'var(--gold)'}}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top countries */}
      <div className="sl-card">
        <div className="sl-card__head"><h2 className="sl-card__title">Revenue by Country</h2></div>
        <div className="sl-country-table">
          {TOP_COUNTRIES.map(({ country, revenue, orders }, i) => {
            const pct = Math.round((revenue / TOP_COUNTRIES[0].revenue) * 100);
            return (
              <div key={country} className="sl-country-row">
                <span className="sl-country-row__rank">#{i+1}</span>
                <span className="sl-country-row__name">{country}</span>
                <div className="sl-country-row__bar-wrap">
                  <div className="sl-country-row__bar" style={{width:`${pct}%`}}/>
                </div>
                <span className="sl-country-row__orders">{orders} orders</span>
                <span className="sl-country-row__revenue">${revenue.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
