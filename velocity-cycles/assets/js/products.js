/* ============================================================
   VELOCITY CYCLES - Products Data & Management
   ============================================================ */

// ---- Default Sample Products ----
const DEFAULT_PRODUCTS = [
  {
    id: 'vc-001',
    name: 'Apex Pro Carbon MTB',
    brand: 'Trek',
    category: 'mountain',
    price: 3299,
    discountPrice: 2799,
    description: 'Conquer any terrain with the Apex Pro Carbon MTB. Featuring a lightweight full-carbon frame, 29" wheels, and a 12-speed SRAM GX Eagle drivetrain. The RockShox Pike fork soaks up trail chatter with 140mm of travel, while 4-piston hydraulic brakes deliver confident stopping power in all conditions.',
    images: [
      'https://images.unsplash.com/photo-1576435728678-68d0fbf94946?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80'
    ],
    colors: ['#1a1a1a', '#2d6a4f', '#c9184a'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 15,
    rating: 4.9,
    reviewCount: 127,
    featured: true,
    newArrival: false,
    weight: '10.8 kg',
    specs: {
      frame: 'Full Carbon, 29"',
      fork: 'RockShox Pike RCT3 140mm',
      drivetrain: 'SRAM GX Eagle 12-speed',
      brakes: 'Shimano XT 4-piston Hydraulic',
      wheels: '29" Carbon Tubeless',
      suspension: 'Full Suspension'
    }
  },
  {
    id: 'vc-002',
    name: 'Velocity R9 Road Racer',
    brand: 'Specialized',
    category: 'road',
    price: 4199,
    discountPrice: 3599,
    description: 'Built for speed and aerodynamics, the Velocity R9 Road Racer features an ultra-stiff carbon aero frame and Shimano Ultegra R8000 groupset. The integrated cockpit reduces drag while the tubeless-ready wheels roll fast on any road surface.',
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80',
      'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800&q=80',
      'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=800&q=80'
    ],
    colors: ['#c9184a', '#0077b6', '#1a1a1a'],
    sizes: ['47', '50', '52', '54', '56', '58'],
    stock: 8,
    rating: 4.8,
    reviewCount: 94,
    featured: true,
    newArrival: false,
    weight: '7.4 kg',
    specs: {
      frame: 'Aero Carbon, 700c',
      fork: 'Carbon Aero Fork',
      drivetrain: 'Shimano Ultegra R8000 22-speed',
      brakes: 'Shimano Ultegra Hydraulic Disc',
      wheels: '700c Carbon Tubeless',
      suspension: 'Rigid'
    }
  },
  {
    id: 'vc-003',
    name: 'Bolt Electric Commuter',
    brand: 'Giant',
    category: 'electric',
    price: 2899,
    discountPrice: 2499,
    description: 'The Bolt Electric Commuter transforms your daily ride with a 500Wh integrated battery and 85Nm torque Bosch Performance motor. Up to 100km range on a single charge, with a smart LCD display and hydraulic disc brakes for confident urban riding.',
    images: [
      'https://images.unsplash.com/photo-1558979158-65a1eaa08691?w=800&q=80',
      'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=800&q=80',
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80'
    ],
    colors: ['#1a1a1a', '#6c757d', '#0077b6'],
    sizes: ['S/M', 'M/L', 'L/XL'],
    stock: 12,
    rating: 4.7,
    reviewCount: 68,
    featured: true,
    newArrival: true,
    weight: '22.5 kg',
    specs: {
      frame: 'Aluminium 6061, 27.5"',
      fork: 'Air Suspension 80mm',
      drivetrain: 'Shimano Deore 10-speed',
      brakes: 'Hydraulic Disc 180mm',
      wheels: '27.5" Double Wall',
      motor: 'Bosch Performance 85Nm',
      battery: '500Wh Integrated',
      range: 'Up to 100km'
    }
  },
  {
    id: 'vc-004',
    name: 'Blazer Kids 24"',
    brand: 'Cannondale',
    category: 'kids',
    price: 499,
    discountPrice: 399,
    description: 'The perfect first serious bicycle for young riders aged 8-12. The Blazer Kids features a lightweight aluminium frame, 7-speed Shimano gears, and front disc brake for confident stopping. The ergonomic design grows with your child.',
    images: [
      'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&q=80',
      'https://images.unsplash.com/photo-1609520505218-7421df82672e?w=800&q=80',
      'https://images.unsplash.com/photo-1574504258040-2e3f6ef0f3f4?w=800&q=80'
    ],
    colors: ['#c9184a', '#0077b6', '#2d6a4f', '#f9c74f'],
    sizes: ['One Size'],
    stock: 25,
    rating: 4.6,
    reviewCount: 52,
    featured: true,
    newArrival: false,
    weight: '9.2 kg',
    specs: {
      frame: 'Aluminium 6061, 24"',
      fork: 'Rigid Steel',
      drivetrain: 'Shimano 7-speed',
      brakes: 'Front Disc, Rear V-Brake',
      wheels: '24" Double Wall',
      ageRange: '8-12 years'
    }
  },
  {
    id: 'vc-005',
    name: 'Summit XC Trail',
    brand: 'Santa Cruz',
    category: 'mountain',
    price: 5299,
    discountPrice: null,
    description: 'Race-proven XC geometry meets trail-ready capability in the Summit XC Trail. A full-carbon main frame pairs with a 100mm travel fork for efficient climbing and capable descending. SRAM XX1 Eagle provides seamless 12-speed shifting.',
    images: [
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80',
      'https://images.unsplash.com/photo-1576435728678-68d0fbf94946?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'
    ],
    colors: ['#c9184a', '#1a1a1a', '#f9c74f'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    stock: 6,
    rating: 4.9,
    reviewCount: 43,
    featured: false,
    newArrival: true,
    weight: '9.1 kg',
    specs: {
      frame: 'Full Carbon, 29"',
      fork: 'Fox 32 Step-Cast 100mm',
      drivetrain: 'SRAM XX1 Eagle 12-speed',
      brakes: 'SRAM Level Ultimate Hydraulic',
      wheels: '29" Carbon XC',
      suspension: 'Full Suspension'
    }
  },
  {
    id: 'vc-006',
    name: 'Aero S Pro Disc',
    brand: 'Canyon',
    category: 'road',
    price: 3499,
    discountPrice: 2999,
    description: 'The Aero S Pro Disc is designed to slice through the wind with its CFD-optimized tube shapes. Shimano 105 Di2 electronic shifting ensures precise gear changes at race speeds, while the through-axle disc brakes provide all-weather braking confidence.',
    images: [
      'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=800&q=80',
      'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800&q=80',
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80'
    ],
    colors: ['#0077b6', '#1a1a1a', '#c9184a'],
    sizes: ['48', '50', '52', '54', '56'],
    stock: 10,
    rating: 4.7,
    reviewCount: 38,
    featured: false,
    newArrival: false,
    weight: '7.8 kg',
    specs: {
      frame: 'Carbon Aero, 700c',
      fork: 'Carbon Full-Integrated',
      drivetrain: 'Shimano 105 Di2 22-speed',
      brakes: 'Shimano 105 Hydraulic Disc',
      wheels: '700c Carbon',
      suspension: 'Rigid'
    }
  },
  {
    id: 'vc-007',
    name: 'Spark E-MTB Pro',
    brand: 'Scott',
    category: 'electric',
    price: 5799,
    discountPrice: 4999,
    description: 'Experience the thrill of mountain biking amplified. The Spark E-MTB Pro combines a TQ-HPR50 mid-motor delivering 50Nm of support with a lightweight full-suspension carbon frame. Navigate technical trails with precise Fox suspension and SRAM Eagle AXS wireless shifting.',
    images: [
      'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=800&q=80',
      'https://images.unsplash.com/photo-1558979158-65a1eaa08691?w=800&q=80',
      'https://images.unsplash.com/photo-1576435728678-68d0fbf94946?w=800&q=80'
    ],
    colors: ['#2d6a4f', '#1a1a1a', '#0077b6'],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 4,
    rating: 4.8,
    reviewCount: 29,
    featured: true,
    newArrival: true,
    weight: '19.5 kg',
    specs: {
      frame: 'Carbon, 29"',
      fork: 'Fox 36 Factory 150mm',
      drivetrain: 'SRAM Eagle AXS 12-speed',
      brakes: 'SRAM Code RSC Hydraulic',
      wheels: '29" Carbon Enduro',
      motor: 'TQ-HPR50 50Nm',
      battery: '360Wh Internal',
      range: 'Up to 80km'
    }
  },
  {
    id: 'vc-008',
    name: 'Zoom 20" Junior',
    brand: 'Trek',
    category: 'kids',
    price: 349,
    discountPrice: 279,
    description: 'The Zoom 20" Junior is engineered specifically for growing riders aged 6-9. With a lightweight aluminium frame, single-speed drivetrain, and coaster brake with front hand brake, it builds confidence for young cyclists ready to advance.',
    images: [
      'https://images.unsplash.com/photo-1609520505218-7421df82672e?w=800&q=80',
      'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&q=80',
      'https://images.unsplash.com/photo-1574504258040-2e3f6ef0f3f4?w=800&q=80'
    ],
    colors: ['#c9184a', '#2d6a4f', '#f9c74f', '#0077b6'],
    sizes: ['One Size'],
    stock: 30,
    rating: 4.5,
    reviewCount: 76,
    featured: false,
    newArrival: false,
    weight: '7.8 kg',
    specs: {
      frame: 'Aluminium 6061, 20"',
      fork: 'Rigid Steel',
      drivetrain: 'Single Speed',
      brakes: 'Coaster + Front Hand Brake',
      wheels: '20" Alloy',
      ageRange: '6-9 years'
    }
  },
  {
    id: 'vc-009',
    name: 'Enduro Beast 27.5',
    brand: 'Yeti',
    category: 'mountain',
    price: 6499,
    discountPrice: null,
    description: 'Dominate the most technical enduro courses. The Enduro Beast features 160mm of Switch Infinity suspension travel, a Mullet setup with 29" front and 27.5" rear, and full SRAM X01 Eagle drivetrain. Built for podiums, not compromises.',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1576435728678-68d0fbf94946?w=800&q=80',
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80'
    ],
    colors: ['#0077b6', '#1a1a1a'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 3,
    rating: 5.0,
    reviewCount: 21,
    featured: true,
    newArrival: false,
    weight: '13.9 kg',
    specs: {
      frame: 'Carbon Switch Infinity, Mullet',
      fork: 'Fox 38 Factory 160mm',
      drivetrain: 'SRAM X01 Eagle 12-speed',
      brakes: 'SRAM Maven Ultimate 4-piston',
      wheels: '29/27.5" Enduro Carbon',
      suspension: 'Full 160mm'
    }
  },
  {
    id: 'vc-010',
    name: 'Gravel King 700c',
    brand: 'Specialized',
    category: 'road',
    price: 2199,
    discountPrice: 1899,
    description: 'Explore roads less traveled. The Gravel King 700c blurs the line between road bike and adventure machine with its relaxed geometry, clearance for 45mm tires, and Shimano GRX gravel-specific drivetrain. Equipped with mounting points for bikepacking.',
    images: [
      'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800&q=80',
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80',
      'https://images.unsplash.com/photo-1502744688674-c619d1586c9e?w=800&q=80'
    ],
    colors: ['#2d6a4f', '#c9184a', '#6c757d'],
    sizes: ['47', '50', '52', '54', '56'],
    stock: 14,
    rating: 4.6,
    reviewCount: 55,
    featured: false,
    newArrival: true,
    weight: '8.6 kg',
    specs: {
      frame: 'Carbon Gravel, 700c',
      fork: 'Carbon with Fender Mounts',
      drivetrain: 'Shimano GRX 800 22-speed',
      brakes: 'Shimano GRX Hydraulic Disc',
      wheels: '700c Gravel Tubeless',
      suspension: 'Rigid'
    }
  },
  {
    id: 'vc-011',
    name: 'City Glide E-Comfort',
    brand: 'Giant',
    category: 'electric',
    price: 1999,
    discountPrice: 1699,
    description: 'The ultimate urban commuter. The City Glide E-Comfort pairs a Yamaha SyncDrive Core motor with a step-through frame for easy mounting. Built-in rear rack, fenders, and integrated lights make it the perfect last-mile solution.',
    images: [
      'https://images.unsplash.com/photo-1558979158-65a1eaa08691?w=800&q=80',
      'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=800&q=80',
      'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80'
    ],
    colors: ['#6c757d', '#1a1a1a', '#f9c74f'],
    sizes: ['One Size'],
    stock: 18,
    rating: 4.5,
    reviewCount: 83,
    featured: false,
    newArrival: false,
    weight: '24.1 kg',
    specs: {
      frame: 'Aluminium Step-Through, 28"',
      fork: 'Rigid Aluminium',
      drivetrain: 'Shimano Nexus 7-speed Internal',
      brakes: 'Hydraulic Disc',
      wheels: '28" Double Wall',
      motor: 'Yamaha SyncDrive Core',
      battery: '400Wh Integrated',
      range: 'Up to 85km'
    }
  },
  {
    id: 'vc-012',
    name: 'Thunder 16" Balance',
    brand: 'Cannondale',
    category: 'kids',
    price: 199,
    discountPrice: 159,
    description: 'Help your little one find their balance. The Thunder 16" is the perfect introduction to cycling for ages 4-6. The lightweight aluminium frame with two-hand brakes and training wheels builds confidence for the transition to pedaling.',
    images: [
      'https://images.unsplash.com/photo-1574504258040-2e3f6ef0f3f4?w=800&q=80',
      'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800&q=80',
      'https://images.unsplash.com/photo-1609520505218-7421df82672e?w=800&q=80'
    ],
    colors: ['#c9184a', '#f9c74f', '#0077b6'],
    sizes: ['One Size'],
    stock: 40,
    rating: 4.4,
    reviewCount: 112,
    featured: false,
    newArrival: false,
    weight: '5.9 kg',
    specs: {
      frame: 'Aluminium 6061, 16"',
      fork: 'Rigid Steel',
      drivetrain: 'Single Speed',
      brakes: 'Two-hand Caliper',
      wheels: '16" Alloy',
      ageRange: '4-6 years'
    }
  }
];

// ---- Currency Configuration ----
const CURRENCY = {
  code: 'PKR',
  symbol: 'Rs.',
  rate: 278,        // 1 USD = 278 PKR (update as needed)
  locale: 'en-PK'
};

// Format a USD price to PKR string
function formatPrice(usdPrice) {
  const pkr = Math.round(usdPrice * CURRENCY.rate);
  return CURRENCY.symbol + ' ' + pkr.toLocaleString('en-PK');
}

// ---- Products Store ----
const ProductsStore = {
  // Initialize products in localStorage
  init() {
    if (!localStorage.getItem('vc_products')) {
      localStorage.setItem('vc_products', JSON.stringify(DEFAULT_PRODUCTS));
    }
  },

  // Get all products
  getAll() {
    const stored = localStorage.getItem('vc_products');
    return stored ? JSON.parse(stored) : DEFAULT_PRODUCTS;
  },

  // Get product by ID
  getById(id) {
    return this.getAll().find(p => p.id === id) || null;
  },

  // Get products by category
  getByCategory(category) {
    if (category === 'all') return this.getAll();
    return this.getAll().filter(p => p.category === category);
  },

  // Get featured products
  getFeatured() {
    return this.getAll().filter(p => p.featured);
  },

  // Get new arrivals
  getNewArrivals() {
    return this.getAll().filter(p => p.newArrival);
  },

  // Get best sellers (high rating + many reviews)
  getBestSellers() {
    return this.getAll()
      .sort((a, b) => (b.rating * b.reviewCount) - (a.rating * a.reviewCount))
      .slice(0, 8);
  },

  // Search products
  search(query) {
    const q = query.toLowerCase();
    return this.getAll().filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  },

  // Filter products
  filter({ category, minPrice, maxPrice, brands, sortBy }) {
    let products = this.getAll();

    if (category && category !== 'all') {
      products = products.filter(p => p.category === category);
    }
    if (minPrice !== undefined) {
      products = products.filter(p => (p.discountPrice || p.price) >= minPrice);
    }
    if (maxPrice !== undefined) {
      products = products.filter(p => (p.discountPrice || p.price) <= maxPrice);
    }
    if (brands && brands.length > 0) {
      products = products.filter(p => brands.includes(p.brand));
    }

    switch (sortBy) {
      case 'price-low': products.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price)); break;
      case 'price-high': products.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price)); break;
      case 'rating': products.sort((a, b) => b.rating - a.rating); break;
      case 'newest': products.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0)); break;
      case 'name': products.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }

    return products;
  },

  // Add product (admin)
  add(product) {
    const products = this.getAll();
    const newProduct = {
      ...product,
      id: 'vc-' + Date.now(),
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      featured: product.featured || false,
      newArrival: product.newArrival || true,
    };
    products.push(newProduct);
    localStorage.setItem('vc_products', JSON.stringify(products));
    return newProduct;
  },

  // Update product (admin)
  update(id, updates) {
    const products = this.getAll();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      localStorage.setItem('vc_products', JSON.stringify(products));
      return products[index];
    }
    return null;
  },

  // Delete product (admin)
  delete(id) {
    const products = this.getAll().filter(p => p.id !== id);
    localStorage.setItem('vc_products', JSON.stringify(products));
  },

  // Get unique brands
  getBrands() {
    return [...new Set(this.getAll().map(p => p.brand))].sort();
  },

  // Get price range
  getPriceRange() {
    const products = this.getAll();
    const prices = products.map(p => p.discountPrice || p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }
};

