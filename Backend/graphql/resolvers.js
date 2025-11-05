const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');

// (Necesitarás una función de utilidad para manejar la autenticación)
// (Esta es una implementación simplificada. En una app real, manejarías el token desde el 'context' de Apollo)

const resolvers = {
  Query: {
    products: async () => await Product.find({}),
    productsByCategory: async (_, { categoria }) => {
      return await Product.find({ categoria: categoria });
    },
    product: async (_, { id }) => await Product.findById(id),

    // (Estas consultas requerirían autenticación real)
    myOrders: async (parent, args, context) => {
      // if (!context.userId) throw new GraphQLError('No autenticado', { extensions: { code: 'UNAUTHENTICATED' } });
      // return await Order.find({ user: context.userId }).populate('user');
      return []; // Placeholder
    },
    me: async (parent, args, context) => {
      // if (!context.userId) return null;
      // return await User.findById(context.userId);
      return null; // Placeholder
    },
  },

  Mutation: {
    register: async (_, { email, password }) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new GraphQLError('El usuario ya existe', { extensions: { code: 'BAD_REQUEST' } });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        email,
        password: hashedPassword,
        role: email.includes('@admin') ? 'admin' : 'cliente' // Lógica de admin simple
      });
      await user.save();

      const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

      return { user, token };
    },

    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new GraphQLError('Usuario no encontrado', { extensions: { code: 'BAD_REQUEST' } });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new GraphQLError('Contraseña incorrecta', { extensions: { code: 'BAD_REQUEST' } });
      }

      const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

      return { user, token };
    },

    createOrder: async (_, { items, direccion, fechaDespacho }, context) => {
      // (Aquí necesitarías el ID del usuario autenticado)
      // const userId = context.userId;
      // if (!userId) throw new GraphQLError('No autenticado', { extensions: { code: 'UNAUTHENTICATED' } });

      const userId = "ID_DEL_USUARIO_LOGUEADO"; // Placeholder

      let total = 0;
      const processedItems = await Promise.all(items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) throw new GraphQLError(`Producto ${item.productId} no encontrado`);
        total += product.precio * item.cantidad;
        return {
          product: product.id,
          nombre: product.nombre,
          cantidad: item.cantidad,
          precio: product.precio
        };
      }));

      const order = new Order({
        user: userId,
        items: processedItems,
        total: total,
        direccionDespacho: direccion,
        fechaDespacho: fechaDespacho,
        status: 'Pendiente'
      });

      await order.save();
      return order;
    },

  }
};

module.exports = resolvers;