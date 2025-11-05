const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PokeFreshProductSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  nombre: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true },
  imagen: { type: String },
  base: { type: String },
  proteina: { type: String },
  toppings: [{ type: String }],
  alergenos: [{ type: String }],
  ingredientes: { type: String }
});

module.exports = mongoose.model('PokeFreshProduct', PokeFreshProductSchema);