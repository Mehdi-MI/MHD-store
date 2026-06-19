import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from '../../components/products/ProductCard';
import ProductFilter from '../../components/products/ProductFilter';
import './Search.css';

/* ── Mock data — replace with productService.getAll({ search: q }) ── */
const ALL_PRODUCTS = [
  { id:1,  name:'Cashmere Blend Overcoat',        price:349, originalPrice:480, images:[], rating:4.9, reviewCount:128, seller:{store_name:'Maison Élite'},  badge:'New',        category:'fashion'     },
  { id:2,  name:'Minimal Wireless Earbuds',        price:189, originalPrice:null,images:[], rating:4.8, reviewCount:94,  seller:{store_name:'TechVault'},     badge:'Bestseller', category:'electronics' },
  { id:3,  name:'Hand-Thrown Ceramic Vase Set',    price:124, originalPrice:null,images:[], rating:4.6, reviewCount:61,  seller:{store_name:'Atelier Nord'},  badge:null,         category:'home-living' },
  { id:4,  name:'Leather Bifold Wallet',           price:95,  originalPrice:130, images:[], rating:4.7, reviewCount:203, seller:{store_name:'Craft & Hide'},  badge:'Sale',       category:'fashion'     },
  { id:5,  name:'Botanical Candle Collection',     price:68,  originalPrice:null,images:[], rating:4.9, reviewCount:317, seller:{store_name:'Grove & Wax'},   badge:null,         category:'home-living' },
  { id:6,  name:'Merino Wool Throw Blanket',       price:215, originalPrice:null,images:[], rating:4.8, reviewCount:88,  seller:{store_name:'Nordic Knit'},   badge:'New',        category:'home-living' },
  { id:7,  name:'Silk Pillowcase Duo',             price:89,  originalPrice:110, images:[], rating:4.7, reviewCount:142, seller:{store_name:'Rest & Glow'},   badge:null,         category:'home-living' },
  { id:8,  name:'Smart Watch Series X',            price:299, originalPrice:null,images:[], rating:4.5, reviewCount:76,  seller:{store_name:'TechVault'},     badge:'New',        category:'electronics' },
  { id:9,  name:'Rose Hip Face Serum 30ml',        price:58,  originalPrice:75,  images:[], rating:4.8, reviewCount:229, seller:{store_name:'Lumière Lab'},   badge:'Sale',       category:'beauty'      },
  { id:10, name:'Linen Wide-Leg Trousers',         price:145, originalPrice:null,images:[], rating:4.6, reviewCount:55,  seller:{store_name:'Maison Élite'},  badge:null,         category:'fashion'     },
  { id:11, name:'Yoga Mat — Natural Rubber',       price:110, originalPrice:null,images:[], rating:4.9, reviewCount:184, seller:{store_name:'Form & Flow'},   badge:'Bestseller', category:'sports'      },
  { id:12, name:'Abstract Canvas Print 60x80cm',   price:320, originalPrice:null,images:[], rating:4.7, reviewCount:38,  seller:{store_name:'Studio Blank'},  badge:null,         category:'art'         },
];

const POPULAR_SEARCHES = ['cashmere', 'earbuds', 'ceramic', 'leather wallet', 'candle', 'yoga mat', 'silk', 'art print'];

