# PokéFresh - Aplicación Completa

Una aplicación web completa para venta de bowls hawaianos inspirados en Pokémon, con frontend en HTML/CSS/JS y backend en Node.js + Express + MongoDB.

## 🚀 Configuración y Ejecución

### Requisitos Previos

- Node.js 16+
- MongoDB (local o MongoDB Atlas)
- Un navegador web moderno

### Backend (Node.js + Express + MongoDB)

1. **Instalar dependencias:**

```powershell
cd Backend
npm install
```

2. **Configurar variables de entorno:**
   El archivo `.env` ya está configurado con:

- MongoDB Atlas (conexión incluida)
- Credenciales admin: `admin` / `pokefresh2025`
- Puerto: `4000`

3. **Iniciar el servidor:**

```powershell
npm run dev
```

El backend estará disponible en:

- API REST: `http://localhost:4000/api`
- GraphQL (existente): `http://localhost:4000/graphql`
- Health check: `http://localhost:4000/api/health`

### Frontend

1. **Abrir el frontend:**
   Simplemente abrir `index.html` en un navegador web o usar un servidor local:

```powershell
# Opción 1: Abrir directamente
start index.html

# Opción 2: Servidor local con Python (opcional)
python -m http.server 3000

# Opción 3: Servidor local con Node.js live-server (opcional)
npx live-server --port=3000
```

2. **Acceso al sistema:**

- **Tienda principal:** `index.html`
- **Panel admin:** Clic en "👨‍💼 Admin" o ir a `login.html`
- **Credenciales:** `admin` / `pokefresh2025`

## 🔌 Integración Frontend-Backend

El frontend ahora está completamente integrado con el backend:

### APIs REST Disponibles

**Autenticación:**

- `POST /api/auth/login` - Login con usuario/contraseña

**Productos:**

- `GET /api/products` - Listar todos los productos (público)
- `POST /api/products` - Crear producto (requiere autenticación)

**Órdenes:**

- `POST /api/orders` - Crear nueva orden (público)
- `GET /api/orders` - Listar órdenes (requiere autenticación)
- `PUT /api/orders/:id/status` - Actualizar estado de orden (requiere autenticación)

### Características de la Integración

1. **Productos dinámicos:** El frontend carga productos desde el backend automáticamente
2. **Órdenes persistentes:** Las compras se guardan en MongoDB
3. **Autenticación real:** Login válida tokens con el backend
4. **Gestión de estado:** Los cambios de estado de pedidos se sincronizan
5. **Modo offline:** Fallback a localStorage si el backend no está disponible

## 🛠️ Funcionalidades

### Tienda (Frontend)

- ✅ Catálogo de productos dinámico
- ✅ Filtros por base, proteína, toppings y alérgenos
- ✅ Carrito de compras funcional
- ✅ Checkout y creación de órdenes
- ✅ Diseño responsivo hawaiano

### Panel Admin (Dashboard)

- ✅ Login con autenticación real
- ✅ Estadísticas de ventas en tiempo real
- ✅ Gestión completa de pedidos (pendientes → procesando → completados)
- ✅ Filtros por fecha y estado
- ✅ Exportación de datos a CSV
- ✅ Reportes imprimibles

### Backend (APIs)

- ✅ API REST completa
- ✅ Base de datos MongoDB
- ✅ Autenticación con tokens
- ✅ CORS configurado para el frontend
- ✅ Gestión de productos y órdenes
- ✅ GraphQL legacy (mantiene compatibilidad)

## 📊 Base de Datos

### Colecciones MongoDB:

- `pokefreshproducts` - Productos del catálogo
- `pokefreshorders` - Órdenes de compra
- `sessions` - Sesiones de admin

### Datos iniciales:

- 8 bowls Pokémon predefinidos se crean automáticamente
- Precios en pesos chilenos
- Estados de orden: pendiente → procesando → completado/cancelado

## 🔧 Desarrollo

### Estructura del proyecto:

```
/
├── Backend/              # Servidor Node.js
│   ├── models/          # Modelos de datos
│   ├── routes/          # Rutas REST
│   ├── config/          # Configuración DB
│   └── graphql/         # GraphQL (legacy)
├── index.html           # Tienda principal
├── login.html           # Login admin
├── dashboard.html       # Panel administrativo
├── script.js           # Lógica principal
├── login.js            # Autenticación
├── dashboard.js        # Gestión de pedidos
└── *.css              # Estilos
```

### Flujo de datos:

1. **Cliente:** Navega por productos → Añade al carrito → Checkout
2. **API:** `POST /api/orders` crea la orden en MongoDB
3. **Admin:** Ve pedidos en dashboard → Cambia estados
4. **API:** `PUT /api/orders/:id/status` actualiza en MongoDB
5. **Sincronización:** Frontend se actualiza con datos reales

## 🎯 Estado del Proyecto

**✅ Completado:**

- Backend API REST funcional
- Frontend integrado con backend
- Autenticación real
- Gestión completa de pedidos
- Base de datos persistente
- Modo offline como fallback

**🔄 Funcionamiento:**

- El sistema está completamente operativo
- Las órdenes se guardan en MongoDB
- Los administradores pueden gestionar pedidos en tiempo real
- El frontend funciona incluso si el backend está desconectado

## 🚦 Cómo Probar

1. **Iniciar backend:** `cd Backend && npm run dev`
2. **Abrir frontend:** `index.html` en navegador
3. **Hacer una compra:** Añadir productos → checkout
4. **Ver como admin:** Login → Dashboard → Gestionar pedido
5. **Verificar persistencia:** Cerrar/abrir navegador y backend

¡El sistema está listo para usar! 🍜✨
