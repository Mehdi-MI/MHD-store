import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../../hooks/useReveal';
import './Categories.css';

/* ── Mock data — replace with categoryService.getAll() ── */
const CATEGORIES = [
  {
    id: 1, name: 'Fashion & Apparel', slug: 'fashion',
    description: 'Curated clothing, accessories and footwear from independent designers worldwide.',
    productCount: 3240, sellerCount: 142,
    featured: ['Overcoats', 'Denim', 'Knitwear', 'Accessories'],
    icon: <FashionIcon />,
  },
  {
    id: 2, name: 'Electronics', slug: 'electronics',
    description: 'Premium tech gadgets, audio equipment and smart devices from verified sellers.',
    productCount: 1890, sellerCount: 87,
    featured: ['Audio', 'Wearables', 'Cameras', 'Smart Home'],
    icon: <ElecIcon />,
  },
  {
    id: 3, name: 'Home & Living', slug: 'home-living',
    description: 'Artisan homeware, furniture and décor pieces for the considered home.',
    productCount: 2105, sellerCount: 113,
    featured: ['Ceramics', 'Textiles', 'Lighting', 'Furniture'],
    icon: <HomeIcon />,
  },
  {
    id: 4, name: 'Beauty & Care', slug: 'beauty',
    description: 'Clean beauty, skincare and wellness products crafted with natural ingredients.',
    productCount: 987, sellerCount: 64,
    featured: ['Skincare', 'Fragrance', 'Hair Care', 'Wellness'],
    icon: <BeautyIcon />,
  },
  {
    id: 5, name: 'Sports & Outdoor', slug: 'sports',
    description: 'Performance gear and outdoor equipment for the active lifestyle.',
    productCount: 1450, sellerCount: 78,
    featured: ['Yoga', 'Running', 'Cycling', 'Hiking'],
    icon: <SportsIcon />,
  },
  {
    id: 6, name: 'Art & Collectibles', slug: 'art',
    description: 'Original artworks, prints and rare collectibles from emerging and established artists.',
    productCount: 634, sellerCount: 39,
    featured: ['Prints', 'Sculpture', 'Photography', 'Ceramics'],
    icon: <ArtIcon />,
  },
  {
    id: 7, name: 'Books & Stationery', slug: 'books',
    description: 'Independent publishers, fine stationery and handcrafted paper goods.',
    productCount: 812, sellerCount: 52,
    featured: ['Fiction', 'Design Books', 'Notebooks', 'Pens'],
    icon: <BooksIcon />,
  },
  {
    id: 8, name: 'Food & Drink', slug: 'food',
    description: 'Artisan foods, specialty coffee, fine teas and handcrafted spirits.',
    productCount: 543, sellerCount: 31,
    featured: ['Coffee', 'Tea', 'Chocolate', 'Condiments'],
    icon: <FoodIcon />,
  },
];

const FEATURED_CATEGORIES = CATEGORIES.slice(0, 3);

