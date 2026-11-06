/* ============================================================
   VELOCITY CYCLES - Admin Dashboard JavaScript
   ============================================================ */

// ---- Currency helper for admin (mirrors frontend) ----
const ADMIN_CURRENCY = { symbol: 'Rs.', rate: 278 };
function fmtPKR(usd) {
  const pkr = Math.round(usd * ADMIN_CURRENCY.rate);
  return ADMIN_CURRENCY.symbol + ' ' + pkr.toLocaleString('en-PK');
}
  const sidebar = document.querySelector('.admin-sidebar');
  const toggleBtn = document.querySelector('.sidebar-toggle');
  const mobileToggle = document.querySelector('.mobile-sidebar-toggle');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar?.classList.toggle('mobile-open');
      } else {
        sidebar?.classList.toggle('collapsed');
        localStorage.setItem('vc_sidebar_collapsed', sidebar?.classList.contains('collapsed'));
      }
    });
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      sidebar?.classList.toggle('mobile-open');
    });
  }

  // Restore sidebar state
  const isCollapsed = localStorage.getItem('vc_sidebar_collapsed') === 'true';
  if (isCollapsed && window.innerWidth > 768) {
    sidebar?.classList.add('collapsed');
  }

  // Mark active nav item
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-nav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href && href.includes(currentPage)) {
      item.classList.add('active');
    }
  });

  // Close mobile sidebar when clicking outside
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && sidebar?.classList.contains('mobile-open')) {
      if (!sidebar.contains(e.target) && !mobileToggle?.contains(e.target) && !toggleBtn?.contains(e.target)) {
        sidebar.classList.remove('mobile-open');
      }
    }
  });
}

