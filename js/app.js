// =============================================================================
// AMOR & CACAO - APLICACIÓN PRINCIPAL (APP.JS)
// Arquitectura con Sidebar Derecho, Dashboard Inicial, Pedidos Web,
// Calendario Integrado, Sistema de Roles (Admin/Ventas) y Responsive Design
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  const store = window.appStore;

  // Estado Local de la Sesión y Filtros
  const state = {
    currentTab: 'tab-dashboard',
    isAdminMode: true,
    currentUser: store.getCurrentUser(),
    posCategory: 'todos',
    posSearchQuery: '',
    cart: [],
    clientCart: [],
    clientCategory: 'todos',
    invCategory: 'todos',
    invSearchQuery: '',
    financePeriod: 'all',
    webOrderStatusFilter: 'all',
    webOrderSearchQuery: '',
    calendarDate: new Date(),
    selectedCalendarDateStr: new Date().toISOString().split('T')[0],
    lastSaleRecord: null
  };

  // ===========================================================================
  // SISTEMA DE NOTIFICACIONES TOAST
  // ===========================================================================
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-msg toast-${type}`;
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✨';
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // ===========================================================================
  // AUTENTICACIÓN, USUARIOS & CONTROL DE ROLES (RBAC)
  // ===========================================================================
  function initAuth() {
    updateUserDisplay();

    // Botones para abrir modal de inicio de sesión / cambio de usuario
    const userBadge = document.getElementById('btnOpenUserModal');
    const sidebarCard = document.getElementById('sidebarUserCard');
    if (userBadge) userBadge.addEventListener('click', openLoginModal);
    if (sidebarCard) sidebarCard.addEventListener('click', openLoginModal);

    // Accesos rápidos de login
    const btnAdmin = document.getElementById('btnQuickLoginAdmin');
    const btnSales = document.getElementById('btnQuickLoginSales');

    if (btnAdmin) {
      btnAdmin.addEventListener('click', () => {
        tryLogin('admin', '1234');
      });
    }

    if (btnSales) {
      btnSales.addEventListener('click', () => {
        tryLogin('ventas', '1234');
      });
    }

    // Formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const u = document.getElementById('loginUsername').value.trim();
        const p = document.getElementById('loginPin').value.trim();
        tryLogin(u, p);
      });
    }

    // Configuración de nuevo usuario
    const btnNewUser = document.getElementById('btnOpenNewUserModal');
    if (btnNewUser) {
      btnNewUser.addEventListener('click', () => openUserModal());
    }

    const userForm = document.getElementById('userForm');
    if (userForm) {
      userForm.addEventListener('submit', handleUserFormSubmit);
    }
  }

  function tryLogin(username, pin) {
    try {
      const user = store.login(username, pin);
      state.currentUser = user;
      updateUserDisplay();
      applyRolePermissions();
      const loginModal = document.getElementById('loginModal');
      if (loginModal) loginModal.close();
      showToast(`¡Bienvenido/a, ${user.name}! (${user.role === 'admin' ? 'Administrador' : 'Personal de Ventas'})`, 'success');

      // Si el rol es ventas y estaba en pestaña restringida, enviarlo a Pedidos Web o POS
      if (user.role === 'sales' && (state.currentTab === 'tab-dashboard' || state.currentTab === 'tab-settings' || state.currentTab === 'tab-storefront-editor')) {
        switchTab('tab-web-orders');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  function updateUserDisplay() {
    const user = store.getCurrentUser();
    state.currentUser = user;

    const hAvatar = document.getElementById('headerUserAvatar');
    const hName = document.getElementById('headerUserName');
    const hRole = document.getElementById('headerUserRole');

    const sAvatar = document.getElementById('sidebarUserAvatar');
    const sName = document.getElementById('sidebarUserName');
    const sRole = document.getElementById('sidebarUserRole');

    const roleName = user.role === 'admin' ? 'ADMIN' : 'VENTAS';
    const roleClass = user.role === 'admin' ? 'admin' : 'sales';

    if (hAvatar) hAvatar.textContent = user.avatar || (user.role === 'admin' ? '👑' : '💼');
    if (hName) hName.textContent = user.name;
    if (hRole) {
      hRole.textContent = roleName;
      hRole.className = `user-role-tag ${roleClass}`;
    }

    if (sAvatar) sAvatar.textContent = user.avatar || (user.role === 'admin' ? '👑' : '💼');
    if (sName) sName.textContent = user.name;
    if (sRole) {
      sRole.textContent = roleName;
      sRole.className = `user-role-tag ${roleClass}`;
    }

    renderUsersList();
  }

  function applyRolePermissions() {
    const user = store.getCurrentUser();
    const isSales = user.role === 'sales';

    const btnDashboard = document.getElementById('navBtnDashboard');
    const btnSettings = document.getElementById('navBtnSettings');
    const btnInventory = document.getElementById('navBtnInventory');
    const btnEditor = document.getElementById('navBtnStorefrontEditor');

    if (btnDashboard) {
      btnDashboard.classList.toggle('restricted', isSales);
      btnDashboard.title = isSales ? 'Acceso restringido a Administradores' : 'Dashboard Financiero';
    }

    if (btnSettings) {
      btnSettings.classList.toggle('restricted', isSales);
      btnSettings.title = isSales ? 'Acceso restringido a Administradores' : 'Configuración de Sistema y Usuarios';
    }

    if (btnEditor) {
      btnEditor.classList.toggle('restricted', isSales);
      btnEditor.title = isSales ? 'Acceso restringido a Administradores' : '🎨 Editor Tienda Web';
    }
  }

  function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
      document.getElementById('loginUsername').value = '';
      document.getElementById('loginPin').value = '';
      modal.showModal();
    }
  }

  function openUserModal(userId = null) {
    const modal = document.getElementById('userModal');
    const form = document.getElementById('userForm');
    const title = document.getElementById('userModalTitle');

    form.reset();
    document.getElementById('userEditId').value = '';

    if (userId) {
      const user = store.getUsers().find(u => u.id === userId);
      if (!user) return;
      title.textContent = '✏️ Editar Usuario';
      document.getElementById('userEditId').value = user.id;
      document.getElementById('userNameInput').value = user.name;
      document.getElementById('userUsernameInput').value = user.username;
      document.getElementById('userPinInput').value = user.pin;
      document.getElementById('userEmailInput').value = user.email || '';
      document.getElementById('userRoleInput').value = user.role;
    } else {
      title.textContent = '➕ Nuevo Usuario de Plataforma';
    }

    modal.showModal();
  }

  function handleUserFormSubmit(e) {
    e.preventDefault();
    const editId = document.getElementById('userEditId').value;
    const userData = {
      id: editId || null,
      name: document.getElementById('userNameInput').value.trim(),
      username: document.getElementById('userUsernameInput').value.trim(),
      pin: document.getElementById('userPinInput').value.trim(),
      email: document.getElementById('userEmailInput').value.trim(),
      role: document.getElementById('userRoleInput').value
    };

    store.saveUser(userData);
    document.getElementById('userModal').close();
    showToast(`Usuario "${userData.name}" guardado correctamente`, 'success');
    renderUsersList();
  }

  function renderUsersList() {
    const container = document.getElementById('usersListContainer');
    if (!container) return;

    const users = store.getUsers();
    container.innerHTML = users.map(u => `
      <div class="user-card-item">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span style="font-size: 1.5rem;">${u.avatar || (u.role === 'admin' ? '👑' : '💼')}</span>
          <div>
            <strong style="font-size: 0.9rem; color: var(--cacao-950);">${u.name}</strong>
            <div style="font-size: 0.75rem; color: var(--text-muted);">
              @${u.username} | ${u.email || 'Sin correo'}
            </div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <span class="user-role-tag ${u.role}">${u.role === 'admin' ? 'Administrador' : 'Personal Ventas'}</span>
          <button class="btn-icon" data-edit-user="${u.id}" title="Editar">✏️</button>
          <button class="btn-icon danger" data-delete-user="${u.id}" title="Eliminar">🗑️</button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('[data-edit-user]').forEach(btn => {
      btn.addEventListener('click', () => openUserModal(btn.getAttribute('data-edit-user')));
    });

    container.querySelectorAll('[data-delete-user]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-delete-user');
        try {
          if (confirm('¿Está seguro de eliminar este usuario?')) {
            store.deleteUser(id);
            showToast('Usuario eliminado', 'info');
            renderUsersList();
          }
        } catch (err) {
          showToast(err.message, 'error');
        }
      });
    });
  }

  // ===========================================================================
  // NAVEGACIÓN Y MENÚ RESPONSIVE (SIDEBAR PERMANENTE IZQUIERDO)
  // ===========================================================================
  function initNavigation() {
    const sidebarButtons = document.querySelectorAll('.sidebar-nav-btn');
    sidebarButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        const user = store.getCurrentUser();

        // Control de permisos para Personal de Ventas
        if (user.role === 'sales' && (targetTab === 'tab-dashboard' || targetTab === 'tab-settings' || targetTab === 'tab-storefront-editor')) {
          showToast('Acceso restringido: El personal de ventas no tiene permisos para este módulo confidencial.', 'warning');
          return;
        }

        switchTab(targetTab);
        closeMobileDrawer();
      });
    });

    // Toggle para Colapsar/Reducir Sidebar al hacer clic en el Logo
    // "Cuando presione el logo quiero que el panel se reduzca y solo salga los símbolos de cada módulo"
    const btnCollapse = document.getElementById('btnToggleSidebarCollapse');
    const logoImg = document.getElementById('sidebarLogoImg');

    if (btnCollapse) {
      btnCollapse.addEventListener('click', (e) => {
        toggleSidebarCollapse();
      });
      btnCollapse.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleSidebarCollapse();
        }
      });
    }

    // Restaurar estado guardado de colapso en pantallas de escritorio
    if (window.innerWidth > 980) {
      const savedCollapsed = localStorage.getItem('amor_cacao_sidebar_collapsed');
      if (savedCollapsed === 'true') {
        const sidebar = document.getElementById('appSidebar');
        const badge = document.getElementById('sidebarCollapseBadge');
        if (sidebar) sidebar.classList.add('collapsed');
        if (badge) badge.textContent = '▶';
      }
    }

    // Menú móvil (Drawer lateral)
    const btnMobile = document.getElementById('btnToggleMobileMenu');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (btnMobile) {
      btnMobile.addEventListener('click', toggleMobileDrawer);
    }
    if (backdrop) {
      backdrop.addEventListener('click', closeMobileDrawer);
    }

    // Toggle modo cliente
    const btnToggleMode = document.getElementById('btnToggleMode');
    if (btnToggleMode) {
      btnToggleMode.addEventListener('click', toggleClientMode);
    }
  }

  function toggleSidebarCollapse() {
    const sidebar = document.getElementById('appSidebar') || document.getElementById('rightSidebar');
    if (!sidebar) return;

    // En pantallas pequeñas (< 980px), el logo no colapsa a iconos sino que cierra el drawer
    if (window.innerWidth <= 980) {
      closeMobileDrawer();
      return;
    }

    const isCollapsed = sidebar.classList.toggle('collapsed');
    const badge = document.getElementById('sidebarCollapseBadge');
    if (badge) {
      badge.textContent = isCollapsed ? '▶' : '◀';
    }

    localStorage.setItem('amor_cacao_sidebar_collapsed', isCollapsed ? 'true' : 'false');
    showToast(isCollapsed ? 'Panel reducido a iconos' : 'Panel expandido', 'info');
  }

  function toggleMobileDrawer() {
    const sidebar = document.getElementById('appSidebar') || document.getElementById('rightSidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (sidebar) sidebar.classList.toggle('drawer-open');
    if (backdrop) backdrop.classList.toggle('active');
  }

  function closeMobileDrawer() {
    const sidebar = document.getElementById('appSidebar') || document.getElementById('rightSidebar');
    const backdrop = document.getElementById('sidebarBackdrop');
    if (sidebar) sidebar.classList.remove('drawer-open');
    if (backdrop) backdrop.classList.remove('active');
  }

  function switchTab(tabId) {
    state.currentTab = tabId;

    document.querySelectorAll('.sidebar-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });

    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === tabId);
    });

    // Actualizar subtítulo en el encabezado
    const tabTitles = {
      'tab-dashboard': '📊 Dashboard Ejecutivo',
      'tab-web-orders': '🌐 Pedidos Web & Pagos',
      'tab-pos': '🛒 Punto de Venta (POS)',
      'tab-calendar': '📅 Calendario de Entregas',
      'tab-inventory': '📦 Inventario & Costos',
      'tab-cash': '💵 Control de Caja & Arqueo',
      'tab-orders': '🎂 Pedidos Especiales',
      'tab-settings': '⚙️ Configuración de Sistema',
      'tab-storefront': '🛍️ Menú Digital de Clientes',
      'tab-storefront-editor': '🎨 Editor Tienda Web'
    };
    const subTitleEl = document.getElementById('headerActiveTabTitle');
    if (subTitleEl && tabTitles[tabId]) {
      subTitleEl.textContent = tabTitles[tabId];
    }

    // Cargar o actualizar contenido del módulo correspondiente
    if (tabId === 'tab-dashboard') renderFinanceDashboard();
    if (tabId === 'tab-web-orders') renderWebOrders();
    if (tabId === 'tab-pos') renderPosCatalog();
    if (tabId === 'tab-calendar') renderCalendar();
    if (tabId === 'tab-inventory') renderInventory();
    if (tabId === 'tab-cash') renderCashShift();
    if (tabId === 'tab-orders') renderSpecialOrders();
    if (tabId === 'tab-settings') renderUsersList();
    if (tabId === 'tab-storefront') renderClientStorefront();
    if (tabId === 'tab-storefront-editor') renderStorefrontEditorModule();
  }

  function toggleClientMode() {
    window.open('tienda.html', '_blank');
  }

  // ===========================================================================
  // MÓDULO 2: PANEL DE PEDIDOS WEB (RIGUROSO - CONFIRMACIÓN DE PAGO)
  // ===========================================================================
  function initWebOrders() {
    renderWebOrders();

    // Filtros de estado
    const filterContainer = document.getElementById('webOrdersFilterPills');
    if (filterContainer) {
      filterContainer.querySelectorAll('.cat-pill-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          filterContainer.querySelectorAll('.cat-pill-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          state.webOrderStatusFilter = btn.getAttribute('data-web-status');
          renderWebOrders();
        });
      });
    }

    // Buscador
    const searchInput = document.getElementById('webOrdersSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.webOrderSearchQuery = e.target.value.toLowerCase().trim();
        renderWebOrders();
      });
    }

    // Simular Pedido Web de Prueba
    const btnSimulate = document.getElementById('btnSimulateWebOrder');
    if (btnSimulate) {
      btnSimulate.addEventListener('click', () => {
        const dummyOrder = {
          customer: 'Mariana Zavaleta',
          whatsapp: '+51 981 223 344',
          address: 'Av. Bolognesi 415, Tacna',
          deliveryDate: new Date(Date.now() + 86400 * 1000).toISOString().split('T')[0],
          deliveryTime: '17:00',
          paymentMethod: 'Yape / Plin',
          paymentDeclaredProof: 'Yape de Mariana Z. - Operación #55129',
          items: [
            { id: 'prod-1', name: 'Caja Selección Bombones de Autor (12 uds)', quantity: 1, price: 68.00 },
            { id: 'prod-6', name: 'Cheesecake Horneado de Frutos Rojos & Cacao', quantity: 2, price: 18.50 }
          ],
          deliveryFee: 10.00,
          notes: 'Incluir nota: ¡Feliz Aniversario Amor!'
        };
        store.createWebOrder(dummyOrder);
        showToast('Pedido web de prueba recibido y registrado', 'success');
      });
    }

    // Formulario de Cancelación
    const cancelForm = document.getElementById('cancelOrderForm');
    if (cancelForm) {
      cancelForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const orderId = document.getElementById('cancelOrderId').value;
        const reason = document.getElementById('cancelReasonInput').value.trim();
        try {
          store.cancelWebOrder(orderId, reason);
          document.getElementById('cancelOrderModal').close();
          showToast(`Pedido ${orderId} cancelado y sincronizado`, 'info');
        } catch (err) {
          showToast(err.message, 'error');
        }
      });
    }
  }

  function renderWebOrders() {
    const container = document.getElementById('webOrdersListContainer');
    const badge = document.getElementById('navWebOrdersBadge');
    if (!container) return;

    const orders = store.getWebOrders();

    // Actualizar badge de pendientes de pago
    const pendingVerificationCount = orders.filter(o => o.paymentStatus === 'pending_verification').length;
    if (badge) {
      badge.textContent = pendingVerificationCount;
      badge.style.display = pendingVerificationCount > 0 ? 'inline-block' : 'none';
    }

    // Filtrar
    const filtered = orders.filter(o => {
      let matchesStatus = true;
      if (state.webOrderStatusFilter === 'pending_verification') matchesStatus = o.paymentStatus === 'pending_verification';
      else if (state.webOrderStatusFilter === 'verified') matchesStatus = o.paymentStatus === 'verified';
      else if (state.webOrderStatusFilter === 'in_prep') matchesStatus = o.orderStatus === 'in_prep';
      else if (state.webOrderStatusFilter === 'ready') matchesStatus = o.orderStatus === 'ready';
      else if (state.webOrderStatusFilter === 'cancelled') matchesStatus = o.orderStatus === 'cancelled' || o.paymentStatus === 'cancelled';

      const q = state.webOrderSearchQuery;
      const matchesSearch = !q || 
        (o.customer && o.customer.toLowerCase().includes(q)) ||
        (o.whatsapp && o.whatsapp.includes(q)) ||
        (o.orderNumber && o.orderNumber.toLowerCase().includes(q));

      return matchesStatus && matchesSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--text-light);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🌐</div>
          <p>No se encontraron pedidos web en esta categoría.</p>
        </div>
      `;
      return;
    }

    const paymentBadges = {
      pending_verification: { label: '⚠️ PENDIENTE DE PAGO', class: 'pending_verification' },
      verified: { label: '✅ PAGO VERIFICADO', class: 'verified' },
      cancelled: { label: '❌ PAGO CANCELADO', class: 'cancelled' }
    };

    container.innerHTML = filtered.map(order => {
      const pBadge = paymentBadges[order.paymentStatus] || { label: order.paymentStatus, class: 'pending_verification' };
      const cleanPhone = (order.whatsapp || '').replace(/[^0-9]/g, '');
      const isPending = order.paymentStatus === 'pending_verification';
      const isCancelled = order.orderStatus === 'cancelled' || order.paymentStatus === 'cancelled';

      return `
        <div class="web-order-card" id="card-${order.id}">
          <div class="web-order-header">
            <div>
              <strong style="font-size: 1.1rem; color: var(--cacao-950);">${order.orderNumber}</strong>
              <span style="font-size: 0.8rem; color: var(--text-light); margin-left: 0.5rem;">
                ${new Date(order.createdAt).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })}
              </span>
            </div>
            <div class="web-order-badges">
              <span class="badge-payment ${pBadge.class}">${pBadge.label}</span>
              ${order.verifiedBy ? `<span style="font-size: 0.72rem; color: var(--success); font-weight: 600;">(Verificado por: ${order.verifiedBy})</span>` : ''}
            </div>
          </div>

          <div class="web-order-body">
            <!-- Datos del Cliente y WhatsApp -->
            <div class="customer-info-box">
              <h4>👤 ${order.customer}</h4>
              <div style="margin: 0.35rem 0;">
                <a href="https://wa.me/${cleanPhone}" target="_blank" class="btn-whatsapp-chat" title="Abrir chat directo en WhatsApp">
                  <span>💬</span>
                  <span>${order.whatsapp || 'Sin WhatsApp'}</span>
                </a>
              </div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.3rem;">
                📍 <strong>Destino:</strong> ${order.address || 'Recojo en Tienda'}
              </div>
              <div style="font-size: 0.8rem; color: var(--caramel-primary); font-weight: 600; margin-top: 0.2rem;">
                📅 <strong>Fecha deseada:</strong> ${order.deliveryDate} a las ${order.deliveryTime || '16:00'}
              </div>
              ${order.notes ? `
                <div style="font-size: 0.78rem; background: var(--cream-100); padding: 0.4rem 0.6rem; border-radius: 4px; margin-top: 0.4rem; border-left: 3px solid var(--caramel-primary);">
                  💌 <strong>Dedicatoria/Nota:</strong> ${order.notes}
                </div>
              ` : ''}
            </div>

            <!-- Desglose del Pedido y Pago Declarado -->
            <div>
              <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.3rem;">
                Detalle del Pedido:
              </div>
              <table class="web-order-items-table">
                ${(order.items || []).map(it => `
                  <tr>
                    <td><strong>${it.quantity}x</strong> ${it.name}</td>
                    <td style="text-align: right;">${store.formatMoney(it.price * it.quantity)}</td>
                  </tr>
                `).join('')}
                ${order.deliveryFee > 0 ? `
                  <tr style="color: var(--text-muted);">
                    <td>Delivery:</td>
                    <td style="text-align: right;">+${store.formatMoney(order.deliveryFee)}</td>
                  </tr>
                ` : ''}
                <tr style="border-top: 1px dashed var(--border-accent); font-weight: 800; font-size: 0.95rem;">
                  <td style="padding-top: 0.3rem;">TOTAL:</td>
                  <td style="padding-top: 0.3rem; text-align: right; color: var(--cacao-950); font-family: var(--font-serif);">
                    ${store.formatMoney(order.total)}
                  </td>
                </tr>
              </table>

              <div style="margin-top: 0.5rem; font-size: 0.76rem; background: white; padding: 0.4rem 0.6rem; border-radius: 4px; border: 1px solid var(--border-subtle);">
                <strong>💳 Pago Reportado:</strong> ${order.paymentMethod}
                <div style="color: var(--text-muted);">${order.paymentDeclaredProof || ''}</div>
              </div>

              ${order.cancellationReason ? `
                <div style="margin-top: 0.4rem; font-size: 0.76rem; color: var(--danger); background: var(--danger-bg); padding: 0.35rem 0.6rem; border-radius: 4px;">
                  ❌ <strong>Motivo cancelación:</strong> ${order.cancellationReason}
                </div>
              ` : ''}
            </div>
          </div>

          <!-- Acciones de Verificación y Estados -->
          <div class="web-order-actions">
            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
              ${isPending ? `
                <button class="btn-confirm-payment" data-confirm-pay="${order.id}">
                  <span>💰</span>
                  <span>Confirmar Pago Recibido</span>
                </button>
              ` : ''}

              ${!isCancelled ? `
                <button class="btn-cancel-order" data-cancel-order="${order.id}">
                  <span>❌ Cancelar Pedido</span>
                </button>
              ` : ''}

              <a href="https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hola ${order.customer}, te saludamos de Amor & Cacao sobre tu pedido ${order.orderNumber}...`)}" target="_blank" class="btn-secondary" style="font-size: 0.8rem;">
                <span>💬 Mensaje WhatsApp</span>
              </a>
            </div>

            <!-- Selector de Estado de Elaboración -->
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <span style="font-size: 0.78rem; font-weight: 600;">Estado:</span>
              <select class="form-control" style="width: auto; font-size: 0.8rem; padding: 0.35rem 0.6rem;" data-web-order-status="${order.id}">
                <option value="pending" ${order.orderStatus === 'pending' ? 'selected' : ''}>⏳ Pendiente</option>
                <option value="in_prep" ${order.orderStatus === 'in_prep' ? 'selected' : ''}>🥣 En Preparación</option>
                <option value="ready" ${order.orderStatus === 'ready' ? 'selected' : ''}>✨ Listo para Entrega</option>
                <option value="delivered" ${order.orderStatus === 'delivered' ? 'selected' : ''}>✅ Entregado</option>
                <option value="cancelled" ${order.orderStatus === 'cancelled' ? 'selected' : ''}>❌ Cancelado</option>
              </select>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Listeners para confirmar pago
    container.querySelectorAll('[data-confirm-pay]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-confirm-pay');
        if (confirm('¿Confirma que verificó la recepción del dinero en la cuenta o Yape?')) {
          try {
            store.confirmWebOrderPayment(id);
            showToast('¡Pago verificado con éxito! Stock descontado y venta registrada.', 'success');
          } catch (e) {
            showToast(e.message, 'error');
          }
        }
      });
    });

    // Cancelar pedido
    container.querySelectorAll('[data-cancel-order]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-cancel-order');
        document.getElementById('cancelOrderId').value = id;
        document.getElementById('cancelReasonInput').value = '';
        document.getElementById('cancelOrderModal').showModal();
      });
    });

    // Cambio de estado
    container.querySelectorAll('[data-web-order-status]').forEach(select => {
      select.addEventListener('change', (e) => {
        const id = select.getAttribute('data-web-order-status');
        const newStatus = e.target.value;
        store.updateWebOrderStatus(id, newStatus);
        showToast(`Estado del pedido ${id} actualizado a ${newStatus}`, 'info');
      });
    });
  }

  // ===========================================================================
  // MÓDULO 4: CALENDARIO INTEGRADO DE ENTREGAS
  // ===========================================================================
  function initCalendar() {
    renderCalendar();

    document.getElementById('btnCalendarPrev').addEventListener('click', () => {
      state.calendarDate.setMonth(state.calendarDate.getMonth() - 1);
      renderCalendar();
    });

    document.getElementById('btnCalendarNext').addEventListener('click', () => {
      state.calendarDate.setMonth(state.calendarDate.getMonth() + 1);
      renderCalendar();
    });

    document.getElementById('btnCalendarToday').addEventListener('click', () => {
      state.calendarDate = new Date();
      state.selectedCalendarDateStr = new Date().toISOString().split('T')[0];
      renderCalendar();
    });

    document.getElementById('btnCalendarNewDelivery').addEventListener('click', () => {
      openOrderModal();
    });

    // Formulario de edición de entrega
    const deliveryEditForm = document.getElementById('deliveryEditForm');
    if (deliveryEditForm) {
      deliveryEditForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const source = document.getElementById('editDeliverySource').value;
        const id = document.getElementById('editDeliveryId').value;
        const updates = {
          customer: document.getElementById('editDeliveryCustomer').value.trim(),
          phone: document.getElementById('editDeliveryPhone').value.trim(),
          scheduledDate: document.getElementById('editDeliveryDate').value,
          scheduledTime: document.getElementById('editDeliveryTime').value,
          notes: document.getElementById('editDeliveryNotes').value.trim(),
          totalAmount: Number(document.getElementById('editDeliveryTotal').value),
          status: document.getElementById('editDeliveryStatus').value
        };

        store.updateCalendarDelivery(source, id, updates);
        document.getElementById('deliveryEditModal').close();
        showToast('Entrega actualizada en el calendario', 'success');
        renderCalendar();
      });
    }
  }

  function renderCalendar() {
    const grid = document.getElementById('calendarDaysGrid');
    const monthTitle = document.getElementById('calendarMonthTitle');
    const navBadge = document.getElementById('navCalendarBadge');
    if (!grid) return;

    const year = state.calendarDate.getFullYear();
    const month = state.calendarDate.getMonth();

    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    monthTitle.textContent = `${monthNames[month]} ${year}`;

    const deliveries = store.getCalendarDeliveries();
    const todayStr = new Date().toISOString().split('T')[0];

    // Badge en sidebar: entregas hoy
    const todayDeliveries = deliveries.filter(d => d.scheduledDate === todayStr && d.status !== 'delivered' && d.status !== 'cancelled');
    if (navBadge) {
      navBadge.textContent = todayDeliveries.length;
      navBadge.style.display = todayDeliveries.length > 0 ? 'inline-block' : 'none';
    }

    // Calcular días
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Ajustar primer día de la semana (Lunes = 0, ..., Domingo = 6)
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const totalDays = lastDay.getDate();

    // Días del mes anterior para relleno
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    let gridHtml = `
      <div class="calendar-day-header">Lun</div>
      <div class="calendar-day-header">Mar</div>
      <div class="calendar-day-header">Mié</div>
      <div class="calendar-day-header">Jue</div>
      <div class="calendar-day-header">Vie</div>
      <div class="calendar-day-header">Sáb</div>
      <div class="calendar-day-header">Dom</div>
    `;

    // Celdas del mes anterior
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dNum = prevMonthLastDay - i;
      gridHtml += `<div class="calendar-cell other-month"><span class="calendar-cell-num">${dNum}</span></div>`;
    }

    // Celdas del mes actual
    for (let day = 1; day <= totalDays; day++) {
      const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isToday = dayStr === todayStr;
      const isSelected = dayStr === state.selectedCalendarDateStr;

      const dayDeliveries = deliveries.filter(d => d.scheduledDate === dayStr && d.status !== 'cancelled');

      gridHtml += `
        <div class="calendar-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" data-calendar-day="${dayStr}">
          <span class="calendar-cell-num">${day}</span>
          ${dayDeliveries.slice(0, 2).map(d => `
            <div class="calendar-event-dot ${d.sourceType}" title="${d.customer} - ${d.scheduledTime}">
              ${d.scheduledTime || ''} ${d.customer.split(' ')[0]}
            </div>
          `).join('')}
          ${dayDeliveries.length > 2 ? `
            <div style="font-size: 0.65rem; color: var(--caramel-primary); font-weight: 700; margin-top: 0.1rem;">
              +${dayDeliveries.length - 2} más
            </div>
          ` : ''}
        </div>
      `;
    }

    // Celdas sobrantes para cerrar grilla
    const totalCellsFilled = startDayOfWeek + totalDays;
    const remaining = (7 - (totalCellsFilled % 7)) % 7;
    for (let j = 1; j <= remaining; j++) {
      gridHtml += `<div class="calendar-cell other-month"><span class="calendar-cell-num">${j}</span></div>`;
    }

    grid.innerHTML = gridHtml;

    // Listeners de clics en días
    grid.querySelectorAll('[data-calendar-day]').forEach(cell => {
      cell.addEventListener('click', () => {
        state.selectedCalendarDateStr = cell.getAttribute('data-calendar-day');
        renderCalendar();
      });
    });

    renderDayDeliveriesList();
  }

  function renderDayDeliveriesList() {
    const listEl = document.getElementById('dayDeliveriesList');
    const titleEl = document.getElementById('selectedDateTitle');
    const countBadge = document.getElementById('selectedDateCountBadge');
    if (!listEl) return;

    const dateStr = state.selectedCalendarDateStr;
    const [y, m, d] = dateStr.split('-');
    titleEl.textContent = `Entregas: ${d}/${m}/${y}`;

    const deliveries = store.getCalendarDeliveries().filter(d => d.scheduledDate === dateStr);
    countBadge.textContent = `${deliveries.length} entregas`;

    if (deliveries.length === 0) {
      listEl.innerHTML = `
        <div style="text-align: center; padding: 2rem 0; color: var(--text-light);">
          <div style="font-size: 2rem; margin-bottom: 0.3rem;">📅</div>
          <p style="font-size: 0.85rem;">No hay entregas programadas para esta fecha.</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = deliveries.map(deliv => {
      const cleanPhone = (deliv.phone || '').replace(/[^0-9]/g, '');
      return `
        <div class="delivery-item-card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <strong style="font-size: 0.95rem; color: var(--cacao-950);">${deliv.customer}</strong>
              <div style="font-size: 0.78rem; color: var(--text-light);">⏰ Hora: ${deliv.scheduledTime}</div>
            </div>
            <span class="status-badge in-stock" style="font-size: 0.7rem;">${deliv.status.toUpperCase()}</span>
          </div>

          <div style="font-size: 0.82rem; color: var(--text-dark); margin: 0.2rem 0;">
            📦 <strong>Pedido:</strong> ${deliv.details || deliv.title}
          </div>

          ${deliv.notes ? `
            <div style="font-size: 0.76rem; color: var(--text-muted); background: white; padding: 0.35rem 0.5rem; border-radius: 4px; border: 1px solid var(--border-subtle);">
              📝 ${deliv.notes}
            </div>
          ` : ''}

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.3rem; font-size: 0.85rem;">
            <span>Monto Total: <strong>${store.formatMoney(deliv.totalAmount)}</strong></span>
            <div style="display: flex; gap: 0.35rem;">
              <a href="https://wa.me/${cleanPhone}" target="_blank" class="btn-icon" title="Abrir WhatsApp">💬</a>
              <button class="btn-icon" data-edit-delivery="${deliv.sourceType}:${deliv.id}" title="Editar">✏️</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    listEl.querySelectorAll('[data-edit-delivery]').forEach(btn => {
      btn.addEventListener('click', () => {
        const [source, id] = btn.getAttribute('data-edit-delivery').split(':');
        openDeliveryEditModal(source, id);
      });
    });
  }

  function openDeliveryEditModal(source, id) {
    const deliveries = store.getCalendarDeliveries();
    const item = deliveries.find(d => d.sourceType === source && d.id === id);
    if (!item) return;

    document.getElementById('editDeliverySource').value = source;
    document.getElementById('editDeliveryId').value = id;
    document.getElementById('editDeliveryCustomer').value = item.customer;
    document.getElementById('editDeliveryPhone').value = item.phone;
    document.getElementById('editDeliveryDate').value = item.scheduledDate;
    document.getElementById('editDeliveryTime').value = item.scheduledTime;
    document.getElementById('editDeliveryNotes').value = item.notes || '';
    document.getElementById('editDeliveryTotal').value = item.totalAmount;
    document.getElementById('editDeliveryStatus').value = item.status || 'pending';

    document.getElementById('deliveryEditModal').showModal();
  }

  // ===========================================================================
  // MÓDULO 3: PUNTO DE VENTA (POS)
  // ===========================================================================
  function initPos() {
    renderPosCategories();
    renderPosCatalog();
    renderCart();

    const searchInput = document.getElementById('posSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.posSearchQuery = e.target.value.toLowerCase().trim();
        renderPosCatalog();
      });
    }

    const discountInput = document.getElementById('cartDiscountInput');
    if (discountInput) {
      discountInput.addEventListener('input', () => renderCart());
    }

    const btnClear = document.getElementById('btnClearCart');
    if (btnClear) {
      btnClear.addEventListener('click', () => {
        if (state.cart.length > 0) {
          state.cart = [];
          renderCart();
          showToast('Carrito vaciado', 'info');
        }
      });
    }

    const btnCheckout = document.getElementById('btnOpenCheckout');
    if (btnCheckout) {
      btnCheckout.addEventListener('click', openCheckoutModal);
    }
  }

  function renderPosCategories() {
    const container = document.getElementById('posCategoryPills');
    if (!container) return;

    container.innerHTML = INITIAL_CATEGORIES.map(cat => `
      <button class="cat-pill-btn ${cat.id === state.posCategory ? 'active' : ''}" data-category="${cat.id}">
        <span>${cat.icon}</span>
        <span>${cat.name}</span>
      </button>
    `).join('');

    container.querySelectorAll('.cat-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.posCategory = btn.getAttribute('data-category');
        renderPosCategories();
        renderPosCatalog();
      });
    });
  }

  function renderPosCatalog() {
    const grid = document.getElementById('posProductsGrid');
    const itemsCountEl = document.getElementById('posItemsCount');
    if (!grid) return;

    const products = store.getProducts();
    const filtered = products.filter(p => {
      const matchCat = state.posCategory === 'todos' || p.category === state.posCategory;
      const matchQuery = !state.posSearchQuery || 
        p.name.toLowerCase().includes(state.posSearchQuery) ||
        (p.sku && p.sku.toLowerCase().includes(state.posSearchQuery));
      return matchCat && matchQuery;
    });

    if (itemsCountEl) itemsCountEl.textContent = `${filtered.length} productos en vitrina`;

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-light);">
          <p>No se encontraron productos con ese criterio.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(prod => {
      let stockClass = 'in-stock';
      let stockLabel = `${prod.stock} disp.`;
      if (prod.stock <= 0) {
        stockClass = 'out-stock';
        stockLabel = 'Agotado';
      } else if (prod.stock <= prod.minStock) {
        stockClass = 'low-stock';
        stockLabel = `Stock bajo (${prod.stock})`;
      }

      return `
        <div class="product-card" data-product-id="${prod.id}" title="Haga clic para agregar a la venta">
          <div class="product-card-img-wrap">
            <img src="${prod.image || 'assets/products/caja_bombones.jpg'}" alt="${prod.name}" class="product-card-img" loading="lazy">
            <span class="stock-tag ${stockClass}">${stockLabel}</span>
          </div>
          <div class="product-card-body">
            <span class="product-sku">${prod.sku || 'ARTISAN'}</span>
            <h3 class="product-title">${prod.name}</h3>
            <div class="product-pricing">
              <span class="product-price">${store.formatMoney(prod.price)}</span>
              <span class="product-margin-pill">+${store.formatMoney(prod.price - prod.cost)}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', () => {
        addToCart(card.getAttribute('data-product-id'));
      });
    });
  }

  function addToCart(productId) {
    const prod = store.getProductById(productId);
    if (!prod) return;

    if (prod.stock <= 0) {
      showToast(`"${prod.name}" está agotado en inventario`, 'error');
      return;
    }

    const existing = state.cart.find(it => it.id === prod.id);
    if (existing) {
      if (existing.quantity >= prod.stock) {
        showToast(`Stock máximo disponible: ${prod.stock}`, 'warning');
        return;
      }
      existing.quantity += 1;
    } else {
      state.cart.push({
        id: prod.id,
        name: prod.name,
        price: prod.price,
        cost: prod.cost,
        quantity: 1
      });
    }

    renderCart();
  }

  function updateCartQuantity(productId, delta) {
    const item = state.cart.find(it => it.id === productId);
    if (!item) return;

    const prod = store.getProductById(productId);
    const newQty = item.quantity + delta;

    if (newQty <= 0) {
      state.cart = state.cart.filter(it => it.id !== productId);
    } else {
      if (prod && newQty > prod.stock) {
        showToast(`Stock máximo disponible: ${prod.stock}`, 'warning');
        return;
      }
      item.quantity = newQty;
    }

    renderCart();
  }

  function renderCart() {
    const list = document.getElementById('cartItemsList');
    const subtotalEl = document.getElementById('cartSubtotal');
    const totalEl = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('btnOpenCheckout');
    const discountInput = document.getElementById('cartDiscountInput');
    if (!list) return;

    if (state.cart.length === 0) {
      list.innerHTML = `
        <div class="cart-empty-state">
          <div style="font-size: 2rem; margin-bottom: 0.3rem;">🧺</div>
          <p>La orden está vacía</p>
        </div>
      `;
      subtotalEl.textContent = store.formatMoney(0);
      totalEl.textContent = store.formatMoney(0);
      checkoutBtn.disabled = true;
      return;
    }

    let subtotal = 0;
    list.innerHTML = state.cart.map(item => {
      const itemSubtotal = item.price * item.quantity;
      subtotal += itemSubtotal;
      return `
        <div class="cart-item">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <span class="cart-item-price">${store.formatMoney(item.price)} c/u</span>
          </div>
          <div class="cart-qty-controls">
            <button class="qty-btn" data-cart-dec="${item.id}">-</button>
            <span class="qty-number">${item.quantity}</span>
            <button class="qty-btn" data-cart-inc="${item.id}">+</button>
          </div>
          <div class="cart-item-total">${store.formatMoney(itemSubtotal)}</div>
        </div>
      `;
    }).join('');

    list.querySelectorAll('[data-cart-inc]').forEach(btn => {
      btn.addEventListener('click', () => updateCartQuantity(btn.getAttribute('data-cart-inc'), 1));
    });
    list.querySelectorAll('[data-cart-dec]').forEach(btn => {
      btn.addEventListener('click', () => updateCartQuantity(btn.getAttribute('data-cart-dec'), -1));
    });

    const discount = Number(discountInput.value || 0);
    const total = Math.max(0, subtotal - discount);

    subtotalEl.textContent = store.formatMoney(subtotal);
    totalEl.textContent = store.formatMoney(total);
    checkoutBtn.disabled = false;
  }

  // ===========================================================================
  // CHECKOUT POS & TICKETS
  // ===========================================================================
  let selectedPaymentMethod = 'cash';

  function openCheckoutModal() {
    if (state.cart.length === 0) return;

    const subtotal = state.cart.reduce((acc, it) => acc + (it.price * it.quantity), 0);
    const discount = Number(document.getElementById('cartDiscountInput').value || 0);
    const total = Math.max(0, subtotal - discount);

    document.getElementById('modalCheckoutTotal').textContent = store.formatMoney(total);
    const cashInput = document.getElementById('cashReceivedInput');
    cashInput.value = '';
    document.getElementById('changeAmount').textContent = store.formatMoney(0);

    setPaymentMethod('cash');

    const exactBtn = document.querySelector('[data-cash-exact]');
    if (exactBtn) {
      exactBtn.onclick = () => {
        cashInput.value = total.toFixed(2);
        calculateChange(total);
      };
    }

    document.querySelectorAll('[data-cash]').forEach(btn => {
      btn.onclick = () => {
        cashInput.value = btn.getAttribute('data-cash');
        calculateChange(total);
      };
    });

    cashInput.oninput = () => calculateChange(total);

    document.getElementById('checkoutModal').showModal();
  }

  function setPaymentMethod(method) {
    selectedPaymentMethod = method;
    document.querySelectorAll('.pay-method-card').forEach(card => {
      card.classList.toggle('active', card.getAttribute('data-method') === method);
    });

    document.getElementById('cashPaymentSection').style.display = method === 'cash' ? 'block' : 'none';
    document.getElementById('digitalPaymentSection').style.display = method === 'digital' ? 'block' : 'none';
    document.getElementById('cardPaymentSection').style.display = method === 'card' ? 'block' : 'none';
  }

  function calculateChange(totalToPay) {
    const received = Number(document.getElementById('cashReceivedInput').value || 0);
    const change = received - totalToPay;
    const changeEl = document.getElementById('changeAmount');

    if (received === 0) {
      changeEl.textContent = store.formatMoney(0);
      changeEl.style.color = 'var(--text-muted)';
    } else if (change >= 0) {
      changeEl.textContent = store.formatMoney(change);
      changeEl.style.color = 'var(--success)';
    } else {
      changeEl.textContent = `Falta ${store.formatMoney(Math.abs(change))}`;
      changeEl.style.color = 'var(--danger)';
    }
  }

  document.querySelectorAll('.pay-method-card').forEach(card => {
    card.addEventListener('click', () => setPaymentMethod(card.getAttribute('data-method')));
  });

  document.getElementById('btnConfirmSale').addEventListener('click', () => {
    const subtotal = state.cart.reduce((acc, it) => acc + (it.price * it.quantity), 0);
    const discount = Number(document.getElementById('cartDiscountInput').value || 0);
    const total = Math.max(0, subtotal - discount);

    let amountPaid = total;
    if (selectedPaymentMethod === 'cash') {
      const received = Number(document.getElementById('cashReceivedInput').value || 0);
      if (received < total && received > 0) {
        showToast('El monto recibido en efectivo es menor al total', 'error');
        return;
      }
      amountPaid = received > 0 ? received : total;
    }

    const customerName = document.getElementById('cartCustomerName').value;
    const customerPhone = document.getElementById('cartCustomerPhone').value;

    try {
      const saleRecord = store.createSale({
        items: state.cart,
        customer: customerName,
        phone: customerPhone,
        paymentMethod: selectedPaymentMethod,
        discount,
        amountPaid
      });

      state.cart = [];
      document.getElementById('cartCustomerName').value = '';
      document.getElementById('cartCustomerPhone').value = '';
      document.getElementById('cartDiscountInput').value = 0;
      renderCart();

      document.getElementById('checkoutModal').close();
      showReceipt(saleRecord);
      showToast(`¡Venta ${saleRecord.id} procesada exitosamente!`, 'success');
    } catch (err) {
      showToast(err.message, 'error');
    }
  });

  function showReceipt(sale) {
    state.lastSaleRecord = sale;
    document.getElementById('recNumber').textContent = sale.id;
    document.getElementById('recDate').textContent = new Date(sale.date).toLocaleString('es-PE', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
    document.getElementById('recCustomer').textContent = sale.customer || 'Cliente General';

    const itemsContainer = document.getElementById('recItemsList');
    itemsContainer.innerHTML = sale.items.map(it => `
      <div class="receipt-item-line">
        <span>${it.quantity}x ${it.name}</span>
        <span>${store.formatMoney(it.subtotal)}</span>
      </div>
    `).join('');

    document.getElementById('recSubtotal').textContent = store.formatMoney(sale.subtotal);

    const discountRow = document.getElementById('recDiscountRow');
    if (sale.discount > 0) {
      discountRow.style.display = 'flex';
      document.getElementById('recDiscount').textContent = `-${store.formatMoney(sale.discount)}`;
    } else {
      discountRow.style.display = 'none';
    }

    document.getElementById('recTotal').textContent = store.formatMoney(sale.total);

    const methodNames = { cash: 'Efectivo', card: 'Tarjeta POS', digital: 'Yape / Plin' };
    document.getElementById('recMethod').textContent = methodNames[sale.paymentMethod] || 'Efectivo';

    const paidRow = document.getElementById('recPaidRow');
    const changeRow = document.getElementById('recChangeRow');
    if (sale.paymentMethod === 'cash') {
      paidRow.style.display = 'flex';
      changeRow.style.display = 'flex';
      document.getElementById('recPaid').textContent = store.formatMoney(sale.amountPaid);
      document.getElementById('recChange').textContent = store.formatMoney(sale.change);
    } else {
      paidRow.style.display = 'none';
      changeRow.style.display = 'none';
    }

    document.getElementById('receiptModal').showModal();
  }

  document.getElementById('btnPrintReceipt').addEventListener('click', () => window.print());

  document.getElementById('btnShareWhatsAppReceipt').addEventListener('click', () => {
    if (!state.lastSaleRecord) return;
    const s = state.lastSaleRecord;
    let msg = `✨ *AMOUR & CACAO - COMPROBANTE DE COMPRA* ✨\n`;
    msg += `Ticket: *${s.id}*\n`;
    msg += `Fecha: ${new Date(s.date).toLocaleString('es-PE')}\n`;
    msg += `Cliente: ${s.customer}\n`;
    msg += `--------------------------------\n`;
    s.items.forEach(it => {
      msg += `• ${it.quantity}x ${it.name} - ${store.formatMoney(it.subtotal)}\n`;
    });
    msg += `*TOTAL: ${store.formatMoney(s.total)}*\n`;
    msg += `"Donde el amor se vuelve Chocolate" 🍫❤️`;

    const cleanPhone = (s.phone || '').replace(/[^0-9]/g, '');
    const url = cleanPhone 
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(msg)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  });

  // ===========================================================================
  // MÓDULO 1: DASHBOARD (FINANZAS & GANANCIAS)
  // ===========================================================================
  function initFinance() {
    renderFinanceDashboard();
    const periodSelect = document.getElementById('financePeriodFilter');
    if (periodSelect) {
      periodSelect.addEventListener('change', (e) => {
        state.financePeriod = e.target.value;
        renderFinanceDashboard();
      });
    }
  }

  function renderFinanceDashboard() {
    const metrics = store.getFinancialMetrics(state.financePeriod);

    document.getElementById('finTotalRevenue').textContent = store.formatMoney(metrics.totalRevenue);
    document.getElementById('finTransactionsCount').textContent = `${metrics.totalTransactions} ventas procesadas`;
    document.getElementById('finTotalCost').textContent = store.formatMoney(metrics.totalCOGS);
    document.getElementById('finNetProfit').textContent = store.formatMoney(metrics.grossProfit);
    document.getElementById('finProfitMargin').textContent = `${metrics.profitMargin}%`;
    document.getElementById('finAverageTicket').textContent = `Ticket Promedio: ${store.formatMoney(metrics.averageTicket)}`;

    // Gráfico de Métodos de Pago
    const payContainer = document.getElementById('paymentBreakdownChart');
    if (payContainer) {
      const total = metrics.totalRevenue || 1;
      const cashPct = ((metrics.paymentBreakdown.cash / total) * 100).toFixed(1);
      const cardPct = ((metrics.paymentBreakdown.card / total) * 100).toFixed(1);
      const digPct = ((metrics.paymentBreakdown.digital / total) * 100).toFixed(1);

      payContainer.innerHTML = `
        <div class="progress-bar-group">
          <div class="progress-bar-label">
            <span>💵 Efectivo (${store.formatMoney(metrics.paymentBreakdown.cash)})</span>
            <span>${cashPct}%</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill fill-cash" style="width: ${cashPct}%;"></div>
          </div>
        </div>

        <div class="progress-bar-group">
          <div class="progress-bar-label">
            <span>💳 Tarjeta POS (${store.formatMoney(metrics.paymentBreakdown.card)})</span>
            <span>${cardPct}%</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill fill-card" style="width: ${cardPct}%;"></div>
          </div>
        </div>

        <div class="progress-bar-group">
          <div class="progress-bar-label">
            <span>📱 Yape / Plin (${store.formatMoney(metrics.paymentBreakdown.digital)})</span>
            <span>${digPct}%</span>
          </div>
          <div class="progress-bar-track">
            <div class="progress-bar-fill fill-digital" style="width: ${digPct}%;"></div>
          </div>
        </div>
      `;
    }

    // Top 5 Productos
    const topContainer = document.getElementById('topProductsList');
    if (topContainer) {
      if (metrics.topProducts.length === 0) {
        topContainer.innerHTML = `<p style="color: var(--text-muted); font-size: 0.82rem;">No hay ventas registradas en este período.</p>`;
      } else {
        topContainer.innerHTML = metrics.topProducts.map((tp, idx) => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.45rem 0; border-bottom: 1px solid var(--border-subtle);">
            <div>
              <span style="font-weight: 700; color: var(--caramel-primary); margin-right: 0.35rem;">#${idx + 1}</span>
              <span style="font-size: 0.85rem; font-weight: 600;">${tp.name}</span>
              <div style="font-size: 0.7rem; color: var(--text-light);">${tp.quantity} unidades</div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: 700; font-size: 0.88rem;">${store.formatMoney(tp.revenue)}</div>
              <div style="font-size: 0.7rem; color: var(--success);">+${store.formatMoney(tp.profit)} utilidad</div>
            </div>
          </div>
        `).join('');
      }
    }

    // Historial
    const tbody = document.getElementById('salesHistoryTableBody');
    if (tbody) {
      const sales = metrics.filteredSales || [];
      if (sales.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No hay ventas registradas.</td></tr>`;
      } else {
        const methodLabels = { cash: 'Efectivo', card: 'Tarjeta', digital: 'Yape / Plin' };
        tbody.innerHTML = sales.map(s => `
          <tr>
            <td><strong>${s.id}</strong></td>
            <td>${new Date(s.date).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' })}</td>
            <td>${s.customer || 'Cliente General'}</td>
            <td><span class="status-badge in-stock">${methodLabels[s.paymentMethod] || 'Efectivo'}</span></td>
            <td><strong>${store.formatMoney(s.total)}</strong></td>
            <td>${store.formatMoney(s.totalCost)}</td>
            <td style="color: var(--success); font-weight: 700;">+${store.formatMoney(s.netProfit)}</td>
            <td>
              <button class="btn-icon" data-view-receipt="${s.id}" title="Ver e imprimir ticket">🧾</button>
            </td>
          </tr>
        `).join('');

        tbody.querySelectorAll('[data-view-receipt]').forEach(btn => {
          btn.addEventListener('click', () => {
            const sale = store.getSales().find(x => x.id === btn.getAttribute('data-view-receipt'));
            if (sale) showReceipt(sale);
          });
        });
      }
    }
  }

  // ===========================================================================
  // MÓDULO 5: INVENTARIO & COSTOS
  // ===========================================================================
  function initInventory() {
    renderInventory();

    const searchInput = document.getElementById('invSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.invSearchQuery = e.target.value.toLowerCase().trim();
        renderInventory();
      });
    }

    const categorySelect = document.getElementById('invCategoryFilter');
    if (categorySelect) {
      categorySelect.addEventListener('change', (e) => {
        state.invCategory = e.target.value;
        renderInventory();
      });
    }

    const btnNewProd = document.getElementById('btnOpenNewProduct');
    if (btnNewProd) {
      btnNewProd.addEventListener('click', () => openProductModal());
    }

    const prodForm = document.getElementById('productForm');
    if (prodForm) {
      prodForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const editId = document.getElementById('prodEditId').value;
        const productData = {
          id: editId || null,
          name: document.getElementById('prodName').value.trim(),
          category: document.getElementById('prodCategory').value,
          sku: document.getElementById('prodSku').value.trim(),
          cost: Number(document.getElementById('prodCost').value),
          price: Number(document.getElementById('prodPrice').value),
          stock: Number(document.getElementById('prodStock').value),
          minStock: Number(document.getElementById('prodMinStock').value),
          origin: document.getElementById('prodOrigin').value.trim(),
          description: document.getElementById('prodDescription').value.trim(),
          image: document.getElementById('prodImageSelect').value
        };

        store.saveProduct(productData);
        document.getElementById('productModal').close();
        showToast(`Producto "${productData.name}" guardado`, 'success');
      });
    }

    const stockAdjustForm = document.getElementById('stockAdjustForm');
    if (stockAdjustForm) {
      stockAdjustForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const prodId = document.getElementById('adjustProdId').value;
        const type = document.getElementById('adjustType').value;
        const qty = Number(document.getElementById('adjustQty').value);
        const reason = document.getElementById('adjustReason').value.trim();

        let delta = qty;
        if (type === 'waste') delta = -qty;

        store.adjustStock(prodId, delta, reason, type);
        document.getElementById('stockAdjustModal').close();
        showToast(`Stock actualizado: ${delta > 0 ? '+' : ''}${delta} unidades`, 'success');
      });
    }
  }

  function renderInventory() {
    const products = store.getProducts();
    const metrics = store.getFinancialMetrics();

    document.getElementById('invTotalProducts').textContent = products.length;
    document.getElementById('invLowStockCount').textContent = metrics.lowStockCount;
    document.getElementById('invValuationCost').textContent = store.formatMoney(metrics.inventoryValuationCost);
    document.getElementById('invValuationSale').textContent = store.formatMoney(metrics.inventoryValuationSale);
    document.getElementById('invPotentialProfitSub').textContent = `Ganancia potencial: ${store.formatMoney(metrics.potentialProfit)}`;

    const navBadge = document.getElementById('navLowStockBadge');
    if (navBadge) {
      navBadge.textContent = metrics.lowStockCount;
      navBadge.style.display = metrics.lowStockCount > 0 ? 'inline-block' : 'none';
    }

    const filtered = products.filter(p => {
      const matchCat = state.invCategory === 'todos' || p.category === state.invCategory;
      const matchQuery = !state.invSearchQuery || 
        p.name.toLowerCase().includes(state.invSearchQuery) ||
        (p.sku && p.sku.toLowerCase().includes(state.invSearchQuery));
      return matchCat && matchQuery;
    });

    const tbody = document.getElementById('inventoryTableBody');
    if (!tbody) return;

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 1.5rem; color: var(--text-muted);">No hay productos registrados con este filtro.</td></tr>`;
      return;
    }

    const catLabels = {
      bombones: 'Bombones', pasteles: 'Pasteles', tabletas: 'Tabletas',
      postres: 'Postres', bebidas: 'Bebidas', regalos: 'Regalos'
    };

    tbody.innerHTML = filtered.map(p => {
      let badgeClass = 'in-stock';
      let badgeText = 'Óptimo';
      if (p.stock <= 0) {
        badgeClass = 'out-stock';
        badgeText = 'Agotado';
      } else if (p.stock <= p.minStock) {
        badgeClass = 'low-stock';
        badgeText = 'Stock Bajo';
      }

      const profitUnit = p.profitUnit || (p.price - p.cost);
      const marginPct = p.marginPct || (p.price > 0 ? ((profitUnit / p.price) * 100).toFixed(1) : 0);

      return `
        <tr>
          <td>
            <div class="table-product-cell">
              <img src="${p.image || 'assets/products/caja_bombones.jpg'}" alt="${p.name}" class="table-prod-img">
              <div>
                <strong>${p.name}</strong>
                <div style="font-size: 0.72rem; color: var(--text-light);">${p.sku || '-'}</div>
              </div>
            </div>
          </td>
          <td>${catLabels[p.category] || p.category}</td>
          <td><strong>${p.stock}</strong></td>
          <td>${store.formatMoney(p.cost)}</td>
          <td><strong>${store.formatMoney(p.price)}</strong></td>
          <td style="color: var(--success); font-weight: 700;">+${store.formatMoney(profitUnit)}</td>
          <td><span class="product-margin-pill">${marginPct}%</span></td>
          <td><span class="status-badge ${badgeClass}">${badgeText}</span></td>
          <td>
            <div class="table-actions">
              <button class="btn-icon" data-adjust-stock="${p.id}" title="Ajustar stock">⚖️</button>
              <button class="btn-icon" data-edit-prod="${p.id}" title="Editar">✏️</button>
              <button class="btn-icon danger" data-delete-prod="${p.id}" title="Eliminar">🗑️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    tbody.querySelectorAll('[data-adjust-stock]').forEach(btn => {
      btn.addEventListener('click', () => openStockAdjustModal(btn.getAttribute('data-adjust-stock')));
    });
    tbody.querySelectorAll('[data-edit-prod]').forEach(btn => {
      btn.addEventListener('click', () => openProductModal(btn.getAttribute('data-edit-prod')));
    });
    tbody.querySelectorAll('[data-delete-prod]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-delete-prod');
        const p = store.getProductById(id);
        if (confirm(`¿Eliminar "${p.name}" del catálogo?`)) {
          store.deleteProduct(id);
          showToast(`Producto "${p.name}" eliminado`, 'info');
        }
      });
    });
  }

  function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const title = document.getElementById('productModalTitle');

    form.reset();
    document.getElementById('prodEditId').value = '';

    if (productId) {
      const p = store.getProductById(productId);
      if (!p) return;
      title.textContent = '✏️ Editar Producto';
      document.getElementById('prodEditId').value = p.id;
      document.getElementById('prodName').value = p.name;
      document.getElementById('prodCategory').value = p.category;
      document.getElementById('prodSku').value = p.sku || '';
      document.getElementById('prodCost').value = p.cost;
      document.getElementById('prodPrice').value = p.price;
      document.getElementById('prodStock').value = p.stock;
      document.getElementById('prodMinStock').value = p.minStock || 5;
      document.getElementById('prodOrigin').value = p.origin || '';
      document.getElementById('prodDescription').value = p.description || '';
      document.getElementById('prodImageSelect').value = p.image || 'assets/products/caja_bombones.jpg';
    } else {
      title.textContent = '➕ Nuevo Producto';
      document.getElementById('prodMinStock').value = 5;
      document.getElementById('prodStock').value = 10;
    }

    modal.showModal();
  }

  function openStockAdjustModal(productId) {
    const p = store.getProductById(productId);
    if (!p) return;

    document.getElementById('adjustProdId').value = p.id;
    document.getElementById('adjustProdName').textContent = `${p.name} (Stock actual: ${p.stock} uds)`;
    document.getElementById('adjustQty').value = 1;
    document.getElementById('adjustReason').value = '';
    document.getElementById('stockAdjustModal').showModal();
  }

  // ===========================================================================
  // MÓDULO 6: CONTROL DE CAJA & ARQUEO
  // ===========================================================================
  function initCashShift() {
    renderCashShift();
    document.getElementById('btnOpenCashInModal').addEventListener('click', () => openCashMovementModal('inflow'));
    document.getElementById('btnOpenCashOutModal').addEventListener('click', () => openCashMovementModal('outflow'));
    document.getElementById('btnOpenCloseShiftModal').addEventListener('click', openCloseShiftModal);

    const cashMovementForm = document.getElementById('cashMovementForm');
    if (cashMovementForm) {
      cashMovementForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const type = document.getElementById('cashMovementType').value;
        const amount = Number(document.getElementById('cashMoveAmount').value);
        const reason = document.getElementById('cashMoveReason').value.trim();
        const user = document.getElementById('cashMoveUser').value.trim();

        store.addCashMovement(type, amount, reason, user);
        document.getElementById('cashMovementModal').close();
        showToast(`Movimiento de caja registrado: ${store.formatMoney(amount)}`, 'success');
      });
    }

    const closeShiftForm = document.getElementById('closeShiftForm');
    if (closeShiftForm) {
      closeShiftForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const counted = Number(document.getElementById('closeCountedCash').value);
        const notes = document.getElementById('closeNotes').value.trim();

        store.closeShift(counted, notes);
        document.getElementById('closeShiftModal').close();
        showToast('Arqueo completado y turno cerrado con éxito', 'info');
      });
    }
  }

  function renderCashShift() {
    const shift = store.getCurrentShift();
    const headerPill = document.getElementById('headerShiftPill');
    const headerShiftText = document.getElementById('headerShiftText');

    if (!shift || !shift.isOpen) {
      document.getElementById('bannerShiftTitle').textContent = 'Turno de Caja: CERRADO';
      document.getElementById('bannerShiftDetails').textContent = 'Abra un nuevo turno con fondo inicial para empezar a cobrar.';
      headerPill.classList.add('closed');
      headerShiftText.textContent = 'Caja Cerrada';
      document.getElementById('btnOpenCloseShiftModal').textContent = '🔓 Abrir Nuevo Turno';
      document.getElementById('btnOpenCashInModal').disabled = true;
      document.getElementById('btnOpenCashOutModal').disabled = true;
      return;
    }

    headerPill.classList.remove('closed');
    document.getElementById('btnOpenCloseShiftModal').textContent = '🔒 Realizar Arqueo & Cerrar Caja';
    document.getElementById('btnOpenCashInModal').disabled = false;
    document.getElementById('btnOpenCashOutModal').disabled = false;

    const expectedCash = (shift.initialCash || 0) + (shift.cashSales || 0) + (shift.cashIn || 0) - (shift.cashOut || 0);

    document.getElementById('bannerShiftTitle').textContent = `Turno de Caja: Activo (${shift.cashierName || 'Caja Central'})`;
    document.getElementById('bannerShiftDetails').textContent = `Iniciado: ${new Date(shift.openedAt).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })} | Efectivo esperado: ${store.formatMoney(expectedCash)}`;
    headerShiftText.textContent = `Caja: ${store.formatMoney(expectedCash)}`;

    document.getElementById('cashInitialAmount').textContent = store.formatMoney(shift.initialCash);
    document.getElementById('cashSalesCash').textContent = store.formatMoney(shift.cashSales);
    document.getElementById('cashSalesCard').textContent = store.formatMoney(shift.cardSales);
    document.getElementById('cashSalesDigital').textContent = store.formatMoney(shift.digitalSales);
    document.getElementById('cashTotalOut').textContent = `-${store.formatMoney(shift.cashOut)}`;
    document.getElementById('cashExpectedTotal').textContent = store.formatMoney(expectedCash);

    const tbody = document.getElementById('cashMovementsTableBody');
    if (tbody) {
      const movs = shift.movements || [];
      if (movs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 1.25rem;">No hay movimientos manuales en este turno.</td></tr>`;
      } else {
        tbody.innerHTML = movs.map(m => `
          <tr>
            <td>${new Date(m.timestamp).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}</td>
            <td>
              <span class="status-badge ${m.type === 'inflow' ? 'in-stock' : 'out-stock'}">
                ${m.type === 'inflow' ? '➕ Ingreso' : '➖ Gasto'}
              </span>
            </td>
            <td><strong>${store.formatMoney(m.amount)}</strong></td>
            <td>${m.reason}</td>
            <td>${m.user || 'Cajero'}</td>
          </tr>
        `).join('');
      }
    }
  }

  function openCashMovementModal(type) {
    const shift = store.getCurrentShift();
    if (!shift || !shift.isOpen) {
      showToast('Debe abrir un turno de caja para registrar movimientos', 'warning');
      return;
    }
    document.getElementById('cashMovementType').value = type;
    document.getElementById('cashMovementTitle').textContent = type === 'inflow' ? '➕ Registrar Ingreso Extra' : '➖ Registrar Gasto de Caja Chica';
    document.getElementById('cashMoveAmount').value = '';
    document.getElementById('cashMoveReason').value = '';
    document.getElementById('cashMovementModal').showModal();
  }

  function openCloseShiftModal() {
    const shift = store.getCurrentShift();
    if (!shift || !shift.isOpen) {
      const initialCash = prompt('Ingrese el fondo inicial de caja (sencillo en S/):', '150');
      if (initialCash !== null) {
        store.openShift(Number(initialCash) || 100, store.getCurrentUser().name);
        showToast('¡Turno de caja abierto correctamente!', 'success');
      }
      return;
    }

    const expected = (shift.initialCash || 0) + (shift.cashSales || 0) + (shift.cashIn || 0) - (shift.cashOut || 0);

    document.getElementById('closeModalInitial').textContent = store.formatMoney(shift.initialCash);
    document.getElementById('closeModalCashSales').textContent = store.formatMoney(shift.cashSales);
    document.getElementById('closeModalCashOut').textContent = store.formatMoney(shift.cashOut);
    document.getElementById('closeModalExpected').textContent = store.formatMoney(expected);

    const countedInput = document.getElementById('closeCountedCash');
    countedInput.value = '';
    const diffBox = document.getElementById('closeDifferenceBox');
    diffBox.style.display = 'none';

    countedInput.oninput = () => {
      const counted = Number(countedInput.value || 0);
      const diff = counted - expected;
      diffBox.style.display = 'block';

      if (diff === 0) {
        diffBox.style.background = 'var(--success-bg)';
        diffBox.style.color = 'var(--success)';
        diffBox.innerHTML = `✅ <strong>Caja Cuadrada Perfecta</strong> (Diferencia: ${store.formatMoney(0)})`;
      } else if (diff > 0) {
        diffBox.style.background = 'var(--warning-bg)';
        diffBox.style.color = 'var(--warning)';
        diffBox.innerHTML = `⚠️ <strong>Sobrante en Caja:</strong> +${store.formatMoney(diff)}`;
      } else {
        diffBox.style.background = 'var(--danger-bg)';
        diffBox.style.color = 'var(--danger)';
        diffBox.innerHTML = `🚨 <strong>Faltante en Caja:</strong> -${store.formatMoney(Math.abs(diff))}`;
      }
    };

    document.getElementById('closeShiftModal').showModal();
  }

  // ===========================================================================
  // MÓDULO 7: PEDIDOS ESPECIALES (ENCARGOS)
  // ===========================================================================
  function initOrders() {
    renderSpecialOrders();
    const btnNewOrder = document.getElementById('btnOpenNewOrder');
    if (btnNewOrder) {
      btnNewOrder.addEventListener('click', () => openOrderModal());
    }

    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
      orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const editId = document.getElementById('orderEditId').value;
        const orderData = {
          id: editId || null,
          customer: document.getElementById('orderCustomer').value.trim(),
          phone: document.getElementById('orderPhone').value.trim(),
          title: document.getElementById('orderTitle').value.trim(),
          scheduledDate: document.getElementById('orderDate').value,
          scheduledTime: document.getElementById('orderTime').value,
          totalAmount: Number(document.getElementById('orderTotal').value),
          depositPaid: Number(document.getElementById('orderDeposit').value || 0),
          description: document.getElementById('orderDesc').value.trim(),
          status: 'pending'
        };

        store.saveSpecialOrder(orderData);
        document.getElementById('orderModal').close();
        showToast(`Pedido especial "${orderData.title}" guardado`, 'success');
      });
    }
  }

  function renderSpecialOrders() {
    const orders = store.getSpecialOrders();
    const grid = document.getElementById('ordersGrid');
    const badge = document.getElementById('navActiveOrdersBadge');

    const activeCount = orders.filter(o => o.status !== 'delivered').length;
    if (badge) badge.textContent = activeCount;

    if (!grid) return;

    if (orders.length === 0) {
      grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: var(--text-light);"><p>No hay pedidos especiales.</p></div>`;
      return;
    }

    grid.innerHTML = orders.map(ord => {
      const hasBalance = ord.pendingBalance > 0;
      const cleanPhone = (ord.phone || '').replace(/[^0-9]/g, '');

      return `
        <div class="order-card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <span style="font-size: 0.72rem; font-weight: 700; color: var(--text-light);">${ord.id}</span>
              <h3 style="font-size: 1rem; margin-top: 0.2rem;">${ord.title}</h3>
            </div>
            <span class="status-badge in-stock">${ord.status.toUpperCase()}</span>
          </div>

          <div style="font-size: 0.8rem; background: var(--cream-100); padding: 0.35rem 0.6rem; border-radius: 4px;">
            📅 Entrega: <strong>${ord.scheduledDate} a las ${ord.scheduledTime || '16:00'}</strong>
          </div>

          <div style="font-size: 0.82rem;">
            <div>👤 <strong>${ord.customer}</strong></div>
            <a href="https://wa.me/${cleanPhone}" target="_blank" style="color: #128c7e; text-decoration: none; font-weight: 700; font-size: 0.78rem;">
              💬 ${ord.phone}
            </a>
          </div>

          ${ord.description ? `<p style="font-size: 0.78rem; color: var(--text-muted);">${ord.description}</p>` : ''}

          <div style="display: flex; justify-content: space-between; align-items: center; background: var(--cream-50); padding: 0.5rem; border-radius: 4px; border: 1px solid var(--border-subtle); font-size: 0.82rem;">
            <div>Total: <strong>${store.formatMoney(ord.totalAmount)}</strong></div>
            <div>Saldo: <span class="${hasBalance ? 'balance-alert' : 'balance-paid'}">${hasBalance ? store.formatMoney(ord.pendingBalance) : 'PAGADO'}</span></div>
          </div>
        </div>
      `;
    }).join('');
  }

  function openOrderModal(orderId = null) {
    const modal = document.getElementById('orderModal');
    const form = document.getElementById('orderForm');
    form.reset();
    document.getElementById('orderEditId').value = '';

    const tomorrow = new Date(Date.now() + 86400 * 1000).toISOString().split('T')[0];
    document.getElementById('orderDate').value = state.selectedCalendarDateStr || tomorrow;

    modal.showModal();
  }

  // ===========================================================================
  // MENÚ DIGITAL PARA CLIENTES (STOREFRONT) & ENVÍO DE PEDIDOS WEB
  // ===========================================================================
  function initStorefront() {
    renderClientCategories();
    renderClientStorefront();

    const btnOpenClientCart = document.getElementById('btnOpenClientCart');
    if (btnOpenClientCart) {
      btnOpenClientCart.addEventListener('click', openClientCartModal);
    }

    const clientCheckoutForm = document.getElementById('clientCheckoutForm');
    if (clientCheckoutForm) {
      clientCheckoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (state.clientCart.length === 0) return;

        const customerName = document.getElementById('clientOrderName').value.trim();
        const phone = document.getElementById('clientOrderPhone').value.trim();
        const date = document.getElementById('clientOrderDate').value;
        const paymentMethod = document.getElementById('clientOrderPayment').value;
        const address = document.getElementById('clientOrderAddress').value.trim();
        const notes = document.getElementById('clientOrderNotes').value.trim();

        try {
          // 1. Registrar formalmente el pedido en el Store (Panel de Pedidos Web)
          const newWebOrder = store.createWebOrder({
            customer: customerName,
            whatsapp: phone,
            address: address,
            deliveryDate: date,
            deliveryTime: '16:00',
            items: state.clientCart,
            deliveryFee: address.toLowerCase().includes('recojo') ? 0 : 10.00,
            paymentMethod: paymentMethod,
            paymentDeclaredProof: `Medio declarado: ${paymentMethod}`,
            notes: notes
          });

          // 2. Preparar mensaje formateado para WhatsApp
          let msg = `🍫 *NUEVO PEDIDO WEB - AMOUR & CACAO* 🍫\n`;
          msg += `Orden: *${newWebOrder.orderNumber}* (${newWebOrder.id})\n`;
          msg += `👤 *Cliente:* ${customerName}\n`;
          msg += `📱 *WhatsApp:* ${phone}\n`;
          msg += `📍 *Dirección:* ${address}\n`;
          msg += `📅 *Fecha Deseada:* ${date}\n`;
          msg += `💳 *Pago Seleccionado:* ${paymentMethod}\n`;
          if (notes) msg += `💌 *Dedicatoria/Nota:* ${notes}\n`;
          msg += `--------------------------------\n`;

          state.clientCart.forEach(it => {
            msg += `• ${it.quantity}x ${it.name} (${store.formatMoney(it.price)})\n`;
          });

          if (newWebOrder.deliveryFee > 0) {
            msg += `• Delivery: ${store.formatMoney(newWebOrder.deliveryFee)}\n`;
          }

          msg += `--------------------------------\n`;
          msg += `*TOTAL A PAGAR: ${store.formatMoney(newWebOrder.total)}*\n\n`;
          msg += `Por favor envíenos la captura de su pago para verificarlo y comenzar la preparación inmediata. ¡Muchas gracias! ✨`;

          // Limpiar carrito de cliente
          state.clientCart = [];
          updateClientCartFloatingBar();
          document.getElementById('clientCartModal').close();

          showToast(`¡Pedido ${newWebOrder.orderNumber} registrado! Abriendo WhatsApp...`, 'success');

          // Abrir WhatsApp de la pastelería
          const settings = store.getSettings();
          const shopPhone = (settings.whatsappNumber || '+51 987 654 321').replace(/[^0-9]/g, '');
          window.open(`https://api.whatsapp.com/send?phone=${shopPhone}&text=${encodeURIComponent(msg)}`, '_blank');
        } catch (err) {
          showToast(err.message, 'error');
        }
      });
    }
  }

  function renderClientCategories() {
    const container = document.getElementById('clientCategoryPills');
    if (!container) return;

    container.innerHTML = INITIAL_CATEGORIES.map(cat => `
      <button class="cat-pill-btn ${cat.id === state.clientCategory ? 'active' : ''}" data-client-cat="${cat.id}">
        <span>${cat.icon}</span>
        <span>${cat.name}</span>
      </button>
    `).join('');

    container.querySelectorAll('[data-client-cat]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.clientCategory = btn.getAttribute('data-client-cat');
        renderClientCategories();
        renderClientStorefront();
      });
    });
  }

  function renderClientStorefront() {
    const grid = document.getElementById('clientProductsGrid');
    if (!grid) return;

    const products = store.getProducts().filter(p => p.stock > 0);
    const filtered = products.filter(p => state.clientCategory === 'todos' || p.category === state.clientCategory);

    grid.innerHTML = filtered.map(prod => `
      <div class="client-card">
        <img src="${prod.image || 'assets/products/caja_bombones.jpg'}" alt="${prod.name}" class="client-card-img" loading="lazy">
        <div class="client-card-content">
          <h3 class="client-card-title">${prod.name}</h3>
          <p class="client-card-desc">${prod.description || 'Elaborado artesanalmente.'}</p>
          <div style="font-size: 0.78rem; color: var(--caramel-primary); font-weight: 600; margin-bottom: 0.65rem;">
            🌿 ${prod.origin || 'Cacao Fino de Aroma'}
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; margin-bottom: 0.75rem;">
            <span style="font-family: var(--font-serif); font-size: 1.25rem; font-weight: 800; color: var(--cacao-950);">
              ${store.formatMoney(prod.price)}
            </span>
          </div>
          <button class="btn-add-client-cart" data-add-client-cart="${prod.id}">
            <span>🛒</span>
            <span>Agregar a mi Selección</span>
          </button>
        </div>
      </div>
    `).join('');

    grid.querySelectorAll('[data-add-client-cart]').forEach(btn => {
      btn.addEventListener('click', () => {
        addToClientCart(btn.getAttribute('data-add-client-cart'));
      });
    });

    updateClientCartFloatingBar();
  }

  function addToClientCart(productId) {
    const prod = store.getProductById(productId);
    if (!prod) return;

    const existing = state.clientCart.find(it => it.id === prod.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      state.clientCart.push({
        id: prod.id,
        name: prod.name,
        price: prod.price,
        quantity: 1
      });
    }

    updateClientCartFloatingBar();
    showToast(`"${prod.name}" agregado a tu pedido`, 'success');
  }

  function updateClientCartFloatingBar() {
    const bar = document.getElementById('clientCartBar');
    const countEl = document.getElementById('clientCartCount');
    const totalEl = document.getElementById('clientCartTotal');

    const totalCount = state.clientCart.reduce((acc, it) => acc + it.quantity, 0);
    const totalAmount = state.clientCart.reduce((acc, it) => acc + (it.price * it.quantity), 0);

    if (totalCount > 0) {
      bar.style.display = 'block';
      countEl.textContent = totalCount;
      totalEl.textContent = store.formatMoney(totalAmount);
    } else {
      bar.style.display = 'none';
    }
  }

  function openClientCartModal() {
    const modal = document.getElementById('clientCartModal');
    const list = document.getElementById('clientModalCartItems');
    const totalEl = document.getElementById('clientModalTotal');
    const dateInput = document.getElementById('clientOrderDate');

    if (state.clientCart.length === 0) return;

    const tomorrow = new Date(Date.now() + 86400 * 1000).toISOString().split('T')[0];
    if (dateInput) dateInput.value = tomorrow;

    let total = 0;
    list.innerHTML = state.clientCart.map(it => {
      const line = it.price * it.quantity;
      total += line;
      return `
        <div class="cart-item">
          <div class="cart-item-info">
            <h4>${it.name}</h4>
            <span class="cart-item-price">${store.formatMoney(it.price)} c/u</span>
          </div>
          <div class="cart-item-total">${store.formatMoney(line)}</div>
        </div>
      `;
    }).join('');

    totalEl.textContent = store.formatMoney(total);
    modal.showModal();
  }

  // ===========================================================================
  // MÓDULO 8: GESTOR & EDITOR VISUAL DE TIENDA WEB
  // ===========================================================================
  function renderStorefrontEditorModule() {
    const content = store.getStorefrontContent();
    const defaults = {
      hero_curator: 'Cosecha Seleccionada 2026 · Atelier Tacna',
      hero_headline: 'La Alquimia del Cacao Puro donde El Amor Se Vuelve Arte',
      hero_subhead: 'Chocolatería de culto elaborada grano a grano desde los valles sagrados de Cusco, Piura y Bagua. Alta repostería sensorial inspirada en el respeto botánico por los microclimas peruanos.',
      masterpiece_desc: '12 bombones pintados a mano al óleo de cacao. Ganache aterciopelada al 70%, maracuyá silvestre y praliné crujiente de avellanas.',
      atelier_address: 'Centro Histórico de Tacna · Paseo Cívico (Arco Parabólico)',
      atelier_hours: 'Lun-Sáb: 09:00 - 20:00 · Dom: 10:00 - 18:00',
      atelier_phone: '+51 987 654 321'
    };

    const curEl = document.getElementById('cmsHeroCurator');
    const headEl = document.getElementById('cmsHeroHeadline');
    const subEl = document.getElementById('cmsHeroSubhead');
    const mastEl = document.getElementById('cmsMasterpieceDesc');
    const addrEl = document.getElementById('cmsAtelierAddress');
    const hrsEl = document.getElementById('cmsAtelierHours');
    const phoneEl = document.getElementById('cmsAtelierPhone');

    if (curEl) curEl.value = content.hero_curator || defaults.hero_curator;
    if (headEl) headEl.value = content.hero_headline || defaults.hero_headline;
    if (subEl) subEl.value = content.hero_subhead || defaults.hero_subhead;
    if (mastEl) mastEl.value = content.masterpiece_desc || defaults.masterpiece_desc;
    if (addrEl) addrEl.value = content.atelier_address || defaults.atelier_address;
    if (hrsEl) hrsEl.value = content.atelier_hours || defaults.atelier_hours;
    if (phoneEl) phoneEl.value = content.atelier_phone || defaults.atelier_phone;
  }

  function initStorefrontEditor() {
    renderStorefrontEditorModule();

    // Botón de Lanzamiento de Editor Visual en Vivo
    const btnLaunch = document.getElementById('btnLaunchVisualEditor');
    if (btnLaunch) {
      btnLaunch.addEventListener('click', () => {
        const user = store.getCurrentUser();
        if (user.role === 'sales') {
          showToast('Solo administradores pueden acceder al editor visual.', 'warning');
          return;
        }
        // Marcar sesión administrativa para el editor en vivo
        sessionStorage.setItem('ac_admin_editor_session', 'true');
        localStorage.setItem('ac_admin_editor_session', 'true');
        window.open('tienda.html?editor=active', '_blank');
        showToast('Abriendo Tienda Web en Modo Editor Visual...', 'success');
      });
    }

    // Formulario de edición rápida CMS
    const quickForm = document.getElementById('quickCmsForm');
    if (quickForm) {
      quickForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const updatedContent = {
          hero_curator: document.getElementById('cmsHeroCurator')?.value.trim() || '',
          hero_headline: document.getElementById('cmsHeroHeadline')?.value.trim() || '',
          hero_subhead: document.getElementById('cmsHeroSubhead')?.value.trim() || '',
          masterpiece_desc: document.getElementById('cmsMasterpieceDesc')?.value.trim() || '',
          atelier_address: document.getElementById('cmsAtelierAddress')?.value.trim() || '',
          atelier_hours: document.getElementById('cmsAtelierHours')?.value.trim() || '',
          atelier_phone: document.getElementById('cmsAtelierPhone')?.value.trim() || ''
        };

        store.saveStorefrontContent(updatedContent);
        showToast('¡Contenidos de la tienda guardados y publicados con éxito!', 'success');
      });
    }

    // Botón de restablecer originales
    const btnReset = document.getElementById('btnResetStorefrontCms');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        if (confirm('¿Deseas restablecer todos los textos a la configuración de fábrica?')) {
          store.resetStorefrontContent();
          renderStorefrontEditorModule();
          showToast('Textos restablecidos a los valores originales', 'info');
        }
      });
    }
  }

  // ===========================================================================
  // CONFIGURACIÓN GENERAL Y RESPALDOS
  // ===========================================================================
  function initSettings() {
    const form = document.getElementById('settingsForm');
    if (form) {
      const s = store.getSettings();
      document.getElementById('setBusinessName').value = s.businessName || 'Amor & Cacao';
      document.getElementById('setTagline').value = s.tagline || 'Donde el amor se vuelve Chocolate';
      document.getElementById('setWhatsapp').value = s.whatsappNumber || '+51 987 654 321';
      document.getElementById('setAddress').value = s.address || 'Paseo Cívico / Centro Histórico, Tacna - Perú';
      document.getElementById('setCurrency').value = s.currency || 'S/.';

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        store.saveSettings({
          businessName: document.getElementById('setBusinessName').value.trim(),
          tagline: document.getElementById('setTagline').value.trim(),
          whatsappNumber: document.getElementById('setWhatsapp').value.trim(),
          address: document.getElementById('setAddress').value.trim(),
          currency: document.getElementById('setCurrency').value
        });
        showToast('Ajustes del negocio guardados correctamente', 'success');
      });
    }

    // Exportar / Importar / Reset
    document.getElementById('btnExportBackup').addEventListener('click', () => {
      const jsonStr = store.exportBackup();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_amor_cacao_${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Copia de seguridad exportada en JSON', 'success');
    });

    const fileImportInput = document.getElementById('fileImportInput');
    document.getElementById('btnImportBackup').addEventListener('click', () => fileImportInput.click());

    fileImportInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = store.importBackup(event.target.result);
        if (res.success) {
          showToast('Respaldo restaurado con éxito', 'success');
        } else {
          showToast(`Error al restaurar: ${res.error}`, 'error');
        }
      };
      reader.readAsText(file);
      fileImportInput.value = '';
    });

    document.getElementById('btnResetDemo').addEventListener('click', () => {
      if (confirm('¿Restablecer datos demo de ejemplo de Amor & Cacao?')) {
        store.resetToDemo();
        showToast('Datos de demostración restablecidos', 'info');
      }
    });

    // Cerrar modales con [data-close-dialog]
    document.querySelectorAll('[data-close-dialog]').forEach(btn => {
      btn.addEventListener('click', () => {
        const dialog = document.getElementById(btn.getAttribute('data-close-dialog'));
        if (dialog) dialog.close();
      });
    });
  }

  // ===========================================================================
  // SUBSCRIPCIONES REACTIVAS AL STORE
  // ===========================================================================
  store.subscribe('products_changed', () => {
    renderPosCatalog();
    renderInventory();
    renderClientStorefront();
  });

  store.subscribe('sales_changed', () => {
    renderCashShift();
    renderFinanceDashboard();
  });

  store.subscribe('shift_changed', () => {
    renderCashShift();
  });

  store.subscribe('web_orders_changed', () => {
    renderWebOrders();
  });

  store.subscribe('calendar_changed', () => {
    renderCalendar();
  });

  store.subscribe('users_changed', () => {
    renderUsersList();
  });

  store.subscribe('user_logged_in', () => {
    updateUserDisplay();
    applyRolePermissions();
  });

  store.subscribe('storefront_content_changed', () => {
    if (state.currentTab === 'tab-storefront-editor') {
      renderStorefrontEditorModule();
    }
  });

  // INICIALIZACIÓN GLOBAL
  initAuth();
  initNavigation();
  initPos();
  initWebOrders();
  initCalendar();
  initInventory();
  initCashShift();
  initFinance();
  initOrders();
  initStorefront();
  initStorefrontEditor();
  initSettings();

  applyRolePermissions();
  showToast('Plataforma Amor & Cacao optimizada y lista', 'success');
});
