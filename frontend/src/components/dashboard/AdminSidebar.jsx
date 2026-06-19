import { NavLink, useNavigate } from 'react-router-dom';
import './AdminSidebar.css';

const NAV = [
  { label:'Dashboard',    href:'/admin',              icon:<DashIcon />    },
  { label:'Users',        href:'/admin/users',        icon:<UsersIcon />   },
  { label:'Sellers',      href:'/admin/sellers',      icon:<StoreIcon />   },
  { label:'Products',     href:'/admin/products',     icon:<ProductIcon /> },
  { label:'Orders',       href:'/admin/orders',       icon:<OrderIcon />   },
  { label:'Categories',   href:'/admin/categories',   icon:<CatIcon />     },
  { label:'Reviews',      href:'/admin/reviews',      icon:<StarIcon />    },
  { label:'Analytics',    href:'/admin/analytics',    icon:<ChartIcon />   },
  { label:'Settings',     href:'/admin/settings',     icon:<SettingsIcon />},
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <div className="admin-sidebar__logo">A</div>
        <div>
          <p className="admin-sidebar__title">Admin Panel</p>
          <p className="admin-sidebar__sub">MHD Store</p>
        </div>
      </div>
      <nav className="admin-sidebar__nav">
        {NAV.map(({ label, href, icon }) => (
          <NavLink key={href} to={href} end={href === '/admin'}
            className={({ isActive }) =>
              `admin-sidebar__link ${isActive ? 'admin-sidebar__link--active' : ''}`}>
            <span className="admin-sidebar__icon">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="admin-sidebar__footer">
        <NavLink to="/" className="admin-sidebar__link admin-sidebar__link--muted">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          </svg>
          View Storefront
        </NavLink>
        <button className="admin-sidebar__link admin-sidebar__link--logout"
          onClick={() => navigate('/login')}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

function DashIcon()    { return <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>; }
function UsersIcon()   { return <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
function StoreIcon()   { return <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>; }
function ProductIcon() { return <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/></svg>; }
function OrderIcon()   { return <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>; }
function CatIcon()     { return <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>; }
function StarIcon()    { return <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>; }
function ChartIcon()   { return <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>; }
function SettingsIcon(){ return <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>; }
