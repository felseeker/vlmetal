(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMotion.matches || !('IntersectionObserver' in window)) return;

  const selector = [
    '.site-light .feature-card',
    '.site-light .image-card',
    '.site-light .project-grid--portfolio .project-card',
    '.site-light .process-grid > article',
    '.site-light .contact-info',
    '.site-light .lead-form',
    '.site-light .price-card',
    '.site-light .price-note',
    '.site-light .ral-band__inner'
  ].join(',');
  const items = document.querySelectorAll(selector);
  if (!items.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('motion-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -36px 0px' });

  items.forEach((item, index) => {
    item.classList.add('motion-ready');
    item.style.setProperty('--motion-delay', `${(index % 4) * 70}ms`);
    observer.observe(item);
  });
})();
