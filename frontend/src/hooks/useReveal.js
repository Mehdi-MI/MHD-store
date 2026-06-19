import { useEffect, useRef } from 'react';

/**
 * useReveal — attaches an IntersectionObserver to trigger CSS fade-in animations.
 * Adds class "visible" to elements with class "reveal" when they enter the viewport.
 *
 * Usage:
 *   const sectionRef = useReveal();
 *   <section ref={sectionRef}>
 *     <div className="reveal">...</div>
 *     <div className="reveal reveal-delay-1">...</div>
 *   </section>
 */
export function useReveal(threshold = 0.12) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const targets = container.querySelectorAll('.reveal');
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

/**
 * useSingleReveal — attach directly to a single element ref.
 */
export function useSingleReveal(threshold = 0.15) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
