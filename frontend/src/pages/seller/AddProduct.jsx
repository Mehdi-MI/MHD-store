import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SellerPages.css';

const CATEGORIES = ['Fashion & Apparel','Electronics','Home & Living','Beauty & Care','Sports & Outdoor','Art & Collectibles'];
const SIZE_OPTIONS  = ['XS','S','M','L','XL','XXL','One Size'];
const COLOR_OPTIONS = ['Black','White','Navy','Camel','Ivory','Midnight','Cognac','Natural'];

export default function AddProduct() {
  const navigate = useNavigate();
  const [step,    setStep]    = useState(0);
  const [saving,  setSaving]  = useState(false);
  const [errors,  setErrors]  = useState({});

  const [form, setForm] = useState({
    name:'', slug:'', category:'', description:'', shortDesc:'',
    price:'', originalPrice:'', stock:'', sku:'', badge:'',
    status:'draft',
    sizes: [], colors: [],
    hasVariants: false,
    details: [{ label:'', value:'' }],
    tags:'',
    isFeatured: false,
    images: [],
  });

  const set = (k, v) => {
    setForm(f => ({...f, [k]: v}));
    if (k==='name') setForm(f => ({...f, name:v,
      slug: v.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'')
    }));
    if (errors[k]) setErrors(e => ({...e, [k]:''}));
  };

  const toggleSize  = (s) => setForm(f => ({...f, sizes:  f.sizes.includes(s)  ? f.sizes.filter(x=>x!==s)  : [...f.sizes,  s]}));
  const toggleColor = (c) => setForm(f => ({...f, colors: f.colors.includes(c) ? f.colors.filter(x=>x!==c) : [...f.colors, c]}));

  const addDetail    = () => setForm(f => ({...f, details:[...f.details,{label:'',value:''}]}));
  const removeDetail = (i) => setForm(f => ({...f, details:f.details.filter((_,idx)=>idx!==i)}));
  const setDetail    = (i,k,v) => setForm(f => ({...f, details:f.details.map((d,idx)=>idx===i?{...d,[k]:v}:d)}));

  const validate = () => {
    const e = {};
    if (!form.name.trim())     e.name     = 'Required';
    if (!form.category)        e.category = 'Required';
    if (!form.description.trim()) e.description = 'Required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = 'Valid price required';
    if (!form.stock || isNaN(form.stock) || Number(form.stock) < 0)  e.stock = 'Valid stock required';
    setErrors(e); return !Object.keys(e).length;
  };

  const handleSave = async (publish = false) => {
    if (!validate()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 900));
    // productService.create({ ...form, status: publish ? 'active' : 'draft' })
    navigate('/seller/products');
  };

  const STEPS = ['Basic Info','Pricing & Stock','Variants','Details & Tags'];

  return (
    <div className="sl-page">
      <div className="sl-header">
        <div>
          <span className="section-tag">Seller Dashboard</span>
          <h1 className="sl-title">Add <em>Product</em></h1>
        </div>
        <div style={{display:'flex',gap:'0.75rem'}}>
          <button className="btn-outline sl-btn-sm" onClick={() => handleSave(false)} disabled={saving}>
            Save Draft
          </button>
          <button className="btn-primary sl-btn-sm" onClick={() => handleSave(true)} disabled={saving}>
            {saving ? 'Publishing…' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Step tabs */}
      <div className="sl-step-tabs">
        {STEPS.map((label, i) => (
          <button key={label}
            className={`sl-step-tab ${step===i?'active':''} ${i<step?'done':''}`}
            onClick={() => setStep(i)}>
            <span className="sl-step-tab__num">{i<step?'✓':i+1}</span>
            {label}
          </button>
        ))}
      </div>

      <div className="sl-form-layout">
        <div className="sl-form-main">

          {/* Step 0: Basic Info */}
          {step === 0 && (
            <div className="sl-card">
              <div className="sl-card__head"><h2 className="sl-card__title">Basic Information</h2></div>
              <div className="sl-form">
                <div className={`sl-field ${errors.name?'error':''}`}>
                  <label className="sl-label">Product name *</label>
                  <input className="sl-input" type="text"
                    placeholder="e.g. Cashmere Blend Overcoat — Midnight"
                    value={form.name} onChange={e=>set('name',e.target.value)} />
                  {errors.name && <p className="sl-error">{errors.name}</p>}
                </div>

                <div className="sl-field">
                  <label className="sl-label">URL slug</label>
                  <div className="sl-slug-wrap">
                    <span className="sl-slug-prefix">mhdstore.com/products/</span>
                    <input className="sl-input sl-input--slug" type="text"
                      value={form.slug}
                      onChange={e=>set('slug',e.target.value.toLowerCase().replace(/[^a-z0-9-]/g,''))} />
                  </div>
                </div>

                <div className={`sl-field ${errors.category?'error':''}`}>
                  <label className="sl-label">Category *</label>
                  <select className="sl-input sl-select"
                    value={form.category} onChange={e=>set('category',e.target.value)}>
                    <option value="">Select category…</option>
                    {CATEGORIES.map(c=><option key={c}>{c}</option>)}
                  </select>
                  {errors.category && <p className="sl-error">{errors.category}</p>}
                </div>

                <div className="sl-field">
                  <label className="sl-label">Short description <span className="sl-optional">(max 200 chars)</span></label>
                  <input className="sl-input" type="text" maxLength={200}
                    placeholder="One-line description shown in product cards"
                    value={form.shortDesc} onChange={e=>set('shortDesc',e.target.value)} />
                </div>

                <div className={`sl-field ${errors.description?'error':''}`}>
                  <label className="sl-label">
                    Full description *
                    <span className="sl-optional">{form.description.length}/2000</span>
                  </label>
                  <textarea className="sl-input sl-textarea" rows={6} maxLength={2000}
                    placeholder="Detailed product description…"
                    value={form.description} onChange={e=>set('description',e.target.value)} />
                  {errors.description && <p className="sl-error">{errors.description}</p>}
                </div>

                {/* Images placeholder */}
                <div className="sl-field">
                  <label className="sl-label">Product Images</label>
                  <div className="sl-image-upload">
                    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <p>Click to upload or drag & drop</p>
                    <p className="sl-image-upload__hint">PNG, JPG or WebP · Max 5MB each · Up to 8 images</p>
                    <button className="btn-outline sl-btn-sm" type="button">Choose Files</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Pricing & Stock */}
          {step === 1 && (
            <div className="sl-card">
              <div className="sl-card__head"><h2 className="sl-card__title">Pricing & Inventory</h2></div>
              <div className="sl-form">
                <div className="sl-grid-2">
                  <div className={`sl-field ${errors.price?'error':''}`}>
                    <label className="sl-label">Price (USD) *</label>
                    <div className="sl-price-wrap">
                      <span>$</span>
                      <input className="sl-input" type="number" min="0" step="0.01" placeholder="0.00"
                        value={form.price} onChange={e=>set('price',e.target.value)} />
                    </div>
                    {errors.price && <p className="sl-error">{errors.price}</p>}
                  </div>
                  <div className="sl-field">
                    <label className="sl-label">Original price <span className="sl-optional">(for sale)</span></label>
                    <div className="sl-price-wrap">
                      <span>$</span>
                      <input className="sl-input" type="number" min="0" step="0.01" placeholder="0.00"
                        value={form.originalPrice} onChange={e=>set('originalPrice',e.target.value)} />
                    </div>
                  </div>
                  <div className={`sl-field ${errors.stock?'error':''}`}>
                    <label className="sl-label">Stock quantity *</label>
                    <input className="sl-input" type="number" min="0" placeholder="0"
                      value={form.stock} onChange={e=>set('stock',e.target.value)} />
                    {errors.stock && <p className="sl-error">{errors.stock}</p>}
                  </div>
                  <div className="sl-field">
                    <label className="sl-label">SKU <span className="sl-optional">(optional)</span></label>
                    <input className="sl-input" type="text" placeholder="e.g. ME-OC-001"
                      value={form.sku} onChange={e=>set('sku',e.target.value)} />
                  </div>
                </div>

                <div className="sl-grid-2">
                  <div className="sl-field">
                    <label className="sl-label">Badge</label>
                    <select className="sl-input sl-select" value={form.badge} onChange={e=>set('badge',e.target.value)}>
                      <option value="">None</option>
                      {['New','Sale','Bestseller','Limited'].map(b=><option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="sl-field">
                    <label className="sl-label">Visibility</label>
                    <select className="sl-input sl-select" value={form.status} onChange={e=>set('status',e.target.value)}>
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <label className="sl-checkbox">
                  <input type="checkbox" checked={form.isFeatured}
                    onChange={e=>set('isFeatured',e.target.checked)} />
                  <span className="sl-checkbox__box" />
                  <span>Request featured placement on homepage</span>
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Variants */}
          {step === 2 && (
            <div className="sl-card">
              <div className="sl-card__head"><h2 className="sl-card__title">Variants</h2></div>
              <div className="sl-form">
                <label className="sl-checkbox">
                  <input type="checkbox" checked={form.hasVariants}
                    onChange={e=>set('hasVariants',e.target.checked)} />
                  <span className="sl-checkbox__box" />
                  <span>This product has multiple sizes / colours</span>
                </label>

                {form.hasVariants && (
                  <>
                    <div className="sl-field">
                      <label className="sl-label">Available sizes</label>
                      <div className="sl-variant-btns">
                        {SIZE_OPTIONS.map(s => (
                          <button key={s} type="button"
                            className={`sl-variant-btn ${form.sizes.includes(s)?'active':''}`}
                            onClick={() => toggleSize(s)}>{s}</button>
                        ))}
                      </div>
                    </div>
                    <div className="sl-field">
                      <label className="sl-label">Available colours</label>
                      <div className="sl-variant-btns">
                        {COLOR_OPTIONS.map(c => (
                          <button key={c} type="button"
                            className={`sl-variant-btn ${form.colors.includes(c)?'active':''}`}
                            onClick={() => toggleColor(c)}>{c}</button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Details & Tags */}
          {step === 3 && (
            <div className="sl-card">
              <div className="sl-card__head"><h2 className="sl-card__title">Details & Tags</h2></div>
              <div className="sl-form">
                <div className="sl-field">
                  <label className="sl-label">Product details</label>
                  {form.details.map((d, i) => (
                    <div key={i} className="sl-detail-row">
                      <input className="sl-input" type="text" placeholder="Label (e.g. Material)"
                        value={d.label} onChange={e=>setDetail(i,'label',e.target.value)} />
                      <input className="sl-input" type="text" placeholder="Value (e.g. 90% Cashmere)"
                        value={d.value} onChange={e=>setDetail(i,'value',e.target.value)} />
                      {form.details.length > 1 && (
                        <button type="button" className="sl-detail-remove" onClick={()=>removeDetail(i)}>×</button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="sl-btn-ghost" onClick={addDetail}>+ Add detail</button>
                </div>

                <div className="sl-field">
                  <label className="sl-label">Tags <span className="sl-optional">(comma-separated)</span></label>
                  <input className="sl-input" type="text"
                    placeholder="cashmere, luxury, winter, overcoat"
                    value={form.tags} onChange={e=>set('tags',e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Nav */}
          <div className="sl-form-nav">
            {step > 0 && (
              <button type="button" className="btn-outline sl-btn-sm" onClick={() => setStep(s=>s-1)}>
                ← Back
              </button>
            )}
            {step < STEPS.length-1 ? (
              <button type="button" className="btn-primary sl-btn-sm" onClick={() => setStep(s=>s+1)}
                style={{marginLeft:'auto'}}>
                Continue →
              </button>
            ) : (
              <div style={{display:'flex',gap:'0.75rem',marginLeft:'auto'}}>
                <button className="btn-outline sl-btn-sm" onClick={() => handleSave(false)} disabled={saving}>
                  Save Draft
                </button>
                <button className="btn-primary sl-btn-sm" onClick={() => handleSave(true)} disabled={saving}>
                  {saving ? 'Publishing…' : 'Publish Product'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar preview */}
        <div className="sl-form-aside">
          <div className="sl-card">
            <div className="sl-card__head"><h2 className="sl-card__title">Preview</h2></div>
            <div className="sl-preview">
              <div className="sl-preview__img">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="0.8" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
              <p className="sl-preview__category">{form.category || 'Category'}</p>
              <p className="sl-preview__name">{form.name || 'Product name'}</p>
              <p className="sl-preview__price">
                {form.price ? `$${Number(form.price).toFixed(2)}` : '$0.00'}
                {form.originalPrice && <span className="sl-preview__original"> ${Number(form.originalPrice).toFixed(2)}</span>}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
