import { useState } from 'react';
import './ProductFilter.css';

const CATEGORIES = [
  { label: 'All Categories',    value: '' },
  { label: 'Fashion & Apparel', value: 'fashion' },
  { label: 'Electronics',       value: 'electronics' },
  { label: 'Home & Living',     value: 'home-living' },
  { label: 'Beauty & Care',     value: 'beauty' },
  { label: 'Sports & Outdoor',  value: 'sports' },
  { label: 'Art & Collectibles',value: 'art' },
];

const SORT_OPTIONS = [
  { label: 'Newest First',       value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Most Popular',       value: 'popular' },
  { label: 'Top Rated',          value: 'rating' },
];

export default function ProductFilter({ filters, onChange, onReset, totalResults = 0, mobileOpen, onMobileClose }) {
  const [localMin, setLocalMin] = useState(filters.minPrice || '');
  const [localMax, setLocalMax] = useState(filters.maxPrice || '');

  const set = (key, val) => onChange({ ...filters, [key]: val });
  const applyPrice = () => onChange({ ...filters, minPrice: localMin, maxPrice: localMax });
  const hasActive = filters.category || filters.minPrice || filters.maxPrice || filters.rating;

  return (
    <>
      {mobileOpen && <div className="filter__overlay" onClick={onMobileClose} />}
      <aside className={`product-filter ${mobileOpen ? 'product-filter--open' : ''}`}>

        <div className="filter__head">
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <h2 className="filter__title">Filters</h2>
            {hasActive && <span className="filter__dot" />}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
            {hasActive && <button className="filter__reset" onClick={onReset}>Clear all</button>}
            <button className="filter__close-btn" onClick={onMobileClose} aria-label="Close">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <p className="filter__count"><span>{totalResults.toLocaleString()}</span> products</p>

        <div className="filter__block">
          <p className="filter__label">Sort By</p>
          {SORT_OPTIONS.map(({ label, value }) => (
            <button key={value} className={`filter__sort-item ${filters.sort === value ? 'active' : ''}`}
              onClick={() => set('sort', value)}>{label}</button>
          ))}
        </div>

        <div className="filter__line" />

        <div className="filter__block">
          <p className="filter__label">Category</p>
          {CATEGORIES.map(({ label, value }) => (
            <button key={value} className={`filter__cat-item ${filters.category === value ? 'active' : ''}`}
              onClick={() => set('category', value)}>
              <span className="filter__cat-dot" />{label}
            </button>
          ))}
        </div>

        <div className="filter__line" />

        <div className="filter__block">
          <p className="filter__label">Price Range</p>
          <div className="filter__price-row">
            <div className="filter__price-field">
              <label>Min</label>
              <div className="filter__price-input">
                <span>$</span>
                <input type="number" placeholder="0" value={localMin} min="0"
                  onChange={e => setLocalMin(e.target.value)} onBlur={applyPrice}
                  onKeyDown={e => e.key === 'Enter' && applyPrice()} />
              </div>
            </div>
            <span className="filter__price-sep">to</span>
            <div className="filter__price-field">
              <label>Max</label>
              <div className="filter__price-input">
                <span>$</span>
                <input type="number" placeholder="any" value={localMax} min="0"
                  onChange={e => setLocalMax(e.target.value)} onBlur={applyPrice}
                  onKeyDown={e => e.key === 'Enter' && applyPrice()} />
              </div>
            </div>
          </div>
          <button className="filter__price-apply" onClick={applyPrice}>Apply Price</button>
        </div>

        <div className="filter__line" />

        <div className="filter__block">
          <p className="filter__label">Min Rating</p>
          {[5,4,3,2,1].map(r => (
            <button key={r} className={`filter__rating-item ${filters.rating === String(r) ? 'active' : ''}`}
              onClick={() => set('rating', filters.rating === String(r) ? '' : String(r))}>
              <span className="filter__stars">{'★'.repeat(r)}{'☆'.repeat(5-r)}</span>
              <span className="filter__rating-sub">and up</span>
            </button>
          ))}
        </div>

        <button className="filter__mobile-apply btn-primary" onClick={onMobileClose}>
          View {totalResults} Results
        </button>
      </aside>
    </>
  );
}
