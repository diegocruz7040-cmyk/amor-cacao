// Datos iniciales para Amor & Cacao - Chocolatería & Pastelería Fina
const INITIAL_CATEGORIES = [
  { id: 'todos', name: 'Todos los Productos', icon: '✨' },
  { id: 'bombones', name: 'Bombones & Trufas', icon: '🍬' },
  { id: 'pasteles', name: 'Pasteles & Tartas', icon: '🎂' },
  { id: 'tabletas', name: 'Tabletas de Origen', icon: '🍫' },
  { id: 'postres', name: 'Postres de Vitrina', icon: '🧁' },
  { id: 'bebidas', name: 'Bebidas & Cacao Caliente', icon: '☕' },
  { id: 'regalos', name: 'Cajas de Regalo', icon: '🎁' }
];

const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    sku: 'BOM-012',
    name: 'Caja Selección Bombones de Autor (12 uds)',
    category: 'regalos',
    description: 'Colección de bombones pintados a mano con rellenos de maracuyá, praliné de avellanas, ganache al 70% y frambuesa.',
    price: 68.00,
    cost: 26.50,
    stock: 14,
    minStock: 5,
    unit: 'caja',
    image: 'assets/products/caja_bombones.jpg',
    origin: 'Cacao Chuncho 70% & Piura Blanco',
    isFeatured: true
  },
  {
    id: 'prod-2',
    sku: 'TRU-008',
    name: 'Trufas Clásicas al Cacao Puro 75%',
    category: 'bombones',
    description: 'Trufas de ganache sedosa de chocolate negro espolvoreadas con fino cacao alcalinizado de aroma y toques de canela.',
    price: 36.00,
    cost: 13.20,
    stock: 22,
    minStock: 8,
    unit: 'caja (8 uds)',
    image: 'assets/products/trufas_cacao.jpg',
    origin: 'Cacao Criollo de San Martín 75%',
    isFeatured: true
  },
  {
    id: 'prod-3',
    sku: 'PAS-001',
    name: 'Tarta Ópera Mousse & Espejo de Cacao',
    category: 'pasteles',
    description: 'Capas de bizcocho gianduja, mousse de chocolate belga, praliné crocante de avellanas, glaseado espejo y hoja de oro comestible.',
    price: 88.00,
    cost: 34.00,
    stock: 6,
    minStock: 3,
    unit: 'torta entera (8-10 porc.)',
    image: 'assets/products/tarta_chocolate.jpg',
    origin: 'Chocolate Puro 70% Origen Único',
    isFeatured: true
  },
  {
    id: 'prod-4',
    sku: 'TAB-003',
    name: 'Tableta Bean-to-Bar con Pistachos & Flor de Sal',
    category: 'tabletas',
    description: 'Chocolate artesanal oscuro elaborado desde el grano, con trozos de pistacho tostado, nibs de cacao y cristales de flor de sal.',
    price: 24.50,
    cost: 8.90,
    stock: 35,
    minStock: 10,
    unit: 'tableta 80g',
    image: 'assets/products/tableta_origen.jpg',
    origin: 'Cacao Nativo de Bagua 72%',
    isFeatured: true
  },
  {
    id: 'prod-5',
    sku: 'BEB-002',
    name: 'Chocolate Caliente Artesanal a la Taza',
    category: 'bebidas',
    description: 'Espeso chocolate tradicional preparado a fuego lento con pasta de cacao pura, leche fresca, crema batida y toque de especias.',
    price: 16.00,
    cost: 4.80,
    stock: 50,
    minStock: 15,
    unit: 'taza 300ml',
    image: 'assets/products/chocolate_caliente.jpg',
    origin: 'Pasta Pura de Cacao Quillabamba',
    isFeatured: true
  },
  {
    id: 'prod-6',
    sku: 'POS-004',
    name: 'Cheesecake Horneado de Frutos Rojos & Cacao',
    category: 'postres',
    description: 'Cremoso cheesecake horneado sobre base crujiente de galleta de chocolate amargo, coulis artesanal de frambuesas y moras.',
    price: 18.50,
    cost: 6.20,
    stock: 12,
    minStock: 4,
    unit: 'porción',
    image: 'assets/products/cheesecake_frutos_rojos.jpg',
    origin: 'Queso crema de campo & Cacao 60%',
    isFeatured: true
  },
  {
    id: 'prod-7',
    sku: 'BOM-004',
    name: 'Pack Bombones Corazón Frutos del Bosque (4 uds)',
    category: 'bombones',
    description: 'Bombones en forma de corazón rojo rubí rellenos de reducción de frutos del bosque y ganache de chocolate con leche.',
    price: 22.00,
    cost: 7.50,
    stock: 18,
    minStock: 6,
    unit: 'caja (4 uds)',
    image: 'assets/products/caja_bombones.jpg',
    origin: 'Chocolate con leche 45% & Fresa silvestre',
    isFeatured: false
  },
  {
    id: 'prod-8',
    sku: 'TAB-001',
    name: 'Tableta Chocolate Blanco Tostado & Café Geisha',
    category: 'tabletas',
    description: 'Chocolate blanco caramelizado con manteca de cacao pura infusionada con granos tostados de café Geisha de altura.',
    price: 25.00,
    cost: 9.10,
    stock: 19,
    minStock: 8,
    unit: 'tableta 80g',
    image: 'assets/products/tableta_origen.jpg',
    origin: 'Manteca de Cacao Piura & Café Geisha',
    isFeatured: false
  }
];

