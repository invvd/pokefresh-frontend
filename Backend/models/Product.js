const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  desc: { type: String },
  img: { type: String },
  categoria: { 
    type: String, 
    required: true, 
    enum: ['panaderia', 'snacks', 'harinas', 'bebidas', 'postres', 'nuevos', 'ofertas'] 
  },
  // Tuve en cuenta las categorías de catalogo.html, catalogonuevos.html y catalogooferta.html
  stock: { type: Number, default: 0 } // Basado en inventario.html
});

module.exports = mongoose.model('Product', ProductSchema);