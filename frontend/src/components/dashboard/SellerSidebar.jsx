import { NavLink, useNavigate } from 'react-router-dom';
import './SellerSidebar.css';

const NAV = [
  { label:'Dashboard',    href:'/seller/dashboard',  icon:<DashIcon />   },
  { label:'My Products',  href:'/seller/products',   icon:<ProductIcon />},
  { label:'Orders',       href:'/seller/orders',     icon:<OrderIcon />  },
  { label:'Analytics',    href:'/seller/analytics',  icon:<ChartIcon />  },
  { label:'Inventory',    href:'/seller/inventory',  icon:<BoxIcon />    },
  { label:'Store Profile',href:'/seller/profile',    icon:<StoreIcon />  },
];

export default function SellerSidebar({ seller }) {
  const navigate = useNavigate();
  return (
    <aside className="sl-sidebar">
      <div className="sl-sidebar__brand">
        <div className="sl-sidebar__logo">
          {seller?.logo
            ? <img src={seller.logo} alt={seller.storeName} />
            : <span>{seller?.storeName?.charAt(0) || 'S'}</span>}
        </div>
        <div>
          <p className="sl-sidebar__store">{seller?.storeName || 'My Store'}</p>
          <p className="sl-sidebar__status">
            <span className={`sl-sidebar__status-dot ${seller?.status === 'approved' ? 'active' : ''}`} />
            {seller?.status === 'approved' ? 'Active' : 'Pending'}
          </p>
        </div>
      </div>

      <nav className="sl-sidebar__nav">
        {NAV.map(({ label, href, icon }) => (
          <NavLink key={href} to={href}
            className={({ isActive }) =>
              `sl-sidebar__link ${isActive ? 'sl-sidebar__link--active' : ''}`}>
            <span className="sl-sidebar__link-icon">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sl-sidebar__footer">
        <NavLink to="/" className="sl-sidebar__link sl-sidebar__link--muted">
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          View Storefront
        </NavLink>
        <button className="sl-sidebar__link sl-sidebar__link--logout"
          onClick={() => navigate('/login')}>
          <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}

function DashIcon()    { return <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>; }
function ProductIcon() { return <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>; }
function OrderIcon()   { return <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>; }
function ChartIcon()   { return <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>; }
function BoxIcon()     { return <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>; }
function StoreIcon()   { return <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
