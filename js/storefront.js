/**
 * AMOR & CACAO — HAUTE CHOCOLATERIE STOREFRONT JAVASCRIPT
 * Dirección de Arte: Dark Luxury & Atelier Sensorial (Anti-AI Slop)
 * Cero Emojis: Iconografía SVG vectorial, físicas a 60 FPS, selectores interactivos de variedad
 * Sincronización en tiempo real con el panel administrativo POS
 */

(function () {
  'use strict';

  // --- 1. DICCIONARIO SENSORIAL & NOTAS DE CATA DE AUTOR ---
  const SENSORY_PROFILES = {
    'prod-1': {
      tags: ['Maracuyá', 'Praliné de Avellana', 'Frambuesa Silvestre', 'Hoja de Oro'],
      origin: 'Cacao Chuncho 70% & Piura Blanco',
      altitude: 'Cusco / Piura · 1,200 m.s.n.m.',
      percentage: '70% Cacao Nativo de Origen',
      aromas: 'Jazmín botánico, frutas cítricas brillantes y final untuoso de avellanas tostadas.',
      pairing: 'Café Geisha filtrado, Oporto Tawny o Champagne Brut.',
      variants: [
        { id: 'v1', label: '8 uds', price: 48.00, desc: 'Caja Selección Bombones (8 uds)' },
        { id: 'v2', label: '12 uds (Clásica)', price: 68.00, desc: 'Caja Selección Bombones (12 uds)', default: true },
        { id: 'v3', label: '24 uds (Gran Selección)', price: 125.00, desc: 'Caja Selección Bombones (24 uds)' }
      ]
    },
    'prod-2': {
      tags: ['Ganache Sedosa', 'Canela Cassia', 'Cacao 75%', 'Fondo Terroso'],
      origin: 'Cacao Criollo de San Martín 75%',
      altitude: 'Selva Alta · 650 m.s.n.m.',
      percentage: '75% Cacao Criollo Puro',
      aromas: 'Madera noble, café tostado, fondo terroso andino y especias dulces.',
      pairing: 'Whisky Single Malt ahumado o Espresso ristretto.',
      variants: [
        { id: 'v1', label: 'Caja 8 uds', price: 36.00, desc: 'Trufas Clásicas al Cacao (8 uds)', default: true },
        { id: 'v2', label: 'Caja 16 uds', price: 65.00, desc: 'Trufas Clásicas al Cacao (16 uds)' }
      ]
    },
    'prod-3': {
      tags: ['Mousse Belga', 'Bizcocho Gianduja', 'Glaseado Espejo', 'Oro Comestible'],
      origin: 'Chocolate Puro 70% Origen Único',
      altitude: 'Valle de La Convención · 1,100 m.s.n.m.',
      percentage: '70% Chocolate Amargo de Guarda',
      aromas: 'Caramelo oscuro, avellanas garrapiñadas y cacao tostado profundo.',
      pairing: 'Vino tinto Malbec reserva o infusión de flor de sauco.',
      variants: [
        { id: 'v1', label: 'Porción Individual', price: 16.50, desc: 'Tarta Ópera (Porción individual)' },
        { id: 'v2', label: 'Torta Entera (8-10 porc.)', price: 88.00, desc: 'Tarta Ópera (Torta Entera 8-10 porciones)', default: true }
      ]
    },
    'prod-4': {
      tags: ['Bean to Bar', 'Pistachos Tostados', 'Flor de Sal', 'Nibs Crujientes'],
      origin: 'Cacao Nativo de Bagua 72%',
      altitude: 'Amazonas · 800 m.s.n.m.',
      percentage: '72% Cacao Nativo Amazónico',
      aromas: 'Contraste dulce-salino vibrante, frutos secos y toque de grosella.',
      pairing: 'Cerveza artesanal Imperial Stout o Té Earl Grey con bergamota.',
      variants: [
        { id: 'v1', label: 'Tableta 80g', price: 24.50, desc: 'Tableta Bean-to-Bar (80g)', default: true },
        { id: 'v2', label: 'Pack Dúo (2x80g)', price: 45.00, desc: 'Tableta Bean-to-Bar (Pack Dúo 2x80g)' }
      ]
    },
    'prod-5': {
      tags: ['A la Taza', 'Crema Batida', 'Canela & Clavo', 'Espeso Artesanal'],
      origin: 'Pasta Pura de Cacao Quillabamba',
      altitude: 'Cusco · 1,050 m.s.n.m.',
      percentage: '100% Pasta Pura de Cacao',
      aromas: 'Aroma ancestral a chocolate conventual, especias dulces y leche fresca de campo.',
      pairing: 'Churros tradicionales o Croissants de mantequilla francesa.',
      variants: [
        { id: 'v1', label: 'Taza Personal 300ml', price: 16.00, desc: 'Chocolate Caliente (Taza 300ml)', default: true },
        { id: 'v2', label: 'Termo Atelier 1 Litro', price: 42.00, desc: 'Chocolate Caliente (Termo Atelier 1 Litro)' }
      ]
    },
    'prod-6': {
      tags: ['Base Crujiente Cacao', 'Coulis de Frambuesa', 'Queso Horneado', 'Moras'],
      origin: 'Queso Crema de Campo & Cacao 60%',
      altitude: 'Valle Central & Costa',
      percentage: '60% Cobertura de Cacao',
      aromas: 'Acidez vivaz de frutos del bosque combinada con suntuosidad láctea.',
      pairing: 'Cava rosado, Prosecco o Cold Brew con cáscara de naranja confitada.',
      variants: [
        { id: 'v1', label: 'Porción Individual', price: 18.50, desc: 'Cheesecake de Frutos Rojos (Porción)', default: true },
        { id: 'v2', label: 'Torta Entera (8 porc.)', price: 92.00, desc: 'Cheesecake de Frutos Rojos (Torta Entera 8 porciones)' }
      ]
    }
  };

  const DEFAULT_SENSORY = {
    tags: ['Artesanal', 'Cacao Puro', 'Edición Limitada'],
    origin: 'Cacao Peruano Seleccionado',
    altitude: 'Microclima Andino / Amazónico',
    percentage: '65% - 75% Cacao',
    aromas: 'Notas frutales, miel de flores silvestres y cacao persistente.',
    pairing: 'Café de especialidad o infusión floral.',
    variants: null
  };

  // --- 2. ESTADO LOCAL & CMS STUDIO ---
  let cart = [];
  const selectedVariants = {}; // Map: productId -> selectedVariantObject
  const CART_STORAGE_KEY = 'ac_storefront_cart';

  const studioState = {
    texts: {},
    styles: {},
    images: {},
    theme: {},
    productEdits: {} // Map: prodId -> { name, description, image, origin }
  };

  const undoStack = [];
  const INITIAL_FACTORY_TEXTS = {};
  const FACTORY_IMAGES = {
    'masterpiece_img': 'assets/products/caja_bombones.jpg',
    'brand_logo_img': 'assets/logo.jpg',
    'prod-1': 'assets/products/caja_bombones.jpg',
    'prod-2': 'assets/products/trufas_cacao.jpg',
    'prod-3': 'assets/products/tarta_chocolate.jpg',
    'prod-4': 'assets/products/tableta_origen.jpg',
    'prod-5': 'assets/products/chocolate_caliente.jpg',
    'prod-6': 'assets/products/cheesecake_frutos_rojos.jpg'
  };

  let selectedTextElement = null;
  let selectedImgKey = 'masterpiece_img';
  let selectedProductImgId = null;

  function isAdminEditing() {
    return document.body.classList.contains('admin-editor-active') && !document.body.classList.contains('preview-clean');
  }

  function captureFactoryTexts() {
    document.querySelectorAll('[data-cms-key]').forEach(el => {
      const key = el.getAttribute('data-cms-key');
      if (key && INITIAL_FACTORY_TEXTS[key] === undefined) {
        INITIAL_FACTORY_TEXTS[key] = el.innerHTML.trim();
      }
    });
  }

  function loadCart() {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      cart = saved ? JSON.parse(saved) : [];
    } catch (e) {
      cart = [];
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('No se pudo guardar el carrito:', e);
    }
  }

  // --- 3. REFERENCIAS DEL DOM ---
  const header = document.getElementById('storeHeader');
  const productsGrid = document.getElementById('productsGrid');
  const categoryNav = document.getElementById('categoryNav');
  const cartBadgeCount = document.getElementById('cartBadgeCount');
  const btnOpenCart = document.getElementById('btnOpenCart');
  const btnFloatingCart = document.getElementById('btnFloatingCart');
  const floatingCartBadge = document.getElementById('floatingCartBadge');
  const btnCloseCart = document.getElementById('btnCloseCart');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const cartItemsList = document.getElementById('cartItemsList');
  const drawerSubtotalDisplay = document.getElementById('drawerSubtotalDisplay');
  const drawerDeliveryDisplay = document.getElementById('drawerDeliveryDisplay');
  const drawerTotalDisplay = document.getElementById('drawerTotalDisplay');
  const checkoutForm = document.getElementById('checkoutForm');
  const custDeliveryType = document.getElementById('custDeliveryType');
  const btnSubmitOrder = document.getElementById('btnSubmitOrder');

  // Modal de Cata
  const tastingModal = document.getElementById('tastingModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const modalImage = document.getElementById('modalImage');
  const modalOrigin = document.getElementById('modalOrigin');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalTerroirVal = document.getElementById('modalTerroirVal');
  const modalPercentageVal = document.getElementById('modalPercentageVal');
  const modalAromaVal = document.getElementById('modalAromaVal');
  const modalPairingVal = document.getElementById('modalPairingVal');
  const modalPrice = document.getElementById('modalPrice');
  const btnModalAddToCart = document.getElementById('btnModalAddToCart');
  let currentModalProductId = null;

  // Toast
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimer = null;

  // --- 4. INICIALIZACIÓN ---
  function init() {
    captureFactoryTexts();
    loadCart();
    setupHeaderScroll();
    setupCategoryFilter();
    setupCartDrawerEvents();
    setupTastingModalEvents();
    setupDateDefaults();
    setupHeroEvents();
    renderProducts('todos');
    updateCartUI();
    applyCustomCmsContent();
    initAdminVisualEditor();

    // Escuchar cambios del inventario si el admin modifica productos en el POS
    if (window.appStore) {
      window.appStore.subscribe('products_changed', () => {
        const activeFilter = document.querySelector('.store-cat-pill.active')?.dataset.category || 'todos';
        renderProducts(activeFilter);
      });
      window.appStore.subscribe('storefront_content_changed', () => {
        applyCustomCmsContent();
      });
    }
  }

  function setupHeroEvents() {
    const btnHeroMasterpiece = document.getElementById('btnHeroAddMasterpiece');
    if (btnHeroMasterpiece) {
      btnHeroMasterpiece.addEventListener('click', (e) => {
        if (isAdminEditing()) {
          e.preventDefault();
          return;
        }
        addToCart('prod-1');
        if (cartDrawer && cartBackdrop) {
          cartDrawer.classList.add('open');
          cartBackdrop.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    }
  }

  // --- 5. MICROINTERACCIÓN: HEADER ELEGANTE CON SCROLL ---
  function setupHeaderScroll() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // --- 6. RENDERIZADO DE PRODUCTOS CON SPOTLIGHT & TILT 3D ---
  function renderProducts(categoryFilter = 'todos') {
    if (!productsGrid) return;

    const allProducts = window.appStore ? window.appStore.getProducts() : (window.INITIAL_PRODUCTS || []);
    const filtered = categoryFilter === 'todos'
      ? allProducts
      : allProducts.filter(p => p.category === categoryFilter);

    if (filtered.length === 0) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4.5rem 1.5rem; color: var(--cream-muted);">
          <h3 style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--gold-light); margin-bottom: 0.5rem;">
            Colección temporalmente en preparación
          </h3>
          <p style="font-size: 0.9rem;">Pronto hornearemos una nueva partida artesanal en el atelier.</p>
        </div>
      `;
      return;
    }

    productsGrid.innerHTML = filtered.map(product => {
      const sensory = SENSORY_PROFILES[product.id] || DEFAULT_SENSORY;
      const inStock = product.stock > 0;

      // Ediciones en vuelo (in-flight edits del editor)
      const edits = (studioState && studioState.productEdits) ? (studioState.productEdits[product.id] || {}) : {};
      const prodImg = edits.image || product.image;
      const prodName = edits.name || product.name;
      const prodDesc = edits.description || product.description || sensory.aromas;
      const originDisplay = edits.origin || product.origin || sensory.origin;

      // Inicializar variante por defecto si existe
      if (sensory.variants && !selectedVariants[product.id]) {
        const defaultVar = sensory.variants.find(v => v.default) || sensory.variants[0];
        selectedVariants[product.id] = defaultVar;
      }

      const currentVar = selectedVariants[product.id];
      const activePrice = currentVar ? currentVar.price : product.price;
      const formattedPrice = window.appStore ? window.appStore.formatMoney(activePrice) : `S/. ${activePrice.toFixed(2)}`;

      // Stock badge aislado en la esquina superior derecha (sin solapamiento con origen)
      const stockBadge = inStock
        ? `<div class="card-badge-stock"><span class="stock-dot"></span><span>Disponible (${product.stock})</span></div>`
        : `<div class="card-badge-stock out-of-stock"><span class="stock-dot"></span><span>Agotado</span></div>`;

      // Selector de variedades / presentaciones (si aplica)
      let variantsHtml = '';
      if (sensory.variants && sensory.variants.length > 0) {
        variantsHtml = `
          <div class="card-variants-wrap">
            <span class="card-variants-header">Seleccionar Presentación:</span>
            <div class="card-variants-pills" data-product-id="${product.id}">
              ${sensory.variants.map(v => {
                const isSelected = currentVar && currentVar.id === v.id;
                return `
                  <button type="button" class="variant-pill-btn ${isSelected ? 'active' : ''}" data-variant-id="${v.id}">
                    ${v.label}
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }

      // Notas sensoriales interactivas
      const tagsHtml = sensory.tags.map(tag => `
        <span class="tasting-tag" data-tag="${tag}">${tag}</span>
      `).join('');

      return `
        <article class="product-spotlight-card" data-product-id="${product.id}">
          <div class="card-media-wrapper">
            <img src="${prodImg}" alt="${prodName}" class="card-media-img" data-prod-img-id="${product.id}" title="Haz clic en modo editor para cambiar foto" loading="lazy">
            ${stockBadge}
          </div>

          <div class="card-details-body">
            <div class="card-origin-kicker">
              <span class="kicker-line"></span>
              <span data-prod-field="origin" data-prod-id="${product.id}">${originDisplay}</span>
            </div>

            <h3 class="card-product-title" data-prod-field="name" data-prod-id="${product.id}">${prodName}</h3>
            <p class="card-product-desc" data-prod-field="description" data-prod-id="${product.id}">${prodDesc}</p>

            ${variantsHtml}

            <div class="tasting-notes-section">
              <div class="tasting-notes-header">Perfil Aromático:</div>
              <div class="tasting-notes-strip">
                ${tagsHtml}
              </div>
            </div>

            <div class="card-purchase-row">
              <div class="card-price-display">
                <span class="price-currency-small">Inversión Sensorial</span>
                <span class="price-amount-large" id="price-${product.id}">${formattedPrice}</span>
              </div>

              <div class="card-actions-group">
                <button type="button" class="btn-tasting-info" data-action="tasting" data-id="${product.id}" title="Ficha de Cata Sensorial & Maridaje" aria-label="Ver ficha de cata">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                </button>
                <button type="button" class="btn-add-bag" data-action="add" data-id="${product.id}" ${!inStock ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                  <span>Añadir</span>
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Habilitar edición de campos de producto si el editor está activo
    if (document.body.classList.contains('admin-editor-active')) {
      const isClean = document.body.classList.contains('preview-clean');
      productsGrid.querySelectorAll('[data-prod-field]').forEach(el => {
        el.setAttribute('contenteditable', (!isClean).toString());
        el.setAttribute('spellcheck', 'false');

        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            el.blur();
          }
        });

        el.addEventListener('input', () => {
          const pId = el.getAttribute('data-prod-id');
          const field = el.getAttribute('data-prod-field');
          const val = el.innerText || el.textContent;
          if (!studioState.productEdits[pId]) studioState.productEdits[pId] = {};
          studioState.productEdits[pId][field] = val;

          const studioTextInput = document.getElementById('studioTextInput');
          if (studioTextInput && selectedTextElement === el) {
            studioTextInput.value = val;
          }
        });
      });
    }

    attachSpotlightAndTiltListeners();
  }

  // --- 7. FÍSICAS: CURSOR SPOTLIGHT TRACKER & TILT 3D A 60 FPS ---
  function attachSpotlightAndTiltListeners() {
    const cards = productsGrid.querySelectorAll('.product-spotlight-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        const rotateX = deltaY * -3.5;
        const rotateY = deltaX * 3.5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });

    // Delegación de eventos para interactividad
    productsGrid.addEventListener('click', (e) => {
      // SI ESTÁ EN MODO EDICIÓN ACTIVA: Prevenir añadir a bolsa o abrir cata
      if (isAdminEditing()) {
        const prodImg = e.target.closest('[data-prod-img-id]');
        if (prodImg) {
          e.preventDefault();
          e.stopPropagation();
          if (typeof selectProductImage === 'function') {
            selectProductImage(prodImg.getAttribute('data-prod-img-id'));
          }
          return;
        }

        const prodField = e.target.closest('[data-prod-field]');
        if (prodField) {
          if (typeof selectProductField === 'function') {
            selectProductField(prodField);
          }
          return;
        }

        const anyActionBtn = e.target.closest('button, a');
        if (anyActionBtn) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
      }

      // 1. Selector de Variedad / Presentación
      const variantBtn = e.target.closest('.variant-pill-btn');
      if (variantBtn) {
        const container = variantBtn.closest('.card-variants-pills');
        const prodId = container.dataset.productId;
        const variantId = variantBtn.dataset.variantId;
        const sensory = SENSORY_PROFILES[prodId];

        if (sensory && sensory.variants) {
          const selectedVar = sensory.variants.find(v => v.id === variantId);
          if (selectedVar) {
            selectedVariants[prodId] = selectedVar;

            // Actualizar estilo de pills
            container.querySelectorAll('.variant-pill-btn').forEach(b => b.classList.remove('active'));
            variantBtn.classList.add('active');

            // Actualizar precio en la tarjeta en vivo
            const priceEl = document.getElementById(`price-${prodId}`);
            if (priceEl) {
              priceEl.textContent = window.appStore ? window.appStore.formatMoney(selectedVar.price) : `S/. ${selectedVar.price.toFixed(2)}`;
            }

            showToast(`Seleccionado: ${selectedVar.label} (${window.appStore ? window.appStore.formatMoney(selectedVar.price) : 'S/. ' + selectedVar.price.toFixed(2)})`);
          }
        }
        return;
      }

      // 2. Clic en Notas de Cata
      const tag = e.target.closest('.tasting-tag');
      if (tag) {
        showToast(`Nota aromática: ${tag.dataset.tag}`);
        return;
      }

      // 3. Añadir a Bolsa
      const btnAdd = e.target.closest('button[data-action="add"]');
      if (btnAdd) {
        const prodId = btnAdd.dataset.id;
        addToCart(prodId);
        return;
      }

      // 4. Abrir Ficha de Cata
      const btnTasting = e.target.closest('button[data-action="tasting"]');
      if (btnTasting) {
        const prodId = btnTasting.dataset.id;
        openTastingModal(prodId);
        return;
      }
    });
  }

  // --- 8. FILTRADO POR CATEGORÍAS ---
  function setupCategoryFilter() {
    if (!categoryNav) return;

    categoryNav.addEventListener('click', (e) => {
      const button = e.target.closest('.store-cat-pill');
      if (!button) return;

      categoryNav.querySelectorAll('.store-cat-pill').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });

      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      const category = button.dataset.category;
      renderProducts(category);
    });
  }

  // --- 9. CARRITO: OPERACIONES & UI REACTIVA ---
  function addToCart(productId, quantity = 1) {
    const product = window.appStore ? window.appStore.getProductById(productId) : (window.INITIAL_PRODUCTS || []).find(p => p.id === productId);
    if (!product) return;

    if (product.stock <= 0) {
      showToast('Creación temporalmente sin existencias');
      return;
    }

    const currentVar = selectedVariants[productId];
    const itemName = currentVar && currentVar.desc ? currentVar.desc : product.name;
    const itemPrice = currentVar ? currentVar.price : product.price;
    const itemCartId = currentVar ? `${product.id}-${currentVar.id}` : product.id;

    const existingIndex = cart.findIndex(item => item.cartId === itemCartId);
    if (existingIndex > -1) {
      if (cart[existingIndex].quantity + quantity > product.stock) {
        showToast(`Stock máximo alcanzado (${product.stock} unidades)`);
        return;
      }
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        cartId: itemCartId,
        name: itemName,
        price: itemPrice,
        image: product.image,
        quantity: quantity,
        variantLabel: currentVar ? currentVar.label : null,
        origin: product.origin
      });
    }

    saveCart();
    updateCartUI();
    if (btnFloatingCart) {
      btnFloatingCart.classList.remove('pulse-anim');
      void btnFloatingCart.offsetWidth; // trigger reflow
      btnFloatingCart.classList.add('pulse-anim');
    }
    showToast(`Añadido a tu selección: ${itemName}`);
  }

  function removeFromCart(cartId) {
    cart = cart.filter(item => (item.cartId || item.id) !== cartId);
    saveCart();
    updateCartUI();
  }

  function changeCartQuantity(cartId, delta) {
    const item = cart.find(i => (i.cartId || i.id) === cartId);
    if (!item) return;

    const product = window.appStore ? window.appStore.getProductById(item.id) : null;
    const maxStock = product ? product.stock : 99;

    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      removeFromCart(cartId);
      return;
    }

    if (newQty > maxStock) {
      showToast(`Stock máximo disponible: ${maxStock}`);
      return;
    }

    item.quantity = newQty;
    saveCart();
    updateCartUI();
  }

  function getDeliveryFee() {
    const type = custDeliveryType ? custDeliveryType.value : 'pickup_civico';
    if (type === 'delivery_tacna') return 8.00;
    if (type === 'delivery_tacna_distritos') return 10.00;
    return 0.00; // pickup_civico o pickup_atelier
  }

  function updateCartUI() {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    if (cartBadgeCount) {
      cartBadgeCount.textContent = totalItems;
      cartBadgeCount.style.display = totalItems > 0 ? 'inline-block' : 'none';
    }
    if (floatingCartBadge) {
      floatingCartBadge.textContent = totalItems;
      floatingCartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    if (!cartItemsList) return;

    if (cart.length === 0) {
      cartItemsList.innerHTML = `
        <div class="cart-empty-state">
          <svg class="cart-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <h4 style="font-family: var(--font-serif); color: var(--gold-light); margin-bottom: 0.5rem; font-size: 1.15rem;">
            Tu bolsa de selección está vacía
          </h4>
          <p style="font-size: 0.85rem; line-height: 1.6;">Explora nuestra vitrina y selecciona creaciones de autor.</p>
        </div>
      `;
      if (drawerSubtotalDisplay) drawerSubtotalDisplay.textContent = 'S/. 0.00';
      if (drawerDeliveryDisplay) drawerDeliveryDisplay.textContent = 'S/. 0.00';
      if (drawerTotalDisplay) drawerTotalDisplay.textContent = 'S/. 0.00';
      if (btnSubmitOrder) btnSubmitOrder.disabled = true;
      return;
    }

    if (btnSubmitOrder) btnSubmitOrder.disabled = false;

    let subtotal = 0;
    cartItemsList.innerHTML = cart.map(item => {
      const itemSubtotal = item.price * item.quantity;
      subtotal += itemSubtotal;
      const formattedItemPrice = window.appStore ? window.appStore.formatMoney(item.price) : `S/. ${item.price.toFixed(2)}`;
      const cartKey = item.cartId || item.id;
      const variantBadge = item.variantLabel ? `<div class="item-variant-label">Presentación: ${item.variantLabel}</div>` : '';

      return `
        <div class="drawer-cart-item" data-cart-id="${cartKey}">
          <img src="${item.image}" alt="${item.name}">
          <div class="item-meta">
            <h4>${item.name}</h4>
            ${variantBadge}
            <div class="item-price-unit">${formattedItemPrice} c/u</div>
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.45rem;">
            <div class="item-drawer-qty">
              <button type="button" class="btn-drawer-qty" data-action="decrease" data-cart-id="${cartKey}">−</button>
              <span class="drawer-qty-num">${item.quantity}</span>
              <button type="button" class="btn-drawer-qty" data-action="increase" data-cart-id="${cartKey}">+</button>
            </div>
            <button type="button" class="btn-drawer-remove" data-action="remove" data-cart-id="${cartKey}" style="background: none; border: none; color: var(--ruby-berry); font-size: 0.72rem; cursor: pointer; text-decoration: underline; font-family: var(--font-sans);">
              Quitar
            </button>
          </div>
        </div>
      `;
    }).join('');

    const deliveryFee = getDeliveryFee();
    const total = subtotal + deliveryFee;

    if (drawerSubtotalDisplay) drawerSubtotalDisplay.textContent = window.appStore ? window.appStore.formatMoney(subtotal) : `S/. ${subtotal.toFixed(2)}`;
    if (drawerDeliveryDisplay) drawerDeliveryDisplay.textContent = window.appStore ? window.appStore.formatMoney(deliveryFee) : `S/. ${deliveryFee.toFixed(2)}`;
    if (drawerTotalDisplay) drawerTotalDisplay.textContent = window.appStore ? window.appStore.formatMoney(total) : `S/. ${total.toFixed(2)}`;
  }

  // --- 10. EVENTOS DEL DRAWER DE CARRITO ---
  function setupCartDrawerEvents() {
    function openCart(e) {
      if (isAdminEditing()) {
        if (e && e.preventDefault) e.preventDefault();
        return;
      }
      cartDrawer.classList.add('open');
      cartBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeCart() {
      cartDrawer.classList.remove('open');
      cartBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (btnOpenCart) btnOpenCart.addEventListener('click', openCart);
    if (btnFloatingCart) btnFloatingCart.addEventListener('click', openCart);
    if (btnCloseCart) btnCloseCart.addEventListener('click', closeCart);
    if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeCart();
        closeTastingModal();
      }
    });

    if (cartItemsList) {
      cartItemsList.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const action = btn.dataset.action;
        const cartId = btn.dataset.cartId;
        if (action === 'increase') changeCartQuantity(cartId, 1);
        if (action === 'decrease') changeCartQuantity(cartId, -1);
        if (action === 'remove') removeFromCart(cartId);
      });
    }

    if (custDeliveryType) {
      custDeliveryType.addEventListener('change', () => {
        const addressInput = document.getElementById('custAddress');
        if (custDeliveryType.value === 'pickup_civico') {
          if (addressInput) addressInput.placeholder = 'Punto de encuentro: Paseo Cívico de Tacna (Arco Parabólico)';
        } else if (custDeliveryType.value === 'pickup_atelier') {
          if (addressInput) addressInput.placeholder = 'Recojo directo en Atelier (Centro Histórico de Tacna)';
        } else {
          if (addressInput) addressInput.placeholder = 'Dirección de Entrega en Tacna (Calle, Nro, Urb o Referencia) *';
        }
        updateCartUI();
      });
    }

    if (checkoutForm) {
      checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }
  }

  // --- 11. CHECKOUT DOBLE VÍA (SISTEMA ADMIN POS + WHATSAPP OFICIAL) ---
  function handleCheckoutSubmit(e) {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('Tu bolsa está vacía');
      return;
    }

    const nameInput = document.getElementById('custName');
    const wspInput = document.getElementById('custWhatsapp');
    const addressInput = document.getElementById('custAddress');
    const dateInput = document.getElementById('custDate');
    const timeInput = document.getElementById('custTime');
    const paymentMethodInput = document.getElementById('custPaymentMethod');
    const notesInput = document.getElementById('custNotes');

    const customerName = nameInput.value.trim();
    const customerWsp = wspInput.value.trim();
    const deliveryType = custDeliveryType.value;
    const isPickup = deliveryType === 'pickup_civico' || deliveryType === 'pickup_atelier';
    const defaultAddress = deliveryType === 'pickup_civico'
      ? 'Punto de Encuentro: Paseo Cívico de Tacna (Arco Parabólico)'
      : (deliveryType === 'pickup_atelier' ? 'Recojo en Atelier (Centro Histórico de Tacna)' : 'Dirección por coordinar en Tacna');
    const address = addressInput.value.trim() || defaultAddress;
    const deliveryDate = dateInput.value || new Date().toISOString().split('T')[0];
    const deliveryTime = timeInput.value || '16:00';
    const paymentMethod = paymentMethodInput.value;
    const notes = notesInput.value.trim();
    const deliveryFee = getDeliveryFee();

    if (!customerName) {
      showToast('Por favor indica tu nombre completo');
      nameInput.focus();
      return;
    }

    if (!customerWsp || customerWsp.length < 8) {
      showToast('Por favor ingresa un número de teléfono válido');
      wspInput.focus();
      return;
    }

    // Registrar pedido en AppStore (sincronización reactiva inmediata con POS)
    let createdWebOrder = null;
    if (window.appStore && typeof window.appStore.createWebOrder === 'function') {
      try {
        createdWebOrder = window.appStore.createWebOrder({
          customer: customerName,
          whatsapp: customerWsp,
          address: address,
          deliveryDate: deliveryDate,
          deliveryTime: deliveryTime,
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: item.price
          })),
          deliveryFee: deliveryFee,
          paymentMethod: paymentMethod,
          paymentDeclaredProof: `Pedido realizado vía ${paymentMethod}. Pendiente de verificación.`,
          notes: notes
        });
      } catch (err) {
        console.error('Error al registrar pedido web en appStore:', err);
      }
    }

    const orderNumber = createdWebOrder ? createdWebOrder.orderNumber : `#W${Math.floor(100 + Math.random() * 900)}`;
    const subtotal = cart.reduce((acc, it) => acc + (it.price * it.quantity), 0);
    const total = subtotal + deliveryFee;

    // Construcción de Mensaje para WhatsApp sin Emojis Genéricos (Estilo Editorial de Lujo)
    const settings = window.appStore ? window.appStore.getSettings() : {};
    const atelierWsp = (settings.whatsappNumber || '+51 987 654 321').replace(/[^\d+]/g, '');

    let wspMessage = `AMOR & CACAO — PEDIDO ${orderNumber}\n`;
    wspMessage += `Donde el amor se vuelve Chocolate\n\n`;
    wspMessage += `CLIENTE: ${customerName}\n`;
    wspMessage += `TELEFONO: ${customerWsp}\n`;
    wspMessage += `ENTREGA: ${address}\n`;
    wspMessage += `FECHA DE ENTREGA: ${deliveryDate} a las ${deliveryTime}\n`;
    wspMessage += `METODO DE PAGO: ${paymentMethod}\n`;
    if (notes) {
      wspMessage += `DEDICATORIA / NOTA: ${notes}\n`;
    }
    wspMessage += `\nCREACIONES SOLICITADAS:\n`;

    cart.forEach(item => {
      wspMessage += `• ${item.quantity}x ${item.name} — S/. ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    wspMessage += `\nSubtotal: S/. ${subtotal.toFixed(2)}\n`;
    wspMessage += `Envío / Despacho: S/. ${deliveryFee.toFixed(2)}\n`;
    wspMessage += `TOTAL A PAGAR: S/. ${total.toFixed(2)}\n\n`;
    wspMessage += `Hola, acabo de registrar este pedido en la tienda web. ¿Me confirman la recepción y los datos para realizar el pago? Muchas gracias.`;

    const encodedWsp = encodeURIComponent(wspMessage);
    const whatsappUrl = `https://wa.me/${atelierWsp.replace('+', '')}?text=${encodedWsp}`;

    // Limpiar carrito
    cart = [];
    saveCart();
    updateCartUI();

    // Cerrar carrito
    cartDrawer.classList.remove('open');
    cartBackdrop.classList.remove('active');
    document.body.style.overflow = '';

    showToast(`Pedido ${orderNumber} registrado con éxito`);

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 500);
  }

  // --- 12. MODAL DE FICHA DE CATA SENSORIAL ---
  function setupTastingModalEvents() {
    function closeTastingModal() {
      if (tastingModal) tastingModal.classList.remove('active');
    }

    if (btnCloseModal) btnCloseModal.addEventListener('click', closeTastingModal);
    if (tastingModal) {
      tastingModal.addEventListener('click', (e) => {
        if (e.target === tastingModal) closeTastingModal();
      });
    }

    if (btnModalAddToCart) {
      btnModalAddToCart.addEventListener('click', () => {
        if (currentModalProductId) {
          addToCart(currentModalProductId);
          closeTastingModal();
        }
      });
    }
  }

  function openTastingModal(productId) {
    const product = window.appStore ? window.appStore.getProductById(productId) : (window.INITIAL_PRODUCTS || []).find(p => p.id === productId);
    if (!product || !tastingModal) return;

    currentModalProductId = productId;
    const sensory = SENSORY_PROFILES[productId] || DEFAULT_SENSORY;
    const currentVar = selectedVariants[productId];
    const priceToDisplay = currentVar ? currentVar.price : product.price;

    modalImage.src = product.image;
    modalOrigin.textContent = (product.origin || sensory.origin).toUpperCase();
    modalTitle.textContent = currentVar && currentVar.desc ? currentVar.desc : product.name;
    modalDesc.textContent = product.description;
    modalTerroirVal.textContent = sensory.altitude;
    modalPercentageVal.textContent = sensory.percentage;
    modalAromaVal.textContent = sensory.aromas;
    modalPairingVal.textContent = sensory.pairing;
    modalPrice.textContent = window.appStore ? window.appStore.formatMoney(priceToDisplay) : `S/. ${priceToDisplay.toFixed(2)}`;

    tastingModal.classList.add('active');
  }

  function closeTastingModal() {
    if (tastingModal) tastingModal.classList.remove('active');
  }

  // --- 13. PRESELECCIÓN DE FECHA ---
  function setupDateDefaults() {
    const dateInput = document.getElementById('custDate');
    if (dateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dd = String(tomorrow.getDate()).padStart(2, '0');
      dateInput.value = `${yyyy}-${mm}-${dd}`;
      dateInput.min = new Date().toISOString().split('T')[0];
    }
  }

  // --- 14. SISTEMA DE TOAST NOTIFICATIONS (SIN EMOJIS) ---
  function showToast(message) {
    if (!toastNotification) return;

    if (toastTimer) clearTimeout(toastTimer);

    toastMessage.textContent = message;
    toastNotification.style.opacity = '1';
    toastNotification.style.transform = 'translateY(0)';

    toastTimer = setTimeout(() => {
      toastNotification.style.opacity = '0';
      toastNotification.style.transform = 'translateY(120px)';
    }, 3500);
  }

  // --- 15. GESTOR DE CONTENIDOS CMS & STUDIO DE DISEÑO (ESTILO CANVA) ---

  const THEME_PRESETS = {
    'tacna-original': {
      name: 'Oro & Cacao Negro (Tacna)',
      vars: {
        '--gold-primary': '#daa520',
        '--gold-light': '#f3cf7a',
        '--gold-dark': '#b8860b',
        '--bg-deep': '#0c0502',
        '--cream-silk': '#faf4eb',
        '--card-bg': 'rgba(27, 12, 5, 0.85)'
      },
      pickerVals: {
        gold: '#daa520',
        bg: '#0c0502',
        text: '#faf4eb',
        card: '#1b0c05'
      }
    },
    'champagne': {
      name: 'Champagne & Trufa',
      vars: {
        '--gold-primary': '#e6ca65',
        '--gold-light': '#fae9a8',
        '--gold-dark': '#bda242',
        '--bg-deep': '#14100c',
        '--cream-silk': '#fff8f0',
        '--card-bg': 'rgba(32, 26, 20, 0.85)'
      },
      pickerVals: {
        gold: '#e6ca65',
        bg: '#14100c',
        text: '#fff8f0',
        card: '#201a14'
      }
    },
    'cobre': {
      name: 'Cobre & Selva Alta',
      vars: {
        '--gold-primary': '#d97736',
        '--gold-light': '#f2a874',
        '--gold-dark': '#a85018',
        '--bg-deep': '#0f0704',
        '--cream-silk': '#fdf5ef',
        '--card-bg': 'rgba(30, 15, 8, 0.85)'
      },
      pickerVals: {
        gold: '#d97736',
        bg: '#0f0704',
        text: '#fdf5ef',
        card: '#1e0f08'
      }
    },
    'borgona': {
      name: 'Borgoña Noble',
      vars: {
        '--gold-primary': '#e5a93b',
        '--gold-light': '#f3c87e',
        '--gold-dark': '#b37817',
        '--bg-deep': '#14070a',
        '--cream-silk': '#faedf0',
        '--card-bg': 'rgba(35, 12, 18, 0.85)'
      },
      pickerVals: {
        gold: '#e5a93b',
        bg: '#14070a',
        text: '#faedf0',
        card: '#230c12'
      }
    }
  };

  // Convertidor de RGB a Hex
  function rgbToHex(rgb) {
    if (!rgb) return '#ffffff';
    if (rgb.startsWith('#')) return rgb;
    const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (!match) return '#ffffff';
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }

  function lightenColor(col, percent) {
    const clean = col.replace('#', '');
    const num = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
  }

  function darkenColor(col, percent) {
    const clean = col.replace('#', '');
    const num = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
    const B = Math.max(0, (num & 0x0000FF) - amt);
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
  }

  // Cargar y aplicar todo el contenido guardado (textos, estilos, fotos, variables de tema y productos)
  function applyCustomCmsContent() {
    let bundle = {};
    if (window.appStore && typeof window.appStore.getStorefrontContent === 'function') {
      bundle = window.appStore.getStorefrontContent() || {};
    } else {
      try {
        bundle = JSON.parse(localStorage.getItem('ac_storefront_custom_content') || '{}');
      } catch (e) {
        bundle = {};
      }
    }

    // 1. Hidratar Estado Local
    const texts = bundle.texts || {};
    Object.keys(bundle).forEach(k => {
      if (!['texts', 'styles', 'images', 'theme', 'productEdits', 'lastUpdated'].includes(k)) {
        if (!texts[k]) texts[k] = bundle[k];
      }
    });
    studioState.texts = { ...texts };
    studioState.styles = { ...(bundle.styles || {}) };
    studioState.images = { ...(bundle.images || {}) };
    studioState.theme = { ...(bundle.theme || {}) };
    studioState.productEdits = { ...(bundle.productEdits || {}) };

    // 2. Aplicar Textos y Estilos a los Elementos [data-cms-key]
    document.querySelectorAll('[data-cms-key]').forEach(el => {
      const key = el.getAttribute('data-cms-key');

      // Texto
      if (texts[key] !== undefined && texts[key] !== null && texts[key].trim() !== '') {
        if (texts[key].includes('<span') || texts[key].includes('<strong') || texts[key].includes('<br') || texts[key].includes('<u>') || texts[key].includes('<em>')) {
          el.innerHTML = texts[key];
        } else {
          el.textContent = texts[key];
        }
      }

      // Estilos tipográficos
      if (studioState.styles[key]) {
        const s = studioState.styles[key];
        if (s.fontFamily) el.style.fontFamily = s.fontFamily;
        if (s.fontSize) el.style.fontSize = s.fontSize;
        if (s.fontWeight) el.style.fontWeight = s.fontWeight;
        if (s.fontStyle) el.style.fontStyle = s.fontStyle;
        if (s.textDecoration) el.style.textDecoration = s.textDecoration;
        if (s.textTransform) el.style.textTransform = s.textTransform;
        if (s.textAlign) el.style.textAlign = s.textAlign;
        if (s.color) el.style.color = s.color;
        if (s.letterSpacing) el.style.letterSpacing = s.letterSpacing;
      }
    });

    // 3. Aplicar Imágenes Personalizadas [data-cms-img-key]
    Object.keys(studioState.images).forEach(imgKey => {
      const src = studioState.images[imgKey];
      if (src) {
        const imgEl = document.querySelector(`[data-cms-img-key="${imgKey}"]`);
        if (imgEl) imgEl.src = src;
      }
    });

    // 4. Aplicar Paleta Global de Tema (Variables CSS)
    if (studioState.theme && Object.keys(studioState.theme).length > 0) {
      Object.entries(studioState.theme).forEach(([cssVar, colorVal]) => {
        if (colorVal) {
          document.documentElement.style.setProperty(cssVar, colorVal);
        }
      });
    }

    // 5. Re-renderizar productos para reflejar fotos o textos de producto guardados
    renderProducts('todos');
  }

  // --- STACK DE DESHACER (UNDO / REVERTIR HISTORIAL) ---
  function pushUndoState(actionName = 'cambio') {
    const snapshot = {
      action: actionName,
      texts: { ...studioState.texts },
      styles: JSON.parse(JSON.stringify(studioState.styles)),
      images: { ...studioState.images },
      theme: { ...studioState.theme },
      productEdits: JSON.parse(JSON.stringify(studioState.productEdits)),
      domTexts: {}
    };
    document.querySelectorAll('[data-cms-key]').forEach(el => {
      snapshot.domTexts[el.getAttribute('data-cms-key')] = el.innerHTML;
    });
    undoStack.push(snapshot);
    if (undoStack.length > 40) undoStack.shift();
    updateUndoBtnState();
  }

  function updateUndoBtnState() {
    const btnUndo = document.getElementById('btnEditorUndo');
    if (btnUndo) {
      btnUndo.style.opacity = undoStack.length > 0 ? '1' : '0.5';
      btnUndo.style.cursor = undoStack.length > 0 ? 'pointer' : 'default';
      btnUndo.title = undoStack.length > 0
        ? `Deshacer último cambio: ${undoStack[undoStack.length - 1].action || 'edición'} (${undoStack.length})`
        : 'Nada que deshacer (Ctrl+Z)';
    }
  }

  function performUndo() {
    if (undoStack.length === 0) {
      showToast('No hay cambios previos en el historial para deshacer');
      return;
    }
    const previous = undoStack.pop();
    updateUndoBtnState();

    // Restaurar estado interno
    studioState.texts = { ...previous.texts };
    studioState.styles = JSON.parse(JSON.stringify(previous.styles));
    studioState.images = { ...previous.images };
    studioState.theme = { ...previous.theme };
    studioState.productEdits = JSON.parse(JSON.stringify(previous.productEdits));

    // Restaurar textos y estilos en el DOM
    document.querySelectorAll('[data-cms-key]').forEach(el => {
      const key = el.getAttribute('data-cms-key');
      if (previous.domTexts[key] !== undefined) {
        el.innerHTML = previous.domTexts[key];
      } else if (INITIAL_FACTORY_TEXTS[key] !== undefined) {
        el.innerHTML = INITIAL_FACTORY_TEXTS[key];
      }

      const s = studioState.styles[key] || {};
      el.style.fontFamily = s.fontFamily || '';
      el.style.fontSize = s.fontSize || '';
      el.style.fontWeight = s.fontWeight || '';
      el.style.fontStyle = s.fontStyle || '';
      el.style.textDecoration = s.textDecoration || '';
      el.style.textTransform = s.textTransform || '';
      el.style.textAlign = s.textAlign || '';
      el.style.color = s.color || '';
      el.style.letterSpacing = s.letterSpacing || '';
    });

    // Restaurar imágenes de cabecera y vitrina
    Object.keys(FACTORY_IMAGES).forEach(key => {
      if (key.startsWith('prod-')) {
        const edits = studioState.productEdits[key];
        const src = (edits && edits.image) ? edits.image : FACTORY_IMAGES[key];
        document.querySelectorAll(`img[data-prod-img-id="${key}"]`).forEach(img => {
          img.src = src;
        });
      } else {
        const src = studioState.images[key] || FACTORY_IMAGES[key];
        const el = document.querySelector(`[data-cms-img-key="${key}"]`);
        if (el) el.src = src;
      }
    });

    // Restaurar tema
    if (studioState.theme && Object.keys(studioState.theme).length > 0) {
      Object.entries(studioState.theme).forEach(([v, c]) => {
        if (c) document.documentElement.style.setProperty(v, c);
      });
    }

    // Re-renderizar productos de autor
    renderProducts('todos');

    // Refrescar inspector lateral
    if (selectedTextElement) {
      const isConnected = document.body.contains(selectedTextElement);
      if (isConnected) {
        selectTextElement(selectedTextElement);
      } else {
        const firstHeadline = document.querySelector('[data-cms-key="hero_headline"]');
        if (firstHeadline) selectTextElement(firstHeadline);
      }
    }
    if (selectedProductImgId) {
      selectProductImage(selectedProductImgId);
    } else if (selectedImgKey) {
      selectImageTarget(selectedImgKey);
    }

    showToast(`Deshecho: ${previous.action || 'cambio revertido'}`);
  }

  // Descartar cambios no guardados con reinicio limpio a fábrica antes de cargar estado guardado
  function discardUnsavedChanges() {
    // 1. Restaurar TODAS las fotos a fábrica primero
    Object.entries(FACTORY_IMAGES).forEach(([imgKey, factorySrc]) => {
      if (imgKey.startsWith('prod-')) {
        document.querySelectorAll(`img[data-prod-img-id="${imgKey}"]`).forEach(img => {
          img.src = factorySrc;
        });
        const thumb = document.querySelector(`.studio-gallery-item[data-img-target="${imgKey}"] img`);
        if (thumb) thumb.src = factorySrc;
      } else {
        const imgEl = document.querySelector(`[data-cms-img-key="${imgKey}"]`);
        if (imgEl) imgEl.src = factorySrc;
        const thumb = document.querySelector(`.studio-gallery-item[data-img-target="${imgKey}"] img`);
        if (thumb) thumb.src = factorySrc;
      }
    });

    // 2. Restaurar textos a fábrica y limpiar estilos inline
    Object.entries(INITIAL_FACTORY_TEXTS).forEach(([key, factoryHtml]) => {
      const el = document.querySelector(`[data-cms-key="${key}"]`);
      if (el) {
        el.innerHTML = factoryHtml;
        el.style.fontFamily = '';
        el.style.fontSize = '';
        el.style.fontWeight = '';
        el.style.fontStyle = '';
        el.style.textDecoration = '';
        el.style.textTransform = '';
        el.style.textAlign = '';
        el.style.color = '';
        el.style.letterSpacing = '';
      }
    });

    // 3. Limpiar ediciones de productos en memoria
    studioState.productEdits = {};
    studioState.styles = {};
    studioState.images = {};
    studioState.texts = {};

    // 4. Restaurar paleta original de Tacna
    const preset = THEME_PRESETS['tacna-original'];
    if (preset) {
      Object.entries(preset.vars).forEach(([cssVar, val]) => {
        document.documentElement.style.setProperty(cssVar, val);
      });
    }

    // 5. Re-renderizar productos limpios
    renderProducts('todos');

    // 6. Limpiar stack de deshacer
    undoStack.length = 0;
    updateUndoBtnState();

    // 7. Re-aplicar cualquier contenido que esté previamente guardado en el servidor/storage
    applyCustomCmsContent();

    // 8. Seleccionar por defecto el primer elemento
    const firstHeadline = document.querySelector('[data-cms-key="hero_headline"]');
    if (firstHeadline) selectTextElement(firstHeadline);
    selectImageTarget('masterpiece_img');

    showToast('Cambios no guardados descartados. Restaurado al estado publicado.');
  }

  // --- SELECCIÓN DE CAMPOS DE PRODUCTOS Y FOTOS EN MODO EDITOR ---
  function selectProductField(el) {
    if (!el) return;
    document.querySelectorAll('.studio-selected').forEach(item => item.classList.remove('studio-selected'));
    el.classList.add('studio-selected');
    selectedTextElement = el;

    const pId = el.getAttribute('data-prod-id');
    const field = el.getAttribute('data-prod-field');
    const fieldNames = {
      origin: 'Origen / Región',
      name: 'Nombre de Creación',
      description: 'Descripción de Autor'
    };

    const studioActiveElName = document.getElementById('studioActiveElName');
    const studioTextInput = document.getElementById('studioTextInput');

    if (studioActiveElName) {
      studioActiveElName.textContent = `Producto [${pId}]: ${fieldNames[field] || field}`;
    }

    if (studioTextInput) {
      studioTextInput.value = el.innerText || el.textContent;
    }

    // Abrir panel en pestaña de tipografía
    switchStudioTab('tab-studio-typography');
    openStudioPanel();
  }

  function selectProductImage(prodId) {
    selectedProductImgId = prodId;
    selectedImgKey = null;

    document.querySelectorAll('.studio-gallery-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-img-target') === prodId);
    });

    const targetEl = document.querySelector(`img[data-prod-img-id="${prodId}"]`);
    const allProducts = window.appStore ? window.appStore.getProducts() : (window.INITIAL_PRODUCTS || []);
    const prod = allProducts.find(p => p.id === prodId);
    const prodName = (studioState.productEdits[prodId] && studioState.productEdits[prodId].name) || (prod ? prod.name : prodId);

    const studioActiveImgName = document.getElementById('studioActiveImgName');
    const studioImgPreview = document.getElementById('studioImgPreview');

    if (studioActiveImgName) {
      studioActiveImgName.textContent = `Vitrina: ${prodName}`;
    }
    if (studioImgPreview && targetEl) {
      studioImgPreview.src = targetEl.src;
    }

    switchStudioTab('tab-studio-media');
    openStudioPanel();
  }

  function selectImageTarget(imgKey) {
    selectedImgKey = imgKey;
    selectedProductImgId = null;

    document.querySelectorAll('.studio-gallery-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-img-target') === imgKey);
    });

    const targetEl = document.querySelector(`[data-cms-img-key="${imgKey}"]`);
    const label = imgKey === 'masterpiece_img' ? 'Obra Insignia (Hero)' : (imgKey === 'brand_logo_img' ? 'Emblema / Logo de Marca' : imgKey);

    const studioActiveImgName = document.getElementById('studioActiveImgName');
    const studioImgPreview = document.getElementById('studioImgPreview');

    if (studioActiveImgName) studioActiveImgName.textContent = label;
    if (targetEl && studioImgPreview) {
      studioImgPreview.src = targetEl.src;
    }

    switchStudioTab('tab-studio-media');
    openStudioPanel();
  }

  function openStudioPanel() {
    const adminStudioPanel = document.getElementById('adminStudioPanel');
    const btnToggleStudioPanel = document.getElementById('btnToggleStudioPanel');
    if (adminStudioPanel) {
      adminStudioPanel.style.display = 'flex';
      adminStudioPanel.classList.remove('collapsed');
    }
    document.body.classList.add('studio-drawer-open');
    if (btnToggleStudioPanel) btnToggleStudioPanel.classList.add('active');
  }

  function switchStudioTab(tabId) {
    document.querySelectorAll('.studio-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-studio-tab') === tabId);
    });
    document.querySelectorAll('.studio-tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === tabId);
    });
  }

  function selectTextElement(el) {
    if (!el) return;
    document.querySelectorAll('.studio-selected').forEach(item => item.classList.remove('studio-selected'));
    el.classList.add('studio-selected');
    selectedTextElement = el;

    const studioActiveElName = document.getElementById('studioActiveElName');
    const studioTextInput = document.getElementById('studioTextInput');
    const studioFontFamily = document.getElementById('studioFontFamily');
    const studioFontSizeSlider = document.getElementById('studioFontSizeSlider');
    const studioSizeDisplay = document.getElementById('studioSizeDisplay');
    const btnToolBold = document.getElementById('btnToolBold');
    const btnToolItalic = document.getElementById('btnToolItalic');
    const btnToolUnderline = document.getElementById('btnToolUnderline');
    const btnToolStrike = document.getElementById('btnToolStrike');
    const btnToolCase = document.getElementById('btnToolCase');
    const btnToolAlignLeft = document.getElementById('btnToolAlignLeft');
    const btnToolAlignCenter = document.getElementById('btnToolAlignCenter');
    const btnToolAlignRight = document.getElementById('btnToolAlignRight');
    const btnToolAlignJustify = document.getElementById('btnToolAlignJustify');
    const studioTextColorPicker = document.getElementById('studioTextColorPicker');
    const studioLetterSpacing = document.getElementById('studioLetterSpacing');

    const key = el.getAttribute('data-cms-key') || el.getAttribute('data-prod-field');
    const tag = el.tagName.toLowerCase();
    if (studioActiveElName) {
      studioActiveElName.textContent = `<${tag}> ${key}`;
    }

    // Sincronizar el contenido del texto en el textarea de la barra lateral
    if (studioTextInput) {
      studioTextInput.value = el.innerText || el.textContent;
    }

    // Leer estilos computados
    const comp = window.getComputedStyle(el);
    const currentStyles = (el.getAttribute('data-cms-key') && studioState.styles[key]) ? studioState.styles[key] : {};

    // Sincronizar select de fuente
    if (studioFontFamily) {
      const rawFamily = currentStyles.fontFamily || comp.fontFamily || 'inherit';
      let matched = false;
      for (let opt of studioFontFamily.options) {
        if (opt.value !== 'inherit' && rawFamily.toLowerCase().includes(opt.value.replace(/'/g, '').split(',')[0].toLowerCase().trim())) {
          studioFontFamily.value = opt.value;
          matched = true;
          break;
        }
      }
      if (!matched) studioFontFamily.value = 'inherit';
    }

    // Tamaño de fuente
    const fontSizePx = parseInt(comp.fontSize) || 16;
    if (studioFontSizeSlider) studioFontSizeSlider.value = Math.min(Math.max(fontSizePx, 10), 72);
    if (studioSizeDisplay) studioSizeDisplay.textContent = `${fontSizePx}px`;

    // Botones de formato B / I / U / S / aA
    const isBold = (comp.fontWeight >= 600 || comp.fontWeight === 'bold');
    if (btnToolBold) btnToolBold.classList.toggle('active', isBold);

    const isItalic = (comp.fontStyle === 'italic');
    if (btnToolItalic) btnToolItalic.classList.toggle('active', isItalic);

    const isUnder = comp.textDecorationLine ? comp.textDecorationLine.includes('underline') : (comp.textDecoration && comp.textDecoration.includes('underline'));
    if (btnToolUnderline) btnToolUnderline.classList.toggle('active', Boolean(isUnder));

    const isStrike = comp.textDecorationLine ? comp.textDecorationLine.includes('line-through') : (comp.textDecoration && comp.textDecoration.includes('line-through'));
    if (btnToolStrike) btnToolStrike.classList.toggle('active', Boolean(isStrike));

    const isUpper = (comp.textTransform === 'uppercase');
    if (btnToolCase) btnToolCase.classList.toggle('active', isUpper);

    // Alineación
    const align = comp.textAlign || 'left';
    if (btnToolAlignLeft) btnToolAlignLeft.classList.toggle('active', align === 'left' || align === 'start');
    if (btnToolAlignCenter) btnToolAlignCenter.classList.toggle('active', align === 'center');
    if (btnToolAlignRight) btnToolAlignRight.classList.toggle('active', align === 'right' || align === 'end');
    if (btnToolAlignJustify) btnToolAlignJustify.classList.toggle('active', align === 'justify');

    // Color del texto
    if (studioTextColorPicker) {
      const hex = rgbToHex(comp.color);
      studioTextColorPicker.value = hex;
    }

    // Interletrado
    if (studioLetterSpacing) {
      studioLetterSpacing.value = currentStyles.letterSpacing || 'normal';
    }
  }

  function initAdminVisualEditor() {
    // 1. Verificación de autorización
    const urlParams = new URLSearchParams(window.location.search);
    const hasEditorParam = urlParams.get('editor') === 'active';
    const hasAdminSession = sessionStorage.getItem('ac_admin_editor_session') === 'true' || localStorage.getItem('ac_admin_editor_session') === 'true';

    const adminEditorBar = document.getElementById('adminEditorBar');
    const adminStudioPanel = document.getElementById('adminStudioPanel');

    // SI NO ES ADMIN AUTORIZADO: Experiencia 100% limpia y pública para clientes
    if (!hasEditorParam && !hasAdminSession) {
      if (adminEditorBar) adminEditorBar.style.display = 'none';
      if (adminStudioPanel) adminStudioPanel.style.display = 'none';
      document.body.classList.remove('admin-editor-active', 'studio-drawer-open');
      document.querySelectorAll('[data-cms-key]').forEach(el => {
        el.removeAttribute('contenteditable');
      });
      return;
    }

    // SI ES ADMIN AUTORIZADO:
    sessionStorage.setItem('ac_admin_editor_session', 'true');

    if (adminEditorBar) adminEditorBar.style.display = 'flex';
    if (adminStudioPanel) adminStudioPanel.style.display = 'flex';
    document.body.classList.add('admin-editor-active', 'studio-drawer-open');

    // --- ELEMENTOS DEL PANEL STUDIO ---
    const btnToggleStudioPanel = document.getElementById('btnToggleStudioPanel');
    const btnToggleStudioCollapse = document.getElementById('btnToggleStudioCollapse');
    const btnCloseStudioPanel = document.getElementById('btnCloseStudioPanel');

    // Pestaña 1: Tipografía y Contenido de Texto
    const studioTextInput = document.getElementById('studioTextInput');
    const studioFontFamily = document.getElementById('studioFontFamily');
    const btnStudioSizeMinus = document.getElementById('btnStudioSizeMinus');
    const btnStudioSizePlus = document.getElementById('btnStudioSizePlus');
    const studioSizeDisplay = document.getElementById('studioSizeDisplay');
    const studioFontSizeSlider = document.getElementById('studioFontSizeSlider');
    const btnToolBold = document.getElementById('btnToolBold');
    const btnToolItalic = document.getElementById('btnToolItalic');
    const btnToolUnderline = document.getElementById('btnToolUnderline');
    const btnToolStrike = document.getElementById('btnToolStrike');
    const btnToolCase = document.getElementById('btnToolCase');
    const btnToolAlignLeft = document.getElementById('btnToolAlignLeft');
    const btnToolAlignCenter = document.getElementById('btnToolAlignCenter');
    const btnToolAlignRight = document.getElementById('btnToolAlignRight');
    const btnToolAlignJustify = document.getElementById('btnToolAlignJustify');
    const studioTextColorPicker = document.getElementById('studioTextColorPicker');
    const studioLetterSpacing = document.getElementById('studioLetterSpacing');
    const btnStudioResetElementStyles = document.getElementById('btnStudioResetElementStyles');

    // Pestaña 2: Fotos
    const studioImgPreview = document.getElementById('studioImgPreview');
    const studioFileInput = document.getElementById('studioFileInput');
    const btnStudioTriggerUpload = document.getElementById('btnStudioTriggerUpload');
    const studioImgUrlInput = document.getElementById('studioImgUrlInput');
    const btnStudioApplyUrl = document.getElementById('btnStudioApplyUrl');
    const btnStudioResetImg = document.getElementById('btnStudioResetImg');

    // Pestaña 3: Paleta
    const themeGoldColor = document.getElementById('themeGoldColor');
    const themeGoldHex = document.getElementById('themeGoldHex');
    const themeBgColor = document.getElementById('themeBgColor');
    const themeBgHex = document.getElementById('themeBgHex');
    const themeTextColor = document.getElementById('themeTextColor');
    const themeTextHex = document.getElementById('themeTextHex');
    const themeCardColor = document.getElementById('themeCardColor');
    const themeCardHex = document.getElementById('themeCardHex');
    const btnStudioResetTheme = document.getElementById('btnStudioResetTheme');

    // Botones de la Barra Superior
    const btnUndo = document.getElementById('btnEditorUndo');
    const btnPreview = document.getElementById('btnEditorPreviewToggle');
    const btnDiscard = document.getElementById('btnEditorDiscard');
    const btnPublish = document.getElementById('btnEditorPublish');
    const btnExit = document.getElementById('btnEditorExit');

    // Helpers para abrir/cerrar el panel Studio
    function closeStudioPanel() {
      if (adminStudioPanel) {
        adminStudioPanel.style.display = 'none';
      }
      document.body.classList.remove('studio-drawer-open');
      if (btnToggleStudioPanel) btnToggleStudioPanel.classList.remove('active');
    }

    function toggleStudioPanel() {
      if (!adminStudioPanel) return;
      const isVisible = adminStudioPanel.style.display !== 'none' && !adminStudioPanel.classList.contains('collapsed');
      if (isVisible) {
        adminStudioPanel.style.display = 'none';
        document.body.classList.remove('studio-drawer-open');
        if (btnToggleStudioPanel) btnToggleStudioPanel.classList.remove('active');
      } else {
        openStudioPanel();
      }
    }

    if (btnToggleStudioPanel) btnToggleStudioPanel.addEventListener('click', toggleStudioPanel);
    if (btnCloseStudioPanel) btnCloseStudioPanel.addEventListener('click', closeStudioPanel);
    if (btnToggleStudioCollapse) {
      btnToggleStudioCollapse.addEventListener('click', () => {
        if (!adminStudioPanel) return;
        adminStudioPanel.classList.toggle('collapsed');
        const isCollapsed = adminStudioPanel.classList.contains('collapsed');
        document.body.classList.toggle('studio-drawer-open', !isCollapsed);
        if (btnToggleStudioPanel) btnToggleStudioPanel.classList.toggle('active', !isCollapsed);
      });
    }

    // Navegación de pestañas del Studio
    document.querySelectorAll('.studio-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-studio-tab');
        if (targetTab) switchStudioTab(targetTab);
      });
    });

    // --- CONFIGURACIÓN DE ELEMENTOS EDITABLES [data-cms-key] ---
    const editableElements = document.querySelectorAll('[data-cms-key]');
    editableElements.forEach(el => {
      el.setAttribute('contenteditable', 'true');
      el.setAttribute('spellcheck', 'false');

      // Prevenir saltos de línea indeseados en titulares
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !el.classList.contains('hero-subhead') && !el.classList.contains('masterpiece-desc') && el.getAttribute('data-cms-key') !== 'footer_manifesto') {
          e.preventDefault();
          el.blur();
        }
      });

      // Selección al hacer foco
      el.addEventListener('focus', () => {
        selectTextElement(el);
      });

      // Sincronización en vivo del contenido editado directamente sobre la página hacia el textarea lateral
      el.addEventListener('input', () => {
        const key = el.getAttribute('data-cms-key');
        if (key) {
          studioState.texts[key] = el.innerHTML;
        }
        if (studioTextInput && selectedTextElement === el) {
          studioTextInput.value = el.innerText || el.textContent;
        }
      });
    });

    // --- EDICIÓN BIDIRECCIONAL EN EL TEXTAREA LATERAL (INSPECTOR) ---
    if (studioTextInput) {
      let textInputDebounce = null;
      studioTextInput.addEventListener('input', () => {
        if (!selectedTextElement) return;
        const val = studioTextInput.value;

        // Si es un elemento [data-cms-key]
        const cmsKey = selectedTextElement.getAttribute('data-cms-key');
        if (cmsKey) {
          selectedTextElement.textContent = val;
          studioState.texts[cmsKey] = val;
        }

        // Si es un campo de producto de autor [data-prod-field]
        const pId = selectedTextElement.getAttribute('data-prod-id');
        const field = selectedTextElement.getAttribute('data-prod-field');
        if (pId && field) {
          selectedTextElement.textContent = val;
          if (!studioState.productEdits[pId]) studioState.productEdits[pId] = {};
          studioState.productEdits[pId][field] = val;
        }

        clearTimeout(textInputDebounce);
        textInputDebounce = setTimeout(() => {
          pushUndoState('editar texto');
        }, 1200);
      });
    }

    // Helper para registrar estilos del elemento seleccionado
    function updateSelectedStyle(prop, value) {
      if (!selectedTextElement) return;
      const key = selectedTextElement.getAttribute('data-cms-key');
      if (!key) return;

      pushUndoState(`estilo ${prop}`);

      if (!studioState.styles[key]) studioState.styles[key] = {};
      if (value === '' || value === null || value === undefined) {
        delete studioState.styles[key][prop];
      } else {
        studioState.styles[key][prop] = value;
      }
    }

    // Controles de Tipografía
    if (studioFontFamily) {
      studioFontFamily.addEventListener('change', () => {
        if (!selectedTextElement) return;
        const val = studioFontFamily.value;
        selectedTextElement.style.fontFamily = val === 'inherit' ? '' : val;
        updateSelectedStyle('fontFamily', val === 'inherit' ? '' : val);
      });
    }

    function applyFontSize(sizePx) {
      if (!selectedTextElement) return;
      const clamped = Math.min(Math.max(sizePx, 10), 72);
      selectedTextElement.style.fontSize = `${clamped}px`;
      if (studioFontSizeSlider) studioFontSizeSlider.value = clamped;
      if (studioSizeDisplay) studioSizeDisplay.textContent = `${clamped}px`;
      updateSelectedStyle('fontSize', `${clamped}px`);
    }

    if (studioFontSizeSlider) {
      studioFontSizeSlider.addEventListener('input', () => {
        applyFontSize(parseInt(studioFontSizeSlider.value));
      });
    }

    if (btnStudioSizeMinus) {
      btnStudioSizeMinus.addEventListener('click', () => {
        const cur = parseInt(studioFontSizeSlider ? studioFontSizeSlider.value : 16) || 16;
        applyFontSize(cur - 1);
      });
    }

    if (btnStudioSizePlus) {
      btnStudioSizePlus.addEventListener('click', () => {
        const cur = parseInt(studioFontSizeSlider ? studioFontSizeSlider.value : 16) || 16;
        applyFontSize(cur + 1);
      });
    }

    if (btnToolBold) {
      btnToolBold.addEventListener('click', () => {
        if (!selectedTextElement) return;
        const isBold = btnToolBold.classList.contains('active');
        selectedTextElement.style.fontWeight = isBold ? 'normal' : '700';
        btnToolBold.classList.toggle('active', !isBold);
        updateSelectedStyle('fontWeight', !isBold ? '700' : 'normal');
      });
    }

    if (btnToolItalic) {
      btnToolItalic.addEventListener('click', () => {
        if (!selectedTextElement) return;
        const isItalic = btnToolItalic.classList.contains('active');
        selectedTextElement.style.fontStyle = isItalic ? 'normal' : 'italic';
        btnToolItalic.classList.toggle('active', !isItalic);
        updateSelectedStyle('fontStyle', !isItalic ? 'italic' : 'normal');
      });
    }

    if (btnToolUnderline) {
      btnToolUnderline.addEventListener('click', () => {
        if (!selectedTextElement) return;
        const isUnder = btnToolUnderline.classList.contains('active');
        selectedTextElement.style.textDecoration = isUnder ? 'none' : 'underline';
        btnToolUnderline.classList.toggle('active', !isUnder);
        updateSelectedStyle('textDecoration', !isUnder ? 'underline' : 'none');
      });
    }

    if (btnToolStrike) {
      btnToolStrike.addEventListener('click', () => {
        if (!selectedTextElement) return;
        const isStrike = btnToolStrike.classList.contains('active');
        selectedTextElement.style.textDecoration = isStrike ? 'none' : 'line-through';
        btnToolStrike.classList.toggle('active', !isStrike);
        updateSelectedStyle('textDecoration', !isStrike ? 'line-through' : 'none');
      });
    }

    if (btnToolCase) {
      btnToolCase.addEventListener('click', () => {
        if (!selectedTextElement) return;
        const isUpper = btnToolCase.classList.contains('active');
        selectedTextElement.style.textTransform = isUpper ? 'none' : 'uppercase';
        btnToolCase.classList.toggle('active', !isUpper);
        updateSelectedStyle('textTransform', !isUpper ? 'uppercase' : 'none');
      });
    }

    function setTextAlign(align) {
      if (!selectedTextElement) return;
      selectedTextElement.style.textAlign = align;
      if (btnToolAlignLeft) btnToolAlignLeft.classList.toggle('active', align === 'left');
      if (btnToolAlignCenter) btnToolAlignCenter.classList.toggle('active', align === 'center');
      if (btnToolAlignRight) btnToolAlignRight.classList.toggle('active', align === 'right');
      if (btnToolAlignJustify) btnToolAlignJustify.classList.toggle('active', align === 'justify');
      updateSelectedStyle('textAlign', align);
    }

    if (btnToolAlignLeft) btnToolAlignLeft.addEventListener('click', () => setTextAlign('left'));
    if (btnToolAlignCenter) btnToolAlignCenter.addEventListener('click', () => setTextAlign('center'));
    if (btnToolAlignRight) btnToolAlignRight.addEventListener('click', () => setTextAlign('right'));
    if (btnToolAlignJustify) btnToolAlignJustify.addEventListener('click', () => setTextAlign('justify'));

    // Swatches de color
    document.querySelectorAll('.studio-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        if (!selectedTextElement) return;
        const color = swatch.getAttribute('data-color');
        selectedTextElement.style.color = color;
        if (studioTextColorPicker) studioTextColorPicker.value = color;
        updateSelectedStyle('color', color);
      });
    });

    if (studioTextColorPicker) {
      studioTextColorPicker.addEventListener('input', () => {
        if (!selectedTextElement) return;
        const color = studioTextColorPicker.value;
        selectedTextElement.style.color = color;
        updateSelectedStyle('color', color);
      });
    }

    if (studioLetterSpacing) {
      studioLetterSpacing.addEventListener('change', () => {
        if (!selectedTextElement) return;
        const sp = studioLetterSpacing.value;
        selectedTextElement.style.letterSpacing = sp === 'normal' ? '' : sp;
        updateSelectedStyle('letterSpacing', sp === 'normal' ? '' : sp);
      });
    }

    // Botón: Restaurar estilo original del texto
    if (btnStudioResetElementStyles) {
      btnStudioResetElementStyles.addEventListener('click', () => {
        if (!selectedTextElement) return;
        const key = selectedTextElement.getAttribute('data-cms-key');
        if (key && studioState.styles[key]) {
          pushUndoState('restaurar estilo');
          delete studioState.styles[key];
        }
        selectedTextElement.style.fontFamily = '';
        selectedTextElement.style.fontSize = '';
        selectedTextElement.style.fontWeight = '';
        selectedTextElement.style.fontStyle = '';
        selectedTextElement.style.textDecoration = '';
        selectedTextElement.style.textTransform = '';
        selectedTextElement.style.textAlign = '';
        selectedTextElement.style.color = '';
        selectedTextElement.style.letterSpacing = '';

        selectTextElement(selectedTextElement);
        showToast('Estilo del texto restablecido al diseño predeterminado');
      });
    }

    // --- PESTAÑA 2: FOTOS & MULTIMEDIA (HERO, LOGO Y VITRINA DE AUTOR) ---
    function applyImageToTarget(source) {
      pushUndoState('cambiar foto');

      // Si es una foto de producto en la Vitrina
      if (selectedProductImgId) {
        const prodId = selectedProductImgId;
        if (!studioState.productEdits[prodId]) studioState.productEdits[prodId] = {};
        studioState.productEdits[prodId].image = source;

        // Actualizar en el DOM de la vitrina
        document.querySelectorAll(`img[data-prod-img-id="${prodId}"]`).forEach(img => {
          img.src = source;
        });
        if (studioImgPreview) studioImgPreview.src = source;

        // Actualizar thumbnail en el panel
        const thumb = document.querySelector(`.studio-gallery-item[data-img-target="${prodId}"] img`);
        if (thumb) thumb.src = source;

        showToast(`Foto del producto actualizada en la vitrina`);
      }
      // Si es una imagen CMS estática (Hero o Logo)
      else if (selectedImgKey) {
        const key = selectedImgKey;
        studioState.images[key] = source;
        const targetEl = document.querySelector(`[data-cms-img-key="${key}"]`);
        if (targetEl) targetEl.src = source;
        if (studioImgPreview) studioImgPreview.src = source;

        // Actualizar thumbnail en el panel
        const thumb = document.querySelector(`.studio-gallery-item[data-img-target="${key}"] img`);
        if (thumb) thumb.src = source;

        showToast(`Foto de la tienda actualizada con éxito`);
      }
    }

    // Clic en galería de fotos del panel lateral (Hero, Logo y Productos)
    document.querySelectorAll('.studio-gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const key = item.getAttribute('data-img-target');
        if (!key) return;
        if (key.startsWith('prod-')) {
          selectProductImage(key);
        } else {
          selectImageTarget(key);
        }
      });
    });

    // Subida de imagen desde archivo local con compresión Canvas automática
    if (btnStudioTriggerUpload && studioFileInput) {
      btnStudioTriggerUpload.addEventListener('click', () => {
        studioFileInput.click();
      });

      studioFileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const maxDim = 1200;

            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
            applyImageToTarget(compressedDataUrl);
          };
          img.src = loadEvt.target.result;
        };
        reader.readAsDataURL(file);
      });
    }

    // Aplicar URL directa
    if (btnStudioApplyUrl && studioImgUrlInput) {
      btnStudioApplyUrl.addEventListener('click', () => {
        const url = studioImgUrlInput.value.trim();
        if (!url) {
          showToast('Ingresa una URL válida de imagen');
          return;
        }
        applyImageToTarget(url);
        studioImgUrlInput.value = '';
      });
    }

    // Restaurar foto seleccionada de fábrica
    if (btnStudioResetImg) {
      btnStudioResetImg.addEventListener('click', () => {
        if (selectedProductImgId) {
          const prodId = selectedProductImgId;
          const factorySrc = FACTORY_IMAGES[prodId];
          if (factorySrc) {
            pushUndoState('restaurar foto de producto');
            if (studioState.productEdits[prodId]) {
              delete studioState.productEdits[prodId].image;
            }
            document.querySelectorAll(`img[data-prod-img-id="${prodId}"]`).forEach(img => {
              img.src = factorySrc;
            });
            if (studioImgPreview) studioImgPreview.src = factorySrc;
            const thumb = document.querySelector(`.studio-gallery-item[data-img-target="${prodId}"] img`);
            if (thumb) thumb.src = factorySrc;
            showToast('Foto del producto restablecida a la de fábrica');
          }
        } else if (selectedImgKey && FACTORY_IMAGES[selectedImgKey]) {
          pushUndoState('restaurar foto de fábrica');
          delete studioState.images[selectedImgKey];
          const factorySrc = FACTORY_IMAGES[selectedImgKey];
          const targetEl = document.querySelector(`[data-cms-img-key="${selectedImgKey}"]`);
          if (targetEl) targetEl.src = factorySrc;
          if (studioImgPreview) studioImgPreview.src = factorySrc;
          const thumb = document.querySelector(`.studio-gallery-item[data-img-target="${selectedImgKey}"] img`);
          if (thumb) thumb.src = factorySrc;
          showToast('Foto restablecida a la original de fábrica');
        }
      });
    }

    // --- PESTAÑA 3: PALETA & TEMAS CROMÁTICOS ---
    function applyThemePreset(presetKey) {
      const preset = THEME_PRESETS[presetKey];
      if (!preset) return;

      pushUndoState(`paleta ${preset.name}`);

      Object.entries(preset.vars).forEach(([cssVar, val]) => {
        document.documentElement.style.setProperty(cssVar, val);
        studioState.theme[cssVar] = val;
      });

      if (themeGoldColor) {
        themeGoldColor.value = preset.pickerVals.gold;
        if (themeGoldHex) themeGoldHex.textContent = preset.pickerVals.gold.toUpperCase();
      }
      if (themeBgColor) {
        themeBgColor.value = preset.pickerVals.bg;
        if (themeBgHex) themeBgHex.textContent = preset.pickerVals.bg.toUpperCase();
      }
      if (themeTextColor) {
        themeTextColor.value = preset.pickerVals.text;
        if (themeTextHex) themeTextHex.textContent = preset.pickerVals.text.toUpperCase();
      }
      if (themeCardColor) {
        themeCardColor.value = preset.pickerVals.card;
        if (themeCardHex) themeCardHex.textContent = preset.pickerVals.card.toUpperCase();
      }

      showToast(`Paleta aplicada: ${preset.name}`);
    }

    document.querySelectorAll('.studio-preset-card').forEach(card => {
      card.addEventListener('click', () => {
        const presetKey = card.getAttribute('data-preset');
        if (presetKey) applyThemePreset(presetKey);
      });
    });

    if (themeGoldColor) {
      themeGoldColor.addEventListener('input', () => {
        const val = themeGoldColor.value;
        document.documentElement.style.setProperty('--gold-primary', val);
        document.documentElement.style.setProperty('--gold-light', lightenColor(val, 20));
        document.documentElement.style.setProperty('--gold-dark', darkenColor(val, 20));
        studioState.theme['--gold-primary'] = val;
        studioState.theme['--gold-light'] = lightenColor(val, 20);
        studioState.theme['--gold-dark'] = darkenColor(val, 20);
        if (themeGoldHex) themeGoldHex.textContent = val.toUpperCase();
      });
    }

    if (themeBgColor) {
      themeBgColor.addEventListener('input', () => {
        const val = themeBgColor.value;
        document.documentElement.style.setProperty('--bg-deep', val);
        studioState.theme['--bg-deep'] = val;
        if (themeBgHex) themeBgHex.textContent = val.toUpperCase();
      });
    }

    if (themeTextColor) {
      themeTextColor.addEventListener('input', () => {
        const val = themeTextColor.value;
        document.documentElement.style.setProperty('--cream-silk', val);
        studioState.theme['--cream-silk'] = val;
        if (themeTextHex) themeTextHex.textContent = val.toUpperCase();
      });
    }

    if (themeCardColor) {
      themeCardColor.addEventListener('input', () => {
        const val = themeCardColor.value;
        document.documentElement.style.setProperty('--card-bg', val);
        studioState.theme['--card-bg'] = val;
        if (themeCardHex) themeCardHex.textContent = val.toUpperCase();
      });
    }

    if (btnStudioResetTheme) {
      btnStudioResetTheme.addEventListener('click', () => {
        applyThemePreset('tacna-original');
        showToast('Paleta restablecida al diseño original de Tacna');
      });
    }

    // --- INTERCEPTOR GLOBAL DE CLICS EN FASE DE CAPTURA ---
    // Evita que al hacer clic sobre cualquier botón, enlace o producto en modo edición
    // se abra el carrito o se salte de página, interrumpiendo la edición
    document.addEventListener('click', (e) => {
      if (!isAdminEditing()) return;

      // Si el clic ocurre dentro del editor o sus herramientas, permitirlo normalmente
      if (e.target.closest('#adminEditorBar, #adminStudioPanel, #toastNotification, .studio-collapse-handle')) {
        return;
      }

      // Si se hace clic en una imagen de producto de la vitrina
      const prodImg = e.target.closest('[data-prod-img-id]');
      if (prodImg) {
        e.preventDefault();
        e.stopPropagation();
        selectProductImage(prodImg.getAttribute('data-prod-img-id'));
        return;
      }

      // Si se hace clic en un campo de texto de un producto de autor
      const prodField = e.target.closest('[data-prod-field]');
      if (prodField) {
        selectProductField(prodField);
        return;
      }

      // Si se hace clic en una imagen fija CMS (Hero, Logo)
      const cmsImg = e.target.closest('[data-cms-img-key]');
      if (cmsImg) {
        e.preventDefault();
        e.stopPropagation();
        selectImageTarget(cmsImg.getAttribute('data-cms-img-key'));
        return;
      }

      // Si se hace clic en un texto editable [data-cms-key]
      const cmsEl = e.target.closest('[data-cms-key]');
      if (cmsEl) {
        // Si el elemento es a su vez un botón o enlace (ej. botón hero), evitar que navegue o abra carrito
        if (e.target.closest('button, a')) {
          e.preventDefault();
          e.stopPropagation();
        }
        selectTextElement(cmsEl);
        return;
      }

      // Si es cualquier otro botón, link o disparador en la página (Añadir a bolsa, Ver Ficha, Tu Selección, etc.)
      const interactiveEl = e.target.closest('button, a, input, select');
      if (interactiveEl) {
        e.preventDefault();
        e.stopPropagation();
        showToast('Modo edición activo: botones de compra pausados para editar');
        return;
      }
    }, true); // Captura activa para interceptar antes que los listeners hijos

    // --- ACCIONES DE LA BARRA SUPERIOR DEL EDITOR ---

    // 1. Botón Deshacer
    if (btnUndo) {
      btnUndo.addEventListener('click', performUndo);
    }

    // Atajo de teclado: Ctrl+Z / Cmd+Z para deshacer
    document.addEventListener('keydown', (e) => {
      if (!isAdminEditing()) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
          return; // Respetar historial nativo del input/textarea si está en foco
        }
        e.preventDefault();
        performUndo();
      }
    });

    // 2. Vista Previa Limpia (oculta marcos y reactiva enlaces para probar)
    let isPreviewMode = false;
    if (btnPreview) {
      btnPreview.addEventListener('click', () => {
        isPreviewMode = !isPreviewMode;
        document.body.classList.toggle('preview-clean', isPreviewMode);
        editableElements.forEach(el => {
          el.setAttribute('contenteditable', (!isPreviewMode).toString());
        });
        document.querySelectorAll('[data-prod-field]').forEach(el => {
          el.setAttribute('contenteditable', (!isPreviewMode).toString());
        });
        btnPreview.innerHTML = isPreviewMode ? '<span>✏️ Salir de Vista Previa</span>' : '<span>👁️ Vista Previa</span>';
        showToast(isPreviewMode ? 'Vista previa activa (sin marcos de edición)' : 'Modo edición reactivado');
      });
    }

    // 3. Descartar Cambios (reversión completa confiable)
    if (btnDiscard) {
      btnDiscard.addEventListener('click', () => {
        if (confirm('¿Descartar los cambios no guardados y restaurar el contenido guardado?')) {
          discardUnsavedChanges();
        }
      });
    }

    // 4. Publicar Cambios (Guarda Contenido CMS y Productos en Inventario)
    if (btnPublish) {
      btnPublish.addEventListener('click', () => {
        // Cosechar textos actuales de todos los elementos
        editableElements.forEach(el => {
          const key = el.getAttribute('data-cms-key');
          if (key) {
            studioState.texts[key] = el.innerHTML.trim();
          }
        });

        const bundleToSave = {
          texts: studioState.texts,
          styles: studioState.styles,
          images: studioState.images,
          theme: studioState.theme,
          productEdits: studioState.productEdits,
          ...studioState.texts, // Fallback plano para máxima compatibilidad
          lastUpdated: new Date().toISOString()
        };

        // Guardar contenido visual CMS de la tienda
        if (window.appStore && typeof window.appStore.saveStorefrontContent === 'function') {
          window.appStore.saveStorefrontContent(bundleToSave);
        } else {
          try {
            const current = JSON.parse(localStorage.getItem('ac_storefront_custom_content') || '{}');
            localStorage.setItem('ac_storefront_custom_content', JSON.stringify({ ...current, ...bundleToSave }));
          } catch (e) {
            console.error(e);
          }
        }

        // Guardar productos modificados en la vitrina directamente en el stock/inventario central
        if (window.appStore && typeof window.appStore.saveProduct === 'function') {
          Object.entries(studioState.productEdits).forEach(([prodId, edits]) => {
            const prod = window.appStore.getProductById(prodId);
            if (prod) {
              const updatedProduct = {
                ...prod,
                name: edits.name || prod.name,
                description: edits.description || prod.description,
                origin: edits.origin || prod.origin,
                image: edits.image || prod.image
              };
              window.appStore.saveProduct(updatedProduct);
            }
          });
        }

        // Limpiar stack de deshacer ya que se persistió
        undoStack.length = 0;
        updateUndoBtnState();

        showToast('¡Página Web y Catálogo Actualizados con Éxito! Los cambios ya están en vivo.');
      });
    }

    // 5. Salir del modo editor
    if (btnExit) {
      btnExit.addEventListener('click', () => {
        sessionStorage.removeItem('ac_admin_editor_session');
        localStorage.removeItem('ac_admin_editor_session');
        window.location.href = 'tienda.html';
      });
    }

    // Seleccionar por defecto el titular hero al abrir el editor
    const firstHeadline = document.querySelector('[data-cms-key="hero_headline"]');
    if (firstHeadline) selectTextElement(firstHeadline);
    updateUndoBtnState();
  }

  // Inicializar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