const INITIAL_CASH_SHIFT = {
  id: 'shift-101',
  openedAt: new Date().toISOString(),
  closedAt: null,
  isOpen: true,
  cashierName: 'Administrador / Caja Central',
  initialCash: 150.00, // Fondo de caja para vuelto
  cashSales: 168.00,
  cardSales: 112.50,
  digitalSales: 92.50, // Yape / Plin / Transferencia
  cashIn: 0.00,        // Ingresos extras de efectivo
  cashOut: 20.00,      // Gastos de caja chica (ej. compra de fresas)
  movements: [
    {
      id: 'mov-1',
      type: 'inflow',
      amount: 150.00,
      reason: 'Apertura de turno - Fondo inicial para sencillo/vuelto',
      timestamp: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
      user: 'Admin'
    },
    {
      id: 'mov-2',
      type: 'outflow',
      amount: 20.00,
      reason: 'Compra urgente de fresas frescas para decoración de vitrina',
      timestamp: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
      user: 'Pastelero'
    }
  ],
  notes: 'Turno de tarde iniciado con sencillo disponible.'
};

const INITIAL_SALES = [
  {
    id: 'TKT-1001',
    date: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    customer: 'Valeria Mendoza',
    phone: '+51 987 654 321',
    paymentMethod: 'cash',
    items: [
      { id: 'prod-1', name: 'Caja Selección Bombones de Autor (12 uds)', quantity: 1, price: 68.00, cost: 26.50 },
      { id: 'prod-5', name: 'Chocolate Caliente Artesanal a la Taza', quantity: 2, price: 16.00, cost: 4.80 }
    ],
    subtotal: 100.00,
    discount: 0.00,
    total: 100.00,
    totalCost: 36.10,
    netProfit: 63.90,
    amountPaid: 100.00,
    change: 0.00,
    cashShiftId: 'shift-101'
  },
  {
    id: 'TKT-1002',
    date: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
    customer: 'Carlos Delgado',
    phone: '+51 912 345 678',
    paymentMethod: 'card',
    items: [
      { id: 'prod-3', name: 'Tarta Ópera Mousse & Espejo de Cacao', quantity: 1, price: 88.00, cost: 34.00 },
      { id: 'prod-4', name: 'Tableta Bean-to-Bar con Pistachos & Flor de Sal', quantity: 1, price: 24.50, cost: 8.90 }
    ],
    subtotal: 112.50,
    discount: 0.00,
    total: 112.50,
    totalCost: 42.90,
    netProfit: 69.60,
    amountPaid: 112.50,
    change: 0.00,
    cashShiftId: 'shift-101'
  },
  {
    id: 'TKT-1003',
    date: new Date(Date.now() - 3600 * 1000 * 1.5).toISOString(),
    customer: 'Andrea Quispe',
    phone: '+51 999 111 222',
    paymentMethod: 'digital', // Yape/Plin
    items: [
      { id: 'prod-2', name: 'Trufas Clásicas al Cacao Puro 75%', quantity: 2, price: 36.00, cost: 13.20 },
      { id: 'prod-6', name: 'Cheesecake Horneado de Frutos Rojos & Cacao', quantity: 1, price: 18.50, cost: 6.20 }
    ],
    subtotal: 90.50,
    discount: 0.00,
    total: 90.50,
    totalCost: 32.60,
    netProfit: 57.90,
    amountPaid: 90.50,
    change: 0.00,
    cashShiftId: 'shift-101'
  },
  {
    id: 'TKT-1004',
    date: new Date(Date.now() - 3600 * 1000 * 0.5).toISOString(),
    customer: 'Fernando Ramos',
    phone: '',
    paymentMethod: 'cash',
    items: [
      { id: 'prod-1', name: 'Caja Selección Bombones de Autor (12 uds)', quantity: 1, price: 68.00, cost: 26.50 }
    ],
    subtotal: 68.00,
    discount: 0.00,
    total: 68.00,
    totalCost: 26.50,
    netProfit: 41.50,
    amountPaid: 100.00,
    change: 32.00,
    cashShiftId: 'shift-101'
  }
];

