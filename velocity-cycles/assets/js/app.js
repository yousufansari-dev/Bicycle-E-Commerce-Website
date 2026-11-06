/* ============================================================
   VELOCITY CYCLES - Main Application JavaScript
   Loads on every customer page
   ============================================================ */

// ============================================================
// TOAST NOTIFICATION SYSTEM
// ============================================================
function showToast(title, message, type = 'success') {
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-times-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  };

  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="toast-icon ${icons[type] || icons.info}"></i>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <span class="toast-close" onclick="this.parentElement.remove()">&times;</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ============================================================
// HEADER / NAVIGATION
// ============================================================
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  // Scroll behavior
  const updateHeader = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when link clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target)) {
        menuToggle.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // Dropdown on mobile tap
  document.querySelectorAll('.nav-links > li > a').forEach(link => {
    link.addEventListener('click', (e) => {
      const dropdown = link.nextElementSibling;
      if (dropdown && dropdown.classList.contains('dropdown-menu') && window.innerWidth <= 1023) {
        e.preventDefault();
        dropdown.classList.toggle('open');
      }
    });
  });

  // Set active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ============================================================
// BACK TO TOP
// ============================================================
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================================
// PAGE LOADER
// ============================================================
function initPageLoader() {
  const loader = document.querySelector('.loader-overlay');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 500);
  });

  // Fallback in case load event already fired
  if (document.readyState === 'complete') {
    setTimeout(() => loader.classList.add('hidden'), 300);
  }
}

// ============================================================
// COUNTDOWN TIMER
// ============================================================
function initCountdown(targetDate) {
  const hoursEl = document.getElementById('countdown-hours');
  const minutesEl = document.getElementById('countdown-minutes');
  const secondsEl = document.getElementById('countdown-seconds');
  const daysEl = document.getElementById('countdown-days');

  if (!hoursEl && !minutesEl && !secondsEl) return;

  function update() {
    const now = new Date();
    const target = targetDate || new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3);
    const diff = target - now;

    if (diff <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

// ============================================================
// NEWSLETTER FORM
// ============================================================
function initNewsletterForm() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (!emailInput) return;

      const email = emailInput.value.trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Invalid Email', 'Please enter a valid email address.', 'error');
        return;
      }

      // Save to localStorage (demo)
      const subscribers = JSON.parse(localStorage.getItem('vc_subscribers') || '[]');
      if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('vc_subscribers', JSON.stringify(subscribers));
      }

      showToast('Subscribed!', `Thanks for subscribing, ${email}!`, 'success');
      emailInput.value = '';
    });
  });
}

// ============================================================
// SEARCH FUNCTIONALITY
// ============================================================
function initSearchBar() {
  const searchInput = document.getElementById('product-search-input');
  if (!searchInput) return;

  let debounceTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const query = searchInput.value.trim();
      const grid = document.getElementById('products-grid');
      if (!grid) return;

      if (query.length === 0) {
        const cat = searchInput.dataset.category || 'all';
        renderProducts(grid, ProductsStore.getByCategory(cat));
      } else if (query.length >= 2) {
        const results = ProductsStore.search(query);
        renderProducts(grid, results);
      }
    }, 300);
  });
}

// ============================================================
// FADE-IN ANIMATION (Intersection Observer)
// ============================================================
function initFadeInObserver() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.fade-in').forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ============================================================
// TABS
// ============================================================
function initTabs() {
  document.querySelectorAll('.tabs-nav').forEach(nav => {
    nav.querySelectorAll('.tab-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        const container = btn.closest('.tabs-container');
        if (!container) return;

        // Update buttons
        container.querySelectorAll('.tab-nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update panels
        container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        const panel = container.querySelector(`#${target}`);
        if (panel) panel.classList.add('active');
      });
    });
  });
}

// ============================================================
// MODAL
// ============================================================
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
  if (e.target.classList.contains('modal-close') || e.target.closest('.modal-close')) {
    const modal = e.target.closest('.modal-overlay');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
});

// ============================================================
// UPDATE BADGES
// ============================================================
function updateAllBadges() {
  CartStore.updateBadge();
  WishlistStore.updateBadge();
}

// ============================================================
// CATEGORY FILTER BUTTONS
// ============================================================
function initCategoryFilters() {
  document.querySelectorAll('.tab-btn[data-category]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.category;
      const grid = document.getElementById('products-grid');
      if (!grid) return;

      const products = category === 'all'
        ? ProductsStore.getFeatured().slice(0, 8)
        : ProductsStore.getByCategory(category).slice(0, 8);

      renderProducts(grid, products);
    });
  });
}

