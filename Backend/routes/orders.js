const express = require('express');
const router = express.Router();
const PokeFreshOrder = require('../models/PokeFreshOrder');
const { validateToken } = require('./auth');

// Crear orden
router.post('/', async (req, res) => {
  try {
    const { productos, total, totalCantidad } = req.body;

    // Generar ID único
    const orderId = `PF${Date.now().toString().slice(-6)}`;

    const order = new PokeFreshOrder({
      id: orderId,
      fecha: new Date().toISOString(),
      productos,
      totalCantidad,
      total,
      estado: 'pendiente'
    });

    await order.save();
    const { _id, __v, ...orderSinMongo } = order.toObject();
    res.status(201).json(orderSinMongo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Listar órdenes (protegido)
router.get('/', validateToken, async (req, res) => {
  try {
    const orders = await PokeFreshOrder.find({}, '-_id -__v').sort({ fecha: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar estado de orden (protegido)
router.put('/:id/status', validateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await PokeFreshOrder.findOneAndUpdate(
      { id },
      { estado: status },
      { new: true, projection: '-_id -__v' }
    );

    if (!order) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    res.json({ ok: true, order_id: id, status, order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;