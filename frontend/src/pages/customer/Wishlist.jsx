import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/products/ProductCard';
import './CustomerPages.css';

const MOCK_WISHLIST = [
  { id:1,  name:'Cashmere Blend Overcoat — Midnight', price:349, originalPrice:480, images:[], rating:4.9, reviewCount:128, seller:{store_name:'Maison Élite'}, badge:'New'        },
  { id:6,  name:'Merino Wool Throw Blanket',          price:215, originalPrice:null,images:[], rating:4.8, reviewCount:88,  seller:{store_name:'Nordic Knit'},  badge:'New'        },
  { id:9,  name:'Rose Hip Face Serum 30ml',           price:58,  originalPrice:75,  images:[], rating:4.8, reviewCount:229, seller:{store_name:'Lumière Lab'},   badge:'Sale'       },
  { id:11, name:'Yoga Mat — Natural Rubber',          price:110, originalPrice:null,images:[], rating:4.9, reviewCount:184, seller:{store_name:'Form & Flow'},   badge:'Bestseller' },
];

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(MOCK_WISHLIST.map(p => p.id));
  const [items,    setItems]    = useState(MOCK_WISHLIST);

  const handleRemove = (id) => {
    setWishlist(prev => prev.filter(i => i !== id));
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleAddToCart = (product) => {
    console.log('Add to cart:', product.name);
  };

  return (
    <div className="cp-page">
      <div className="cp-header">
        <div>
          <span className="section-tag">Account</span>
          <h1 className="cp-title">My <em>Wishlist</em></h1>
        </div>
        {items.length > 0 && (
          <span className="cp-count-badge">{items.length} item{items.length!==1?'s':''}</span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="cp-empty">
          <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="0.8" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <p>Your wishlist is empty</p>
          <Link to="/products" className="btn-outline cp-btn-sm">Discover Products</Link>
        </div>
      ) : (
        <>
          <div className="cp-wishlist-actions">
            <button className="btn-outline cp-btn-sm" onClick={() => items.forEach(p => handleAddToCart(p))}>
              Add all to Cart
            </button>
            <button className="cp-link-btn cp-link-btn--danger"
              onClick={() => { setItems([]); setWishlist([]); }}>
              Clear wishlist
            </button>
          </div>
          <div className="cp-wishlist-grid">
            {items.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onWishlistToggle={handleRemove}
                wishlisted={wishlist.includes(product.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
