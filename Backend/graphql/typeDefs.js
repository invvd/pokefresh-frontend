const { gql } = require('graphql-tag'); // Necesitarás 'npm install graphql-tag'

// Nota: En una app real, ¡no deberías exponer el password del usuario!
// Esta es una definición de los tipos de datos que tu API puede manejar.

const typeDefs = gql`
  # Modelo de Producto basado en models/Product.js
  type Product {
    id: ID!
    nombre: String!
    precio: Float!
    desc: String
    img: String
    categoria: String!
    stock: Int
  }

  # Modelo de Usuario basado en models/User.js
  type User {
    id: ID!
    email: String!
    role: String
  }

  # Modelo de Pedido basado en models/Order.js
  type OrderItem {
    id: ID
    nombre: String
    cantidad: Int
    precio: Float
  }

  type Order {
    id: ID!
    user: User
    items: [OrderItem]
    total: Float
    status: String
    createdAt: String
  }
  
  # Payload de autenticación (devuelve el token y datos del usuario)
  type AuthPayload {
    token: String!
    user: User!
  }
  
  # Inputs (para crear o actualizar datos)
  
  # Input para los items del carrito al crear una orden
  input OrderItemInput {
    productId: ID!
    cantidad: Int!
  }
  
  # Input para la dirección
  input DireccionInput {
      calle: String!
      comuna: String!
      region: String!
  }

  # QUERIES (Consultas - Leer datos)
  type Query {
    "Obtiene todos los productos"
    products: [Product]
    
    "Obtiene productos por categoría (panaderia, snacks, etc.)"
    productsByCategory(categoria: String!): [Product]
    
    "Obtiene un producto por su ID"
    product(id: ID!): Product
    
    "Obtiene los pedidos del usuario actualmente logueado"
    myOrders: [Order]
    
    "Obtiene el perfil del usuario logueado"
    me: User
  }

  # MUTATIONS (Mutaciones - Escribir/Modificar datos)
  type Mutation {
    "Registra un nuevo usuario"
    register(email: String!, password: String!): AuthPayload
    
    "Inicia sesión de un usuario"
    login(email: String!, password: String!): AuthPayload

    "Crea un nuevo pedido (basado en checkout.html)"
    createOrder(items: [OrderItemInput!]!, direccion: DireccionInput!, fechaDespacho: String!): Order
    
    # --- Mutaciones de Admin ---
    "Crea un nuevo producto (Admin)"
    createProduct(nombre: String!, precio: Float!, categoria: String!, desc: String, img: String, stock: Int): Product
    
    "Actualiza el stock de un producto (Admin - basado en inventario.html)"
    updateStock(productId: ID!, nuevoStock: Int!): Product
    
    "Actualiza el estado de un pedido (Admin - basado en reporteventas.html)"
    updateOrderStatus(orderId: ID!, newStatus: String!): Order
  }
`;

module.exports = typeDefs;