// ============================================================
// SMOOTH SCROLL
// ============================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ============================================================
// SHOP PAGE FILTERS
// ============================================================
function initShopFilters() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  let currentFilters = {
    category: new URLSearchParams(window.location.search).get('category') || 'all',
    minPrice: 0,
    maxPrice: 10000,
    brands: [],
    sortBy: 'default'
  };

  function applyFilters() {
    const products = ProductsStore.filter(currentFilters);
    renderProducts(grid, products);
    const countEl = document.getElementById('products-count');
    if (countEl) countEl.textContent = products.length;
  }

  // Category checkboxes
  document.querySelectorAll('.category-filter-cb').forEach(cb => {
    cb.addEventListener('change', () => {
      currentFilters.category = cb.value;
      applyFilters();
    });
  });

  // Brand checkboxes
  document.querySelectorAll('.brand-filter-cb').forEach(cb => {
    cb.addEventListener('change', () => {
      if (cb.checked) {
        currentFilters.brands.push(cb.value);
      } else {
        currentFilters.brands = currentFilters.brands.filter(b => b !== cb.value);
      }
      applyFilters();
    });
  });

  // Sort select
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      currentFilters.sortBy = sortSelect.value;
      applyFilters();
    });
  }

  // Price range
  const minPriceInput = document.getElementById('min-price');
  const maxPriceInput = document.getElementById('max-price');
  const priceSlider = document.getElementById('price-range-slider');

  if (priceSlider) {
    priceSlider.addEventListener('input', () => {
      currentFilters.maxPrice = parseInt(priceSlider.value);
      if (maxPriceInput) maxPriceInput.value = currentFilters.maxPrice;
      applyFilters();
    });
  }

  if (minPriceInput) {
    minPriceInput.addEventListener('change', () => {
      currentFilters.minPrice = parseInt(minPriceInput.value) || 0;
      applyFilters();
    });
  }
  if (maxPriceInput) {
    maxPriceInput.addEventListener('change', () => {
      currentFilters.maxPrice = parseInt(maxPriceInput.value) || 10000;
      applyFilters();
    });
  }

  // Search bar
  const searchInput = document.getElementById('product-search-input');
  if (searchInput) {
    let timer;
    searchInput.addEventListener('input', () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const q = searchInput.value.trim();
        if (q.length >= 2) {
          renderProducts(grid, ProductsStore.search(q));
        } else if (q.length === 0) {
          applyFilters();
        }
      }, 300);
    });
  }

  // View toggle (grid/list)
  const gridViewBtn = document.getElementById('grid-view-btn');
  const listViewBtn = document.getElementById('list-view-btn');
  const productsWrapper = document.getElementById('products-wrapper');

  if (gridViewBtn && listViewBtn && productsWrapper) {
    gridViewBtn.addEventListener('click', () => {
      gridViewBtn.classList.add('active');
      listViewBtn.classList.remove('active');
      productsWrapper.classList.remove('product-list-view');
    });

    listViewBtn.addEventListener('click', () => {
      listViewBtn.classList.add('active');
      gridViewBtn.classList.remove('active');
      productsWrapper.classList.add('product-list-view');
    });
  }

  // Initial render
  applyFilters();
}

// ============================================================
// INITIALIZE APP
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initBackToTop();
  initPageLoader();
  initNewsletterForm();
  initTabs();
  initSmoothScroll();
  initFadeInObserver();
  updateAllBadges();
  initCategoryFilters();

  // Page-specific inits
  const page = window.location.pathname.split('/').pop();

  if (page === 'shop.html' || page === 'mountain-bikes.html' ||
      page === 'road-bikes.html' || page === 'electric-bikes.html' ||
      page === 'kids-bikes.html') {
    initShopFilters();
    initSearchBar();
  }

  if (page === 'cart.html') {
    renderCartPage();
    // Setup checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (CartStore.getCount() === 0) {
          showToast('Cart Empty', 'Add items to your cart first.', 'warning');
        } else {
          window.location.href = 'checkout.html';
        }
      });
    }
  }

  if (page === 'wishlist.html') {
    renderWishlistPage();
  }

  if (page === 'checkout.html') {
    const form = document.getElementById('checkout-form');
    if (form) form.addEventListener('submit', handleCheckout);
    updateCartSummary();
    // Pre-fill user data if logged in
    const user = AuthStore.getCurrentUser();
    if (user) {
      const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
      setVal('checkout-firstname', user.firstName);
      setVal('checkout-lastname', user.lastName);
      setVal('checkout-email', user.email);
      setVal('checkout-phone', user.phone);
    }
  }

  if (page === 'order-success.html') {
    const orderId = localStorage.getItem('vc_last_order_id');
    const order = orderId ? OrdersStore.getById(orderId) : null;
    if (order) {
      const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
      setEl('success-order-id', order.id);
      setEl('success-customer-name', order.customerName);
      setEl('success-order-total', formatPrice(order.total));
      setEl('success-email', order.customerEmail);
      setEl('success-items-count', order.items.length);
    }
  }

  if (page === 'login.html') {
    const form = document.getElementById('login-form');
    if (form) form.addEventListener('submit', handleCustomerLogin);
  }

  if (page === 'register.html') {
    const form = document.getElementById('register-form');
    if (form) form.addEventListener('submit', handleCustomerRegister);
  }

  if (page === 'product-details.html') {
    initProductDetailsPage();
  }

  if (page === 'index.html' || page === '') {
    initHomePage();
  }

  // Countdown on homepage
  const promoDate = new Date();
  promoDate.setDate(promoDate.getDate() + 3);
  initCountdown(promoDate);
});

