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
})();

// Shopify cart integration — outside IIFE so state is global
window._sakaroCart = null;

window._sakaroSetupCart = function(ui) {
  if (window._sakaroCart) return;
  var carts = ui.components.cart;
  if (!carts || !carts[0]) return;
  window._sakaroCart = carts[0];

  function updateBadge() {
    var cart = window._sakaroCart;
    if (!cart || !cart.model || !cart.model.lineItems) return;
    var count = 0;
    cart.model.lineItems.forEach(function(item) { count += item.quantity; });
    var el = document.getElementById('cartCount');
    if (el) el.textContent = count;
  }

  updateBadge();
  setInterval(updateBadge, 800);
};

(function() {
  var cartLink = document.querySelector('.navbar__cart');
  if (!cartLink) return;

  cartLink.addEventListener('click', function(e) {
    e.preventDefault();
    var attempts = 15;
    function tryOpen() {
      var cart = window._sakaroCart;
      if (cart && typeof cart.toggleVisibility === 'function') {
        cart.toggleVisibility();
        return;
      }
      if (attempts-- > 0) {
        setTimeout(tryOpen, 200);
      }
    }
    tryOpen();
  });
})();