// ---- Product Card HTML Generator ----
function createProductCard(product) {
  const currentPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const stars = generateStars(product.rating);
  const cart = CartStore.getAll();
  const wishlist = WishlistStore.getAll();
  const inCart = cart.some(i => i.id === product.id);
  const inWishlist = wishlist.some(i => i.id === product.id);

  return `
    <div class="product-card fade-in" data-product-id="${product.id}">
      <div class="product-card-image">
        <img 
          src="${product.images[0]}" 
          alt="${product.name}"
          loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=60'"
        >
        <div class="product-badges">
          ${product.newArrival ? '<span class="badge badge-new">New</span>' : ''}
          ${hasDiscount ? `<span class="badge badge-sale">-${discountPct}%</span>` : ''}
          ${product.featured && !product.newArrival ? '<span class="badge badge-hot">Hot</span>' : ''}
        </div>
        <div class="product-actions-overlay">
          <button class="product-action-btn ${inWishlist ? 'active' : ''}" 
            onclick="toggleWishlist('${product.id}')" 
            title="${inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}">
            <i class="fa${inWishlist ? 's' : 'r'} fa-heart"></i>
          </button>
          <button class="product-action-btn" 
            onclick="window.location.href='product-details.html?id=${product.id}'" 
            title="Quick view">
            <i class="far fa-eye"></i>
          </button>
        </div>
      </div>
      <div class="product-card-body">
        <div class="product-brand">${product.brand}</div>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-rating">
          <div class="stars">${stars}</div>
          <span class="rating-count">(${product.reviewCount})</span>
        </div>
        <div class="product-price">
          <span class="price-current">${formatPrice(currentPrice)}</span>
          ${hasDiscount ? `<span class="price-original">${formatPrice(product.price)}</span>` : ''}
          ${hasDiscount ? `<span class="price-discount">Save ${discountPct}%</span>` : ''}
        </div>
      </div>
      <div class="product-card-footer">
        <button class="btn-add-cart ${inCart ? 'in-cart' : ''}" 
          onclick="addToCart('${product.id}')"
          ${product.stock === 0 ? 'disabled' : ''}>
          <i class="fas fa-${product.stock === 0 ? 'times' : inCart ? 'check' : 'shopping-cart'}"></i>
          ${product.stock === 0 ? 'Out of Stock' : inCart ? 'In Cart' : 'Add to Cart'}
        </button>
        <a href="product-details.html?id=${product.id}" class="btn-view-details" title="View Details">
          <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  `;
}

// Generate star HTML
function generateStars(rating) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) html += '<i class="fas fa-star"></i>';
    else if (rating >= i - 0.5) html += '<i class="fas fa-star-half-alt"></i>';
    else html += '<i class="far fa-star"></i>';
  }
  return html;
}

// Render products into a container
function renderProducts(container, products) {
  if (!container) return;
  if (products.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1;">
        <div class="empty-icon"><i class="fas fa-bicycle"></i></div>
        <h3 class="empty-title">No Products Found</h3>
        <p class="empty-text">Try adjusting your filters or search terms.</p>
        <a href="shop.html" class="btn btn-primary">Browse All Bikes</a>
      </div>
    `;
    return;
  }
  container.innerHTML = products.map(p => createProductCard(p)).join('');
  initFadeInObserver();
}

// Init intersection observer for fade-in animations
function initFadeInObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// Init products store on load
ProductsStore.init();