// ============================================================
// HOME PAGE INIT
// ============================================================
function initHomePage() {
  // Featured products
  const featuredGrid = document.getElementById('featured-products-grid');
  if (featuredGrid) {
    renderProducts(featuredGrid, ProductsStore.getFeatured());
  }

  // New arrivals
  const newArrivalsGrid = document.getElementById('new-arrivals-grid');
  if (newArrivalsGrid) {
    renderProducts(newArrivalsGrid, ProductsStore.getNewArrivals());
  }

  // Best sellers
  const bestSellersGrid = document.getElementById('best-sellers-grid');
  if (bestSellersGrid) {
    renderProducts(bestSellersGrid, ProductsStore.getBestSellers().slice(0, 4));
  }

  // Update category product counts
  const categories = ['mountain', 'road', 'electric', 'kids'];
  categories.forEach(cat => {
    const countEl = document.getElementById(`${cat}-count`);
    if (countEl) {
      countEl.textContent = ProductsStore.getByCategory(cat).length + ' Models';
    }
  });
}

// ============================================================
// PRODUCT DETAILS PAGE
// ============================================================
function initProductDetailsPage() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');
  if (!productId) {
    window.location.href = 'shop.html';
    return;
  }

  const product = ProductsStore.getById(productId);
  if (!product) {
    window.location.href = 'shop.html';
    return;
  }

  // Set product data
  document.title = `${product.name} — Velocity Cycles`;

  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };
  const setAttr = (id, attr, val) => { const el = document.getElementById(id); if (el) el.setAttribute(attr, val); };

  setEl('product-brand', product.brand);
  setEl('product-name', product.name);
  setEl('product-description', product.description);
  setEl('product-rating-stars', generateStars(product.rating));
  setEl('product-review-count', `(${product.reviewCount} reviews)`);

  const currentPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  setEl('product-current-price', formatPrice(currentPrice));
  if (hasDiscount) {
    setEl('product-original-price', formatPrice(product.price));
    const savePct = Math.round(((product.price - product.discountPrice) / product.price) * 100);
    setEl('product-save', `Save ${savePct}%`);
  }

  // Category badge
  setEl('product-breadcrumb-name', product.name);
  setEl('product-breadcrumb-cat', product.category.charAt(0).toUpperCase() + product.category.slice(1) + ' Bikes');

  // Gallery
  renderProductGallery(product);

  // Sizes
  const sizesContainer = document.getElementById('product-sizes');
  if (sizesContainer) {
    sizesContainer.innerHTML = product.sizes.map((s, i) => `
      <button class="size-btn ${i === 0 ? 'active' : ''}" data-size="${s}" 
        onclick="selectSize(this, '${s}')">${s}</button>
    `).join('');
  }

  // Colors
  const colorsContainer = document.getElementById('product-colors');
  if (colorsContainer) {
    colorsContainer.innerHTML = product.colors.map((c, i) => `
      <button class="color-option ${i === 0 ? 'active' : ''}" 
        style="background:${c}" data-color="${c}"
        onclick="selectColor(this, '${c}')" title="${c}"></button>
    `).join('');
  }

  // Stock indicator
  const stockEl = document.getElementById('product-stock');
  if (stockEl) {
    if (product.stock === 0) {
      stockEl.innerHTML = '<span style="color:var(--danger)"><i class="fas fa-times-circle"></i> Out of Stock</span>';
    } else if (product.stock <= 5) {
      stockEl.innerHTML = `<span style="color:var(--warning)"><i class="fas fa-exclamation-triangle"></i> Only ${product.stock} left in stock!</span>`;
    } else {
      stockEl.innerHTML = `<span style="color:var(--success)"><i class="fas fa-check-circle"></i> In Stock (${product.stock} available)</span>`;
    }
  }

  // Add to cart button
  const addCartBtn = document.getElementById('detail-add-cart-btn');
  if (addCartBtn) {
    addCartBtn.addEventListener('click', () => {
      const qty = parseInt(document.getElementById('detail-qty')?.value || '1');
      const size = document.querySelector('.size-btn.active')?.dataset.size || null;
      const color = document.querySelector('.color-option.active')?.dataset.color || null;
      addToCart(product.id, qty, size, color);
    });
  }

  // Wishlist button
  const wishlistBtn = document.getElementById('detail-wishlist-btn');
  if (wishlistBtn) {
    const inWishlist = WishlistStore.has(product.id);
    wishlistBtn.innerHTML = `<i class="fa${inWishlist ? 's' : 'r'} fa-heart"></i>`;
    wishlistBtn.classList.toggle('active', inWishlist);

    wishlistBtn.addEventListener('click', () => {
      toggleWishlist(product.id);
      const isNow = WishlistStore.has(product.id);
      wishlistBtn.innerHTML = `<i class="fa${isNow ? 's' : 'r'} fa-heart"></i>`;
      wishlistBtn.classList.toggle('active', isNow);
    });
  }

  // Qty controls
  const qtyInput = document.getElementById('detail-qty');
  document.getElementById('detail-qty-minus')?.addEventListener('click', () => {
    if (qtyInput && parseInt(qtyInput.value) > 1) qtyInput.value--;
  });
  document.getElementById('detail-qty-plus')?.addEventListener('click', () => {
    if (qtyInput && parseInt(qtyInput.value) < product.stock) qtyInput.value++;
  });

  // Specs
  const specsContainer = document.getElementById('product-specs-list');
  if (specsContainer && product.specs) {
    specsContainer.innerHTML = Object.entries(product.specs).map(([key, val]) => `
      <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border-gray);font-size:14px">
        <span style="color:var(--medium-gray);font-weight:500;text-transform:capitalize">${key.replace(/([A-Z])/g,' $1')}</span>
        <span style="font-weight:600;text-align:right;max-width:60%">${val}</span>
      </div>
    `).join('');
  }

  // Related products
  const relatedGrid = document.getElementById('related-products-grid');
  if (relatedGrid) {
    const related = ProductsStore.getByCategory(product.category)
      .filter(p => p.id !== product.id)
      .slice(0, 4);
    renderProducts(relatedGrid, related);
  }

  // Init tabs
  initTabs();
}

