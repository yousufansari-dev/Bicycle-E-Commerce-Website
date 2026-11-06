/* ============================================================
   VELOCITY CYCLES - Authentication (Demo / LocalStorage)
   ============================================================ */

const AuthStore = {
  // Get all customers
  getCustomers() {
    const stored = localStorage.getItem('vc_customers');
    return stored ? JSON.parse(stored) : [];
  },

  // Save customers
  saveCustomers(customers) {
    localStorage.setItem('vc_customers', JSON.stringify(customers));
  },

  // Get current user
  getCurrentUser() {
    const stored = localStorage.getItem('vc_current_user');
    return stored ? JSON.parse(stored) : null;
  },

  // Check if admin is logged in
  isAdminLoggedIn() {
    const admin = localStorage.getItem('vc_admin_logged_in');
    return admin === 'true';
  },

  // Customer Registration
  register(data) {
    const customers = this.getCustomers();
    const exists = customers.some(c => c.email === data.email.toLowerCase());

    if (exists) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newCustomer = {
      id: 'cust-' + Date.now(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email.toLowerCase(),
      phone: data.phone || '',
      password: btoa(data.password), // Base64 encode (demo only - NOT secure for production)
      avatar: null,
      createdAt: new Date().toISOString(),
      orders: [],
      addresses: []
    };

    customers.push(newCustomer);
    this.saveCustomers(customers);

    // Auto-login
    const { password, ...userWithoutPassword } = newCustomer;
    localStorage.setItem('vc_current_user', JSON.stringify(userWithoutPassword));

    return { success: true, user: userWithoutPassword };
  },

  // Customer Login
  login(email, password) {
    const customers = this.getCustomers();
    const customer = customers.find(c => c.email === email.toLowerCase());

    if (!customer) {
      return { success: false, message: 'No account found with this email.' };
    }

    if (atob(customer.password) !== password) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    const { password: pwd, ...userWithoutPassword } = customer;
    localStorage.setItem('vc_current_user', JSON.stringify(userWithoutPassword));

    return { success: true, user: userWithoutPassword };
  },

  // Admin Login (demo credentials)
  adminLogin(email, password) {
    // Demo admin credentials
    if (email === 'admin@velocitycycles.com' && password === 'admin123') {
      localStorage.setItem('vc_admin_logged_in', 'true');
      localStorage.setItem('vc_admin_user', JSON.stringify({
        name: 'Admin User',
        email: 'admin@velocitycycles.com',
        role: 'Super Admin'
      }));
      return { success: true };
    }
    return { success: false, message: 'Invalid admin credentials.' };
  },

  // Logout
  logout() {
    localStorage.removeItem('vc_current_user');
    window.location.href = 'login.html';
  },

  // Admin Logout
  adminLogout() {
    localStorage.removeItem('vc_admin_logged_in');
    localStorage.removeItem('vc_admin_user');
    window.location.href = 'login.html';
  },

  // Update user profile
  updateProfile(updates) {
    const user = this.getCurrentUser();
    if (!user) return false;

    const customers = this.getCustomers();
    const index = customers.findIndex(c => c.id === user.id);
    if (index !== -1) {
      customers[index] = { ...customers[index], ...updates };
      this.saveCustomers(customers);
      const { password, ...userWithoutPassword } = customers[index];
      localStorage.setItem('vc_current_user', JSON.stringify(userWithoutPassword));
    }
    return true;
  },

  // Get admin user info
  getAdminUser() {
    const stored = localStorage.getItem('vc_admin_user');
    return stored ? JSON.parse(stored) : { name: 'Admin', email: 'admin@velocitycycles.com', role: 'Super Admin' };
  }
};

// ---- Form Validation Helpers ----
const Validator = {
  required(value) {
    return value && value.toString().trim().length > 0;
  },
  email(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  },
  minLength(value, min) {
    return value && value.length >= min;
  },
  phone(value) {
    return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(value);
  },
  passwordMatch(p1, p2) {
    return p1 === p2;
  }
};

// ---- Handle Login Form ----
function handleCustomerLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email')?.value;
  const password = document.getElementById('login-password')?.value;
  let valid = true;

  clearErrors();

  if (!Validator.email(email)) {
    showFieldError('login-email', 'Please enter a valid email address.');
    valid = false;
  }
  if (!Validator.minLength(password, 6)) {
    showFieldError('login-password', 'Password must be at least 6 characters.');
    valid = false;
  }
  if (!valid) return;

  const result = AuthStore.login(email, password);
  if (result.success) {
    showToast('Welcome Back!', `Hello ${result.user.firstName}!`, 'success');
    setTimeout(() => {
      const redirect = new URLSearchParams(window.location.search).get('redirect') || 'index.html';
      window.location.href = redirect;
    }, 1000);
  } else {
    showToast('Login Failed', result.message, 'error');
  }
}

