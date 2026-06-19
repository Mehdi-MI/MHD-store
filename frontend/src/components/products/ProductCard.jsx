import { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

/**
 * ProductCard
 * Props:
 *   product  : { id, name, price, originalPrice?, images, rating, reviewCount, seller, badge? }
 *   onAddToCart       : (product) => void
 *   onWishlistToggle  : (productId) => void
 *   wishlisted        : bool
 *   view              : 'grid' | 'list'
 */
export default function ProductCard({ product, onAddToCart, onWishlistToggle, wishlisted = false, view = 'grid' }) {
  const [imgError, setImgError] = useState(false);
  const [adding,   setAdding]   = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault(); e.stopPropagation();
    setAdding(true);
    await onAddToCart?.(product);
    setTimeout(() => setAdding(false), 800);
  };

  const handleWishlist = (e) => {
    e.preventDefault(); e.stopPropagation();
    onWishlistToggle?.(product.id);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  if (view === 'list') {
    return (
      <Link to={`/products/${product.id}`} className="product-card product-card--list" aria-label={product.name}>
        {/* Image */}
        <div className="product-card__img-wrap product-card__img-wrap--list">
          {!imgError && product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} className="product-card__img" onError={() => setImgError(true)} loading="lazy" />
          ) : (
            <div className="product-card__img-placeholder">
              <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="0.8" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
          )}
          {product.badge && <span className="product-card__badge">{product.badge}</span>}
        </div>

        {/* Info */}
        <div className="product-card__info product-card__info--list">
          <p className="product-card__seller">{product.seller?.store_name || 'MHD Store'}</p>
          <h3 className="product-card__name product-card__name--list">{product.name}</h3>
          <div className="product-card__rating">
            <span className="product-card__stars">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5-Math.round(product.rating))}</span>
            <span className="product-card__review-count">({product.reviewCount})</span>
          </div>
        </div>

        {/* Right: price + actions */}
        <div className="product-card__list-actions">
          <div className="product-card__pricing">
            <span className="product-card__price">${product.price.toFixed(2)}</span>
            {product.originalPrice && <span className="product-card__original">${product.originalPrice.toFixed(2)}</span>}
            {discount && <span className="product-card__discount">−{discount}%</span>}
          </div>
          <div className="product-card__action-btns">
            <button className={`product-card__wishlist ${wishlisted ? 'product-card__wishlist--active':''}`}
              onClick={handleWishlist} aria-label={wishlisted ? 'Remove from wishlist':'Add to wishlist'}>
              <svg width="15" height="15" fill={wishlisted?'currentColor':'none'} stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
            <button className="product-card__add-btn btn-primary" onClick={handleAddToCart} disabled={adding}>
              {adding ? '✓ Added' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </Link>
    );
  }

  /* ── Grid view (default) ── */
  return (
    <Link to={`/products/${product.id}`} className="product-card" aria-label={product.name}>
      <div className="product-card__img-wrap">
        {!imgError && product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className="product-card__img" onError={() => setImgError(true)} loading="lazy" />
        ) : (
          <div className="product-card__img-placeholder">
            <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="0.8" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        )}
        {product.badge && <span className="product-card__badge">{product.badge}</span>}
        {discount && <span className="product-card__badge product-card__badge--discount">−{discount}%</span>}

        <button className={`product-card__wishlist ${wishlisted?'product-card__wishlist--active':''}`}
          onClick={handleWishlist} aria-label={wishlisted?'Remove from wishlist':'Add to wishlist'}>
          <svg width="16" height="16" fill={wishlisted?'currentColor':'none'} stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        <div className="product-card__overlay">
          <button className="product-card__quick-add" onClick={handleAddToCart} disabled={adding}>
            {adding ? 'Added ✓' : 'Quick Add'}
          </button>
        </div>
      </div>

      <div className="product-card__info">
        <p className="product-card__seller">{product.seller?.store_name || 'MHD Store'}</p>
        <h3 className="product-card__name">{product.name}</h3>
        <div className="product-card__footer">
          <div className="product-card__pricing">
            <span className="product-card__price">${product.price.toFixed(2)}</span>
            {product.originalPrice && <span className="product-card__original">${product.originalPrice.toFixed(2)}</span>}
          </div>
          <div className="product-card__rating">
            <span className="product-card__stars">{'★'.repeat(Math.round(product.rating))}{'☆'.repeat(5-Math.round(product.rating))}</span>
            <span className="product-card__review-count">({product.reviewCount})</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
