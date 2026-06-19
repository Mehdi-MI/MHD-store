import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../../hooks/useReveal';
import './About.css';

const STATS = [
  { num: '12K+', label: 'Products listed'     },
  { num: '840',  label: 'Independent sellers'  },
  { num: '50+',  label: 'Countries served'     },
  { num: '98%',  label: 'Customer satisfaction'},
];

const TEAM = [
  { initials: 'MH', name: 'Mohammed Haddad',  role: 'Founder & CEO',          bio: 'Former fintech engineer turned marketplace builder. Passionate about empowering independent commerce.' },
  { initials: 'SL', name: 'Sophie Laurent',   role: 'Head of Seller Success',  bio: 'Spent 8 years helping small businesses scale. Believes every maker deserves a global audience.' },
  { initials: 'JM', name: 'James Morin',      role: 'Lead Engineer',           bio: 'Full-stack architect obsessed with developer experience and system resilience.' },
  { initials: 'AK', name: 'Aiko Kimura',      role: 'Head of Design',          bio: 'Crafting interfaces that feel inevitable. Previously at Figma and Stripe.' },
];

const VALUES = [
  { icon: '✦', title: 'Quality over quantity',  body: 'Every seller on MHD Store is manually vetted. We'd rather have 840 excellent sellers than 8,000 mediocre ones.' },
  { icon: '✦', title: 'Radical transparency',   body: 'We publish our commission rates, our policies and our seller criteria publicly. No surprises, ever.' },
  { icon: '✦', title: 'Seller-first economics', body: 'Sellers keep the majority of every sale. We succeed only when they succeed — that alignment shapes every decision we make.' },
  { icon: '✦', title: 'Considered curation',    body: 'Our editorial team reviews every new product category. Discerning buyers deserve a discerning platform.' },
];

export default function About() {
  const heroRef   = useReveal();
  const valuesRef = useReveal();
  const teamRef   = useReveal();
  const ctaRef    = useReveal();

  return (
    <div className="about-page">

      {/* ── Hero ───────────────────────────────── */}
      <section className="about-hero" ref={heroRef}>
        <div className="about-hero__inner">
          <div className="about-hero__text">
            <span className="section-tag reveal">Our Story</span>
            <h1 className="about-hero__title reveal reveal-delay-1">
              A marketplace built for<br /><em>makers, not algorithms</em>
            </h1>
            <p className="about-hero__sub reveal reveal-delay-2">
              MHD Store was founded on a simple belief: independent sellers with exceptional products
              deserve a platform that treats them as partners, not vendors. We built the infrastructure.
              They bring the craft.
            </p>
          </div>
          <div className="about-hero__visual reveal reveal-delay-2" aria-hidden="true">
            <div className="about-hero__visual-inner">
              <span>Since</span>
              <span className="about-hero__year">2023</span>
            </div>
            <div className="about-hero__frame" />
          </div>
        </div>

        {/* Stats */}
        <div className="about-stats">
          {STATS.map(({ num, label }) => (
            <div key={label} className="about-stat reveal">
              <span className="about-stat__num">{num}</span>
              <span className="about-stat__label">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Mission ───────────────────────────── */}
      <section className="about-mission">
        <div className="about-mission__inner">
          <div className="about-mission__quote">
            <span className="about-mission__mark">"</span>
            <blockquote>
              We don't just want to be a marketplace. We want to be the platform that made
              it possible for a ceramicist in Oslo, a leatherworker in Brooklyn and a
              textile designer in Lyon to each build a thriving global business.
            </blockquote>
            <cite>— Mohammed Haddad, Founder</cite>
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────── */}
      <section className="about-values" ref={valuesRef}>
        <div className="about-values__inner">
          <div className="about-section-head reveal">
            <span className="section-tag">What we stand for</span>
            <h2 className="section-title" style={{ marginTop:'0.5rem' }}>
              Our <em>Values</em>
            </h2>
          </div>
          <div className="about-values__grid">
            {VALUES.map(({ icon, title, body }, i) => (
              <div key={title} className={`about-value-card reveal ${i>0?`reveal-delay-${Math.min(i,3)}`:''}`}>
                <span className="about-value-card__icon">{icon}</span>
                <h3 className="about-value-card__title">{title}</h3>
                <p className="about-value-card__body">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ──────────────────────────────── */}
      <section className="about-team" ref={teamRef}>
        <div className="about-team__inner">
          <div className="about-section-head reveal">
            <span className="section-tag">The people behind it</span>
            <h2 className="section-title" style={{ marginTop:'0.5rem' }}>
              Meet the <em>Team</em>
            </h2>
          </div>
          <div className="about-team__grid">
            {TEAM.map(({ initials, name, role, bio }, i) => (
              <div key={name} className={`about-team-card reveal ${i>0?`reveal-delay-${Math.min(i,3)}`:''}`}>
                <div className="about-team-card__avatar">{initials}</div>
                <h3 className="about-team-card__name">{name}</h3>
                <p className="about-team-card__role">{role}</p>
                <p className="about-team-card__bio">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────── */}
      <section className="about-cta" ref={ctaRef}>
        <div className="about-cta__inner">
          <div className="about-cta__block reveal">
            <span className="section-tag">For buyers</span>
            <h2 className="section-title" style={{ marginTop:'0.5rem' }}>
              Discover <em>exceptional</em> products
            </h2>
            <p>Browse 12,000+ curated products from verified independent sellers worldwide.</p>
            <Link to="/products" className="btn-primary">
              Shop Now
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </Link>
          </div>
          <div className="about-cta__divider" />
          <div className="about-cta__block reveal reveal-delay-1">
            <span className="section-tag">For sellers</span>
            <h2 className="section-title" style={{ marginTop:'0.5rem' }}>
              Grow your <em>business</em>
            </h2>
            <p>Join 840+ independent sellers already reaching thousands of buyers every day.</p>
            <Link to="/seller/register" className="btn-outline">
              Become a Seller
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
