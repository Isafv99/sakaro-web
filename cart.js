const SakaroCart = {
  getItems() {
    return JSON.parse(localStorage.getItem('sakaro_cart') || '[]');
  },
  save(items) {
    localStorage.setItem('sakaro_cart', JSON.stringify(items));
    this.updateCount();
  },
  addItem(product) {
    const items = this.getItems();
    const existing = items.find(i => i.id === product.id);
    if (existing) {
      existing.qty += product.qty || 1;
    } else {
      items.push({ ...product, qty: product.qty || 1 });
    }
    this.save(items);
  },
  removeItem(id) {
    const items = this.getItems().filter(i => i.id !== id);
    this.save(items);
  },
  updateQty(id, qty) {
    const items = this.getItems();
    const item = items.find(i => i.id === id);
    if (item) {
      item.qty = Math.max(1, qty);
      this.save(items);
    }
  },
  getTotal() {
    return this.getItems().reduce((sum, i) => sum + i.price * i.qty, 0);
  },
  getCount() {
    return this.getItems().reduce((sum, i) => sum + i.qty, 0);
  },
  updateCount() {
    const el = document.getElementById('cartCount');
    if (el) {
      const count = this.getCount();
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    }
  }
};

document.addEventListener('DOMContentLoaded', () => SakaroCart.updateCount());
