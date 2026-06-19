import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useReveal } from '../../hooks/useReveal';
import ProductCard from '../../components/products/ProductCard';
import './ProductDetails.css';

/* ── Mock data — replace with dispatch(fetchProductById(id)) ── */
const MOCK_PRODUCT = {
  id: 1,
  name: 'Cashmere Blend Overcoat — Midnight',
  slug: 'cashmere-blend-overcoat-midnight',
  price: 349,
  originalPrice: 480,
  images: [],
  rating: 4.9,
  reviewCount: 128,
  badge: 'New',
  category: { name: 'Fashion & Apparel', slug: 'fashion' },
  seller: { id: 1, store_name: 'Maison Élite', avatar: null, rating: 4.9, productCount: 48 },
  description: `Crafted from a luxurious blend of 90% cashmere and 10% silk, this overcoat is the definitive statement piece for the discerning wardrobe. The structured silhouette is balanced by the fluid drape of the fabric, creating a garment that transitions effortlessly from boardroom to evening.

Each coat is hand-finished in our atelier in Milan, with mother-of-pearl buttons and fully lined in Bemberg cupro for a whisper-soft sensation against the skin. The deep midnight colourway is achieved through a proprietary double-dye process, ensuring lasting richness.`,
  details: [
    { label: 'Material',    value: '90% Cashmere, 10% Silk' },
    { label: 'Lining',      value: 'Bemberg Cupro' },
    { label: 'Fit',         value: 'Tailored / Regular' },
    { label: 'Origin',      value: 'Made in Italy' },
    { label: 'Care',        value: 'Dry clean only' },
    { label: 'SKU',         value: 'ME-OC-001-MID' },
  ],
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
  colors: [
    { name: 'Midnight', hex: '#1a1a2e' },
    { name: 'Camel',    hex: '#c19a6b' },
    { name: 'Ivory',    hex: '#f5f0e8' },
  ],
  stock: 8,
  tags: ['luxury', 'cashmere', 'overcoat', 'winter'],
};

const MOCK_REVIEWS = [
  { id:1, name:'Sophie L.', rating:5, date:'2025-03-12', comment:'Absolutely impeccable quality. The cashmere is impossibly soft and the cut is perfection. Worth every penny.', verified:true },
  { id:2, name:'James M.',  rating:5, date:'2025-02-28', comment:'I was hesitant at the price point but this coat has exceeded every expectation. The midnight colour is even richer in person.', verified:true },
  { id:3, name:'Aiko K.',   rating:4, date:'2025-01-15', comment:'Beautiful coat, excellent craftsmanship. Runs slightly large — I\'d recommend sizing down. The lining is exquisite.', verified:true },
];

const RELATED_PRODUCTS = [
  { id:10, name:'Linen Wide-Leg Trousers', price:145, originalPrice:null, images:[], rating:4.6, reviewCount:55,  seller:{store_name:'Maison Élite'}, badge:null },
  { id:4,  name:'Leather Bifold Wallet',   price:95,  originalPrice:130,  images:[], rating:4.7, reviewCount:203, seller:{store_name:'Craft & Hide'},  badge:'Sale' },
  { id:11, name:'Yoga Mat — Natural Rubber',price:110,originalPrice:null, images:[], rating:4.9, reviewCount:184, seller:{store_name:'Form & Flow'},   badge:'Bestseller' },
  { id:5,  name:'Botanical Candle Collection',price:68,originalPrice:null,images:[], rating:4.9, reviewCount:317, seller:{store_name:'Grove & Wax'},   badge:null },
];

