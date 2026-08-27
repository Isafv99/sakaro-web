(() => {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 80);
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('is-active');
    navLinks.classList.toggle('is-open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('is-active');
      navLinks.classList.remove('is-open');
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Sync Shopify Buy Button cart count with navbar badge
  const cartCountEl = document.getElementById('cartCount');
  if (cartCountEl) {
    const syncCart = () => {
      const shopifyCount = document.querySelector('.shopify-buy__cart-toggle__count');
      if (shopifyCount) {
        const count = parseInt(shopifyCount.textContent, 10) || 0;
        cartCountEl.textContent = count;
      }
    };
    const bodyObserver = new MutationObserver(syncCart);
    bodyObserver.observe(document.body, { childList: true, subtree: true, characterData: true });
  }
})();
