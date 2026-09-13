# AMOR & CACAO — DOCUMENTACIÓN Y RESUMEN INTEGRAL DEL SISTEMA

**Chocolatería de Autor & Haute Pâtisserie (Tacna, Perú)**  
*Plataforma Comercial Dual: Tienda Web Boutique (E-Commerce) + Sistema ERP / POS / Gestión de Pedidos*

---

## 📌 1. Visión General del Proyecto

Este proyecto es una solución integral y desacoplada para **Amor & Cacao**, diseñada bajo una estética **Dark Luxury / Haute Chocolaterie** (anti-AI slop), libre de emojis estándar, con iconografía vectorial SVG, físicas a 60 FPS y una arquitectura modular preparada para alta concurrencia.

El sistema opera en dos frentes perfectamente conectados:

1. **🌐 Tienda Web Boutique (Storefront de Cara al Cliente - `index.html` / `tienda.html`)**:
   - Experiencia de compra sensorial para clientes en Tacna y Perú.
   - Catálogo de creaciones con notas de cata de autor, porcentajes de cacao y maridajes recomendados.
   - Selector dinámico de presentaciones y cálculo de inversión en tiempo real.
   - Carrito de compras desplegable tipo drawer lateral con checkout directo a doble vía: registro en sistema POS + mensaje oficial formateado a WhatsApp.
   - **Studio de Diseño Visual In-Place (Estilo Canva / Photoshop)**: Herramienta administrativa para editar el 100% de los textos, fotos de productos y paleta de colores directamente sobre la web (`?editor=active`).

2. **🛡️ Plataforma Administrativa POS / ERP (`admin.html` / `pos.html`)**:
   - Punto de venta rápido con cálculo de vuelto, boletas y comandas.
   - Módulo exclusivo de **Recepción y Validación de Pedidos Web** en tiempo real.
   - Gestión de stock e inventario con alertas de existencias críticas.
   - Calendario interactivo de entregas y despachos programados.
   - Control de caja chica (apertura, movimientos, arqueo y cierre de turno).
   - Métricas de ventas, gráficos analíticos y reportes descargables.

---

## 📁 2. Estructura del Repositorio y Archivos

```
Tienda_Postres/
├── assets/
│   ├── logo.jpg                         # Emblema oficial del Atelier (fondo negro y dorado)
│   └── products/                        # Fotografías de alta resolución de creaciones
│       ├── caja_bombones.jpg
│       ├── cheesecake_frutos_rojos.jpg
│       ├── chocolate_caliente.jpg
│       ├── tableta_origen.jpg
│       ├── tarta_chocolate.jpg
│       └── trufas_cacao.jpg
├── css/
│   ├── styles.css                       # Estilos del Panel Administrativo POS / ERP
│   └── storefront.css                   # Diseño Dark Luxury, físicas, Studio y responsive
├── js/
│   ├── data.js                          # Datos maestros iniciales (productos, categorías, usuarios)
│   ├── store.js                         # Capa de datos central (Repository / Pub-Sub / DAL)
│   ├── app.js                           # Lógica del POS, pedidos web, caja, calendario y gráficos
│   └── storefront.js                    # Lógica de la tienda, carrito, checkout y Studio visual
├── index.html                           # Tienda Web Principal (carga por defecto en la raíz /)
├── tienda.html                          # Vista idéntica de la Tienda Web (alias directo)
├── admin.html                           # Panel de Gestión POS / ERP para el personal
├── pos.html                             # Alias directo del Panel de Gestión POS
├── server.js                            # Servidor local Node.js para desarrollo y pruebas
├── vercel.json                          # Enrutamiento estático ultra-rápido para Vercel
├── .gitignore                           # Archivos omitidos en el control de versiones
└── RESUMEN_PROYECTO.md                  # Este documento de arquitectura y resumen
```

---

## 🛠️ 3. Módulos y Funcionalidades Detalladas

### A. Tienda Web de Clientes (`tienda.html`)
- **Cabecera Flotante con Glassmorphism**: Logotipo del atelier, navegación fluida a anclas (`#vitrina`, `#filosofia`, `#ritual`, `#contacto`), estado *"Atelier Abierto"* y acceso a la bolsa de selección.
- **Hero Asimétrico Split-Screen**: Narrativa de culto, coordenadas de cacao Chuncho/Piura, creación insignia y llamada a la acción.
- **La Vitrina de Autor (Catálogo Interactivo)**:
  - Tarjetas de producto con efecto cursor spotlight tracker y tilt 3D a 60 FPS.
  - Píldoras interactivas de presentación (ej. Caja 8 uds, 12 uds, 24 uds) que actualizan el precio al instante.
  - Ficha de cata sensorial emergente (origen, altitud, % cacao, notas de cata y maridaje).
  - Etiquetas aromáticas interactivas con toast notifications.
- **Checkout Doble Vía**:
  - Modal/Drawer de selección con cálculo de delivery o recojo en Paseo Cívico / Atelier.
  - Validación de datos: Nombre, WhatsApp, dirección y fecha de entrega.
  - Guarda el pedido en `ac_web_orders` y dispara el enlace directo a WhatsApp con el pedido codificado.

