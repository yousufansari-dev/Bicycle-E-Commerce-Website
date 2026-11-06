/* ============================================================
   VELOCITY CYCLES - Wishlist Management
   ============================================================ */

const WishlistStore = {
  // Get wishlist items
  getAll() {
    const stored = localStorage.getItem('vc_wishlist');
    return stored ? JSON.parse(stored) : [];
  },

  // Save wishlist
  save(wishlist) {
    localStorage.setItem('vc_wishlist', JSON.stringify(wishlist));
    this.updateBadge();
  },

  // Check if product is in wishlist
  has(productId) {
    return this.getAll().some(i => i.id === productId);
  },

  // Add to wishlist
  add(productId) {
    const product = ProductsStore.getById(productId);
    if (!product) return false;

    const wishlist = this.getAll();
    if (this.has(productId)) return false;

    wishlist.push({
      id: productId,
      name: product.name,
      brand: product.brand,
      price: product.discountPrice || product.price,
      originalPrice: product.price,
      image: product.images[0],
      rating: product.rating,
      reviewCount: product.reviewCount,
      addedAt: new Date().toISOString()
    });

    this.save(wishlist);
    return true;
  },

  // Remove from wishlist
  remove(productId) {
    const wishlist = this.getAll().filter(i => i.id !== productId);
    this.save(wishlist);
  },

  // Toggle wishlist
  toggle(productId) {
    if (this.has(productId)) {
      this.remove(productId);
      return false;
    } else {
      this.add(productId);
      return true;
    }
  },

  // Clear wishlist
  clear() {
    localStorage.removeItem('vc_wishlist');
    this.updateBadge();
  },

  // Get count
  getCount() {
    return this.getAll().length;
  },

  // Update badge
  updateBadge() {
    const badges = document.querySelectorAll('.wishlist-badge');
    const count = this.getCount();
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  }
};

// ---- Global toggle wishlist ----
function toggleWishlist(productId) {
  const product = ProductsStore.getById(productId);
  if (!product) return;

  const added = WishlistStore.toggle(productId);

  if (added) {
    showToast('Added to Wishlist', `${product.name} saved to your wishlist.`, 'success');
  } else {
    showToast('Removed from Wishlist', `${product.name} removed from wishlist.`, 'info');
  }

  // Update heart buttons on page
  const heartBtns = document.querySelectorAll(`[data-product-id="${productId}"] .product-action-btn`);
  heartBtns.forEach(btn => {
    if (btn.querySelector('.fa-heart, .fa-heart')) {
      if (added) {
        btn.classList.add('active');
        btn.innerHTML = '<i class="fas fa-heart"></i>';
        btn.title = 'Remove from wishlist';
      } else {
        btn.classList.remove('active');
        btn.innerHTML = '<i class="far fa-heart"></i>';
        btn.title = 'Add to wishlist';
      }
    }
  });
}

// ---- Render Wishlist Page ----
function renderWishlistPage() {
  const container = document.getElementById('wishlist-grid');
  const emptyState = document.getElementById('wishlist-empty');
  const wishlistContent = document.getElementById('wishlist-content');
  const wishlist = WishlistStore.getAll();

  if (!container) return;

  if (wishlist.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    if (wishlistContent) wishlistContent.style.display = 'none';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  if (wishlistContent) wishlistContent.style.display = 'block';

  const cart = CartStore.getAll();

  container.innerHTML = wishlist.map(item => {
    const inCart = cart.some(c => c.id === item.id);
    const hasDiscount = item.originalPrice && item.price < item.originalPrice;
    const stars = generateStars(item.rating);

    return `
      <div class="product-card fade-in" data-product-id="${item.id}">
        <div class="product-card-image">
          <img src="${item.image}" alt="${item.name}" loading="lazy"
            onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=60'">
          <div class="product-actions-overlay">
            <button class="product-action-btn active" onclick="removeFromWishlistPage('${item.id}')" title="Remove from wishlist">
              <i class="fas fa-heart"></i>
            </button>
            <button class="product-action-btn" onclick="window.location.href='product-details.html?id=${item.id}'" title="View details">
              <i class="far fa-eye"></i>
            </button>
          </div>
        </div>
        <div class="product-card-body">
          <div class="product-brand">${item.brand}</div>
          <h3 class="product-name">${item.name}</h3>
          <div class="product-rating">
            <div class="stars">${stars}</div>
            <span class="rating-count">(${item.reviewCount})</span>
          </div>
          <div class="product-price">
            <span class="price-current">${formatPrice(item.price)}</span>
            ${hasDiscount ? `<span class="price-original">${formatPrice(item.originalPrice)}</span>` : ''}
          </div>
        </div>
        <div class="product-card-footer">
          <button class="btn-add-cart ${inCart ? 'in-cart' : ''}" onclick="addToCart('${item.id}')">
            <i class="fas fa-${inCart ? 'check' : 'shopping-cart'}"></i>
            ${inCart ? 'In Cart' : 'Add to Cart'}
          </button>
          <a href="product-details.html?id=${item.id}" class="btn-view-details">
            <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `;
  }).join('');

  const countEl = document.getElementById('wishlist-count');
  if (countEl) countEl.textContent = wishlist.length;

  initFadeInObserver();
}

function removeFromWishlistPage(productId) {
  WishlistStore.remove(productId);
  renderWishlistPage();
  showToast('Removed', 'Item removed from your wishlist.', 'info');
}
