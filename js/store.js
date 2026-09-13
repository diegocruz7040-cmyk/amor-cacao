// Store y Gestor de Estado con persistencia LocalStorage para Amor & Cacao
const STORE_KEYS = {
  PRODUCTS: 'ac_products',
  SALES: 'ac_sales',
  SHIFT: 'ac_cash_shift',
  ORDERS: 'ac_special_orders',
  WEB_ORDERS: 'ac_web_orders',
  USERS: 'ac_users',
  CURRENT_USER: 'ac_current_user',
  SETTINGS: 'ac_settings',
  STOREFRONT_CONTENT: 'ac_storefront_custom_content'
};

const DEFAULT_SETTINGS = {
  businessName: 'Amor & Cacao',
  tagline: 'Donde el amor se vuelve Chocolate',
  currency: 'S/.',
  taxRate: 0.18, // IGV referencial
  includeTaxInPrices: true,
  whatsappNumber: '+51 987 654 321',
  address: 'Paseo Cívico / Centro Histórico, Tacna - Perú',
  email: 'contacto@amorcacao.com'
};

class Store {
  constructor() {
    this.listeners = new Map();
    this.init();
  }

  init() {
    if (!localStorage.getItem(STORE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem(STORE_KEYS.SALES)) {
      localStorage.setItem(STORE_KEYS.SALES, JSON.stringify(INITIAL_SALES));
    }
    if (!localStorage.getItem(STORE_KEYS.SHIFT)) {
      localStorage.setItem(STORE_KEYS.SHIFT, JSON.stringify(INITIAL_CASH_SHIFT));
    }
    if (!localStorage.getItem(STORE_KEYS.ORDERS)) {
      localStorage.setItem(STORE_KEYS.ORDERS, JSON.stringify(INITIAL_SPECIAL_ORDERS));
    }
    if (!localStorage.getItem(STORE_KEYS.WEB_ORDERS)) {
      localStorage.setItem(STORE_KEYS.WEB_ORDERS, JSON.stringify(INITIAL_WEB_ORDERS));
    }
    if (!localStorage.getItem(STORE_KEYS.USERS)) {
      localStorage.setItem(STORE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORE_KEYS.CURRENT_USER)) {
      localStorage.setItem(STORE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0])); // Admin por defecto
    }
    if (!localStorage.getItem(STORE_KEYS.SETTINGS)) {
      localStorage.setItem(STORE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
  }

  // Pub/Sub
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => {
      const arr = this.listeners.get(event);
      if (arr) {
        this.listeners.set(event, arr.filter(cb => cb !== callback));
      }
    };
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => cb(data));
    }
  }

  // Settings
  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEYS.SETTINGS)) || DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  }

  saveSettings(newSettings) {
    const merged = { ...this.getSettings(), ...newSettings };
    localStorage.setItem(STORE_KEYS.SETTINGS, JSON.stringify(merged));
    this.emit('settings_changed', merged);
    return merged;
  }

  formatMoney(amount) {
    const settings = this.getSettings();
    const curr = settings.currency || 'S/.';
    const num = Number(amount || 0);
    return `${curr} ${num.toFixed(2)}`;
  }

  // --- PRODUCTOS & INVENTARIO ---
  getProducts() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEYS.PRODUCTS)) || [];
    } catch (e) {
      return [];
    }
  }

  getProductById(id) {
    return this.getProducts().find(p => p.id === id);
  }

  saveProduct(productData) {
    const products = this.getProducts();
    const existingIndex = products.findIndex(p => p.id === productData.id);

    // Calcular márgenes
    const cost = Number(productData.cost || 0);
    const price = Number(productData.price || 0);
    const profitUnit = price - cost;
    const marginPct = price > 0 ? ((profitUnit / price) * 100) : 0;

    const enrichedProduct = {
      ...productData,
      cost,
      price,
      stock: Number(productData.stock || 0),
      minStock: Number(productData.minStock || 0),
      profitUnit,
      marginPct: Number(marginPct.toFixed(1))
    };

    if (existingIndex >= 0) {
      products[existingIndex] = { ...products[existingIndex], ...enrichedProduct };
    } else {
      enrichedProduct.id = enrichedProduct.id || `prod-${Date.now()}`;
      enrichedProduct.sku = enrichedProduct.sku || `PRD-${Math.floor(100 + Math.random() * 900)}`;
      products.unshift(enrichedProduct);
    }

    localStorage.setItem(STORE_KEYS.PRODUCTS, JSON.stringify(products));
    this.emit('products_changed', products);
    return enrichedProduct;
  }

  deleteProduct(id) {
    let products = this.getProducts();
    products = products.filter(p => p.id !== id);
    localStorage.setItem(STORE_KEYS.PRODUCTS, JSON.stringify(products));
    this.emit('products_changed', products);
    return true;
  }

  adjustStock(productId, qtyDelta, reason = 'Ajuste manual', type = 'adjustment') {
    const products = this.getProducts();
    const idx = products.findIndex(p => p.id === productId);
    if (idx === -1) return null;

    const prod = products[idx];
    const oldStock = prod.stock;
    prod.stock = Math.max(0, prod.stock + qtyDelta);

    // Registrar historial de movimiento en settings o producto
    if (!prod.history) prod.history = [];
    prod.history.unshift({
      date: new Date().toISOString(),
      qtyDelta,
      type, // 'restock', 'waste' (merma), 'adjustment', 'sale'
      reason,
      previousStock: oldStock,
      newStock: prod.stock
    });

    localStorage.setItem(STORE_KEYS.PRODUCTS, JSON.stringify(products));
    this.emit('products_changed', products);
    return prod;
  }

  // --- VENTAS & POS ---
  getSales() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEYS.SALES)) || [];
    } catch (e) {
      return [];
    }
  }

  createSale({ items, customer, phone, paymentMethod, discount = 0, amountPaid = 0, notes = '' }) {
    if (!items || items.length === 0) throw new Error('El carrito está vacío');

    const products = this.getProducts();
    let subtotal = 0;
    let totalCost = 0;

    const processedItems = items.map(cartItem => {
      const prod = products.find(p => p.id === cartItem.id);
      const unitPrice = prod ? prod.price : cartItem.price;
      const unitCost = prod ? prod.cost : (cartItem.cost || 0);
      const lineTotal = unitPrice * cartItem.quantity;
      const lineCost = unitCost * cartItem.quantity;

      subtotal += lineTotal;
      totalCost += lineCost;

      // Reducir stock automáticamente
      if (prod) {
        this.adjustStock(prod.id, -cartItem.quantity, `Venta Ticket`, 'sale');
      }

      return {
        id: cartItem.id,
        name: cartItem.name,
        quantity: cartItem.quantity,
        price: unitPrice,
        cost: unitCost,
        subtotal: lineTotal
      };
    });

    const discountAmount = Number(discount || 0);
    const total = Math.max(0, subtotal - discountAmount);
    const netProfit = total - totalCost;
    const paid = amountPaid > 0 ? amountPaid : total;
    const change = Math.max(0, paid - total);

    const shift = this.getCurrentShift();
    const saleRecord = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString(),
      customer: customer ? customer.trim() : 'Cliente General',
      phone: phone || '',
      paymentMethod, // 'cash', 'card', 'digital'
      items: processedItems,
      subtotal,
      discount: discountAmount,
      total,
      totalCost,
      netProfit,
      amountPaid: paid,
      change,
      notes,
      cashShiftId: shift ? shift.id : null
    };

    const sales = this.getSales();
    sales.unshift(saleRecord);
    localStorage.setItem(STORE_KEYS.SALES, JSON.stringify(sales));

    // Registrar ingreso en caja actual si está abierto
    if (shift && shift.isOpen) {
      if (paymentMethod === 'cash') {
        shift.cashSales = (shift.cashSales || 0) + total;
      } else if (paymentMethod === 'card') {
        shift.cardSales = (shift.cardSales || 0) + total;
      } else {
        shift.digitalSales = (shift.digitalSales || 0) + total;
      }
      this.saveShift(shift);
    }

    this.emit('sales_changed', sales);
    this.emit('sale_completed', saleRecord);
    return saleRecord;
  }

  // --- CAJA & ARQUEO ---
  getCurrentShift() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEYS.SHIFT)) || null;
    } catch (e) {
      return null;
    }
  }

  saveShift(shift) {
    localStorage.setItem(STORE_KEYS.SHIFT, JSON.stringify(shift));
    this.emit('shift_changed', shift);
    return shift;
  }

  openShift(initialCash = 100, cashierName = 'Administrador', notes = '') {
    const shift = {
      id: `shift-${Date.now()}`,
      openedAt: new Date().toISOString(),
      closedAt: null,
      isOpen: true,
      cashierName,
      initialCash: Number(initialCash),
      cashSales: 0,
      cardSales: 0,
      digitalSales: 0,
      cashIn: 0,
      cashOut: 0,
      movements: [
        {
          id: `mov-${Date.now()}`,
          type: 'inflow',
          amount: Number(initialCash),
          reason: 'Apertura de turno - Fondo inicial para sencillo',
          timestamp: new Date().toISOString(),
          user: cashierName
        }
      ],
      notes
    };
    return this.saveShift(shift);
  }

  addCashMovement(type, amount, reason, user = 'Cajero') {
    const shift = this.getCurrentShift();
    if (!shift || !shift.isOpen) throw new Error('No hay una caja abierta actualmente');

    const numAmount = Number(amount || 0);
    if (numAmount <= 0) throw new Error('El monto debe ser mayor a cero');

    if (type === 'outflow') {
      shift.cashOut = (shift.cashOut || 0) + numAmount;
    } else {
      shift.cashIn = (shift.cashIn || 0) + numAmount;
    }

    shift.movements = shift.movements || [];
    shift.movements.unshift({
      id: `mov-${Date.now()}`,
      type, // 'inflow' o 'outflow'
      amount: numAmount,
      reason,
      timestamp: new Date().toISOString(),
      user
    });

    return this.saveShift(shift);
  }

  closeShift(countedCash, notes = '') {
    const shift = this.getCurrentShift();
    if (!shift || !shift.isOpen) throw new Error('No hay una caja abierta para cerrar');

    const expectedCash = (shift.initialCash || 0) + (shift.cashSales || 0) + (shift.cashIn || 0) - (shift.cashOut || 0);
    const counted = Number(countedCash || 0);
    const difference = counted - expectedCash; // positivo: sobrante, negativo: faltante

    shift.isOpen = false;
    shift.closedAt = new Date().toISOString();
    shift.expectedCash = expectedCash;
    shift.countedCash = counted;
    shift.difference = difference;
    shift.closingNotes = notes;

    // Guardar en histórico de turnos si existe
    const allShifts = this.getShiftHistory();
    allShifts.unshift(shift);
    localStorage.setItem('ac_shift_history', JSON.stringify(allShifts));

    return this.saveShift(shift);
  }

  getShiftHistory() {
    try {
      return JSON.parse(localStorage.getItem('ac_shift_history')) || [];
    } catch (e) {
      return [];
    }
  }

  // --- PEDIDOS ESPECIALES / ENCARGOS ---
  getSpecialOrders() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEYS.ORDERS)) || [];
    } catch (e) {
      return [];
    }
  }

  saveSpecialOrder(orderData) {
    const orders = this.getSpecialOrders();
    const existingIdx = orders.findIndex(o => o.id === orderData.id);

    const totalAmount = Number(orderData.totalAmount || 0);
    const depositPaid = Number(orderData.depositPaid || 0);
    const pendingBalance = Math.max(0, totalAmount - depositPaid);

    const enrichedOrder = {
      ...orderData,
      totalAmount,
      depositPaid,
      pendingBalance,
      status: orderData.status || 'pending',
      updatedAt: new Date().toISOString()
    };

    if (existingIdx >= 0) {
      orders[existingIdx] = { ...orders[existingIdx], ...enrichedOrder };
    } else {
      enrichedOrder.id = enrichedOrder.id || `ORD-${Math.floor(500 + Math.random() * 500)}`;
      enrichedOrder.createdAt = new Date().toISOString();
      orders.unshift(enrichedOrder);
    }

    localStorage.setItem(STORE_KEYS.ORDERS, JSON.stringify(orders));
    this.emit('orders_changed', orders);
    return enrichedOrder;
  }

  deleteSpecialOrder(id) {
    let orders = this.getSpecialOrders();
    orders = orders.filter(o => o.id !== id);
    localStorage.setItem(STORE_KEYS.ORDERS, JSON.stringify(orders));
    this.emit('orders_changed', orders);
    return true;
  }

  // --- CÁLCULO DE FINANZAS Y GANANCIAS ---
  getFinancialMetrics(periodFilter = 'all') {
    const sales = this.getSales();
    const shift = this.getCurrentShift();
    const products = this.getProducts();

    // Filtrar por período si corresponde (hoy, semana, mes, todo)
    const now = new Date();
    const filteredSales = sales.filter(s => {
      if (periodFilter === 'all') return true;
      const saleDate = new Date(s.date);
      if (periodFilter === 'today') {
        return saleDate.toDateString() === now.toDateString();
      }
      if (periodFilter === 'week') {
        const oneWeekAgo = new Date(now.getTime() - 7 * 86400 * 1000);
        return saleDate >= oneWeekAgo;
      }
      if (periodFilter === 'month') {
        return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
      }
      return true;
    });

    const totalRevenue = filteredSales.reduce((acc, s) => acc + (s.total || 0), 0);
    const totalCOGS = filteredSales.reduce((acc, s) => acc + (s.totalCost || 0), 0);
    const grossProfit = totalRevenue - totalCOGS;
    const profitMargin = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100) : 0;
    const totalTransactions = filteredSales.length;
    const averageTicket = totalTransactions > 0 ? (totalRevenue / totalTransactions) : 0;

    // Métodos de pago
    const paymentBreakdown = {
      cash: filteredSales.filter(s => s.paymentMethod === 'cash').reduce((acc, s) => acc + s.total, 0),
      card: filteredSales.filter(s => s.paymentMethod === 'card').reduce((acc, s) => acc + s.total, 0),
      digital: filteredSales.filter(s => s.paymentMethod === 'digital').reduce((acc, s) => acc + s.total, 0)
    };

    // Dinero en caja actual
    let currentCashInBox = 0;
    if (shift && shift.isOpen) {
      currentCashInBox = (shift.initialCash || 0) + (shift.cashSales || 0) + (shift.cashIn || 0) - (shift.cashOut || 0);
    }

    // Top productos vendidos
    const productSalesMap = {};
    filteredSales.forEach(s => {
      (s.items || []).forEach(it => {
        if (!productSalesMap[it.id]) {
          productSalesMap[it.id] = {
            id: it.id,
            name: it.name,
            quantity: 0,
            revenue: 0,
            profit: 0
          };
        }
        productSalesMap[it.id].quantity += it.quantity;
        productSalesMap[it.id].revenue += it.subtotal;
        productSalesMap[it.id].profit += (it.subtotal - (it.cost * it.quantity));
      });
    });

    const topProducts = Object.values(productSalesMap).sort((a, b) => b.quantity - a.quantity).slice(0, 5);

    // Métricas de inventario
    const inventoryValuationCost = products.reduce((acc, p) => acc + (p.stock * p.cost), 0);
    const inventoryValuationSale = products.reduce((acc, p) => acc + (p.stock * p.price), 0);
    const potentialProfit = inventoryValuationSale - inventoryValuationCost;
    const lowStockCount = products.filter(p => p.stock <= p.minStock).length;

    return {
      totalRevenue,
      totalCOGS,
      grossProfit,
      profitMargin: Number(profitMargin.toFixed(1)),
      totalTransactions,
      averageTicket,
      paymentBreakdown,
      currentCashInBox,
      topProducts,
      inventoryValuationCost,
      inventoryValuationSale,
      potentialProfit,
      lowStockCount,
      filteredSales
    };
  }

  // --- USUARIOS Y AUTENTICACIÓN (ROLES: ADMIN vs VENTAS) ---
  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEYS.USERS)) || INITIAL_USERS;
    } catch (e) {
      return INITIAL_USERS;
    }
  }

  saveUser(userData) {
    const users = this.getUsers();
    const existingIdx = users.findIndex(u => u.id === userData.id);

    const userRecord = {
      ...userData,
      id: userData.id || `usr-${Date.now()}`,
      name: userData.name ? userData.name.trim() : 'Usuario',
      username: userData.username ? userData.username.toLowerCase().trim() : `user${Date.now()}`,
      role: userData.role === 'sales' ? 'sales' : 'admin',
      pin: userData.pin || '1234',
      email: userData.email || '',
      avatar: userData.role === 'sales' ? '💼' : '👑'
    };

    if (existingIdx >= 0) {
      users[existingIdx] = { ...users[existingIdx], ...userRecord };
    } else {
      users.push(userRecord);
    }

    localStorage.setItem(STORE_KEYS.USERS, JSON.stringify(users));
    this.emit('users_changed', users);
    return userRecord;
  }

  deleteUser(id) {
    let users = this.getUsers();
    if (users.length <= 1) {
      throw new Error('No se puede eliminar el único usuario del sistema');
    }
    const current = this.getCurrentUser();
    if (current && current.id === id) {
      throw new Error('No puedes eliminar el usuario con el que has iniciado sesión');
    }
    users = users.filter(u => u.id !== id);
    localStorage.setItem(STORE_KEYS.USERS, JSON.stringify(users));
    this.emit('users_changed', users);
    return true;
  }

  getCurrentUser() {
    try {
      const user = JSON.parse(localStorage.getItem(STORE_KEYS.CURRENT_USER));
      return user || INITIAL_USERS[0];
    } catch (e) {
      return INITIAL_USERS[0];
    }
  }

  login(username, pin) {
    const users = this.getUsers();
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.pin === pin);
    if (!user) {
      throw new Error('Usuario o PIN incorrecto');
    }
    localStorage.setItem(STORE_KEYS.CURRENT_USER, JSON.stringify(user));
    this.emit('user_logged_in', user);
    return user;
  }

  logout() {
    const defaultUser = INITIAL_USERS[1]; // Cambia a ventas o default
    localStorage.setItem(STORE_KEYS.CURRENT_USER, JSON.stringify(defaultUser));
    this.emit('user_logged_in', defaultUser);
    return defaultUser;
  }

  // --- PEDIDOS WEB (DESDE MENÚ DE CLIENTES) ---
  getWebOrders() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEYS.WEB_ORDERS)) || [];
    } catch (e) {
      return [];
    }
  }

  createWebOrder(orderData) {
    if (!orderData.items || orderData.items.length === 0) {
      throw new Error('El pedido debe tener al menos un producto');
    }

    const products = this.getProducts();
    let subtotal = 0;
    let totalCost = 0;

    const items = orderData.items.map(it => {
      const prod = products.find(p => p.id === it.id);
      const price = prod ? prod.price : (it.price || 0);
      const cost = prod ? prod.cost : 0;
      const itemSubtotal = price * it.quantity;
      subtotal += itemSubtotal;
      totalCost += cost * it.quantity;

      return {
        id: it.id,
        name: it.name,
        quantity: it.quantity,
        price,
        cost,
        subtotal: itemSubtotal
      };
    });

    const deliveryFee = Number(orderData.deliveryFee || 0);
    const total = subtotal + deliveryFee;

    const webOrder = {
      id: `WEB-${Math.floor(800 + Math.random() * 9000)}`,
      orderNumber: `#W${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      customer: orderData.customer ? orderData.customer.trim() : 'Cliente Web',
      whatsapp: orderData.whatsapp ? orderData.whatsapp.trim() : '',
      address: orderData.address ? orderData.address.trim() : 'Recojo en tienda',
      deliveryDate: orderData.deliveryDate || new Date().toISOString().split('T')[0],
      deliveryTime: orderData.deliveryTime || '16:00',
      items,
      subtotal,
      deliveryFee,
      total,
      cost: totalCost,
      paymentMethod: orderData.paymentMethod || 'Yape / Plin',
      paymentDeclaredProof: orderData.paymentDeclaredProof || 'Pendiente de envío por WhatsApp',
      paymentStatus: 'pending_verification', // 'pending_verification', 'verified', 'cancelled'
      orderStatus: 'pending', // 'pending', 'in_prep', 'ready', 'delivered', 'cancelled'
      notes: orderData.notes ? orderData.notes.trim() : '',
      cancellationReason: null
    };

    const orders = this.getWebOrders();
    orders.unshift(webOrder);
    localStorage.setItem(STORE_KEYS.WEB_ORDERS, JSON.stringify(orders));

    this.emit('web_orders_changed', orders);
    this.emit('calendar_changed', true);
    return webOrder;
  }

  confirmWebOrderPayment(orderId) {
    const orders = this.getWebOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) throw new Error('Pedido web no encontrado');

    if (order.paymentStatus === 'verified') {
      throw new Error('El pago ya fue confirmado previamente');
    }

    // Descontar stock de productos
    (order.items || []).forEach(it => {
      this.adjustStock(it.id, -it.quantity, `Pedido Web ${order.orderNumber}`, 'sale');
    });

    // Registrar venta en el historial de ventas para que compute en caja y finanzas
    const saleRecord = {
      id: `TKT-W${order.orderNumber.replace('#', '')}`,
      date: new Date().toISOString(),
      customer: `${order.customer} (Web)`,
      phone: order.whatsapp,
      paymentMethod: order.paymentMethod.toLowerCase().includes('yape') ? 'digital' : 'digital',
      items: order.items,
      subtotal: order.subtotal,
      discount: 0,
      total: order.total,
      totalCost: order.cost,
      netProfit: order.total - order.cost,
      amountPaid: order.total,
      change: 0,
      notes: `Venta originada por Pedido Web ${order.id}. Dirección: ${order.address}`,
      cashShiftId: this.getCurrentShift() ? this.getCurrentShift().id : null
    };

    const allSales = this.getSales();
    allSales.unshift(saleRecord);
    localStorage.setItem(STORE_KEYS.SALES, JSON.stringify(allSales));

    // Si hay caja abierta, sumar a ventas digitales
    const shift = this.getCurrentShift();
    if (shift && shift.isOpen) {
      shift.digitalSales = (shift.digitalSales || 0) + order.total;
      this.saveShift(shift);
    }

    order.paymentStatus = 'verified';
    order.orderStatus = 'in_prep';
    order.verifiedAt = new Date().toISOString();
    order.verifiedBy = this.getCurrentUser().name;

    localStorage.setItem(STORE_KEYS.WEB_ORDERS, JSON.stringify(orders));

    this.emit('web_orders_changed', orders);
    this.emit('sales_changed', allSales);
    this.emit('calendar_changed', true);
    return order;
  }

  cancelWebOrder(orderId, reason = 'Cancelado por el cliente o tienda') {
    const orders = this.getWebOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) throw new Error('Pedido web no encontrado');

    // Si ya se había descontado stock, devolverlo
    if (order.paymentStatus === 'verified') {
      (order.items || []).forEach(it => {
        this.adjustStock(it.id, it.quantity, `Devolución x Cancelación Pedido Web ${order.orderNumber}`, 'restock');
      });
    }

    order.paymentStatus = 'cancelled';
    order.orderStatus = 'cancelled';
    order.cancellationReason = reason;
    order.cancelledAt = new Date().toISOString();

    localStorage.setItem(STORE_KEYS.WEB_ORDERS, JSON.stringify(orders));

    this.emit('web_orders_changed', orders);
    this.emit('calendar_changed', true);
    return order;
  }

  updateWebOrderStatus(orderId, status) {
    const orders = this.getWebOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) throw new Error('Pedido no encontrado');

    order.orderStatus = status;
    order.updatedAt = new Date().toISOString();
    localStorage.setItem(STORE_KEYS.WEB_ORDERS, JSON.stringify(orders));

    this.emit('web_orders_changed', orders);
    this.emit('calendar_changed', true);
    return order;
  }

  deleteWebOrder(id) {
    let orders = this.getWebOrders();
    orders = orders.filter(o => o.id !== id);
    localStorage.setItem(STORE_KEYS.WEB_ORDERS, JSON.stringify(orders));
    this.emit('web_orders_changed', orders);
    this.emit('calendar_changed', true);
    return true;
  }

  // --- CALENDARIO UNIFICADO DE ENTREGAS ---
  getCalendarDeliveries() {
    const specialOrders = this.getSpecialOrders();
    const webOrders = this.getWebOrders();

    const deliveries = [];

    // Pedidos especiales
    specialOrders.forEach(so => {
      deliveries.push({
        id: so.id,
        sourceType: 'special',
        title: so.title,
        customer: so.customer,
        phone: so.phone,
        scheduledDate: so.scheduledDate,
        scheduledTime: so.scheduledTime || '16:00',
        details: so.description || so.title,
        notes: so.notes || '',
        totalAmount: so.totalAmount,
        pendingBalance: so.pendingBalance,
        status: so.status // 'pending', 'in_progress', 'ready', 'delivered'
      });
    });

    // Pedidos web
    webOrders.forEach(wo => {
      const itemsDesc = (wo.items || []).map(i => `${i.quantity}x ${i.name}`).join(', ');
      deliveries.push({
        id: wo.id,
        sourceType: 'web',
        title: `Pedido Web ${wo.orderNumber} - ${wo.customer}`,
        customer: wo.customer,
        phone: wo.whatsapp,
        scheduledDate: wo.deliveryDate,
        scheduledTime: wo.deliveryTime || '16:00',
        details: itemsDesc,
        notes: `${wo.notes ? `Nota: ${wo.notes} | ` : ''}Dirección: ${wo.address} | Pago: ${wo.paymentStatus === 'verified' ? 'PAGO CONFIRMADO' : 'PENDIENTE VERIFICAR'}`,
        totalAmount: wo.total,
        pendingBalance: wo.paymentStatus === 'verified' ? 0 : wo.total,
        status: wo.orderStatus // 'pending', 'in_prep', 'ready', 'delivered', 'cancelled'
      });
    });

    // Ordenar por fecha y hora
    return deliveries.sort((a, b) => new Date(`${a.scheduledDate}T${a.scheduledTime}`) - new Date(`${b.scheduledDate}T${b.scheduledTime}`));
  }

  updateCalendarDelivery(sourceType, id, updates) {
    if (sourceType === 'special') {
      const orders = this.getSpecialOrders();
      const order = orders.find(o => o.id === id);
      if (order) {
        if (updates.scheduledDate) order.scheduledDate = updates.scheduledDate;
        if (updates.scheduledTime) order.scheduledTime = updates.scheduledTime;
        if (updates.customer) order.customer = updates.customer;
        if (updates.phone) order.phone = updates.phone;
        if (updates.notes) order.notes = updates.notes;
        if (updates.status) order.status = updates.status;
        if (updates.totalAmount !== undefined) order.totalAmount = Number(updates.totalAmount);
        this.saveSpecialOrder(order);
      }
    } else if (sourceType === 'web') {
      const orders = this.getWebOrders();
      const order = orders.find(o => o.id === id);
      if (order) {
        if (updates.scheduledDate) order.deliveryDate = updates.scheduledDate;
        if (updates.scheduledTime) order.deliveryTime = updates.scheduledTime;
        if (updates.customer) order.customer = updates.customer;
        if (updates.phone) order.whatsapp = updates.phone;
        if (updates.notes) order.notes = updates.notes;
        if (updates.status) order.orderStatus = updates.status;
        if (updates.totalAmount !== undefined) order.total = Number(updates.totalAmount);
        localStorage.setItem(STORE_KEYS.WEB_ORDERS, JSON.stringify(orders));
        this.emit('web_orders_changed', orders);
        this.emit('calendar_changed', true);
      }
    }
  }

  // --- RESPALDO Y RESTABLECIMIENTO ---
  exportBackup() {
    const data = {
      backupDate: new Date().toISOString(),
      business: this.getSettings().businessName,
      products: this.getProducts(),
      sales: this.getSales(),
      shift: this.getCurrentShift(),
      shiftHistory: this.getShiftHistory(),
      orders: this.getSpecialOrders(),
      webOrders: this.getWebOrders(),
      users: this.getUsers(),
      settings: this.getSettings()
    };
    return JSON.stringify(data, null, 2);
  }

  importBackup(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.products) localStorage.setItem(STORE_KEYS.PRODUCTS, JSON.stringify(data.products));
      if (data.sales) localStorage.setItem(STORE_KEYS.SALES, JSON.stringify(data.sales));
      if (data.shift) localStorage.setItem(STORE_KEYS.SHIFT, JSON.stringify(data.shift));
      if (data.orders) localStorage.setItem(STORE_KEYS.ORDERS, JSON.stringify(data.orders));
      if (data.webOrders) localStorage.setItem(STORE_KEYS.WEB_ORDERS, JSON.stringify(data.webOrders));
      if (data.users) localStorage.setItem(STORE_KEYS.USERS, JSON.stringify(data.users));
      if (data.shiftHistory) localStorage.setItem('ac_shift_history', JSON.stringify(data.shiftHistory));
      if (data.settings) localStorage.setItem(STORE_KEYS.SETTINGS, JSON.stringify(data.settings));

      this.emit('backup_restored', true);
      this.emit('products_changed', this.getProducts());
      this.emit('sales_changed', this.getSales());
      this.emit('shift_changed', this.getCurrentShift());
      this.emit('orders_changed', this.getSpecialOrders());
      this.emit('web_orders_changed', this.getWebOrders());
      this.emit('users_changed', this.getUsers());
      this.emit('calendar_changed', true);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  // --- GESTIÓN DE CONTENIDOS DE TIENDA WEB (VISUAL CMS) ---
  getStorefrontContent() {
    try {
      const data = localStorage.getItem(STORE_KEYS.STOREFRONT_CONTENT);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  saveStorefrontContent(content) {
    try {
      const current = this.getStorefrontContent();
      const updated = { ...current, ...content, lastUpdated: new Date().toISOString() };
      localStorage.setItem(STORE_KEYS.STOREFRONT_CONTENT, JSON.stringify(updated));
      this.emit('storefront_content_changed', updated);
      return { success: true, content: updated };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  resetStorefrontContent() {
    try {
      localStorage.removeItem(STORE_KEYS.STOREFRONT_CONTENT);
      this.emit('storefront_content_changed', {});
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  resetToDemo() {
    localStorage.setItem(STORE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORE_KEYS.SALES, JSON.stringify(INITIAL_SALES));
    localStorage.setItem(STORE_KEYS.SHIFT, JSON.stringify(INITIAL_CASH_SHIFT));
    localStorage.setItem(STORE_KEYS.ORDERS, JSON.stringify(INITIAL_SPECIAL_ORDERS));
    localStorage.setItem(STORE_KEYS.WEB_ORDERS, JSON.stringify(INITIAL_WEB_ORDERS));
    localStorage.setItem(STORE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
    localStorage.setItem(STORE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));

    this.emit('products_changed', INITIAL_PRODUCTS);
    this.emit('sales_changed', INITIAL_SALES);
    this.emit('shift_changed', INITIAL_CASH_SHIFT);
    this.emit('orders_changed', INITIAL_SPECIAL_ORDERS);
    this.emit('web_orders_changed', INITIAL_WEB_ORDERS);
    this.emit('users_changed', INITIAL_USERS);
    this.emit('user_logged_in', INITIAL_USERS[0]);
    this.emit('settings_changed', DEFAULT_SETTINGS);
    this.emit('calendar_changed', true);
    return true;
  }
}

// Instancia global
window.appStore = new Store();

