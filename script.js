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

  // Custom cart icon — wired up by _sakaroCartReady() called from each page's Shopify init
  window._sakaroCartReady = function (ui) {
    var cartBtn = document.getElementById('customCartBtn');
    var cartBadge = document.getElementById('cartBadge');
    if (!cartBtn) return;

    cartBtn.addEventListener('click', function () {
      if (ui.cart) {
        ui.cart.toggleVisibility();
      } else if (ui.components && ui.components.cart && ui.components.cart[0]) {
        ui.components.cart[0].toggleVisibility();
      }
    });

    function syncBadge() {
      if (!cartBadge) return;
      var cart = ui.cart || (ui.components && ui.components.cart && ui.components.cart[0]);
      if (!cart || !cart.model) return;
      var items = cart.model.lineItems || [];
      var total = 0;
      for (var i = 0; i < items.length; i++) {
        total += items[i].quantity || 0;
      }
      if (total > 0) {
        cartBadge.textContent = total;
        cartBadge.classList.add('is-visible');
      } else {
        cartBadge.classList.remove('is-visible');
      }
    }

    setInterval(syncBadge, 500);
    syncBadge();
  };
})();
