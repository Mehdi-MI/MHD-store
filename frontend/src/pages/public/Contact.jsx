import { useState } from 'react';
import { useReveal } from '../../hooks/useReveal';
import './Contact.css';

const TOPICS = ['General enquiry','Order support','Seller support','Partnership','Press & media','Report an issue'];

const FAQ = [
  { q:'How long does shipping take?',        a:'Standard delivery takes 3–7 business days. Express options are available at checkout. Free shipping on all orders over $150.' },
  { q:'What is your return policy?',         a:'We offer a 30-day hassle-free return policy. Items must be unused and in original packaging. Contact us to initiate a return.' },
  { q:'How do I become a seller?',           a:'Visit our Seller Register page and complete the 4-step application. Approved sellers go live within 2 business days.' },
  { q:'Are all sellers verified?',           a:'Yes. Every seller is manually reviewed by our team before being approved. We check product quality, fulfilment reliability and business legitimacy.' },
  { q:'How do payouts work for sellers?',    a:'Sellers receive payouts within 2 business days after order delivery confirmation, minus our platform commission.' },
];

export default function Contact() {
  const heroRef = useReveal();
  const faqRef  = useReveal();

  const [form, setForm] = useState({ name:'', email:'', topic:'', message:'' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const set = (k,v) => { setForm(f=>({...f,[k]:v})); if(errors[k]) setErrors(e=>({...e,[k]:''})); };

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Required';
    if (!form.email)          e.email   = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.topic)          e.topic   = 'Required';
    if (!form.message.trim()) e.message = 'Required';
    else if (form.message.length < 20) e.message = 'Please provide more detail (min 20 characters)';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="contact-page">

      {/* ── Hero ───────────────────────────────── */}
      <section className="contact-hero" ref={heroRef}>
        <div className="contact-hero__inner">
          <div>
            <span className="section-tag reveal">Get in touch</span>
            <h1 className="contact-hero__title reveal reveal-delay-1">
              We'd love to<br /><em>hear from you</em>
            </h1>
            <p className="contact-hero__sub reveal reveal-delay-2">
              Our team typically responds within 4 business hours. For urgent order issues, include your order number.
            </p>
          </div>

          {/* Contact info cards */}
          <div className="contact-info-cards reveal reveal-delay-2">
            {[
              {
                icon: <EmailIcon />,
                label: 'Email us',
                val: 'support@mhdstore.com',
                sub: 'General enquiries & support',
                href: 'mailto:support@mhdstore.com',
              },
              {
                icon: <ChatIcon />,
                label: 'Live chat',
                val: 'Available 9am – 6pm EST',
                sub: 'Mon – Fri, excluding holidays',
                href: null,
              },
              {
                icon: <SellerIcon />,
                label: 'Seller support',
                val: 'sellers@mhdstore.com',
                sub: 'Dedicated seller team',
                href: 'mailto:sellers@mhdstore.com',
              },
            ].map(({ icon, label, val, sub, href }) => (
              <div key={label} className="contact-info-card">
                <div className="contact-info-card__icon">{icon}</div>
                <div>
                  <p className="contact-info-card__label">{label}</p>
                  {href
                    ? <a href={href} className="contact-info-card__val">{val}</a>
                    : <p className="contact-info-card__val">{val}</p>}
                  <p className="contact-info-card__sub">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form + FAQ ─────────────────────────── */}
      <div className="contact-body">

        {/* Form */}
        <div className="contact-form-col">
          <h2 className="contact-form-col__title">Send a message</h2>

          {sent ? (
            <div className="contact-success">
              <div className="contact-success__icon">
                <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h3>Message sent!</h3>
              <p>Thank you for reaching out. We'll get back to you at <strong>{form.email}</strong> within 4 business hours.</p>
              <button className="btn-outline" onClick={() => { setSent(false); setForm({name:'',email:'',topic:'',message:''}); }}>
                Send another message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit} noValidate>

              <div className="contact-grid-2">
                <div className={`contact-field ${errors.name?'error':''}`}>
                  <label className="contact-label">Your name *</label>
                  <input className="contact-input" type="text" placeholder="Sophie Laurent"
                    value={form.name} onChange={e=>set('name',e.target.value)} />
                  {errors.name && <p className="contact-error">{errors.name}</p>}
                </div>
                <div className={`contact-field ${errors.email?'error':''}`}>
                  <label className="contact-label">Email address *</label>
                  <input className="contact-input" type="email" placeholder="you@example.com"
                    value={form.email} onChange={e=>set('email',e.target.value)} />
                  {errors.email && <p className="contact-error">{errors.email}</p>}
                </div>
              </div>

              <div className={`contact-field ${errors.topic?'error':''}`}>
                <label className="contact-label">Topic *</label>
                <select className="contact-input contact-select"
                  value={form.topic} onChange={e=>set('topic',e.target.value)}>
                  <option value="">Select a topic…</option>
                  {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.topic && <p className="contact-error">{errors.topic}</p>}
              </div>

              <div className={`contact-field ${errors.message?'error':''}`}>
                <label className="contact-label">
                  Message *
                  <span className="contact-char-count">{form.message.length}/1000</span>
                </label>
                <textarea className="contact-input contact-textarea"
                  placeholder="Tell us how we can help…"
                  value={form.message} maxLength={1000} rows={6}
                  onChange={e=>set('message',e.target.value)} />
                {errors.message && <p className="contact-error">{errors.message}</p>}
              </div>

              <button type="submit" className="btn-primary contact-submit" disabled={loading}>
                {loading
                  ? <><span className="contact-spinner" />Sending…</>
                  : <>Send Message <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></>
                }
              </button>
            </form>
          )}
        </div>

        {/* FAQ */}
        <aside className="contact-faq" ref={faqRef}>
          <h2 className="contact-faq__title">Frequently asked</h2>
          <div className="contact-faq__list">
            {FAQ.map(({ q, a }, i) => (
              <div key={i} className={`faq-item reveal ${openFaq===i?'faq-item--open':''}`}>
                <button className="faq-item__q" onClick={() => setOpenFaq(openFaq===i?null:i)}>
                  <span>{q}</span>
                  <svg className="faq-item__arrow" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>
                <div className="faq-item__a">
                  <p>{a}</p>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

function EmailIcon()  { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>; }
function ChatIcon()   { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>; }
function SellerIcon() { return <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.3" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