// ---- Admin Stats Charts (using Canvas) ----
function drawSalesChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const orders = OrdersStore.getAll();

  // Generate monthly data for last 6 months
  const months = [];
  const salesData = [];
  const ordersData = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    months.push(date.toLocaleString('default', { month: 'short' }));

    const monthOrders = orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate.getMonth() === date.getMonth() &&
             orderDate.getFullYear() === date.getFullYear() &&
             o.status !== 'cancelled';
    });

    salesData.push(monthOrders.reduce((sum, o) => sum + o.total, 0));
    ordersData.push(monthOrders.length);
  }

  const width = canvas.width = canvas.parentElement.offsetWidth;
  const height = canvas.height = 280;

  const padding = { top: 20, right: 20, bottom: 50, left: 70 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  ctx.clearRect(0, 0, width, height);

  const maxSale = Math.max(...salesData, 1000);
  const xStep = chartWidth / (months.length - 1);

  // Draw grid lines
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartHeight / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();

    // Y-axis labels
    const value = Math.round(maxSale - (maxSale / 4) * i);
    ctx.fillStyle = '#9ca3af';
    ctx.font = '11px Open Sans';
    ctx.textAlign = 'right';
    ctx.fillText('$' + value.toLocaleString(), padding.left - 8, y + 4);
  }

  // Draw gradient area
  const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
  gradient.addColorStop(0, 'rgba(57,255,20,0.3)');
  gradient.addColorStop(1, 'rgba(57,255,20,0.02)');

  ctx.beginPath();
  salesData.forEach((val, i) => {
    const x = padding.left + i * xStep;
    const y = padding.top + chartHeight - (val / maxSale) * chartHeight;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  // Close the path for fill
  const lastX = padding.left + (salesData.length - 1) * xStep;
  ctx.lineTo(lastX, padding.top + chartHeight);
  ctx.lineTo(padding.left, padding.top + chartHeight);
  ctx.closePath();
  ctx.fillStyle = gradient;
  ctx.fill();

  // Draw the line
  ctx.beginPath();
  ctx.strokeStyle = '#39ff14';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  salesData.forEach((val, i) => {
    const x = padding.left + i * xStep;
    const y = padding.top + chartHeight - (val / maxSale) * chartHeight;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Draw data points + x-labels
  salesData.forEach((val, i) => {
    const x = padding.left + i * xStep;
    const y = padding.top + chartHeight - (val / maxSale) * chartHeight;

    // Dot
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#39ff14';
    ctx.fill();
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 2;
    ctx.stroke();

    // X-axis label
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px Open Sans';
    ctx.textAlign = 'center';
    ctx.fillText(months[i], x, height - padding.bottom + 20);
  });
}

// ---- Admin Products Table ----
function renderAdminProductsTable(products = null) {
  const tbody = document.getElementById('products-tbody');
  if (!tbody) return;

  const allProducts = products || ProductsStore.getAll();

  if (allProducts.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center;padding:40px;color:var(--admin-light-gray)">
          <i class="fas fa-box-open" style="font-size:32px;margin-bottom:12px;display:block"></i>
          No products found
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = allProducts.map(p => {
    const price = p.discountPrice || p.price;
    const stockClass = p.stock > 10 ? 'high' : p.stock > 3 ? 'medium' : 'low';
    const stockPercent = Math.min((p.stock / 50) * 100, 100);

    return `
      <tr>
        <td>
          <div class="product-cell">
            <img src="${p.images[0]}" alt="${p.name}" class="product-thumb"
              onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&q=60'">
            <div>
              <div class="product-name">${p.name}</div>
              <div class="product-sku">ID: ${p.id}</div>
            </div>
          </div>
        </td>
        <td>${p.brand}</td>
        <td style="text-transform:capitalize">${p.category}</td>
        <td>
          <div style="font-weight:700">$${price.toLocaleString()}</div>
          ${p.discountPrice ? `<div style="font-size:11px;color:var(--admin-light-gray);text-decoration:line-through">$${p.price.toLocaleString()}</div>` : ''}
        </td>
        <td>
          <div class="stock-indicator">
            <div class="stock-bar">
              <div class="stock-fill ${stockClass}" style="width:${stockPercent}%"></div>
            </div>
            <span class="stock-count ${p.stock <= 3 ? 'text-red' : ''}">${p.stock}</span>
          </div>
        </td>
        <td>
          <span class="status-badge ${p.stock > 0 ? 'status-active' : 'status-cancelled'}">
            ${p.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </td>
        <td style="color:var(--admin-warning)">
          <i class="fas fa-star" style="font-size:12px"></i> ${p.rating}
        </td>
        <td>
          <div style="display:flex;gap:6px;align-items:center">
            <a href="edit-product.html?id=${p.id}" class="admin-btn admin-btn-outline admin-btn-sm admin-btn-icon" title="Edit">
              <i class="fas fa-edit"></i>
            </a>
            <button class="admin-btn admin-btn-danger admin-btn-sm admin-btn-icon" 
              onclick="confirmDeleteProduct('${p.id}', '${p.name.replace(/'/g, "\\'")}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// Confirm product deletion
function confirmDeleteProduct(productId, productName) {
  if (confirm(`Delete "${productName}"?\n\nThis action cannot be undone.`)) {
    ProductsStore.delete(productId);
    renderAdminProductsTable();
    showAdminToast('Product Deleted', `"${productName}" has been removed.`, 'success');
  }
}

// ---- Admin Orders Table ----
function renderAdminOrdersTable(orders = null) {
  const tbody = document.getElementById('orders-tbody');
  if (!tbody) return;

  const allOrders = orders || OrdersStore.getAll();

  if (allOrders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:40px;color:var(--admin-light-gray)">No orders found</td></tr>`;
    return;
  }

  tbody.innerHTML = allOrders.map(o => {
    const date = new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `
      <tr>
        <td><strong style="font-family:'Montserrat',sans-serif">${o.id}</strong></td>
        <td>
          <div style="font-weight:600">${o.customerName}</div>
          <div style="font-size:12px;color:var(--admin-light-gray)">${o.customerEmail}</div>
        </td>
        <td>${date}</td>
        <td>${o.items.length} item${o.items.length !== 1 ? 's' : ''}</td>
        <td style="font-weight:700">$${o.total.toFixed(2)}</td>
        <td>
          <span class="status-badge status-${o.status}">${capitalize(o.status)}</span>
        </td>
        <td>
          <div style="display:flex;gap:6px">
            <button class="admin-btn admin-btn-outline admin-btn-sm admin-btn-icon" 
              onclick="viewOrderDetails('${o.id}')" title="View">
              <i class="fas fa-eye"></i>
            </button>
            <select class="admin-filter-select" style="padding:5px 8px;font-size:12px"
              onchange="updateOrderStatus('${o.id}', this.value)" title="Update Status">
              ${['pending','confirmed','processing','shipped','delivered','cancelled'].map(s =>
                `<option value="${s}" ${s === o.status ? 'selected' : ''}>${capitalize(s)}</option>`
              ).join('')}
            </select>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function updateOrderStatus(orderId, newStatus) {
  const updated = OrdersStore.updateStatus(orderId, newStatus);
  if (updated) {
    showAdminToast('Status Updated', `Order ${orderId} is now ${newStatus}.`, 'success');
    renderAdminOrdersTable();
  }
}

function viewOrderDetails(orderId) {
  const order = OrdersStore.getById(orderId);
  if (!order) return;

  const modal = document.getElementById('order-detail-modal');
  const content = document.getElementById('order-detail-content');
  if (!modal || !content) return;

  const date = new Date(order.createdAt).toLocaleString();
  content.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px">
      <div>
        <div style="font-size:11px;color:var(--admin-light-gray);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Order ID</div>
        <div style="font-weight:700;font-family:'Montserrat',sans-serif">${order.id}</div>
      </div>
      <div>
        <div style="font-size:11px;color:var(--admin-light-gray);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Date</div>
        <div>${date}</div>
      </div>
      <div>
        <div style="font-size:11px;color:var(--admin-light-gray);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Customer</div>
        <div style="font-weight:600">${order.customerName}</div>
        <div style="font-size:12px;color:var(--admin-light-gray)">${order.customerEmail}</div>
      </div>
      <div>
        <div style="font-size:11px;color:var(--admin-light-gray);text-transform:uppercase;letter-spacing:1px;margin-bottom:4px">Status</div>
        <span class="status-badge status-${order.status}">${capitalize(order.status)}</span>
      </div>
    </div>
    <div style="margin-bottom:20px">
      <div style="font-size:11px;color:var(--admin-light-gray);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Shipping Address</div>
      <div style="font-size:14px">${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}</div>
    </div>
    <div style="margin-bottom:20px">
      <div style="font-size:11px;color:var(--admin-light-gray);text-transform:uppercase;letter-spacing:1px;margin-bottom:12px">Order Items</div>
      ${order.items.map(item => `
        <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--admin-border)">
          <img src="${item.image}" alt="${item.name}" style="width:48px;height:36px;object-fit:cover;border-radius:6px;background:var(--admin-bg)">
          <div style="flex:1">
            <div style="font-weight:600;font-size:13px">${item.name}</div>
            <div style="font-size:12px;color:var(--admin-light-gray)">Qty: ${item.quantity}</div>
          </div>
          <div style="font-weight:700">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
      `).join('')}
    </div>
    <div style="background:var(--admin-bg);border-radius:8px;padding:16px">
      <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:14px">
        <span>Subtotal</span><span>$${order.subtotal.toFixed(2)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:14px">
        <span>Shipping</span><span>${order.shipping === 0 ? 'FREE' : '$'+order.shipping.toFixed(2)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:14px">
        <span>Tax</span><span>$${order.tax.toFixed(2)}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding-top:10px;border-top:2px solid var(--admin-border);font-weight:800;font-size:16px;font-family:'Montserrat',sans-serif">
        <span>Total</span><span>$${order.total.toFixed(2)}</span>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

// ---- Customers Table ----
function renderCustomersTable() {
  const tbody = document.getElementById('customers-tbody');
  if (!tbody) return;

  const customers = AuthStore.getCustomers();
  const orders = OrdersStore.getAll();

  if (customers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--admin-light-gray)">No customers registered yet</td></tr>`;
    return;
  }

  tbody.innerHTML = customers.map(c => {
    const customerOrders = orders.filter(o => o.customerEmail === c.email);
    const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0);
    const date = new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:36px;height:36px;background:rgba(57,255,20,0.15);border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;color:#2cc110;font-size:14px">
              ${c.firstName[0]}${c.lastName[0]}
            </div>
            <div>
              <div style="font-weight:600">${c.firstName} ${c.lastName}</div>
              <div style="font-size:12px;color:var(--admin-light-gray)">${c.id}</div>
            </div>
          </div>
        </td>
        <td>${c.email}</td>
        <td>${c.phone || '—'}</td>
        <td>${customerOrders.length}</td>
        <td style="font-weight:700">$${totalSpent.toFixed(2)}</td>
        <td>${date}</td>
      </tr>
    `;
  }).join('');
}

// ---- Product Form Handler ----
function handleAddProduct(e) {
  e.preventDefault();

  const getData = (id) => document.getElementById(id)?.value?.trim() || '';

  const name = getData('product-name');
  const brand = getData('product-brand');
  const category = getData('product-category');
  const price = parseFloat(getData('product-price'));
  const discountPrice = parseFloat(getData('product-discount-price')) || null;
  const stock = parseInt(getData('product-stock')) || 0;
  const description = getData('product-description');
  const weight = getData('product-weight');
  const featured = document.getElementById('product-featured')?.checked || false;
  const newArrival = document.getElementById('product-new-arrival')?.checked || true;

  // Validation
  if (!name || !brand || !category || !price) {
    showAdminToast('Validation Error', 'Please fill in all required fields.', 'error');
    return;
  }

  // Get images from Cloudinary uploader
  const images = CloudinaryUploader.getUrls();
  if (images.length === 0) {
    // Use a default placeholder
    images.push('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80');
  }

  // Get sizes and colors from tags
  const sizes = Array.from(document.querySelectorAll('#sizes-container .tag-chip'))
    .map(el => el.dataset.value || el.textContent.replace('×', '').trim());

  const colors = Array.from(document.querySelectorAll('#colors-container .admin-color-chip'))
    .map(el => el.dataset.color);

  const newProduct = ProductsStore.add({
    name, brand, category, price,
    discountPrice: discountPrice && discountPrice < price ? discountPrice : null,
    stock, description, weight: weight || null,
    images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'],
    sizes: sizes.length > 0 ? sizes : ['S', 'M', 'L'],
    colors: colors.length > 0 ? colors : ['#1a1a1a'],
    featured, newArrival,
    rating: 0, reviewCount: 0,
    specs: {}
  });

  showAdminToast('Product Added!', `"${newProduct.name}" has been added successfully.`, 'success');
  setTimeout(() => { window.location.href = 'products.html'; }, 1200);
}

// ---- Category Management ----
function renderCategoriesTable() {
  const tbody = document.getElementById('categories-tbody');
  if (!tbody) return;

  const products = ProductsStore.getAll();
  const categories = [
    { id: 'mountain', name: 'Mountain Bikes', icon: 'fa-mountain', color: '#2d6a4f' },
    { id: 'road', name: 'Road Bikes', icon: 'fa-road', color: '#0077b6' },
    { id: 'electric', name: 'Electric Bikes', icon: 'fa-bolt', color: '#39ff14' },
    { id: 'kids', name: 'Kids Bikes', icon: 'fa-child', color: '#f9c74f' }
  ];

  tbody.innerHTML = categories.map(cat => {
    const count = products.filter(p => p.category === cat.id).length;
    return `
      <tr>
        <td>
          <div style="display:flex;align-items:center;gap:10px">
            <div style="width:36px;height:36px;background:${cat.color}20;border-radius:8px;display:flex;align-items:center;justify-content:center;color:${cat.color}">
              <i class="fas ${cat.icon}"></i>
            </div>
            ${cat.name}
          </div>
        </td>
        <td style="font-family:'Montserrat',sans-serif;font-weight:700">${cat.id}</td>
        <td><span class="status-badge status-active">${count} Products</span></td>
        <td><span class="status-badge status-active">Active</span></td>
      </tr>
    `;
  }).join('');
}

// ---- Dashboard Stats ----
function renderDashboardStats() {
  const products = ProductsStore.getAll();
  const orders = OrdersStore.getAll();
  const customers = AuthStore.getCustomers();
  const stats = OrdersStore.getStats();

  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  setEl('stat-revenue', fmtPKR(stats.totalRevenue));
  setEl('stat-orders', stats.total);
  setEl('stat-products', products.length);
  setEl('stat-customers', customers.length);
  setEl('stat-pending', stats.pending);
}

// ---- Low Stock Products ----
function renderLowStockWidget() {
  const container = document.getElementById('low-stock-list');
  if (!container) return;

  const lowStock = ProductsStore.getAll()
    .filter(p => p.stock <= 5)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 6);

  if (lowStock.length === 0) {
    container.innerHTML = `<p style="color:var(--admin-light-gray);font-size:13px;text-align:center;padding:20px">All products are well-stocked.</p>`;
    return;
  }

  container.innerHTML = lowStock.map(p => {
    const stockClass = p.stock <= 2 ? 'low' : 'medium';
    const stockPercent = (p.stock / 10) * 100;

    return `
      <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--admin-border)">
        <img src="${p.images[0]}" alt="${p.name}" style="width:40px;height:30px;object-fit:cover;border-radius:6px;background:var(--admin-bg)"
          onerror="this.src='https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&q=60'">
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.name}</div>
          <div class="stock-indicator">
            <div class="stock-bar">
              <div class="stock-fill ${stockClass}" style="width:${stockPercent}%"></div>
            </div>
            <span class="stock-count" style="color:${p.stock <= 2 ? 'var(--admin-danger)' : 'var(--admin-warning)'}">${p.stock}</span>
          </div>
        </div>
        <a href="edit-product.html?id=${p.id}" class="admin-btn admin-btn-outline admin-btn-sm" style="font-size:11px">Restock</a>
      </div>
    `;
  }).join('');
}

// ---- Utility ----
function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

// ---- Tags/Sizes Input ----
function initTagsInput(inputId, containerId) {
  const input = document.getElementById(inputId);
  const container = document.getElementById(containerId);
  if (!input || !container) return;

  input.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ',') && input.value.trim()) {
      e.preventDefault();
      addTag(input.value.trim(), container);
      input.value = '';
    }
  });
}

function addTag(value, container) {
  const existing = Array.from(container.querySelectorAll('.tag-chip'))
    .map(el => el.dataset.value || el.textContent.replace('×', '').trim());

  if (existing.includes(value)) return;

  const chip = document.createElement('div');
  chip.className = 'tag-chip';
  chip.dataset.value = value;
  chip.innerHTML = `${value} <button type="button" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>`;
  container.insertBefore(chip, container.querySelector('input'));
}

// ---- Colors Input ----
function initColorInput(inputId, containerId) {
  const input = document.getElementById(inputId);
  const container = document.getElementById(containerId);
  if (!input || !container) return;

  input.addEventListener('input', () => {
    // debounce - update color preview
  });

  document.getElementById('add-color-btn')?.addEventListener('click', () => {
    const colorValue = input.value;
    const colorName = document.getElementById('color-name-input')?.value || colorValue;
    addColorChip(colorValue, colorName, container);
  });
}

function addColorChip(colorValue, colorName, container) {
  const chip = document.createElement('div');
  chip.className = 'admin-color-chip';
  chip.dataset.color = colorValue;
  chip.innerHTML = `
    <div class="admin-color-dot" style="background:${colorValue}"></div>
    <span>${colorName}</span>
    <i class="admin-color-remove fas fa-times" onclick="this.parentElement.remove()"></i>
  `;
  container.appendChild(chip);
}

// Init admin on page load
document.addEventListener('DOMContentLoaded', () => {
  initAdminSidebar();

  // Set admin user name in header/sidebar
  const adminUser = AuthStore.getAdminUser();
  document.querySelectorAll('.admin-user-name-display').forEach(el => {
    el.textContent = adminUser.name;
  });
});
