import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductFilter from '../../components/products/ProductFilter';
import ProductGrid   from '../../components/products/ProductGrid';
import './Products.css';

/* ── Mock data — replace with: dispatch(fetchProducts(filters)) ── */
const ALL_PRODUCTS = [
  { id:1,  name:'Cashmere Blend Overcoat',         price:349, originalPrice:480, images:[], rating:4.9, reviewCount:128, seller:{store_name:'Maison Élite'},  badge:'New',        category:'fashion'     },
  { id:2,  name:'Minimal Wireless Earbuds',         price:189, originalPrice:null, images:[], rating:4.8, reviewCount:94,  seller:{store_name:'TechVault'},     badge:'Bestseller', category:'electronics' },
  { id:3,  name:'Hand-Thrown Ceramic Vase Set',     price:124, originalPrice:null, images:[], rating:4.6, reviewCount:61,  seller:{store_name:'Atelier Nord'},  badge:null,         category:'home-living' },
  { id:4,  name:'Leather Bifold Wallet',            price:95,  originalPrice:130,  images:[], rating:4.7, reviewCount:203, seller:{store_name:'Craft & Hide'},  badge:'Sale',       category:'fashion'     },
  { id:5,  name:'Botanical Candle Collection',      price:68,  originalPrice:null, images:[], rating:4.9, reviewCount:317, seller:{store_name:'Grove & Wax'},   badge:null,         category:'home-living' },
  { id:6,  name:'Merino Wool Throw Blanket',        price:215, originalPrice:null, images:[], rating:4.8, reviewCount:88,  seller:{store_name:'Nordic Knit'},   badge:'New',        category:'home-living' },
  { id:7,  name:'Silk Pillowcase Duo',              price:89,  originalPrice:110,  images:[], rating:4.7, reviewCount:142, seller:{store_name:'Rest & Glow'},   badge:null,         category:'home-living' },
  { id:8,  name:'Smart Watch Series X',             price:299, originalPrice:null, images:[], rating:4.5, reviewCount:76,  seller:{store_name:'TechVault'},     badge:'New',        category:'electronics' },
  { id:9,  name:'Rose Hip Face Serum 30ml',         price:58,  originalPrice:75,   images:[], rating:4.8, reviewCount:229, seller:{store_name:'Lumière Lab'},   badge:'Sale',       category:'beauty'      },
  { id:10, name:'Linen Wide-Leg Trousers',          price:145, originalPrice:null, images:[], rating:4.6, reviewCount:55,  seller:{store_name:'Maison Élite'},  badge:null,         category:'fashion'     },
  { id:11, name:'Yoga Mat — Natural Rubber',        price:110, originalPrice:null, images:[], rating:4.9, reviewCount:184, seller:{store_name:'Form & Flow'},   badge:'Bestseller', category:'sports'      },
  { id:12, name:'Abstract Canvas Print 60x80cm',    price:320, originalPrice:null, images:[], rating:4.7, reviewCount:38,  seller:{store_name:'Studio Blank'},  badge:null,         category:'art'         },
];

const BREADCRUMBS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
];

