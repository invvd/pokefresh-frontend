const express = require('express');
const router = express.Router();
const PokeFreshProduct = require('../models/PokeFreshProduct');
const { validateToken } = require('./auth');

// Productos iniciales que coinciden con el frontend
const productosIniciales = [
  {
    id: 1,
    nombre: "Bowl Pikachu Tropical",
    descripcion: "Bowl energético con la frescura tropical que Pikachu ama",
    precio: 12500,
    imagen: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&crop=center",
    base: "arroz",
    proteina: "salmon",
    toppings: ["aguacate", "mango", "edamame"],
    alergenos: ["pescado"],
    ingredientes: "Arroz, salmón fresco, aguacate, mango, edamame, salsa ponzu"
  },
  {
    id: 2,
    nombre: "Bowl Squirtle Oceánico",
    descripcion: "Fresco como las olas del mar, perfecto para los amantes del agua",
    precio: 11900,
    imagen: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop&crop=center",
    base: "ensalada",
    proteina: "atun",
    toppings: ["alga", "aguacate", "sesamo"],
    alergenos: ["pescado", "sesamo"],
    ingredientes: "Mix de ensaladas, atún rojo, alga nori, aguacate, semillas de sésamo"
  },
  {
    id: 3,
    nombre: "Bowl Bulbasaur Garden",
    descripcion: "100% vegetal como nuestro querido Pokémon planta",
    precio: 10500,
    imagen: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=center",
    base: "quinoa",
    proteina: "tofu",
    toppings: ["aguacate", "edamame", "alga"],
    alergenos: ["soja"],
    ingredientes: "Quinoa, tofu marinado, aguacate, edamame, alga wakame, tahini"
  },
  {
    id: 4,
    nombre: "Bowl Charmander Fire",
    descripcion: "Picante y ardiente como la cola de Charmander",
    precio: 13200,
    imagen: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop&crop=center",
    base: "arroz",
    proteina: "pollo",
    toppings: ["mango", "edamame", "sesamo"],
    alergenos: ["sesamo", "soja"],
    ingredientes: "Arroz, pollo teriyaki picante, mango, edamame, salsa sriracha, sésamo"
  },
  {
    id: 5,
    nombre: "Bowl Snorlax Comfort",
    descripcion: "Abundante y satisfactorio como el apetito de Snorlax",
    precio: 14800,
    imagen: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop&crop=center",
    base: "arroz",
    proteina: "salmon",
    toppings: ["aguacate", "mango", "edamame", "alga"],
    alergenos: ["pescado"],
    ingredientes: "Arroz integral, salmón teriyaki, aguacate, mango, edamame, alga nori"
  },
  {
    id: 6,
    nombre: "Bowl Jigglypuff Sweet",
    descripcion: "Dulce y adorable como la melodía de Jigglypuff",
    precio: 11300,
    imagen: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=300&fit=crop&crop=center",
    base: "quinoa",
    proteina: "tofu",
    toppings: ["mango", "aguacate", "sesamo"],
    alergenos: ["soja", "sesamo"],
    ingredientes: "Quinoa rosa, tofu dulce, mango, aguacate, salsa de coco, sésamo negro"
  },
  {
    id: 7,
    nombre: "Bowl Gyarados Storm",
    descripcion: "Intenso y poderoso como la furia de Gyarados",
    precio: 15500,
    imagen: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop&crop=center",
    base: "ensalada",
    proteina: "atun",
    toppings: ["alga", "edamame", "sesamo"],
    alergenos: ["pescado", "sesamo"],
    ingredientes: "Mix marino, atún especiado, alga kombu, edamame, wasabi, sésamo tostado"
  },
  {
    id: 8,
    nombre: "Bowl Eevee Evolution",
    descripcion: "Versátil y adaptable como las evoluciones de Eevee",
    precio: 12900,
    imagen: "https://images.unsplash.com/photo-1544982503-9f984c14501a?w=400&h=300&fit=crop&crop=center",
    base: "quinoa",
    proteina: "pollo",
    toppings: ["aguacate", "mango", "edamame"],
    alergenos: ["soja"],
    ingredientes: "Quinoa tricolor, pollo al vapor, aguacate, mango, edamame, vinagreta asiática"
  }
];

// Inicializar productos si no existen
const initializeProducts = async () => {
  try {
    const count = await PokeFreshProduct.countDocuments();
    if (count === 0) {
      await PokeFreshProduct.insertMany(productosIniciales);
      console.log('Productos iniciales creados');
    }
  } catch (error) {
    console.error('Error inicializando productos:', error);
  }
};

// Listar productos
router.get('/', async (req, res) => {
  try {
    await initializeProducts(); // Asegurar que existan productos
    const productos = await PokeFreshProduct.find({}, '-_id -__v');
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear producto (protegido)
router.post('/', validateToken, async (req, res) => {
  try {
    const producto = new PokeFreshProduct(req.body);
    await producto.save();
    const { _id, __v, ...productoSinMongo } = producto.toObject();
    res.status(201).json(productoSinMongo);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;