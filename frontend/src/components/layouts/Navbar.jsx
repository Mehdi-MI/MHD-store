import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Collections', href: '/products' },
  { label: 'Categories', href: '/categories' },
  { label: 'Sellers',    href: '/sellers' },
  { label: 'About',      href: '/about' },
];

export default function Navbar() {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [cartCount,   setCartCount]   = useState(0);   // wire to Redux later
  const location = useLocation();

  /* scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* close mobile menu on route change */
  useEffect(() => setMenuOpen(false), [location]);

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">

        {/* Logo */}
        <Link to="/" className="navbar__logo">
          MHD<span>Store</span>
        </Link>

        {/* Desktop links */}
        <nav className="navbar__links" aria-label="Main navigation">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              to={href}
              className={`navbar__link ${location.pathname === href ? 'navbar__link--active' : ''}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="navbar__actions">
          <Link to="/search" className="navbar__icon" aria-label="Search">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </Link>

          <Link to="/profile/wishlist" className="navbar__icon" aria-label="Wishlist">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </Link>

          <Link to="/cart" className="navbar__icon navbar__icon--cart" aria-label={`Cart (${cartCount} items)`}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            {cartCount > 0 && <span className="navbar__cart-badge">{cartCount}</span>}
          </Link>

          <Link to="/login" className="btn-outline navbar__signin">Sign In</Link>

          {/* Hamburger (mobile) */}
          <button
            className={`navbar__hamburger ${menuOpen ? 'navbar__hamburger--open' : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span/><span/><span/>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div className={`navbar__drawer ${menuOpen ? 'navbar__drawer--open' : ''}`} aria-hidden={!menuOpen}>
        {NAV_LINKS.map(({ label, href }) => (
          <Link key={href} to={href} className="navbar__drawer-link">{label}</Link>
        ))}
        <div className="navbar__drawer-actions">
          <Link to="/login"    className="btn-outline" style={{ width: '100%', justifyContent: 'center' }}>Sign In</Link>
          <Link to="/register" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Register</Link>
        </div>
      </div>
    </header>
  );
}
