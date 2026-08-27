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

  // Shopify cart integration
  const cartCountEl = document.getElementById('cartCount');
  const cartLink = document.querySelector('.navbar__cart');
  let shopifyCart = null;

  function updateBadge() {
    if (!shopifyCart || !shopifyCart.model || !shopifyCart.model.lineItems) return;
    let count = 0;
    shopifyCart.model.lineItems.forEach(item => { count += item.quantity; });
    if (cartCountEl) cartCountEl.textContent = count;
  }

  window._sakaroSetupCart = function(ui) {
    if (shopifyCart) return;
    const carts = ui.components.cart;
    if (!carts || !carts[0]) return;
    shopifyCart = carts[0];

    updateBadge();
    setInterval(updateBadge, 800);

    if (cartLink) {
      cartLink.addEventListener('click', function(e) {
        e.preventDefault();
        if (shopifyCart.open) {
          shopifyCart.open();
        } else {
          var toggle = document.querySelector('.shopify-buy__cart-toggle');
          if (toggle) toggle.click();
        }
      });
    }
  };
})();
