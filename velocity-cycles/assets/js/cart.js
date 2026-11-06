/* ============================================================
   VELOCITY CYCLES - Cart Management
   ============================================================ */

const CartStore = {
  // Get cart items
  getAll() {
    const stored = localStorage.getItem('vc_cart');
    return stored ? JSON.parse(stored) : [];
  },

  // Save cart
  save(cart) {
    localStorage.setItem('vc_cart', JSON.stringify(cart));
    this.updateBadge();
  },

  // Add item to cart
  add(productId, quantity = 1, selectedSize = null, selectedColor = null) {
    const product = ProductsStore.getById(productId);
    if (!product) return false;

    const cart = this.getAll();
    const key = `${productId}-${selectedSize}-${selectedColor}`;
    const existingIndex = cart.findIndex(i => i.cartKey === key);

    if (existingIndex !== -1) {
      cart[existingIndex].quantity = Math.min(
        cart[existingIndex].quantity + quantity,
        product.stock
      );
    } else {
      cart.push({
        cartKey: key,
        id: productId,
        name: product.name,
        brand: product.brand,
        price: product.discountPrice || product.price,
        originalPrice: product.price,
        image: product.images[0],
        quantity,
        selectedSize: selectedSize || (product.sizes[0] || null),
        selectedColor: selectedColor || (product.colors[0] || null),
        maxStock: product.stock
      });
    }

    this.save(cart);
    return true;
  },

  // Remove item
  remove(cartKey) {
    const cart = this.getAll().filter(i => i.cartKey !== cartKey);
    this.save(cart);
  },

  // Update quantity
  updateQuantity(cartKey, quantity) {
    const cart = this.getAll();
    const index = cart.findIndex(i => i.cartKey === cartKey);
    if (index !== -1) {
      if (quantity <= 0) {
        cart.splice(index, 1);
      } else {
        cart[index].quantity = Math.min(quantity, cart[index].maxStock);
      }
      this.save(cart);
    }
  },

  // Clear cart
  clear() {
    localStorage.removeItem('vc_cart');
    this.updateBadge();
  },

  // Get total item count
  getCount() {
    return this.getAll().reduce((sum, item) => sum + item.quantity, 0);
  },

  // Get subtotal
  getSubtotal() {
    return this.getAll().reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  // Get shipping cost
  getShipping() {
    const subtotal = this.getSubtotal();
    // Free shipping over Rs. 139,000 (≈ $500)
    return subtotal >= 500 ? 0 : 29.99;
  },

  // Get tax (8%)
  getTax() {
    return this.getSubtotal() * 0.08;
  },

  // Get total
  getTotal() {
    return this.getSubtotal() + this.getShipping() + this.getTax();
  },

  // Update cart badge in nav
  updateBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const count = this.getCount();
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  }
};

// ---- Global add to cart function ----
function addToCart(productId, quantity = 1, size = null, color = null) {
  const product = ProductsStore.getById(productId);
  if (!product) return;

  if (product.stock === 0) {
    showToast('Out of Stock', 'This product is currently out of stock.', 'error');
    return;
  }

  const success = CartStore.add(productId, quantity, size, color);

  if (success) {
    showToast('Added to Cart!', `${product.name} has been added to your cart.`, 'success');
    // Update the card button state
    const cards = document.querySelectorAll(`[data-product-id="${productId}"] .btn-add-cart`);
    cards.forEach(btn => {
      btn.innerHTML = '<i class="fas fa-check"></i> In Cart';
      btn.classList.add('in-cart');
    });
  }
}

// ---- Render Cart Page ----
function renderCartPage() {
  const container = document.getElementById('cart-items-container');
  const emptyState = document.getElementById('cart-empty');
  const cartContent = document.getElementById('cart-content');
  const cart = CartStore.getAll();

  if (!container) return;

  if (cart.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    if (cartContent) cartContent.style.display = 'none';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (cartContent) cartContent.style.display = 'grid';

  container.innerHTML = cart.map(item => `
    <div class="cart-item-row" data-cart-key="${item.cartKey}">
      <div class="cart-item-product">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img"
          onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=60'">
        <div class="cart-item-details">
          <div class="product-brand">${item.brand}</div>
          <div class="product-name">${item.name}</div>
          ${item.selectedSize ? `<small style="color:var(--light-gray)">Size: ${item.selectedSize}</small>` : ''}
        </div>
      </div>
      <div class="cart-item-price">${formatPrice(item.price)}</div>
      <div class="qty-control">
        <button class="qty-btn" onclick="updateCartQty('${item.cartKey}', ${item.quantity - 1})">
          <i class="fas fa-minus"></i>
        </button>
        <input type="number" class="qty-input" value="${item.quantity}" min="1" max="${item.maxStock}"
          onchange="updateCartQty('${item.cartKey}', parseInt(this.value))">
        <button class="qty-btn" onclick="updateCartQty('${item.cartKey}', ${item.quantity + 1})">
          <i class="fas fa-plus"></i>
        </button>
      </div>
      <div class="cart-item-price" style="font-weight:800">
        ${formatPrice(item.price * item.quantity)}
      </div>
      <button class="remove-item-btn" onclick="removeCartItem('${item.cartKey}')" title="Remove">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>
  `).join('');

  updateCartSummary();
}

function updateCartQty(cartKey, qty) {
  CartStore.updateQuantity(cartKey, qty);
  renderCartPage();
}

function removeCartItem(cartKey) {
  CartStore.remove(cartKey);
  renderCartPage();
  showToast('Item Removed', 'Product removed from your cart.', 'info');
}

function updateCartSummary() {
  const subtotalEl = document.getElementById('cart-subtotal');
  const shippingEl = document.getElementById('cart-shipping');
  const taxEl = document.getElementById('cart-tax');
  const totalEl = document.getElementById('cart-total');
  const countEl = document.getElementById('cart-count');

  const subtotal = CartStore.getSubtotal();
  const shipping = CartStore.getShipping();
  const tax = CartStore.getTax();
  const total = CartStore.getTotal();

  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
  if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : formatPrice(shipping);
  if (taxEl) taxEl.textContent = formatPrice(tax);
  if (totalEl) totalEl.textContent = formatPrice(total);
  if (countEl) countEl.textContent = CartStore.getCount();
}

// Coupon codes (demo)
const COUPONS = {
  'VELOCITY10': 0.10,
  'RIDE20': 0.20,
  'NEWRIDER': 0.15,
  'SAVE25': 0.25
};

function applyCoupon() {
  const input = document.getElementById('coupon-input');
  if (!input) return;
  const code = input.value.trim().toUpperCase();
  const discount = COUPONS[code];

  if (discount) {
    const subtotal = CartStore.getSubtotal();
    const discountAmount = subtotal * discount;
    const discountEl = document.getElementById('cart-discount');
    const discountRow = document.getElementById('discount-row');
    if (discountEl) discountEl.textContent = `-${formatPrice(discountAmount)}`;
    if (discountRow) discountRow.style.display = 'flex';
    localStorage.setItem('vc_coupon', JSON.stringify({ code, discount }));
    showToast('Coupon Applied!', `${Math.round(discount * 100)}% discount applied.`, 'success');
  } else {
    showToast('Invalid Coupon', 'This coupon code is not valid.', 'error');
  }
}
