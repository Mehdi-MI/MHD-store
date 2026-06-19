import { useState } from 'react';
import './AdminPages.css';

const MOCK_USERS = [
  { id:1, name:'Sophie Laurent', email:'sophie@example.com',  role:'customer', status:'active',   joined:'2024-03-15', orders:12, spent:1840  },
  { id:2, name:'James Morin',    email:'james@maisonelite.com',role:'seller',  status:'active',   joined:'2024-01-08', orders:0,  spent:0     },
  { id:3, name:'Aiko Kimura',    email:'aiko@example.com',    role:'customer', status:'active',   joined:'2024-05-21', orders:4,  spent:620   },
  { id:4, name:'Clara Dubois',   email:'clara@example.com',   role:'customer', status:'active',   joined:'2024-02-10', orders:8,  spent:1120  },
  { id:5, name:'Bob Wilson',     email:'bob@example.com',     role:'customer', status:'banned',   joined:'2023-11-03', orders:2,  spent:180   },
  { id:6, name:'MHD Admin',      email:'admin@mhdstore.com',  role:'admin',    status:'active',   joined:'2023-01-01', orders:0,  spent:0     },
  { id:7, name:'Erik Larsen',    email:'erik@nordicknit.com', role:'seller',   status:'active',   joined:'2024-04-12', orders:0,  spent:0     },
  { id:8, name:'Priya Patel',    email:'priya@example.com',   role:'customer', status:'inactive', joined:'2024-06-01', orders:1,  spent:95    },
];

const ROLE_STYLES = {
  admin:    { bg:'rgba(201,168,76,0.15)',  color:'#C9A84C' },
  seller:   { bg:'rgba(129,178,154,0.12)', color:'#81b29a' },
  customer: { bg:'rgba(74,68,56,0.2)',     color:'#8A8070' },
};
const STATUS_STYLES = {
  active:   { bg:'rgba(129,178,154,0.12)', color:'#81b29a' },
  inactive: { bg:'rgba(242,204,143,0.12)', color:'#f2cc8f' },
  banned:   { bg:'rgba(224,122,95,0.12)',  color:'#e07a5f' },
};

export default function Users() {
  const [users,   setUsers]   = useState(MOCK_USERS);
  const [filter,  setFilter]  = useState('all');
  const [search,  setSearch]  = useState('');
  const [selected,setSelected]= useState([]);

  const filtered = users.filter(u => {
    const matchF = filter==='all' || u.role===filter || u.status===filter;
    const matchS = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchF && matchS;
  });

  const toggleSelect = (id) => setSelected(p => p.includes(id)?p.filter(i=>i!==id):[...p,id]);
  const selectAll    = ()   => setSelected(selected.length===filtered.length?[]:filtered.map(u=>u.id));

  const banUser    = (id) => setUsers(p=>p.map(u=>u.id===id?{...u,status:u.status==='banned'?'active':'banned'}:u));
  const deleteUser = (id) => setUsers(p=>p.filter(u=>u.id!==id));

  return (
    <div className="ap-page">
      <div className="ap-header">
        <div>
          <span className="section-tag">Admin</span>
          <h1 className="ap-title">Users <em>Management</em></h1>
        </div>
        <div className="ap-header__stats">
          <span>{users.filter(u=>u.role==='customer').length} customers</span>
          <span>{users.filter(u=>u.role==='seller').length} sellers</span>
          <span style={{color:'#e07a5f'}}>{users.filter(u=>u.status==='banned').length} banned</span>
        </div>
      </div>

      <div className="ap-toolbar">
        <div className="ap-filter-tabs">
          {['all','customer','seller','admin','banned'].map(f=>(
            <button key={f} className={`ap-filter-tab ${filter===f?'active':''}`} onClick={()=>setFilter(f)}>
              {f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>
        <div className="ap-search">
          <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="search" placeholder="Search users…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
      </div>

      <div className="ap-table-wrap">
        <table className="ap-table">
          <thead>
            <tr>
              <th><input type="checkbox" checked={selected.length===filtered.length&&filtered.length>0} onChange={selectAll}/></th>
              <th>User</th><th>Role</th><th>Status</th><th>Joined</th><th>Orders</th><th>Spent</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u=>{
              const rs=ROLE_STYLES[u.role]; const ss=STATUS_STYLES[u.status]||STATUS_STYLES.active;
              return (
                <tr key={u.id} className={selected.includes(u.id)?'ap-table__row--selected':''}>
                  <td><input type="checkbox" checked={selected.includes(u.id)} onChange={()=>toggleSelect(u.id)}/></td>
                  <td>
                    <div className="ap-table__user">
                      <div className="ap-avatar ap-avatar--sm">{u.name.charAt(0)}</div>
                      <div>
                        <p className="ap-table__name">{u.name}</p>
                        <p className="ap-table__sub">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="ap-badge" style={{background:rs.bg,color:rs.color}}>{u.role}</span></td>
                  <td><span className="ap-badge" style={{background:ss.bg,color:ss.color}}>{u.status}</span></td>
                  <td className="ap-table__muted">{new Date(u.joined).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})}</td>
                  <td className="ap-table__muted">{u.orders}</td>
                  <td className="ap-table__gold">{u.spent>0?`$${u.spent.toLocaleString()}`:'—'}</td>
                  <td>
                    <div className="ap-table__actions">
                      <button className="ap-action-btn" onClick={()=>banUser(u.id)}>
                        {u.status==='banned'?'Unban':'Ban'}
                      </button>
                      {u.role!=='admin'&&(
                        <button className="ap-action-btn ap-action-btn--danger" onClick={()=>deleteUser(u.id)}>Delete</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length===0&&<div className="ap-empty"><p>No users found</p></div>}
      </div>
    </div>
  );
}
