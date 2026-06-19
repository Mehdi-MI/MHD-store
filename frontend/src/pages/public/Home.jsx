import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../../components/products/ProductCard';
import { useReveal } from '../../hooks/useReveal';
import './Home.css';

/* ─── Mock data (replace with API calls) ──────────────────── */
const FEATURED_PRODUCTS = [
  {
    id: 1, name: 'Cashmere Blend Overcoat — Midnight',
    price: 349, originalPrice: 480,
    images: [], rating: 4.9, reviewCount: 128,
    seller: { store_name: 'Maison Élite' }, badge: 'New',
  },
  {
    id: 2, name: 'Minimal Wireless Earbuds — Pearl White',
    price: 189, originalPrice: null,
    images: [], rating: 4.8, reviewCount: 94,
    seller: { store_name: 'TechVault' }, badge: 'Bestseller',
  },
  {
    id: 3, name: 'Hand-Thrown Ceramic Vase Set',
    price: 124, originalPrice: null,
    images: [], rating: 4.6, reviewCount: 61,
    seller: { store_name: 'Atelier Nord' }, badge: null,
  },
  {
    id: 4, name: 'Leather Bifold Wallet — Cognac',
    price: 95, originalPrice: 130,
    images: [], rating: 4.7, reviewCount: 203,
    seller: { store_name: 'Craft & Hide' }, badge: 'Sale',
  },
  {
    id: 5, name: 'Botanical Candle Collection',
    price: 68, originalPrice: null,
    images: [], rating: 4.9, reviewCount: 317,
    seller: { store_name: 'Grove & Wax' }, badge: null,
  },
  {
    id: 6, name: 'Merino Wool Throw Blanket',
    price: 215, originalPrice: null,
    images: [], rating: 4.8, reviewCount: 88,
    seller: { store_name: 'Nordic Knit' }, badge: 'New',
  },
];

const CATEGORIES = [
  { id: 1, name: 'Fashion & Apparel', count: '3,240', slug: 'fashion', icon: <FashionIcon /> },
  { id: 2, name: 'Electronics',       count: '1,890', slug: 'electronics', icon: <ElecIcon /> },
  { id: 3, name: 'Home & Living',     count: '2,105', slug: 'home-living', icon: <HomeIcon /> },
  { id: 4, name: 'Beauty & Care',     count: '987',   slug: 'beauty', icon: <BeautyIcon /> },
  { id: 5, name: 'Sports & Outdoor',  count: '1,450', slug: 'sports', icon: <SportsIcon /> },
  { id: 6, name: 'Art & Collectibles',count: '634',   slug: 'art', icon: <ArtIcon /> },
];

const TESTIMONIALS = [
  {
    id: 1, text: 'MHD Store completely changed how I shop online. The quality of sellers here is unmatched — every purchase feels curated and intentional.',
    name: 'Sophie Laurent', role: 'Verified Buyer', initials: 'SL',
  },
  {
    id: 2, text: 'As a seller, the dashboard is incredibly intuitive. I went from zero to $12K in monthly revenue within four months of joining.',
    name: 'James Morin', role: 'Verified Seller', initials: 'JM',
  },
  {
    id: 3, text: "The checkout experience is seamless and delivery was ahead of schedule. I've recommended MHD to everyone in my circle.",
    name: 'Aiko Kimura', role: 'Verified Buyer', initials: 'AK',
  },
];

const MARQUEE_ITEMS = [
  'Free shipping on orders over $150',
  'Verified independent sellers',
  '30-day return guarantee',
  'Secure checkout',
  'Curated quality products',
  '24/7 customer support',
];