const DEFAULT_FILTERS = { category:'', search:'', sort:'newest', minPrice:'', maxPrice:'', rating:'' };

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters,     setFilters]     = useState({
    ...DEFAULT_FILTERS,
    category:  searchParams.get('category') || '',
    search:    searchParams.get('q')        || '',
    sort:      searchParams.get('sort')     || 'newest',
  });
  const [products,    setProducts]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [wishlist,    setWishlist]    = useState([]);
  const [view,        setView]        = useState('grid');   // 'grid' | 'list'
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [page,        setPage]        = useState(1);
  const PER_PAGE = 9;

  /* ── Filter + sort logic (replace with API call) ── */
  const applyFilters = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      let result = [...ALL_PRODUCTS];

      if (filters.category)  result = result.filter(p => p.category === filters.category);
      if (filters.search)    result = result.filter(p => p.name.toLowerCase().includes(filters.search.toLowerCase()));
      if (filters.minPrice)  result = result.filter(p => p.price >= Number(filters.minPrice));
      if (filters.maxPrice)  result = result.filter(p => p.price <= Number(filters.maxPrice));
      if (filters.rating)    result = result.filter(p => p.rating >= Number(filters.rating));

      switch (filters.sort) {
        case 'price_asc':  result.sort((a,b) => a.price - b.price);  break;
        case 'price_desc': result.sort((a,b) => b.price - a.price);  break;
        case 'popular':    result.sort((a,b) => b.reviewCount - a.reviewCount); break;
        case 'rating':     result.sort((a,b) => b.rating - a.rating); break;
        default:           result.sort((a,b) => b.id - a.id);
      }

      setProducts(result);
      setPage(1);
      setLoading(false);
    }, 400);
  }, [filters]);

  useEffect(() => { applyFilters(); }, [applyFilters]);

  /* Sync filters → URL params */
  useEffect(() => {
    const p = {};
    if (filters.category)  p.category = filters.category;
    if (filters.search)    p.q        = filters.search;
    if (filters.sort !== 'newest') p.sort = filters.sort;
    setSearchParams(p, { replace: true });
  }, [filters, setSearchParams]);

  const handleFilterChange = (newFilters) => { setFilters(newFilters); };
  const handleReset        = () => setFilters(DEFAULT_FILTERS);
  const toggleWishlist     = (id) => setWishlist(prev => prev.includes(id) ? prev.filter(i=>i!==id) : [...prev,id]);
  const handleAddToCart    = (product) => console.log('cart:', product.name);

  /* Pagination */
  const totalPages   = Math.ceil(products.length / PER_PAGE);
  const paged        = products.slice((page-1)*PER_PAGE, page*PER_PAGE);

  return (
    <div className="products-page">

      {/* ── Top bar ─────────────────────────────── */}
      <div className="products-topbar">
        <div className="products-topbar__inner">
          {/* Breadcrumb */}
          <nav className="breadcrumb" aria-label="Breadcrumb">
            {BREADCRUMBS.map(({ label, href }, i) => (
              <span key={href}>
                <Link to={href} className="breadcrumb__link">{label}</Link>
                {i < BREADCRUMBS.length - 1 && <span className="breadcrumb__sep">›</span>}
              </span>
            ))}
            {filters.category && (
              <>
                <span className="breadcrumb__sep">›</span>
                <span className="breadcrumb__current">{filters.category}</span>
              </>
            )}
          </nav>

          {/* Title + search */}
          <div className="products-topbar__main">
            <div>
              <span className="section-tag">All Collections</span>
              <h1 className="products-topbar__title">
                {filters.category
                  ? filters.category.replace(/-/g,' ').replace(/\b\w/g, c => c.toUpperCase())
                  : <>Our <em>Products</em></>}
              </h1>
            </div>

            <div className="products-topbar__controls">
              {/* Search */}
              <div className="products-search">
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="search"
                  placeholder="Search products…"
                  value={filters.search}
                  onChange={e => setFilters(f => ({...f, search: e.target.value}))}
                  aria-label="Search products"
                />
              </div>

              {/* View toggle */}
              <div className="view-toggle" role="group" aria-label="View style">
                <button
                  className={`view-toggle__btn ${view==='grid' ? 'active':''}`}
                  onClick={() => setView('grid')}
                  aria-label="Grid view"
                  aria-pressed={view==='grid'}
                >
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                  </svg>
                </button>
                <button
                  className={`view-toggle__btn ${view==='list' ? 'active':''}`}
                  onClick={() => setView('list')}
                  aria-label="List view"
                  aria-pressed={view==='list'}
                >
                  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <line x1="3" y1="12" x2="21" y2="12"/>
                    <line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                </button>
              </div>

              {/* Mobile filter trigger */}
              <button
                className="products-filter-trigger btn-outline"
                onClick={() => setMobileFiltersOpen(true)}
                aria-label="Open filters"
              >
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <line x1="4" y1="6" x2="20" y2="6"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                  <line x1="11" y1="18" x2="13" y2="18"/>
                </svg>
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Layout: sidebar + grid ───────────────── */}
      <div className="products-body">
        <ProductFilter
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
          totalResults={products.length}
          mobileOpen={mobileFiltersOpen}
          onMobileClose={() => setMobileFiltersOpen(false)}
        />

        <div className="products-main">
          {/* Active filter chips */}
          {(filters.category || filters.minPrice || filters.maxPrice || filters.rating) && (
            <div className="filter-chips">
              {filters.category && (
                <span className="filter-chip">
                  {filters.category}
                  <button onClick={() => setFilters(f => ({...f, category:''}))} aria-label="Remove category filter">×</button>
                </span>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <span className="filter-chip">
                  ${filters.minPrice||'0'} — ${filters.maxPrice||'∞'}
                  <button onClick={() => setFilters(f => ({...f, minPrice:'', maxPrice:''}))} aria-label="Remove price filter">×</button>
                </span>
              )}
              {filters.rating && (
                <span className="filter-chip">
                  {filters.rating}★ & up
                  <button onClick={() => setFilters(f => ({...f, rating:''}))} aria-label="Remove rating filter">×</button>
                </span>
              )}
              <button className="filter-chips__clear" onClick={handleReset}>Clear all</button>
            </div>
          )}

          {/* Grid */}
          <ProductGrid
            products={paged}
            loading={loading}
            wishlisted={wishlist}
            onAddToCart={handleAddToCart}
            onWishlistToggle={toggleWishlist}
            view={view}
          />

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <nav className="pagination" aria-label="Pagination">
              <button
                className="pagination__btn"
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                aria-label="Previous page"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  className={`pagination__page ${page === n ? 'active' : ''}`}
                  onClick={() => setPage(n)}
                  aria-label={`Page ${n}`}
                  aria-current={page === n ? 'page' : undefined}
                >
                  {n}
                </button>
              ))}

              <button
                className="pagination__btn"
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                aria-label="Next page"
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
