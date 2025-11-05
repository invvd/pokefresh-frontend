require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const connectDB = require('./config/db');

// Importar esquema y resolvers GraphQL
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

// Importar rutas REST para PokéFresh
const { router: authRoutes } = require('./routes/auth');
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');

const app = express();
const httpServer = http.createServer(app);

connectDB();

const startServer = async () => {
  // Configurar Apollo Server para GraphQL
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  // Middleware global
  app.use(cors({
    origin: true, // Permitir todos los orígenes para desarrollo
    credentials: true
  }));
  app.use(express.json());

  // Rutas REST para PokéFresh
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productsRoutes);
  app.use('/api/orders', ordersRoutes);

  // Endpoint de prueba
  app.get('/api/health', (req, res) => {
    res.json({ ok: true, message: 'PokéFresh API funcionando' });
  });

  // GraphQL endpoint (mantener existente)
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => ({ token: req.headers.token }),
    }),
  );

  const PORT = process.env.PORT || 4000;
  await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
  console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
  console.log(`🍜 API REST en http://localhost:${PORT}/api`);
  console.log(`🔍 GraphQL en http://localhost:${PORT}/graphql`);
};

startServer();