export default function Categories() {
  const [search, setSearch] = useState('');
  const heroRef    = useReveal();
  const gridRef    = useReveal();
  const featuredRef= useReveal();

  const filtered = CATEGORIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="cat-page">

      {/* ── Hero ──────────────────────────────── */}
      <section className="cat-hero" ref={heroRef}>
        <div className="cat-hero__inner">
          <div className="cat-hero__text">
            <span className="section-tag reveal">Browse Collections</span>
            <h1 className="cat-hero__title reveal reveal-delay-1">
              Shop by <em>Category</em>
            </h1>
            <p className="cat-hero__sub reveal reveal-delay-2">
              Explore {CATEGORIES.length} curated categories across {CATEGORIES.reduce((s,c) => s+c.sellerCount,0)}+ independent sellers
              and {CATEGORIES.reduce((s,c) => s+c.productCount,0).toLocaleString()}+ products.
            </p>
          </div>

          {/* Search */}
          <div className="cat-hero__search reveal reveal-delay-2">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="search"
              placeholder="Search categories…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search categories"
            />
            {search && (
              <button onClick={() => setSearch('')} className="cat-hero__search-clear" aria-label="Clear">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <div className="cat-hero__stats reveal">
          {[
            { num: CATEGORIES.length,                                          label: 'Categories' },
            { num: CATEGORIES.reduce((s,c)=>s+c.sellerCount,0)+'+',           label: 'Sellers' },
            { num: CATEGORIES.reduce((s,c)=>s+c.productCount,0).toLocaleString()+'+', label: 'Products' },
            { num: '50+',                                                      label: 'Countries' },
          ].map(({ num, label }) => (
            <div key={label} className="cat-hero__stat">
              <span className="cat-hero__stat-num">{num}</span>
              <span className="cat-hero__stat-label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Categories ─────────────────── */}
      <section className="cat-featured" ref={featuredRef}>
        <div className="cat-featured__inner">
          <div className="cat-section-head reveal">
            <div>
              <span className="section-tag">Editor's Pick</span>
              <h2 className="section-title" style={{ marginTop:'0.5rem' }}>
                Featured <em>Collections</em>
              </h2>
            </div>
          </div>

          <div className="cat-featured__grid">
            {FEATURED_CATEGORIES.map(({ id, name, slug, description, productCount, icon }, i) => (
              <Link
                key={id}
                to={`/categories/${slug}`}
                className={`cat-featured-card reveal ${i > 0 ? `reveal-delay-${i}` : ''}`}
              >
                <div className="cat-featured-card__icon">{icon}</div>
                <div className="cat-featured-card__body">
                  <h3 className="cat-featured-card__name">{name}</h3>
                  <p className="cat-featured-card__desc">{description}</p>
                  <div className="cat-featured-card__footer">
                    <span className="cat-featured-card__count">{productCount.toLocaleString()} products</span>
                    <span className="cat-featured-card__arrow">Browse →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── All Categories Grid ─────────────────── */}
      <section className="cat-all" ref={gridRef}>
        <div className="cat-all__inner">
          <div className="cat-section-head reveal">
            <div>
              <span className="section-tag">All Categories</span>
              <h2 className="section-title" style={{ marginTop:'0.5rem' }}>
                Every <em>Collection</em>
              </h2>
            </div>
            <span className="cat-all__count">
              {filtered.length} {filtered.length === 1 ? 'category' : 'categories'}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="cat-empty">
              <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="0.8" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <h3>No categories found</h3>
              <p>Try a different search term</p>
              <button className="btn-outline" onClick={() => setSearch('')}>Clear search</button>
            </div>
          ) : (
            <div className="cat-grid reveal">
              {filtered.map(({ id, name, slug, description, productCount, sellerCount, featured, icon }) => (
                <Link key={id} to={`/categories/${slug}`} className="cat-card">
                  <div className="cat-card__top">
                    <div className="cat-card__icon">{icon}</div>
                    <div className="cat-card__meta">
                      <span className="cat-card__product-count">{productCount.toLocaleString()} products</span>
                      <span className="cat-card__seller-count">{sellerCount} sellers</span>
                    </div>
                  </div>

                  <h3 className="cat-card__name">{name}</h3>
                  <p className="cat-card__desc">{description}</p>

                  {/* Sub-tags */}
                  <div className="cat-card__tags">
                    {featured.map(tag => (
                      <span key={tag} className="cat-card__tag">{tag}</span>
                    ))}
                  </div>

                  <div className="cat-card__footer">
                    <span className="cat-card__browse">Browse collection</span>
                    <span className="cat-card__arrow-icon">→</span>
                  </div>

                  {/* Gold underline on hover */}
                  <div className="cat-card__bar" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA banner ─────────────────────────── */}
      <section className="cat-cta">
        <div className="cat-cta__inner">
          <div className="cat-cta__text">
            <span className="section-tag">Can't find what you're looking for?</span>
            <h2 className="section-title" style={{ marginTop:'0.75rem' }}>
              Browse <em>All Products</em>
            </h2>
            <p className="cat-cta__sub">
              Search across all categories with advanced filters for price, rating, seller and more.
            </p>
          </div>
          <div className="cat-cta__actions">
            <Link to="/products" className="btn-primary">
              View All Products
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/search" className="btn-outline">
              Advanced Search
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

/* ── SVG Icons ── */
function FashionIcon() {
  return <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
}
function ElecIcon() {
  return <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/></svg>;
}
function HomeIcon() {
  return <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
}
function BeautyIcon() {
  return <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
}
function SportsIcon() {
  return <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>;
}
function ArtIcon() {
  return <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>;
}
function BooksIcon() {
  return <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
}
function FoodIcon() {
  return <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>;
}