/* ─── Home Page ───────────────────────────────────────────── */
export default function Home() {
  const navigate   = useNavigate();
  const [wishlist, setWishlist]     = useState([]);
  const [email,    setEmail]        = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Section refs for reveal animations
  const categoriesRef   = useReveal();
  const productsRef     = useReveal();
  const sellerRef       = useReveal();
  const testiRef        = useReveal();
  const newsletterRef   = useReveal();

  const handleWishlistToggle = (id) =>
    setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);

  const handleAddToCart = (product) => {
    // dispatch(addToCart(product)); // wire to Redux
    console.log('Add to cart:', product.name);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    // call API
    setSubscribed(true);
  };

  return (
    <main className="home">

      {/* ── 1. HERO ─────────────────────────────────────────── */}
      <section className="hero" aria-label="Hero">
        <div className="hero__left">
          <div className="hero__eyebrow">
            <span className="section-tag">New Season — 2025 Collection</span>
          </div>

          <h1 className="hero__title">
            Where <em>Craft</em><br />
            Meets<br />
            Commerce
          </h1>

          <p className="hero__subtitle">
            A curated multi-vendor marketplace for discerning buyers. Discover
            exceptional products from independent sellers worldwide — vetted
            for quality, delivered with care.
          </p>

          <div className="hero__actions">
            <Link to="/products" className="btn-primary">
              Explore Collections
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/seller/register" className="btn-ghost">
              Sell with us
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </Link>
          </div>

          <div className="hero__stats">
            {[
              { num: '12K+', label: 'Products' },
              { num: '840',  label: 'Sellers' },
              { num: '98%',  label: 'Satisfaction' },
              { num: '50+',  label: 'Categories' },
            ].map(({ num, label }) => (
              <div key={label} className="hero__stat">
                <span className="hero__stat-num">{num}</span>
                <span className="hero__stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero__right" aria-hidden="true">
          <HeroGrid />
          <div className="hero__live-badge">
            <span className="hero__live-dot" />
            <div>
              <strong>48 new products today</strong>
              <span>across 12 independent sellers</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. MARQUEE ──────────────────────────────────────── */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="marquee__item">
              {item} <span className="marquee__dot">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── 3. CATEGORIES ───────────────────────────────────── */}
      <section className="section categories" ref={categoriesRef} aria-labelledby="categories-heading">
        <div className="section__head">
          <div>
            <span className="section-tag">Browse by Category</span>
            <h2 id="categories-heading" className="section-title" style={{ marginTop: '0.75rem' }}>
              Shop the <em>Collection</em>
            </h2>
          </div>
          <Link to="/categories" className="btn-ghost reveal">
            View all categories
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </Link>
        </div>

        <div className="categories__grid reveal">
          {CATEGORIES.map(({ id, name, count, slug, icon }) => (
            <Link key={id} to={`/categories/${slug}`} className="cat-card">
              <div className="cat-card__icon" aria-hidden="true">{icon}</div>
              <h3 className="cat-card__name">{name}</h3>
              <p className="cat-card__count">{count} products</p>
              <span className="cat-card__arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 4. FEATURED PRODUCTS ────────────────────────────── */}
      <section className="section products-section" ref={productsRef} aria-labelledby="products-heading">
        <div className="section__head">
          <div>
            <span className="section-tag">Handpicked for You</span>
            <h2 id="products-heading" className="section-title" style={{ marginTop: '0.75rem' }}>
              Featured <em>Products</em>
            </h2>
          </div>
          <Link to="/products" className="btn-ghost reveal">
            Browse all
            <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </Link>
        </div>

        <div className="products__grid reveal">
          {FEATURED_PRODUCTS.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onWishlistToggle={handleWishlistToggle}
              wishlisted={wishlist.includes(product.id)}
            />
          ))}
        </div>
      </section>

      {/* ── 5. SELLER CTA ───────────────────────────────────── */}
      <section className="section seller-cta" ref={sellerRef} aria-labelledby="seller-heading">
        <div className="seller-cta__visual reveal">
          <div className="seller-cta__visual-inner" aria-hidden="true">
            <span>Open</span>
            <span>Your</span>
            <span>Store</span>
          </div>
          <div className="seller-cta__visual-frame" aria-hidden="true" />
        </div>

        <div className="seller-cta__content">
          <span className="section-tag reveal">For Sellers</span>
          <h2 id="seller-heading" className="section-title reveal" style={{ marginTop: '0.75rem' }}>
            Turn Your <em>Passion</em><br />Into Profit
          </h2>
          <p className="seller-cta__body reveal reveal-delay-1">
            Join hundreds of independent sellers already growing their business on MHD Store.
            Get powerful tools, a built-in audience, and real-time analytics — all without the overhead.
          </p>
          <ul className="seller-cta__list reveal reveal-delay-2">
            {[
              'Easy product listing with Cloudinary image uploads',
              'Real-time sales analytics dashboard',
              'Automatic payment processing via Stripe',
              'Dedicated seller support team',
              'Zero setup fee — only pay when you sell',
            ].map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Link to="/seller/register" className="btn-primary reveal reveal-delay-3">
            Become a Seller
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* ── 6. TRUST STRIP ──────────────────────────────────── */}
      <div className="trust-strip" aria-label="Trust indicators">
        {[
          { icon: <ShieldIcon />, label: 'Secure Payments', sub: 'SSL encrypted checkout' },
          { icon: <TruckIcon  />, label: 'Fast Delivery',   sub: 'Ships within 24 hours' },
          { icon: <ReturnIcon />, label: '30-Day Returns',  sub: 'Hassle-free policy' },
          { icon: <StarIcon   />, label: 'Verified Sellers',sub: 'Manually vetted stores' },
        ].map(({ icon, label, sub }) => (
          <div key={label} className="trust-strip__item">
            <span className="trust-strip__icon" aria-hidden="true">{icon}</span>
            <div>
              <p className="trust-strip__label">{label}</p>
              <p className="trust-strip__sub">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── 7. TESTIMONIALS ─────────────────────────────────── */}
      <section className="section testimonials" ref={testiRef} aria-labelledby="testi-heading">
        <div className="section__head">
          <div>
            <span className="section-tag">Client Stories</span>
            <h2 id="testi-heading" className="section-title" style={{ marginTop: '0.75rem' }}>
              Trusted by <em>Thousands</em>
            </h2>
          </div>
        </div>
        <div className="testimonials__grid">
          {TESTIMONIALS.map(({ id, text, name, role, initials }, i) => (
            <article
              key={id}
              className={`testi-card reveal ${i > 0 ? `reveal-delay-${i}` : ''}`}
            >
              <span className="testi-card__quote" aria-hidden="true">"</span>
              <blockquote className="testi-card__text">{text}</blockquote>
              <footer className="testi-card__author">
                <div className="testi-card__avatar" aria-hidden="true">{initials}</div>
                <div>
                  <p className="testi-card__name">{name}</p>
                  <p className="testi-card__role">{role}</p>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </section>

      {/* ── 8. NEWSLETTER ───────────────────────────────────── */}
      <section className="newsletter" ref={newsletterRef} aria-labelledby="newsletter-heading">
        <div className="newsletter__inner">
          <span className="section-tag reveal">Stay Informed</span>
          <h2 id="newsletter-heading" className="section-title reveal" style={{ marginTop: '0.75rem' }}>
            New Arrivals.<br /><em>First.</em>
          </h2>
          <p className="newsletter__body reveal reveal-delay-1">
            Subscribe to our editorial newsletter — no noise, just the finest
            new products and seller stories delivered weekly.
          </p>

          {subscribed ? (
            <p className="newsletter__success reveal">
              ✓ You're on the list. Welcome to MHD Store.
            </p>
          ) : (
            <form className="newsletter__form reveal reveal-delay-2" onSubmit={handleSubscribe} noValidate>
              <label htmlFor="email-input" className="sr-only">Email address</label>
              <input
                id="email-input"
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
              <button type="submit" className="btn-primary">Subscribe</button>
            </form>
          )}
        </div>
      </section>

    </main>
  );
}

/* ─── Inline SVG icon components ─────────────────────────── */
function FashionIcon() {
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}
function ElecIcon() {
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <path d="M8 21h8m-4-4v4"/>
    </svg>
  );
}
function HomeIcon() {
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}
function BeautyIcon() {
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
      <path d="M12 6a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 10a4 4 0 1 1 4-4 4 4 0 0 1-4 4z"/>
    </svg>
  );
}
function SportsIcon() {
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      <path d="M2 12h20"/>
    </svg>
  );
}
function ArtIcon() {
  return (
    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
      <path d="M2 13.5V20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6.5"/>
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
}
function TruckIcon() {
  return (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
      <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  );
}
function ReturnIcon() {
  return (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
      <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4"/>
    </svg>
  );
}
function StarIcon() {
  return (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}

/* Hero grid decorative panels */
function HeroGrid() {
  return (
    <div className="hero-grid" aria-hidden="true">
      {[
        { label: 'Fashion',     icon: <FashionIcon /> },
        { label: 'Electronics', icon: <ElecIcon />    },
        { label: 'Living',      icon: <HomeIcon />    },
        { label: 'Beauty',      icon: <BeautyIcon />  },
      ].map(({ label, icon }) => (
        <div key={label} className="hero-grid__cell">
          <span className="hero-grid__icon">{icon}</span>
          <span className="hero-grid__label">{label}</span>
        </div>
      ))}
    </div>
  );
}