export default function ProductDetails() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const relatedRef   = useReveal();

  const [product,      setProduct]      = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [activeImg,    setActiveImg]    = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor,setSelectedColor]= useState('');
  const [quantity,     setQuantity]     = useState(1);
  const [wishlisted,   setWishlisted]   = useState(false);
  const [addingCart,   setAddingCart]   = useState(false);
  const [activeTab,    setActiveTab]    = useState('description'); // description | details | reviews
  const [reviewWishlist, setReviewWishlist] = useState([]);

  useEffect(() => {
    setLoading(true);
    // Replace with: dispatch(fetchProductById(id))
    setTimeout(() => {
      setProduct(MOCK_PRODUCT);
      setSelectedColor(MOCK_PRODUCT.colors[0].name);
      setLoading(false);
    }, 400);
  }, [id]);

  const handleAddToCart = async () => {
    if (!selectedSize) { alert('Please select a size'); return; }
    setAddingCart(true);
    // dispatch(addToCart({ ...product, selectedSize, selectedColor, quantity }))
    setTimeout(() => setAddingCart(false), 900);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const avgRating = MOCK_REVIEWS.reduce((s,r) => s + r.rating, 0) / MOCK_REVIEWS.length;

  /* ── Placeholder images (4 panels) ── */
  const PLACEHOLDER_IMGS = [0,1,2,3];

  if (loading) return <ProductDetailsSkeleton />;
  if (!product) return <div className="pd-not-found">Product not found.</div>;

  return (
    <div className="pd-page">

      {/* ── Breadcrumb ─────────────────────────── */}
      <div className="pd-breadcrumb">
        <div className="pd-breadcrumb__inner">
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/products">Products</Link>
          <span>›</span>
          <Link to={`/categories/${product.category.slug}`}>{product.category.name}</Link>
          <span>›</span>
          <span className="pd-breadcrumb__current">{product.name}</span>
        </div>
      </div>

      {/* ── Main layout ────────────────────────── */}
      <div className="pd-main">

        {/* LEFT — Image gallery */}
        <div className="pd-gallery">
          {/* Thumbnails */}
          <div className="pd-gallery__thumbs">
            {PLACEHOLDER_IMGS.map((_, i) => (
              <button
                key={i}
                className={`pd-gallery__thumb ${activeImg === i ? 'active' : ''}`}
                onClick={() => setActiveImg(i)}
                aria-label={`View image ${i+1}`}
              >
                <div className="pd-gallery__thumb-inner">
                  <GalleryPlaceholder size={24} />
                </div>
              </button>
            ))}
          </div>

          {/* Main image */}
          <div className="pd-gallery__main">
            <div className="pd-gallery__img-wrap">
              <GalleryPlaceholder size={64} />
              {product.badge && <span className="pd-badge">{product.badge}</span>}
              {discount && <span className="pd-badge pd-badge--discount">−{discount}%</span>}

              {/* Nav arrows */}
              <button className="pd-gallery__arrow pd-gallery__arrow--prev"
                onClick={() => setActiveImg(i => (i-1+PLACEHOLDER_IMGS.length) % PLACEHOLDER_IMGS.length)}
                aria-label="Previous image">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button className="pd-gallery__arrow pd-gallery__arrow--next"
                onClick={() => setActiveImg(i => (i+1) % PLACEHOLDER_IMGS.length)}
                aria-label="Next image">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>

            {/* Dot indicators */}
            <div className="pd-gallery__dots">
              {PLACEHOLDER_IMGS.map((_, i) => (
                <button key={i} className={`pd-gallery__dot ${activeImg===i?'active':''}`}
                  onClick={() => setActiveImg(i)} aria-label={`Image ${i+1}`} />
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Product info */}
        <div className="pd-info">

          {/* Seller */}
          <div className="pd-seller">
            <div className="pd-seller__avatar">
              {product.seller.store_name.charAt(0)}
            </div>
            <div>
              <Link to={`/sellers/${product.seller.id}`} className="pd-seller__name">
                {product.seller.store_name}
              </Link>
              <div className="pd-seller__meta">
                <span className="pd-seller__rating">★ {product.seller.rating}</span>
                <span>·</span>
                <span>{product.seller.productCount} products</span>
              </div>
            </div>
          </div>

          {/* Title + rating */}
          <div className="pd-info__header">
            <span className="section-tag">{product.category.name}</span>
            <h1 className="pd-title">{product.name}</h1>
            <div className="pd-rating">
              <span className="pd-rating__stars">
                {'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5-Math.round(product.rating))}
              </span>
              <span className="pd-rating__score">{product.rating}</span>
              <span className="pd-rating__count">({product.reviewCount} reviews)</span>
            </div>
          </div>

          {/* Price */}
          <div className="pd-pricing">
            <span className="pd-price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="pd-original">${product.originalPrice.toFixed(2)}</span>
            )}
            {discount && <span className="pd-discount">{discount}% off</span>}
          </div>

          <div className="pd-divider" />

          {/* Color selector */}
          <div className="pd-option">
            <div className="pd-option__label">
              Colour: <strong>{selectedColor}</strong>
            </div>
            <div className="pd-colors">
              {product.colors.map(({ name, hex }) => (
                <button
                  key={name}
                  className={`pd-color ${selectedColor===name ? 'active':''}`}
                  style={{ background: hex }}
                  onClick={() => setSelectedColor(name)}
                  aria-label={name}
                  aria-pressed={selectedColor===name}
                  title={name}
                />
              ))}
            </div>
          </div>

          {/* Size selector */}
          <div className="pd-option">
            <div className="pd-option__label">
              Size: <strong>{selectedSize || 'Select a size'}</strong>
            </div>
            <div className="pd-sizes">
              {product.sizes.map(size => (
                <button
                  key={size}
                  className={`pd-size ${selectedSize===size ? 'active':''}`}
                  onClick={() => setSelectedSize(size)}
                  aria-pressed={selectedSize===size}
                >
                  {size}
                </button>
              ))}
            </div>
            <button className="pd-size-guide">Size guide →</button>
          </div>

          {/* Quantity */}
          <div className="pd-option">
            <div className="pd-option__label">Quantity</div>
            <div className="pd-qty">
              <button
                className="pd-qty__btn"
                onClick={() => setQuantity(q => Math.max(1, q-1))}
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
              >−</button>
              <span className="pd-qty__val">{quantity}</span>
              <button
                className="pd-qty__btn"
                onClick={() => setQuantity(q => Math.min(product.stock, q+1))}
                aria-label="Increase quantity"
                disabled={quantity >= product.stock}
              >+</button>
              <span className="pd-stock">
                {product.stock <= 5
                  ? <span className="pd-stock--low">Only {product.stock} left</span>
                  : <span className="pd-stock--ok">In stock</span>}
              </span>
            </div>
          </div>

          <div className="pd-divider" />

          {/* CTA buttons */}
          <div className="pd-ctas">
            <button
              className="btn-primary pd-cta-cart"
              onClick={handleAddToCart}
              disabled={addingCart}
            >
              {addingCart
                ? <>✓ Added to Cart</>
                : <>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                      <line x1="3" y1="6" x2="21" y2="6"/>
                      <path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                    Add to Cart
                  </>}
            </button>
            <button className="pd-cta-buy btn-outline" onClick={handleBuyNow}>
              Buy Now
            </button>
            <button
              className={`pd-cta-wish ${wishlisted ? 'active':''}`}
              onClick={() => setWishlisted(w => !w)}
              aria-label={wishlisted ? 'Remove from wishlist':'Add to wishlist'}
              aria-pressed={wishlisted}
            >
              <svg width="18" height="18" fill={wishlisted?'currentColor':'none'} stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
          </div>

          {/* Trust signals */}
          <div className="pd-trust">
            {[
              { icon: <ShieldIcon />, text: 'Secure checkout — SSL encrypted' },
              { icon: <TruckIcon  />, text: 'Free shipping on orders over $150' },
              { icon: <ReturnIcon />, text: '30-day hassle-free returns' },
            ].map(({ icon, text }) => (
              <div key={text} className="pd-trust__item">
                {icon}<span>{text}</span>
              </div>
            ))}
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="pd-tags">
              {product.tags.map(tag => (
                <Link key={tag} to={`/search?q=${tag}`} className="pd-tag">{tag}</Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Tabs: Description / Details / Reviews ── */}
      <div className="pd-tabs-section">
        <div className="pd-tabs">
          {['description','details','reviews'].map(tab => (
            <button
              key={tab}
              className={`pd-tab ${activeTab===tab ? 'active':''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'reviews' ? `Reviews (${MOCK_REVIEWS.length})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="pd-tab-content">

          {/* Description */}
          {activeTab === 'description' && (
            <div className="pd-description">
              {product.description.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}

          {/* Details */}
          {activeTab === 'details' && (
            <div className="pd-details-table">
              {product.details.map(({ label, value }) => (
                <div key={label} className="pd-details-row">
                  <span className="pd-details-label">{label}</span>
                  <span className="pd-details-value">{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Reviews */}
          {activeTab === 'reviews' && (
            <div className="pd-reviews">
              {/* Summary */}
              <div className="pd-reviews__summary">
                <div className="pd-reviews__score">
                  <span className="pd-reviews__score-num">{avgRating.toFixed(1)}</span>
                  <div className="pd-reviews__score-stars">
                    {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5-Math.round(avgRating))}
                  </div>
                  <span className="pd-reviews__score-label">{MOCK_REVIEWS.length} reviews</span>
                </div>
                <div className="pd-reviews__bars">
                  {[5,4,3,2,1].map(star => {
                    const count = MOCK_REVIEWS.filter(r => r.rating === star).length;
                    const pct   = Math.round((count / MOCK_REVIEWS.length) * 100);
                    return (
                      <div key={star} className="pd-reviews__bar-row">
                        <span>{star}★</span>
                        <div className="pd-reviews__bar-track">
                          <div className="pd-reviews__bar-fill" style={{ width:`${pct}%` }} />
                        </div>
                        <span>{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review cards */}
              <div className="pd-reviews__list">
                {MOCK_REVIEWS.map(({ id, name, rating, date, comment, verified }) => (
                  <article key={id} className="pd-review-card">
                    <div className="pd-review-card__header">
                      <div className="pd-review-card__avatar">{name.charAt(0)}</div>
                      <div>
                        <div className="pd-review-card__name">
                          {name}
                          {verified && <span className="pd-review-card__verified">✓ Verified</span>}
                        </div>
                        <div className="pd-review-card__meta">
                          <span className="pd-review-card__stars">{'★'.repeat(rating)}{'☆'.repeat(5-rating)}</span>
                          <span className="pd-review-card__date">{new Date(date).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</span>
                        </div>
                      </div>
                    </div>
                    <p className="pd-review-card__comment">{comment}</p>
                  </article>
                ))}
              </div>

              <button className="pd-reviews__write btn-outline">Write a Review</button>
            </div>
          )}
        </div>
      </div>

      {/* ── Related Products ──────────────────── */}
      <section className="pd-related" ref={relatedRef}>
        <div className="pd-related__head">
          <span className="section-tag">You May Also Like</span>
          <h2 className="section-title" style={{ marginTop:'0.5rem' }}>
            Related <em>Products</em>
          </h2>
        </div>
        <div className="pd-related__grid reveal">
          {RELATED_PRODUCTS.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={p => console.log('cart:', p.name)}
              onWishlistToggle={pid => setReviewWishlist(prev =>
                prev.includes(pid) ? prev.filter(i=>i!==pid) : [...prev, pid]
              )}
              wishlisted={reviewWishlist.includes(product.id)}
            />
          ))}
        </div>
      </section>

    </div>
  );
}

/* ── Loading skeleton ── */
function ProductDetailsSkeleton() {
  return (
    <div className="pd-page pd-page--loading">
      <div className="pd-skeleton-main">
        <div className="pd-skeleton__gallery skeleton-pulse" />
        <div className="pd-skeleton__info">
          {[60,40,30,80,50,90,40].map((w,i) => (
            <div key={i} className="skeleton-pulse skeleton-line" style={{ width:`${w}%`, height: i===2?'2rem':'14px', marginBottom:'0.75rem' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── SVG Icons ── */
function GalleryPlaceholder({ size }) {
  return (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="0.7" viewBox="0 0 24 24" style={{color:'var(--gold-dim)',opacity:0.4}}>
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  );
}
function ShieldIcon() {
  return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
}
function TruckIcon() {
  return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
}
function ReturnIcon() {
  return <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4"/></svg>;
}
