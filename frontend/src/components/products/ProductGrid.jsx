import ProductCard from './ProductCard';
import './ProductGrid.css';

/**
 * ProductGrid
 * Props:
 *   products: array
 *   loading: bool
 *   wishlisted: string[]
 *   onAddToCart: fn
 *   onWishlistToggle: fn
 *   view: 'grid' | 'list'
 */
export default function ProductGrid({ products, loading, wishlisted, onAddToCart, onWishlistToggle, view = 'grid' }) {
  if (loading) {
    return (
      <div className={`product-grid product-grid--${view}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="product-skeleton">
            <div className="product-skeleton__img skeleton-pulse" />
            <div className="product-skeleton__body">
              <div className="skeleton-pulse skeleton-line" style={{ width: '55%', height: '10px' }} />
              <div className="skeleton-pulse skeleton-line" style={{ width: '80%', height: '16px', marginTop: '8px' }} />
              <div className="skeleton-pulse skeleton-line" style={{ width: '40%', height: '14px', marginTop: '12px' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="product-grid__empty">
        <div className="product-grid__empty-icon">
          <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="0.8" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            <path d="M8 11h6M11 8v6" strokeWidth="1"/>
          </svg>
        </div>
        <h3>No products found</h3>
        <p>Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className={`product-grid product-grid--${view}`}>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onWishlistToggle={onWishlistToggle}
          wishlisted={wishlisted.includes(product.id)}
          view={view}
        />
      ))}
    </div>
  );
}