### B. Gestor de Diseño Visual Studio (Estilo Canva / Photoshop)
- Se activa mediante el parámetro `tienda.html?editor=active` o desde el botón en el POS.
- **100% de Textos Editables (121 claves `data-cms-key`)**: Titulares, subtítulos, axiomas, manifiesto, botones y políticas.
- **Edición Bidireccional**: Al hacer clic en cualquier texto, se refleja en el textarea de la barra lateral (`#studioTextInput`) y viceversa.
- **Inspector Tipográfico**: Cambio de tipografía (*Playfair Display, Cinzel, Plus Jakarta Sans, Outfit, Inter, Georgia*), tamaño fino (slider y botones −/+), negrita, cursiva, subrayado, alineaciones y color.
- **Gestor de Fotos**: Subida de imágenes desde la computadora con compresión automática en `<canvas>` (JPEG 82%, max 1200px) para evitar saturación de memoria. Permite cambiar la foto del Hero, el Logo y cualquiera de las 6 creaciones de la vitrina.
- **Paleta de Colores en 1 Clic**: Presets cromáticos (*Oro & Cacao Negro, Champagne & Trufa, Cobre & Selva Alta, Borgoña Noble*) y selectores individuales de variables CSS.
- **Botón Deshacer (`Ctrl+Z`)**: Historial de 40 estados para retroceder cualquier modificación paso a paso.
- **Botón Descartar**: Restablecimiento total a fábrica o al último estado publicado.
- **Protección de Clics**: Mientras se edita, los botones de compra y enlaces quedan pausados para no abrir el carrito ni saltar de página.
- **Ajuste de Cabecera**: La barra de navegación de la tienda desciende 52px para quedar completamente visible y editable debajo de la barra flotante de administración.

### C. Sistema Administrativo POS / ERP (`index.html`)
- **Punto de Venta Rápido**: Búsqueda por código o nombre, filtrado por categorías, cálculo de vuelto, impresión de tickets/boletas y registro de ventas.
- **Módulo de Pedidos Web**:
  - Tablero centralizado de pedidos recibidos desde la tienda web.
  - Muestra cliente, número de WhatsApp, fecha de entrega solicitada, desglose de ítems, subtotal y delivery.
  - Botón de confirmación de pago manual (cambia estado a `Confirmado`).
  - Botón de cancelación con motivo y reintegro automático de stock al inventario.
  - Enlace directo con 1 clic para chatear por WhatsApp con el cliente.
- **Control de Inventario**: Alerta visual de stock bajo, edición rápida de precios y existencias. Sincronizado en tiempo real con la tienda web.
- **Calendario de Entregas**: Vista mensual y semanal que agrupa los pedidos pendientes según la fecha de despacho prometida.
- **Caja Chica**: Registro de saldo inicial, ingresos extraordinarios, egresos justificados y arqueo final.

---

## 🔒 4. Arquitectura de Seguridad y Producción

### Cero Fuga de Credenciales (F12 / DevTools Safe)
1. **Frontend Limpio**: En los archivos públicos que se descargan al navegador no existen claves maestras, tokens de servicio ni contraseñas.
2. **Ocultamiento de Accesos Internos**: El botón *"Panel POS"* está oculto por defecto para los clientes de la tienda y solo se activa cuando se inicia sesión administrativa.
3. **Persistencia y Sincronización en la Nube**:
   - **Vercel**: Alojamiento en la red de borde (Edge CDN) para velocidad ultrarrápida (20-40ms) y resistencia a picos de tráfico concurrentes sin saturación.
   - **Vercel Rewrites (`vercel.json`)**:
     - `https://amor-cacao.vercel.app/` → Despacha automáticamente la tienda web (`index.html`).
     - `https://amor-cacao.vercel.app/admin` → Despacha el panel administrativo POS (`admin.html`).
   - **Supabase (PostgreSQL + WebSockets)**:
     - Base de datos en la nube con Row Level Security (RLS).
     - Clientes públicos solo pueden ejecutar `INSERT` en pedidos; tienen denegado el `SELECT` sobre otros clientes para garantizar privacidad total (PII).
     - Actualizaciones en tiempo real por WebSockets: un pedido web aparece en la pantalla del cajero en <100ms sin recargar la página.

---

## 🚀 5. Comandos de Ejecución Local

Para probar el proyecto en tu computadora:

```powershell
# Iniciar servidor local en el puerto 3000
node server.js

# Rutas disponibles en el navegador local:
# Tienda Web Pública:     http://localhost:3000/
# Modo Editor en Vivo:    http://localhost:3000/tienda.html?editor=active
# Panel POS / ERP Admin:  http://localhost:3000/admin
```

---

## 🌐 6. Enlaces Oficiales en Producción (En Vivo)

### A. Vercel (Producción Oficial con CI/CD)
* 🌐 **Tienda Web Boutique**: [https://amor-cacao.vercel.app/](https://amor-cacao.vercel.app/)
* 🛡️ **Panel Administrativo POS**: [https://amor-cacao.vercel.app/admin](https://amor-cacao.vercel.app/admin) (o `/admin.html` / `/pos.html`)
* ⚙️ **Dashboard Vercel**: `https://vercel.com/aira-2317/amor-cacao`

### B. GitHub (Repositorio y GitHub Pages Respaldo)
* 📁 **Repositorio**: [https://github.com/diegocruz7040-cmyk/amor-cacao](https://github.com/diegocruz7040-cmyk/amor-cacao)
* 🌐 **Tienda Web (GitHub Pages)**: [https://diegocruz7040-cmyk.github.io/amor-cacao/](https://diegocruz7040-cmyk.github.io/amor-cacao/)
* 🛡️ **Panel POS (GitHub Pages)**: [https://diegocruz7040-cmyk.github.io/amor-cacao/admin.html](https://diegocruz7040-cmyk.github.io/amor-cacao/admin.html)
