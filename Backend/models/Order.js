const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  nombre: String,
  cantidad: { type: Number, required: true },
  precio: { type: Number, required: true }
});

const OrderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  direccionDespacho: { // Basado en checkout.html
    calle: String,
    comuna: String,
    region: String,
  },
  fechaDespacho: String,
  status: { // Basado en pedidos.html y reporteventas.html
    type: String, 
    default: 'Pendiente', 
    enum: ['Pendiente', 'Preparando', 'En tránsito', 'Entregado', 'Cancelado', 'Retrasado']
  }
}, { timestamps: true }); // timestamps añade createdAt y updatedAt

module.exports = mongoose.model('Order', OrderSchema);