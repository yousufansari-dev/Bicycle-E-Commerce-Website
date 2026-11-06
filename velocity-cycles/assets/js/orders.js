/* ============================================================
   VELOCITY CYCLES - Order Management
   ============================================================ */

const OrdersStore = {
  // Get all orders
  getAll() {
    const stored = localStorage.getItem('vc_orders');
    return stored ? JSON.parse(stored) : [];
  },

  // Save orders
  save(orders) {
    localStorage.setItem('vc_orders', JSON.stringify(orders));
  },

  // Get order by ID
  getById(orderId) {
    return this.getAll().find(o => o.id === orderId) || null;
  },

  // Get orders by customer email
  getByCustomer(email) {
    return this.getAll().filter(o => o.customerEmail === email.toLowerCase());
  },

  // Create new order
  create(orderData) {
    const orders = this.getAll();
    const orderId = 'VC-' + Date.now().toString().slice(-8).toUpperCase();

    const newOrder = {
      id: orderId,
      customerName: orderData.customerName,
      customerEmail: orderData.customerEmail,
      customerPhone: orderData.customerPhone,
      shippingAddress: orderData.shippingAddress,
      items: orderData.items,
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      tax: orderData.tax,
      discount: orderData.discount || 0,
      total: orderData.total,
      paymentMethod: orderData.paymentMethod,
      status: 'pending',
      notes: orderData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        { status: 'pending', timestamp: new Date().toISOString(), note: 'Order placed' }
      ]
    };

    orders.unshift(newOrder); // Add to beginning
    this.save(orders);

    // Update customer order history
    const customers = JSON.parse(localStorage.getItem('vc_customers') || '[]');
    const custIndex = customers.findIndex(c => c.email === orderData.customerEmail?.toLowerCase());
    if (custIndex !== -1) {
      customers[custIndex].orders = customers[custIndex].orders || [];
      customers[custIndex].orders.push(orderId);
      localStorage.setItem('vc_customers', JSON.stringify(customers));
    }

    return newOrder;
  },

  // Update order status (admin)
  updateStatus(orderId, newStatus, note = '') {
    const orders = this.getAll();
    const index = orders.findIndex(o => o.id === orderId);
    if (index !== -1) {
      orders[index].status = newStatus;
      orders[index].updatedAt = new Date().toISOString();
      orders[index].statusHistory.push({
        status: newStatus,
        timestamp: new Date().toISOString(),
        note: note || `Status updated to ${newStatus}`
      });
      this.save(orders);
      return orders[index];
    }
    return null;
  },

  // Get orders summary stats
  getStats() {
    const orders = this.getAll();
    const totalRevenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue
    };
  },

  // Seed demo orders for admin dashboard
  seedDemoOrders() {
    if (this.getAll().length > 0) return;

    const demoOrders = [
      {
        id: 'VC-10000001',
        customerName: 'James Wilson',
        customerEmail: 'james@example.com',
        customerPhone: '+1 555-0101',
        shippingAddress: { street: '123 Oak Street', city: 'Denver', state: 'CO', zip: '80201', country: 'USA' },
        items: [{ id: 'vc-001', name: 'Apex Pro Carbon MTB', price: 2799, quantity: 1, image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94946?w=200&q=60' }],
        subtotal: 2799, shipping: 0, tax: 223.92, discount: 0, total: 3022.92,
        paymentMethod: 'Credit Card',
        status: 'delivered',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        statusHistory: [{ status: 'pending', timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), note: 'Order placed' }]
      },
      {
        id: 'VC-10000002',
        customerName: 'Sarah Chen',
        customerEmail: 'sarah@example.com',
        customerPhone: '+1 555-0102',
        shippingAddress: { street: '456 Pine Ave', city: 'Boulder', state: 'CO', zip: '80302', country: 'USA' },
        items: [{ id: 'vc-002', name: 'Velocity R9 Road Racer', price: 3599, quantity: 1, image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=200&q=60' }],
        subtotal: 3599, shipping: 0, tax: 287.92, discount: 0, total: 3886.92,
        paymentMethod: 'PayPal',
        status: 'shipped',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        statusHistory: [{ status: 'pending', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), note: 'Order placed' }]
      },
      {
        id: 'VC-10000003',
        customerName: 'Mike Thompson',
        customerEmail: 'mike@example.com',
        customerPhone: '+1 555-0103',
        shippingAddress: { street: '789 Elm Road', city: 'Aspen', state: 'CO', zip: '81611', country: 'USA' },
        items: [{ id: 'vc-003', name: 'Bolt Electric Commuter', price: 2499, quantity: 1, image: 'https://images.unsplash.com/photo-1558979158-65a1eaa08691?w=200&q=60' }],
        subtotal: 2499, shipping: 0, tax: 199.92, discount: 0, total: 2698.92,
        paymentMethod: 'Credit Card',
        status: 'processing',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        statusHistory: [{ status: 'pending', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), note: 'Order placed' }]
      },
      {
        id: 'VC-10000004',
        customerName: 'Emma Rodriguez',
        customerEmail: 'emma@example.com',
        customerPhone: '+1 555-0104',
        shippingAddress: { street: '321 Maple Blvd', city: 'Colorado Springs', state: 'CO', zip: '80901', country: 'USA' },
        items: [{ id: 'vc-004', name: 'Blazer Kids 24"', price: 399, quantity: 2, image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=200&q=60' }],
        subtotal: 798, shipping: 29.99, tax: 63.84, discount: 0, total: 891.83,
        paymentMethod: 'Debit Card',
        status: 'confirmed',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        statusHistory: [{ status: 'pending', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), note: 'Order placed' }]
      },
      {
        id: 'VC-10000005',
        customerName: 'Alex Park',
        customerEmail: 'alex@example.com',
        customerPhone: '+1 555-0105',
        shippingAddress: { street: '654 Birch Lane', city: 'Fort Collins', state: 'CO', zip: '80521', country: 'USA' },
        items: [{ id: 'vc-007', name: 'Spark E-MTB Pro', price: 4999, quantity: 1, image: 'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=200&q=60' }],
        subtotal: 4999, shipping: 0, tax: 399.92, discount: 0, total: 5398.92,
        paymentMethod: 'Credit Card',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statusHistory: [{ status: 'pending', timestamp: new Date().toISOString(), note: 'Order placed' }]
      }
    ];

    this.save(demoOrders);
  }
};

// ---- Checkout Form Handler ----
function handleCheckout(e) {
  e.preventDefault();
  const cart = CartStore.getAll();

  if (cart.length === 0) {
    showToast('Cart Empty', 'Add items to your cart before checking out.', 'warning');
    return;
  }

  // Gather form data
  const getData = id => document.getElementById(id)?.value?.trim() || '';
  const firstName = getData('checkout-firstname');
  const lastName = getData('checkout-lastname');
  const email = getData('checkout-email');
  const phone = getData('checkout-phone');
  const address = getData('checkout-address');
  const city = getData('checkout-city');
  const state = getData('checkout-state');
  const zip = getData('checkout-zip');
  const country = getData('checkout-country') || 'USA';
  const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'Credit Card';
  const notes = getData('checkout-notes');

  // Basic validation
  if (!firstName || !lastName || !email || !address || !city || !zip) {
    showToast('Missing Information', 'Please fill in all required fields.', 'error');
    return;
  }

  if (!Validator.email(email)) {
    showToast('Invalid Email', 'Please enter a valid email address.', 'error');
    return;
  }

  const couponData = JSON.parse(localStorage.getItem('vc_coupon') || 'null');
  const subtotal = CartStore.getSubtotal();
  const shipping = CartStore.getShipping();
  const tax = CartStore.getTax();
  const discount = couponData ? subtotal * couponData.discount : 0;
  const total = subtotal + shipping + tax - discount;

  const order = OrdersStore.create({
    customerName: `${firstName} ${lastName}`,
    customerEmail: email,
    customerPhone: phone,
    shippingAddress: { street: address, city, state, zip, country },
    items: cart.map(i => ({
      id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      selectedSize: i.selectedSize,
      image: i.image
    })),
    subtotal,
    shipping,
    tax,
    discount,
    total,
    paymentMethod,
    notes
  });

  // Clear cart and coupon
  CartStore.clear();
  localStorage.removeItem('vc_coupon');

  // Redirect to order success
  localStorage.setItem('vc_last_order_id', order.id);
  window.location.href = 'order-success.html';
}

// Seed demo orders
OrdersStore.seedDemoOrders();
