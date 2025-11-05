const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PokeFreshOrderSchema = new Schema({
  id: { type: String, required: true, unique: true },
  fecha: { type: String, required: true }, // ISO string
  productos: [{
    id: { type: Number, required: true },
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    cantidad: { type: Number, required: true }
  }],
  totalCantidad: { type: Number, required: true },
  total: { type: Number, required: true },
  estado: {
    type: String,
    required: true,
    enum: ['pendiente', 'procesando', 'completado', 'cancelado'],
    default: 'pendiente'
  }
});

module.exports = mongoose.model('PokeFreshOrder', PokeFreshOrderSchema);