import { NavLink, useNavigate } from 'react-router-dom';
import './CustomerSidebar.css';

const NAV = [
  { label:'Profile',    href:'/profile',            icon:<UserIcon /> },
  { label:'My Orders',  href:'/profile/orders',      icon:<OrderIcon /> },
  { label:'Wishlist',   href:'/profile/wishlist',    icon:<HeartIcon /> },
  { label:'Addresses',  href:'/profile/addresses',   icon:<MapIcon /> },
  { label:'Settings',   href:'/profile/settings',    icon:<SettingsIcon /> },
];

export default function CustomerSidebar({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // dispatch(logoutUser())
    navigate('/login');
  };

  return (
    <aside className="cs-sidebar">
      {/* Avatar */}
      <div className="cs-sidebar__profile">
        <div className="cs-sidebar__avatar">
          {user?.avatar
            ? <img src={user.avatar} alt={user.fullName} />
            : <span>{user?.fullName?.charAt(0) || 'U'}</span>}
        </div>
        <div className="cs-sidebar__info">
          <p className="cs-sidebar__name">{user?.fullName || 'Guest'}</p>
          <p className="cs-sidebar__email">{user?.email || ''}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="cs-sidebar__nav">
        {NAV.map(({ label, href, icon }) => (
          <NavLink
            key={href} to={href} end={href === '/profile'}
            className={({ isActive }) =>
              `cs-sidebar__link ${isActive ? 'cs-sidebar__link--active' : ''}`}
          >
            <span className="cs-sidebar__link-icon">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button className="cs-sidebar__logout" onClick={handleLogout}>
        <LogoutIcon />
        Sign Out
      </button>
    </aside>
  );
}

function UserIcon()    { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function OrderIcon()   { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>; }
function HeartIcon()   { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>; }
function MapIcon()     { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
function SettingsIcon(){ return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>; }
function LogoutIcon()  { return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>; }