const INITIAL_SPECIAL_ORDERS = [
  {
    id: 'ORD-501',
    customer: 'Luciana Barrenechea',
    phone: '+51 945 882 190',
    title: 'Torta de Bodas de Chocolate Gianduja & Fresas silvestres',
    description: 'Torta de 3 pisos, cobertura de ganache terciopelo al 70%, decorada con bombones dorados y flores naturales comestibles.',
    scheduledDate: new Date(Date.now() + 86400 * 1000 * 2).toISOString().split('T')[0],
    scheduledTime: '16:00',
    totalAmount: 320.00,
    depositPaid: 160.00,
    pendingBalance: 160.00,
    status: 'in_progress', // pending, in_progress, ready, delivered
    notes: 'Entregar en salón de eventos "Los Rosales". Cuidar refrigeración.'
  },
  {
    id: 'ORD-502',
    customer: 'Mauricio Silva',
    phone: '+51 977 444 333',
    title: '5 Cajas Personalizadas de Bombones Aniversario',
    description: 'Bombones con letras "M & S - 5 Años" y selección de praliné de avellana con toques de ron añejo.',
    scheduledDate: new Date(Date.now() + 86400 * 1000 * 1).toISOString().split('T')[0],
    scheduledTime: '11:30',
    totalAmount: 250.00,
    depositPaid: 250.00,
    pendingBalance: 0.00,
    status: 'ready',
    notes: 'Cliente recoge en tienda. Empaque con lazo de seda borgoña.'
  }
];

// Usuarios y Roles del Sistema (Administrador vs Personal de Ventas)
const INITIAL_USERS = [
  {
    id: 'usr-1',
    username: 'admin',
    name: 'Alonso Herrera',
    role: 'admin', // Acceso completo (Dashboard, Finanzas, Costos, Configuración, Caja, etc.)
    pin: '1234',
    email: 'admin@amorcacao.com',
    avatar: '👑'
  },
  {
    id: 'usr-2',
    username: 'ventas',
    name: 'Sofia Paredes',
    role: 'sales', // Restringido: POS, Pedidos Web, Calendario, Atención cliente
    pin: '1234',
    email: 'sofia.ventas@amorcacao.com',
    avatar: '💼'
  }
];

// Pedidos Web confirmados desde el Menú de Clientes
const INITIAL_WEB_ORDERS = [
  {
    id: 'WEB-801',
    orderNumber: '#W801',
    createdAt: new Date(Date.now() - 3600 * 1000 * 3).toISOString(),
    customer: 'Camila Villarán',
    whatsapp: '+51 984 555 123',
    address: 'Av. San Martín 620, Tacna Cercado',
    deliveryDate: new Date(Date.now() + 86400 * 1000 * 1).toISOString().split('T')[0],
    deliveryTime: '15:30',
    items: [
      { id: 'prod-1', name: 'Caja Selección Bombones de Autor (12 uds)', quantity: 2, price: 68.00 },
      { id: 'prod-4', name: 'Tableta Bean-to-Bar con Pistachos & Flor de Sal', quantity: 1, price: 24.50 }
    ],
    subtotal: 160.50,
    deliveryFee: 10.00,
    total: 170.50,
    cost: 61.90,
    paymentMethod: 'Yape / Plin',
    paymentDeclaredProof: 'Yape a nombre de Camila V. - Operación #482910',
    paymentStatus: 'pending_verification', // 'pending_verification', 'verified', 'cancelled'
    orderStatus: 'pending', // 'pending', 'in_prep', 'ready', 'delivered', 'cancelled'
    notes: 'Por favor incluir tarjeta de saludo: "Feliz Cumpleaños Mamá"',
    cancellationReason: null
  },
  {
    id: 'WEB-802',
    orderNumber: '#W802',
    createdAt: new Date(Date.now() - 3600 * 1000 * 7).toISOString(),
    customer: 'Rodrigo Benavides',
    whatsapp: '+51 992 888 777',
    address: 'Calle Los Pinos 230, Miraflores',
    deliveryDate: new Date().toISOString().split('T')[0],
    deliveryTime: '18:00',
    items: [
      { id: 'prod-3', name: 'Tarta Ópera Mousse & Espejo de Cacao', quantity: 1, price: 88.00 },
      { id: 'prod-2', name: 'Trufas Clásicas al Cacao Puro 75%', quantity: 1, price: 36.00 }
    ],
    subtotal: 124.00,
    deliveryFee: 0.00, // Recojo en tienda
    total: 124.00,
    cost: 47.20,
    paymentMethod: 'Transferencia BCP',
    paymentDeclaredProof: 'Transferencia BCP #9931201',
    paymentStatus: 'verified',
    orderStatus: 'in_prep',
    notes: 'Cliente recoge en tienda a las 6:00 pm puntual.',
    cancellationReason: null
  }
];