const DEFAULT_FILTERS = { category:'', search:'', sort:'newest', minPrice:'', maxPrice:'', rating:'' };

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || '';

  const [query,   setQuery]   = useState(initialQ);
  const [input,   setInput]   = useState(initialQ);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!initialQ);
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS, search: initialQ });
  const [wishlist, setWishlist] = useState([]);
  const [view, setView]       = useState('grid');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  /* Run search */
  const runSearch = useCallback((q, f = filters) => {
    if (!q.trim()) { setResults([]); setHasSearched(false); return; }
    setLoading(true);
    setHasSearched(true);
    setTimeout(() => {
      let res = ALL_PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.category.toLowerCase().includes(q.toLowerCase()) ||
        p.seller.store_name.toLowerCase().includes(q.toLowerCase())
      );
      if (f.category)  res = res.filter(p => p.category === f.category);
      if (f.minPrice)  res = res.filter(p => p.price >= Number(f.minPrice));
      if (f.maxPrice)  res = res.filter(p => p.price <= Number(f.maxPrice));
      if (f.rating)    res = res.filter(p => p.rating >= Number(f.rating));
      switch (f.sort) {
        case 'price_asc':  res.sort((a,b) => a.price - b.price); break;
        case 'price_desc': res.sort((a,b) => b.price - a.price); break;
        case 'popular':    res.sort((a,b) => b.reviewCount - a.reviewCount); break;
        case 'rating':     res.sort((a,b) => b.rating - a.rating); break;
        default:           res.sort((a,b) => b.id - a.id);
      }
      setResults(res);
      setLoading(false);
    }, 350);
  }, [filters]);

  /* Run on mount if query exists */
  useEffect(() => {
    if (initialQ) runSearch(initialQ);
  }, []); // eslint-disable-line

  /* Sync URL */
  useEffect(() => {
    if (query) setSearchParams({ q: query }, { replace: true });
    else setSearchParams({}, { replace: true });
  }, [query, setSearchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = input.trim();
    setQuery(q);
    runSearch(q, filters);
  };

  const handleSuggestion = (q) => {
    setInput(q); setQuery(q);
    runSearch(q, filters);
  };

  const handleFilterChange = (f) => {
    setFilters(f);
    if (query) runSearch(query, f);
  };

  const handleReset = () => {
    const f = { ...DEFAULT_FILTERS, search: query };
    setFilters(f);
    if (query) runSearch(query, f);
  };

  return (
    <div className="search-page">

      {/* ── Search hero ──────────────────────────── */}
      <div className="search-hero">
        <div className="search-hero__inner">
          <span className="section-tag">Search</span>
          <h1 className="search-hero__title">
            Find your next <em>favourite</em>
          </h1>

          <form className="search-hero__form" onSubmit={handleSubmit} role="search">
            <div className="search-hero__input-wrap">
              <svg className="search-hero__icon" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="search"
                className="search-hero__input"
                placeholder="Search products, sellers, categories…"
                value={input}
                onChange={e => setInput(e.target.value)}
                autoFocus
                autoComplete="off"
                aria-label="Search"
              />
              {input && (
                <button type="button" className="search-hero__clear"
                  onClick={() => { setInput(''); setQuery(''); setResults([]); setHasSearched(false); }}
                  aria-label="Clear search">
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M18 6 6 18M6 6l12 12"/>
                  </svg>
                </button>
              )}
            </div>
            <button type="submit" className="btn-primary search-hero__submit">
              Search
            </button>
          </form>

          {/* Popular searches */}
          {!hasSearched && (
            <div className="search-suggestions">
              <span className="search-suggestions__label">Popular:</span>
              {POPULAR_SEARCHES.map(s => (
                <button key={s} className="search-suggestions__tag"
                  onClick={() => handleSuggestion(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Result count line */}
          {hasSearched && !loading && (
            <p className="search-hero__meta">
              {results.length > 0
                ? <><span>{results.length}</span> result{results.length !== 1 ? 's' : ''} for <em>"{query}"</em></>
                : <>No results for <em>"{query}"</em></>}
            </p>
          )}
        </div>
      </div>

      {/* ── Results area ─────────────────────────── */}
      {hasSearched && (
        <div className="search-body">

          {/* Filter sidebar */}
          <ProductFilter
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleReset}
            totalResults={results.length}
            mobileOpen={mobileFiltersOpen}
            onMobileClose={() => setMobileFiltersOpen(false)}
          />

          <div className="search-main">

            {/* Toolbar */}
            <div className="search-toolbar">
              <div className="search-toolbar__left">
                <button className="search-filter-trigger btn-outline"
                  onClick={() => setMobileFiltersOpen(true)}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <line x1="4" y1="6" x2="20" y2="6"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                    <line x1="11" y1="18" x2="13" y2="18"/>
                  </svg>
                  Filters
                </button>
                {query && (
                  <span className="search-toolbar__query">
                    Results for <strong>"{query}"</strong>
                  </span>
                )}
              </div>
              <div className="search-toolbar__right">
                {/* View toggle */}
                <div className="view-toggle">
                  <button className={`view-toggle__btn ${view==='grid'?'active':''}`}
                    onClick={() => setView('grid')} aria-label="Grid view">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                    </svg>
                  </button>
                  <button className={`view-toggle__btn ${view==='list'?'active':''}`}
                    onClick={() => setView('list')} aria-label="List view">
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <line x1="3" y1="6" x2="21" y2="6"/>
                      <line x1="3" y1="12" x2="21" y2="12"/>
                      <line x1="3" y1="18" x2="21" y2="18"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className={`search-results search-results--${view}`}>
                {Array.from({length:6}).map((_,i) => (
                  <div key={i} className="product-skeleton">
                    <div className="product-skeleton__img skeleton-pulse" />
                    <div className="product-skeleton__body">
                      <div className="skeleton-pulse skeleton-line" style={{width:'55%',height:'10px'}} />
                      <div className="skeleton-pulse skeleton-line" style={{width:'80%',height:'16px',marginTop:'8px'}} />
                      <div className="skeleton-pulse skeleton-line" style={{width:'40%',height:'14px',marginTop:'12px'}} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No results */}
            {!loading && results.length === 0 && (
              <div className="search-empty">
                <div className="search-empty__icon">
                  <svg width="56" height="56" fill="none" stroke="currentColor" strokeWidth="0.7" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    <path d="M8 11h6" strokeWidth="1"/>
                  </svg>
                </div>
                <h2>No results found</h2>
                <p>We couldn't find anything matching <strong>"{query}"</strong>.</p>
                <ul className="search-empty__tips">
                  <li>Check your spelling</li>
                  <li>Try more general terms</li>
                  <li>Browse by <Link to="/categories">category</Link> instead</li>
                </ul>
                <div className="search-empty__popular">
                  <p>Try one of these:</p>
                  <div className="search-suggestions">
                    {POPULAR_SEARCHES.slice(0,5).map(s => (
                      <button key={s} className="search-suggestions__tag"
                        onClick={() => handleSuggestion(s)}>{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Results grid */}
            {!loading && results.length > 0 && (
              <div className={`search-results search-results--${view}`}>
                {results.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    view={view}
                    onAddToCart={p => console.log('cart:', p.name)}
                    onWishlistToggle={id => setWishlist(prev =>
                      prev.includes(id) ? prev.filter(i=>i!==id) : [...prev,id]
                    )}
                    wishlisted={wishlist.includes(product.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Empty state (no search yet) ──────────── */}
      {!hasSearched && (
        <div className="search-idle">
          <div className="search-idle__inner">
            <p className="search-idle__label">Browse by category</p>
            <div className="search-idle__cats">
              {['fashion','electronics','home-living','beauty','sports','art'].map(slug => (
                <Link key={slug} to={`/categories/${slug}`} className="search-idle__cat">
                  {slug.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}
                </Link>
              ))}
            </div>
            <Link to="/products" className="btn-ghost" style={{marginTop:'2rem'}}>
              Browse all products
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
