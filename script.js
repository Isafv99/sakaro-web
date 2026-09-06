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

window._sakaroCart = null;

function _sakaroStartBadge() {
  if (window._sakaroBadgeRunning) return;
  window._sakaroBadgeRunning = true;
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
}

function _sakaroFindCart(ui, productComponent) {
  // Try explicit cart component passed from createComponent('cart')
  if (ui.components && ui.components.cart && ui.components.cart[0]) {
    return ui.components.cart[0];
  }
  // Try ui.cart (some SDK versions expose it here)
  if (ui.cart) {
    return ui.cart;
  }
  // Try the product component's cart reference
  if (productComponent) {
    if (productComponent.cart) return productComponent.cart;
    if (productComponent.model && productComponent.model.cart) return productComponent.model.cart;
  }
  // Try product components' cart references
  if (ui.components && ui.components.product) {
    for (var i = 0; i < ui.components.product.length; i++) {
      var p = ui.components.product[i];
      if (p && p.cart) return p.cart;
    }
  }
  return null;
}

window._sakaroSetupCart = function(ui, cartComponent, productComponent) {
  if (window._sakaroCart) return;

  // Direct cart component (from createComponent('cart') on cart-only pages)
  if (cartComponent && typeof cartComponent.toggleVisibility === 'function') {
    window._sakaroCart = cartComponent;
    _sakaroStartBadge();
    return;
  }

  // Search all known locations for the cart instance
  var found = _sakaroFindCart(ui, productComponent);
  if (found) {
    window._sakaroCart = found;
    _sakaroStartBadge();
    return;
  }

  // Poll — the SDK creates the cart asynchronously on product pages
  var pollAttempts = 50;
  function poll() {
    if (window._sakaroCart) return;
    var c = _sakaroFindCart(ui, productComponent);
    if (c) {
      window._sakaroCart = c;
      _sakaroStartBadge();
      return;
    }
    if (pollAttempts-- > 0) {
      setTimeout(poll, 200);
    }
  }
  setTimeout(poll, 200);
};

(function() {
  var cartLink = document.querySelector('.navbar__cart');
  if (!cartLink) return;

  cartLink.addEventListener('click', function(e) {
    e.preventDefault();
    var attempts = 20;
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
