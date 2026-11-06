/* ============================================================
   VELOCITY CYCLES - Cloudinary Image Upload Integration
   
   SECURITY NOTE: This implementation uses an UNSIGNED upload preset
   which is suitable for demo/development only. In production:
   - Use a signed upload preset with server-side signature generation
   - Never expose your API Secret in frontend code
   - Implement server-side validation and rate limiting
   - See: https://cloudinary.com/documentation/upload_images
   ============================================================ */

// ---- Cloudinary Configuration ----
// Replace these placeholders with your actual Cloudinary credentials
const CLOUDINARY_CONFIG = {
  cloudName: 'djf0nppav',      // Replace with your cloud name
  uploadPreset: 'ECOMApp', // Replace with your unsigned upload preset
  folder: 'velocity-cycles/products',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFormats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
  transformation: {
    width: 1200,
    height: 900,
    crop: 'fill',
    quality: 'auto:good',
    fetch_format: 'auto'
  }
};

// ---- Cloudinary Upload Widget ----
const CloudinaryUploader = {
  widget: null,
  uploadedImages: [],
  onChangeCallback: null,

  // Initialize the upload widget
  init(containerId, onImageChange) {
    this.onChangeCallback = onImageChange;
    this.uploadedImages = [];

    // Check if Cloudinary script is loaded
    if (typeof cloudinary === 'undefined') {
      console.warn('Cloudinary widget not loaded. Using fallback file input.');
      this.initFallback(containerId);
      return;
    }

    this.widget = cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CONFIG.cloudName,
        uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
        folder: CLOUDINARY_CONFIG.folder,
        sources: ['local', 'url', 'camera'],
        multiple: true,
        maxFiles: 6,
        maxFileSize: CLOUDINARY_CONFIG.maxFileSize,
        clientAllowedFormats: CLOUDINARY_CONFIG.allowedFormats,
        showAdvancedOptions: false,
        cropping: false,
        theme: 'minimal',
        styles: {
          palette: {
            window: '#1a1a1a',
            windowBorder: '#333',
            tabIcon: '#39ff14',
            menuIcons: '#aaa',
            textDark: '#ffffff',
            textLight: '#ffffff',
            link: '#39ff14',
            action: '#39ff14',
            inactiveTabIcon: '#666',
            error: '#ff3b3b',
            inProgress: '#39ff14',
            complete: '#2cc110',
            sourceBg: '#111'
          },
          fonts: {
            default: null,
            "'Montserrat', sans-serif": {
              url: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@600&display=swap',
              active: true
            }
          }
        }
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          showAdminToast('Upload Error', 'Failed to upload image. Please try again.', 'error');
          return;
        }

        if (result && result.event === 'success') {
          const imageData = {
            publicId: result.info.public_id,
            secureUrl: result.info.secure_url,
            format: result.info.format,
            width: result.info.width,
            height: result.info.height,
            bytes: result.info.bytes
          };

          this.uploadedImages.push(imageData);
          this.renderPreview(containerId);

          if (this.onChangeCallback) {
            this.onChangeCallback(this.uploadedImages.map(img => img.secureUrl));
          }
        }
      }
    );

    // Add click handler for open widget button
    const openBtn = document.getElementById('open-cloudinary-widget');
    if (openBtn) {
      openBtn.addEventListener('click', () => this.widget.open());
    }
  },

  // Fallback: Standard file input with preview (when Cloudinary is not configured)
  initFallback(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const uploadArea = container.querySelector('.image-upload-area');
    if (uploadArea) {
      uploadArea.innerHTML = `
        <i class="fas fa-cloud-upload-alt image-upload-icon"></i>
        <p class="image-upload-text">Click to select images</p>
        <p class="image-upload-hint">JPG, PNG, WebP up to 5MB each</p>
        <input type="file" id="fallback-file-input" multiple accept="image/*" 
          style="position:absolute;inset:0;opacity:0;cursor:pointer;">
      `;

      const fileInput = document.getElementById('fallback-file-input');
      if (fileInput) {
        fileInput.addEventListener('change', (e) => {
          this.handleFallbackFiles(Array.from(e.target.files), containerId);
        });
      }

      // Drag and drop
      uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
      });

      uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
      });

      uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        this.handleFallbackFiles(files, containerId);
      });
    }
  },

  // Handle fallback file selection (creates local object URLs)
  handleFallbackFiles(files, containerId) {
    files.forEach(file => {
      if (file.size > CLOUDINARY_CONFIG.maxFileSize) {
        showAdminToast('File Too Large', `${file.name} exceeds 5MB limit.`, 'warning');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = {
          publicId: 'local-' + Date.now(),
          secureUrl: e.target.result, // Data URL (local preview only)
          format: file.type.split('/')[1],
          width: 0,
          height: 0,
          bytes: file.size,
          isLocal: true
        };

        this.uploadedImages.push(imageData);
        this.renderPreview(containerId);

        if (this.onChangeCallback) {
          this.onChangeCallback(this.uploadedImages.map(img => img.secureUrl));
        }
      };
      reader.readAsDataURL(file);
    });
  },

  // Render image previews
  renderPreview(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let previewGrid = container.querySelector('.image-previews');
    if (!previewGrid) {
      previewGrid = document.createElement('div');
      previewGrid.className = 'image-previews';
      container.appendChild(previewGrid);
    }

    previewGrid.innerHTML = this.uploadedImages.map((img, index) => `
      <div class="image-preview-item" data-index="${index}">
        <img src="${img.secureUrl}" alt="Product image ${index + 1}" loading="lazy">
        <button class="image-preview-remove" onclick="CloudinaryUploader.removeImage(${index}, '${containerId}')" type="button">
          <i class="fas fa-times"></i>
        </button>
        ${index === 0 ? '<span style="position:absolute;bottom:4px;left:4px;background:var(--admin-primary);color:var(--admin-black);font-size:9px;font-weight:700;padding:2px 6px;border-radius:3px;">Main</span>' : ''}
      </div>
    `).join('');
  },

  // Remove image from upload list
  removeImage(index, containerId) {
    this.uploadedImages.splice(index, 1);
    this.renderPreview(containerId);

    if (this.onChangeCallback) {
      this.onChangeCallback(this.uploadedImages.map(img => img.secureUrl));
    }
  },

  // Get current image URLs
  getUrls() {
    return this.uploadedImages.map(img => img.secureUrl);
  },

  // Load existing images (for edit product page)
  loadExisting(urls, containerId) {
    this.uploadedImages = urls.map((url, i) => ({
      publicId: 'existing-' + i,
      secureUrl: url,
      format: 'jpg',
      width: 0,
      height: 0,
      bytes: 0
    }));
    this.renderPreview(containerId);
  },

  // Reset
  reset(containerId) {
    this.uploadedImages = [];
    const container = document.getElementById(containerId);
    if (container) {
      const previewGrid = container.querySelector('.image-previews');
      if (previewGrid) previewGrid.innerHTML = '';
    }
  }
};

// ---- Admin Toast Notification ----
function showAdminToast(title, message, type = 'success') {
  const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-times-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle'
  };

  let container = document.querySelector('.admin-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'admin-toast-container';
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
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