function renderProductGallery(product) {
  const mainImg = document.getElementById('gallery-main-img');
  if (mainImg) {
    mainImg.src = product.images[0];
    mainImg.alt = product.name;
  }

  const thumbsContainer = document.getElementById('gallery-thumbs');
  if (thumbsContainer) {
    thumbsContainer.innerHTML = product.images.map((img, i) => `
      <div class="gallery-thumb ${i === 0 ? 'active' : ''}" onclick="switchGalleryImage(this, '${img}')">
        <img src="${img}" alt="${product.name} image ${i + 1}" loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=60'">
      </div>
    `).join('');
  }
}

function switchGalleryImage(thumb, imgSrc) {
  const mainImg = document.getElementById('gallery-main-img');
  if (mainImg) {
    mainImg.style.opacity = '0';
    setTimeout(() => {
      mainImg.src = imgSrc;
      mainImg.style.opacity = '1';
    }, 150);
  }
  document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
  thumb.classList.add('active');
}

function selectSize(btn, size) {
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function selectColor(btn, color) {
  document.querySelectorAll('.color-option').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ============================================================
// SHARED HEADER HTML (injected into pages)
// ============================================================
function getNavHTML(activePage = '') {
  return `
  <div class="loader-overlay" id="page-loader">
    <div class="loader-logo">VELOCITY<span>CYCLES</span></div>
    <div class="loader-spinner"></div>
  </div>

  <div class="toast-container" id="toast-container"></div>

  <header class="header" id="main-header">
    <div class="container">
      <nav class="navbar">
        <a href="index.html" class="logo">
          <div class="logo-icon"><i class="fas fa-bicycle"></i></div>
          <div>
            <div class="logo-text">VELOCITY<span>CYCLES</span></div>
            <div class="logo-tagline">Ride Beyond Limits</div>
          </div>
        </a>

        <ul class="nav-links" id="nav-links">
          <li><a href="index.html" class="${activePage === 'home' ? 'active' : ''}">Home</a></li>
          <li>
            <a href="shop.html" class="${activePage === 'shop' ? 'active' : ''}">
              Shop <i class="fas fa-chevron-down" style="font-size:10px"></i>
            </a>
            <ul class="dropdown-menu">
              <li><a href="shop.html"><i class="fas fa-bicycle"></i> All Bikes</a></li>
              <li><a href="mountain-bikes.html"><i class="fas fa-mountain"></i> Mountain Bikes</a></li>
              <li><a href="road-bikes.html"><i class="fas fa-road"></i> Road Bikes</a></li>
              <li><a href="electric-bikes.html"><i class="fas fa-bolt"></i> Electric Bikes</a></li>
              <li><a href="kids-bikes.html"><i class="fas fa-child"></i> Kids Bikes</a></li>
            </ul>
          </li>
          <li><a href="about.html" class="${activePage === 'about' ? 'active' : ''}">About</a></li>
          <li><a href="contact.html" class="${activePage === 'contact' ? 'active' : ''}">Contact</a></li>
        </ul>

        <div class="nav-actions">
          <a href="wishlist.html" class="nav-action-btn" title="Wishlist">
            <i class="far fa-heart"></i>
            <span class="nav-badge wishlist-badge" style="display:none">0</span>
          </a>
          <a href="cart.html" class="nav-action-btn" title="Cart">
            <i class="fas fa-shopping-cart"></i>
            <span class="nav-badge cart-badge" style="display:none">0</span>
          </a>
          <a href="login.html" class="nav-action-btn" id="nav-auth-btn" title="Account">
            <i class="far fa-user"></i>
          </a>
          <button class="menu-toggle" id="menu-toggle" aria-label="Toggle menu">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>
    </div>
  </header>

  <button class="back-to-top" id="back-to-top" aria-label="Back to top">
    <i class="fas fa-chevron-up"></i>
  </button>
  `;
}

function getFooterHTML() {
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="logo">
            <div class="logo-icon"><i class="fas fa-bicycle"></i></div>
            <div>
              <div class="logo-text">VELOCITY<span>CYCLES</span></div>
              <div class="logo-tagline">Ride Beyond Limits</div>
            </div>
          </a>
          <p>Premium bicycles for every rider. From mountain trails to city streets, we have the perfect bike to fuel your passion and push your limits.</p>
          <div class="social-links">
            <a href="#" class="social-link" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
            <a href="#" class="social-link" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
            <a href="#" class="social-link" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
            <a href="#" class="social-link" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
            <a href="#" class="social-link" aria-label="Strava"><i class="fab fa-strava"></i></a>
          </div>
        </div>
        <div>
          <h4 class="footer-heading">Quick Links</h4>
          <ul class="footer-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="shop.html">All Bikes</a></li>
            <li><a href="about.html">About Us</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="cart.html">Shopping Cart</a></li>
            <li><a href="wishlist.html">Wishlist</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer-heading">Categories</h4>
          <ul class="footer-links">
            <li><a href="mountain-bikes.html">Mountain Bikes</a></li>
            <li><a href="road-bikes.html">Road Bikes</a></li>
            <li><a href="electric-bikes.html">Electric Bikes</a></li>
            <li><a href="kids-bikes.html">Kids Bikes</a></li>
            <li><a href="shop.html">Best Sellers</a></li>
            <li><a href="shop.html">New Arrivals</a></li>
          </ul>
        </div>
        <div>
          <h4 class="footer-heading">Contact Us</h4>
          <div class="footer-contact-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>1234 Cycle Lane, Denver, CO 80201, USA</span>
          </div>
          <div class="footer-contact-item">
            <i class="fas fa-phone-alt"></i>
            <span>+1 (555) VELOCITY</span>
          </div>
          <div class="footer-contact-item">
            <i class="fas fa-envelope"></i>
            <span>hello@velocitycycles.com</span>
          </div>
          <div class="footer-contact-item">
            <i class="fas fa-clock"></i>
            <span>Mon–Sat: 9am–6pm MST</span>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container" style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;width:100%">
        <p>&copy; ${new Date().getFullYear()} Velocity Cycles. All rights reserved.</p>
        <div class="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Return Policy</a>
          <a href="admin/login.html" style="color:rgba(57,255,20,0.4)">Admin</a>
        </div>
      </div>
    </div>
  </footer>
  `;
}