// ---- Handle Register Form ----
function handleCustomerRegister(e) {
  e.preventDefault();
  const firstName = document.getElementById('reg-firstname')?.value;
  const lastName = document.getElementById('reg-lastname')?.value;
  const email = document.getElementById('reg-email')?.value;
  const phone = document.getElementById('reg-phone')?.value;
  const password = document.getElementById('reg-password')?.value;
  const confirmPassword = document.getElementById('reg-confirm-password')?.value;
  let valid = true;

  clearErrors();

  if (!Validator.required(firstName)) { showFieldError('reg-firstname', 'First name is required.'); valid = false; }
  if (!Validator.required(lastName)) { showFieldError('reg-lastname', 'Last name is required.'); valid = false; }
  if (!Validator.email(email)) { showFieldError('reg-email', 'Please enter a valid email.'); valid = false; }
  if (!Validator.minLength(password, 8)) { showFieldError('reg-password', 'Password must be at least 8 characters.'); valid = false; }
  if (!Validator.passwordMatch(password, confirmPassword)) { showFieldError('reg-confirm-password', 'Passwords do not match.'); valid = false; }
  if (!valid) return;

  const result = AuthStore.register({ firstName, lastName, email, phone, password });
  if (result.success) {
    showToast('Account Created!', `Welcome to Velocity Cycles, ${result.user.firstName}!`, 'success');
    setTimeout(() => { window.location.href = 'index.html'; }, 1200);
  } else {
    showToast('Registration Failed', result.message, 'error');
  }
}

// ---- Admin Login Handler ----
function handleAdminLogin(e) {
  e.preventDefault();
  const email = document.getElementById('admin-email')?.value;
  const password = document.getElementById('admin-password')?.value;

  const result = AuthStore.adminLogin(email, password);
  if (result.success) {
    showToast('Welcome!', 'Logging into admin panel...', 'success');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 800);
  } else {
    showToast('Access Denied', result.message || 'Invalid credentials.', 'error');
  }
}

// ---- Field error helpers ----
function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.classList.add('error');
  const errorEl = field.parentElement.querySelector('.form-error');
  if (errorEl) errorEl.textContent = message;
  else {
    const err = document.createElement('div');
    err.className = 'form-error';
    err.textContent = message;
    field.parentElement.appendChild(err);
  }
}

function clearErrors() {
  document.querySelectorAll('.form-control.error, .admin-input.error').forEach(el => el.classList.remove('error'));
  document.querySelectorAll('.form-error').forEach(el => el.remove());
}

// ---- Update nav for logged-in user ----
function updateNavAuth() {
  const user = AuthStore.getCurrentUser();
  const authNavEl = document.getElementById('nav-auth-btn');
  if (!authNavEl) return;

  if (user) {
    authNavEl.innerHTML = `
      <a href="#" class="nav-action-btn" title="${user.firstName}" onclick="AuthStore.logout()">
        <i class="fas fa-user-check"></i>
      </a>
    `;
  }
}

// Protect admin pages
function requireAdminAuth() {
  if (!AuthStore.isAdminLoggedIn()) {
    window.location.href = 'login.html';
  }
}
