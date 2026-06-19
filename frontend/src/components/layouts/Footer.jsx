import { Link } from 'react-router-dom';
import './Footer.css';

const LINKS = {
  Shop: [
    { label: 'New Arrivals',  href: '/products?sort=newest' },
    { label: 'Best Sellers',  href: '/products?sort=popular' },
    { label: 'Categories',    href: '/categories' },
    { label: 'All Sellers',   href: '/sellers' },
    { label: 'Sale',          href: '/products?tag=sale' },
  ],
  Account: [
    { label: 'Sign In',       href: '/login' },
    { label: 'Register',      href: '/register' },
    { label: 'My Orders',     href: '/profile/orders' },
    { label: 'Wishlist',      href: '/profile/wishlist' },
    { label: 'Addresses',     href: '/profile/addresses' },
  ],
  Company: [
    { label: 'About Us',      href: '/about' },
    { label: 'Sell on MHD',   href: '/seller/register' },
    { label: 'Contact',       href: '/contact' },
    { label: 'Privacy Policy',href: '/privacy' },
    { label: 'Terms of Use',  href: '/terms' },
  ],
};

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">

        {/* Brand */}
        <div className="footer__brand">
          <Link to="/" className="footer__logo">MHD<span>Store</span></Link>
          <p className="footer__tagline">
            A premium multi-vendor marketplace for independent sellers and discerning buyers worldwide.
          </p>
          <div className="footer__socials">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
                <path d="M4 4l16 16M4 20L20 4"/>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([group, items]) => (
          <div key={group} className="footer__col">
            <h4 className="footer__col-heading">{group}</h4>
            <ul>
              {items.map(({ label, href }) => (
                <li key={href}>
                  <Link to={href} className="footer__col-link">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <p className="footer__copy">© {new Date().getFullYear()} MHD Store. All rights reserved.</p>
          <div className="footer__payments">
            {['Visa', 'Mastercard', 'PayPal', 'Stripe'].map(p => (
              <span key={p} className="footer__payment-badge">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
