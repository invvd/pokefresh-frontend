// Configuración de API
const API_BASE_URL = 'http://localhost:4000/api';

// Datos de productos (ahora se cargan desde el backend)
let productos = [];

// Cargar productos desde el backend
async function cargarProductosDesdeAPI() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error('Error cargando productos');
    }
    productos = await response.json();
    renderizarProductos(productos);
  } catch (error) {
    console.error('Error:', error);
    // Fallback: usar productos hardcodeados
    productos = [
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
        descripción: "Intenso y poderoso como la furia de Gyarados",
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
    renderizarProductos(productos);
  }
}

// Variables globales
let carritoItems = [];
let productosFiltrados = [...productos];
let filtrosVisibles = false;

// Estructura mejorada para items del carrito
class CarritoItem {
  constructor(producto, cantidad = 1) {
    this.id = producto.id;
    this.nombre = producto.nombre;
    this.precio = producto.precio;
    this.imagen = producto.imagen;
    this.cantidad = cantidad;
  }

  get subtotal() {
    return this.precio * this.cantidad;
  }
}

// Inicialización
document.addEventListener('DOMContentLoaded', function () {
  // Cargar productos desde la API
  cargarProductosDesdeAPI();

  configurarFiltros();

  // Cargar carrito desde localStorage
  cargarCarrito();

  // Inicializar filtros como ocultos
  const filtrosContainer = document.getElementById('filtros-container');
  if (filtrosContainer) {
    filtrosContainer.classList.add('hidden');
  }

  // Cerrar carrito con ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      cerrarCarrito();
    }
  });
});

// Función para renderizar productos
function renderizarProductos(productosArray) {
  const grid = document.getElementById('productos-grid');

  // Actualizar contador
  actualizarContadorProductos(productosArray.length);

  if (productosArray.length === 0) {
    grid.innerHTML = '<div class="no-productos">🔍 No se encontraron productos que coincidan con los filtros seleccionados</div>';
    return;
  }

  grid.innerHTML = productosArray.map(producto => `
        <div class="producto-card" data-id="${producto.id}">
            <div class="producto-imagen">
                <img src="${producto.imagen}" alt="${producto.nombre}" class="bowl-image" onerror="manejarErrorImagen(this, '${producto.nombre}')">
                <div class="imagen-overlay">
                    <div class="pokemon-badge">${obtenerEmojiPokemon(producto.nombre)}</div>
                </div>
            </div>
            <div class="producto-info">
                <h3 class="producto-nombre">${producto.nombre}</h3>
                <p class="producto-descripcion">${producto.descripcion}</p>
                
                <div class="producto-detalles">
                    <div class="detalle-grupo">
                        <strong>Base:</strong> ${capitalizarPrimeraLetra(producto.base)}
                    </div>
                    <div class="detalle-grupo">
                        <strong>Proteína:</strong> ${capitalizarPrimeraLetra(producto.proteina)}
                    </div>
                    <div class="detalle-grupo">
                        <strong>Toppings:</strong> ${producto.toppings.map(t => capitalizarPrimeraLetra(t)).join(', ')}
                    </div>
                    <div class="detalle-grupo">
                        <strong>Ingredientes:</strong> ${producto.ingredientes}
                    </div>
                </div>
                
                ${producto.alergenos.length > 0 ? `
                    <div class="producto-alergenos">
                        ${producto.alergenos.map(alergeno =>
    `<span class="alergeno-tag">⚠️ ${capitalizarPrimeraLetra(alergeno)}</span>`
  ).join('')}
                    </div>
                ` : ''}
                
                <div class="producto-precio">$${producto.precio.toLocaleString('es-CL')} CLP</div>
                
                <button class="agregar-carrito" onclick="agregarAlCarrito(${producto.id})">
                    🛒 Agregar al Carrito
                </button>
            </div>
        </div>
    `).join('');
}

// Función para configurar filtros
function configurarFiltros() {
  const filtrosBases = document.querySelectorAll('.filtro-base');
  const filtrosProteinas = document.querySelectorAll('.filtro-proteina');
  const filtrosToppings = document.querySelectorAll('.filtro-topping');
  const filtrosAlergenos = document.querySelectorAll('.filtro-alergeno');

  // Agregar event listeners a todos los filtros
  [...filtrosBases, ...filtrosProteinas, ...filtrosToppings, ...filtrosAlergenos].forEach(filtro => {
    filtro.addEventListener('change', aplicarFiltros);
  });
}

// Función para aplicar filtros
function aplicarFiltros() {
  const basesSeleccionadas = Array.from(document.querySelectorAll('.filtro-base:checked')).map(cb => cb.value);
  const proteinasSeleccionadas = Array.from(document.querySelectorAll('.filtro-proteina:checked')).map(cb => cb.value);
  const toppingsSeleccionados = Array.from(document.querySelectorAll('.filtro-topping:checked')).map(cb => cb.value);
  const alergenosExcluidos = Array.from(document.querySelectorAll('.filtro-alergeno:checked')).map(cb => cb.value);

  productosFiltrados = productos.filter(producto => {
    // Filtro por base
    const cumpleBase = basesSeleccionadas.length === 0 || basesSeleccionadas.includes(producto.base);

    // Filtro por proteína
    const cumpleProteina = proteinasSeleccionadas.length === 0 || proteinasSeleccionadas.includes(producto.proteina);

    // Filtro por toppings (el producto debe tener al menos uno de los toppings seleccionados)
    const cumpleToppings = toppingsSeleccionados.length === 0 ||
      toppingsSeleccionados.some(topping => producto.toppings.includes(topping));

    // Filtro por alérgenos (excluir productos que contengan alérgenos marcados)
    const cumpleAlergenos = alergenosExcluidos.length === 0 ||
      !alergenosExcluidos.some(alergeno => {
        switch (alergeno) {
          case 'gluten':
            return producto.alergenos.includes('gluten') || producto.base === 'arroz'; // Simplificado
          case 'lacteos':
            return producto.alergenos.includes('lacteos');
          case 'frutos-secos':
            return producto.alergenos.includes('frutos-secos');
          case 'soja':
            return producto.alergenos.includes('soja') || producto.proteina === 'tofu';
          default:
            return false;
        }
      });

    return cumpleBase && cumpleProteina && cumpleToppings && cumpleAlergenos;
  });

  renderizarProductos(productosFiltrados);
}

// Función para resetear filtros
function resetFiltros() {
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = false;
  });
  productosFiltrados = [...productos];
  renderizarProductos(productos);
}

// Función para actualizar contador de productos
function actualizarContadorProductos(cantidad) {
  const contador = document.getElementById('productos-count');
  if (contador) {
    // Añadir animación de actualización
    contador.classList.add('updated');
    contador.textContent = cantidad;

    // Remover la clase después de la animación
    setTimeout(() => {
      contador.classList.remove('updated');
    }, 300);
  }
}

// Función para mostrar/ocultar filtros
function toggleFiltros() {
  const filtrosContainer = document.getElementById('filtros-container');
  const filtrosIcon = document.querySelector('.filtros-icon');
  const filtrosText = document.querySelector('.filtros-text');

  filtrosVisibles = !filtrosVisibles;

  if (filtrosVisibles) {
    filtrosContainer.classList.remove('hidden');
    filtrosIcon.classList.add('rotated');
    filtrosText.textContent = 'Ocultar Filtros';
  } else {
    filtrosContainer.classList.add('hidden');
    filtrosIcon.classList.remove('rotated');
    filtrosText.textContent = 'Mostrar Filtros';
  }
}

// Función para agregar al carrito
function agregarAlCarrito(productoId) {
  const producto = productos.find(p => p.id === productoId);
  if (!producto) return;

  // Verificar si el producto ya existe en el carrito
  const itemExistente = carritoItems.find(item => item.id === productoId);

  if (itemExistente) {
    itemExistente.cantidad++;
  } else {
    carritoItems.push(new CarritoItem(producto));
  }

  actualizarContadorCarrito();
  actualizarCarritoUI();
  mostrarNotificacion(`${producto.nombre} agregado al carrito! 🎉`);

  // Guardar en localStorage
  guardarCarrito();
}

// Función para actualizar contador del carrito
function actualizarContadorCarrito() {
  const contador = document.querySelector('.cart-count');
  const totalItems = carritoItems.reduce((total, item) => total + item.cantidad, 0);
  contador.textContent = totalItems;

  // Animación del carrito
  const carritoIcon = document.querySelector('.cart-icon');
  carritoIcon.style.transform = 'scale(1.1)';
  setTimeout(() => {
    carritoIcon.style.transform = 'scale(1)';
  }, 200);
}

// Función para mostrar/ocultar carrito
function toggleCarrito() {
  const modal = document.getElementById('carrito-modal');
  if (modal.style.display === 'block') {
    cerrarCarrito();
  } else {
    abrirCarrito();
  }
}

// Función para abrir carrito
function abrirCarrito() {
  const modal = document.getElementById('carrito-modal');
  modal.style.display = 'block';
  actualizarCarritoUI();

  // Prevenir scroll del body
  document.body.style.overflow = 'hidden';
}

// Función para cerrar carrito
function cerrarCarrito() {
  const modal = document.getElementById('carrito-modal');
  modal.style.display = 'none';

  // Restaurar scroll del body
  document.body.style.overflow = 'auto';
}

// Función para actualizar la UI del carrito
function actualizarCarritoUI() {
  const carritoItemsContainer = document.getElementById('carrito-items');
  const totalPrecio = document.getElementById('total-precio');

  if (carritoItems.length === 0) {
    carritoItemsContainer.innerHTML = `
      <div class="carrito-vacio">
        <div class="carrito-vacio-icon">🛒</div>
        <p>Tu carrito está vacío</p>
        <p>¡Agrega algunos deliciosos bowls hawaianos!</p>
      </div>
    `;
    totalPrecio.textContent = '$0 CLP';
    return;
  }

  carritoItemsContainer.innerHTML = carritoItems.map(item => `
    <div class="carrito-item">
      <div class="item-imagen">
        <img src="${item.imagen}" alt="${item.nombre}" onload="this.style.display='block'; this.nextElementSibling.style.display='none';" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" style="display: block;">
        <div style="display: none; width: 100%; height: 100%; align-items: center; justify-content: center; background: linear-gradient(45deg, #00c9ff, #92fe9d, #ff6b9d); font-size: 1.5rem; color: white; border-radius: 10px;">
          ${obtenerEmojiPokemon(item.nombre)}
        </div>
      </div>
      <div class="item-info">
        <div class="item-nombre">${item.nombre}</div>
        <div class="item-precio">$${item.precio.toLocaleString('es-CL')} CLP c/u</div>
      </div>
      <div class="item-controles">
        <button class="cantidad-btn" onclick="cambiarCantidad(${item.id}, -1)" ${item.cantidad <= 1 ? 'disabled' : ''}>-</button>
        <span class="item-cantidad">${item.cantidad}</span>
        <button class="cantidad-btn" onclick="cambiarCantidad(${item.id}, 1)">+</button>
        <button class="eliminar-item" onclick="eliminarDelCarrito(${item.id})">🗑️</button>
      </div>
    </div>
  `).join('');

  // Actualizar total
  const total = carritoItems.reduce((sum, item) => sum + item.subtotal, 0);
  totalPrecio.textContent = `$${total.toLocaleString('es-CL')} CLP`;
}

// Función para cambiar cantidad de un item
function cambiarCantidad(productoId, cambio) {
  const item = carritoItems.find(item => item.id === productoId);
  if (!item) return;

  item.cantidad += cambio;

  if (item.cantidad <= 0) {
    eliminarDelCarrito(productoId);
    return;
  }

  actualizarContadorCarrito();
  actualizarCarritoUI();
  guardarCarrito();
}

// Función para eliminar item del carrito
function eliminarDelCarrito(productoId) {
  const index = carritoItems.findIndex(item => item.id === productoId);
  if (index > -1) {
    const producto = carritoItems[index];
    carritoItems.splice(index, 1);

    actualizarContadorCarrito();
    actualizarCarritoUI();
    guardarCarrito();

    mostrarNotificacion(`${producto.nombre} eliminado del carrito`, 'warning');
  }
}

// Función para procesar pedido
function procesarPedido() {
  if (carritoItems.length === 0) {
    mostrarNotificacion('Tu carrito está vacío', 'warning');
    return;
  }

  const total = carritoItems.reduce((sum, item) => sum + item.subtotal, 0);
  const resumenPedido = carritoItems.map(item =>
    `${item.cantidad}x ${item.nombre} - $${item.subtotal.toLocaleString('es-CL')} CLP`
  ).join('\n');

  // Simular procesamiento
  const modal = document.querySelector('.carrito-contenido');
  modal.innerHTML = `
    <div class="pedido-procesando">
      <div style="text-align: center; padding: 3rem 2rem;">
        <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
        <h3 style="color: #00d4aa; margin-bottom: 1rem;">¡Pedido Confirmado!</h3>
        <p style="margin-bottom: 2rem; color: #666;">
          Gracias por elegir PokéFresh. Tu pedido está siendo preparado por nuestros chefs Pokémon.
        </p>
        <div style="background: #f0fdfa; padding: 1rem; border-radius: 10px; margin-bottom: 2rem; text-align: left;">
          <strong>Resumen del pedido:</strong><br>
          ${resumenPedido.replace(/\n/g, '<br>')}
          <br><br>
          <strong>Total: $${total.toLocaleString('es-CL')} CLP</strong>
        </div>
        <button onclick="finalizarPedido()" style="
          background: linear-gradient(45deg, #ff6b9d, #00d4aa);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 25px;
          font-weight: 700;
          cursor: pointer;
          font-size: 1rem;
        ">
          ¡Entendido! 🏝️
        </button>
      </div>
    </div>
  `;
}

// Función para finalizar pedido
function finalizarPedido() {
  // Guardar la venta en localStorage para el dashboard
  guardarVenta();

  carritoItems = [];
  actualizarContadorCarrito();
  cerrarCarrito();
  limpiarCarrito();
  mostrarNotificacion('¡Esperamos que disfrutes tu comida hawaiana! 🌺', 'success');
}

// Función para guardar la venta en el backend
async function guardarVenta() {
  if (carritoItems.length === 0) return;

  // Calcular totales
  const total = carritoItems.reduce((sum, item) => sum + item.subtotal, 0);
  const totalCantidad = carritoItems.reduce((sum, item) => sum + item.cantidad, 0);

  // Crear payload para el backend
  const orderData = {
    productos: carritoItems.map(item => ({
      id: item.id,
      nombre: item.nombre,
      precio: item.precio,
      cantidad: item.cantidad
    })),
    totalCantidad: totalCantidad,
    total: total
  };

  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      throw new Error('Error creando orden');
    }

    const result = await response.json();
    console.log('Orden creada:', result);

    // También guardar en localStorage como fallback/cache
    const ventasExistentes = JSON.parse(localStorage.getItem('pokefresh_ventas') || '[]');
    const nuevaVenta = {
      id: result.id,
      fecha: result.fecha,
      productos: result.productos,
      totalCantidad: result.totalCantidad,
      total: result.total,
      estado: result.estado
    };
    ventasExistentes.unshift(nuevaVenta);
    localStorage.setItem('pokefresh_ventas', JSON.stringify(ventasExistentes));

  } catch (error) {
    console.error('Error guardando venta en el backend:', error);

    // Fallback: guardar solo en localStorage
    const ventasExistentes = JSON.parse(localStorage.getItem('pokefresh_ventas') || '[]');
    const nuevaVenta = {
      id: `PF${String(Date.now()).slice(-6)}`,
      fecha: new Date().toISOString(),
      productos: carritoItems.map(item => ({
        id: item.id,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad
      })),
      totalCantidad: totalCantidad,
      total: total,
      estado: 'procesando'
    };
    ventasExistentes.unshift(nuevaVenta);
    localStorage.setItem('pokefresh_ventas', JSON.stringify(ventasExistentes));
  }
}// Función para guardar carrito en localStorage
function guardarCarrito() {
  localStorage.setItem('pokefresh-carrito', JSON.stringify(carritoItems));
}

// Función para cargar carrito desde localStorage
function cargarCarrito() {
  const carritoGuardado = localStorage.getItem('pokefresh-carrito');
  if (carritoGuardado) {
    const items = JSON.parse(carritoGuardado);
    carritoItems = items.map(item => {
      const carritoItem = new CarritoItem({ id: item.id, nombre: item.nombre, precio: item.precio, imagen: item.imagen });
      carritoItem.cantidad = item.cantidad;
      return carritoItem;
    });
    actualizarContadorCarrito();
  }
}

// Función para limpiar carrito
function limpiarCarrito() {
  localStorage.removeItem('pokefresh-carrito');
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'success') {
  const colores = {
    success: 'linear-gradient(45deg, #00d4aa, #92fe9d)',
    warning: 'linear-gradient(45deg, #ffa726, #ffcc02)',
    error: 'linear-gradient(45deg, #ff6b6b, #ee5a52)'
  };

  // Crear elemento de notificación
  const notificacion = document.createElement('div');
  notificacion.textContent = mensaje;
  notificacion.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colores[tipo]};
        color: white;
        padding: 1rem 2rem;
        border-radius: 25px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        font-weight: 600;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;

  document.body.appendChild(notificacion);

  // Mostrar notificación
  setTimeout(() => {
    notificacion.style.transform = 'translateX(0)';
  }, 100);

  // Ocultar notificación
  setTimeout(() => {
    notificacion.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (document.body.contains(notificacion)) {
        document.body.removeChild(notificacion);
      }
    }, 300);
  }, 3000);
}

// Función para capitalizar primera letra
function capitalizarPrimeraLetra(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Función para obtener emoji del Pokémon según el nombre
function obtenerEmojiPokemon(nombre) {
  const emojiMap = {
    'Pikachu': '⚡',
    'Squirtle': '🌊',
    'Bulbasaur': '🌱',
    'Charmander': '🔥',
    'Snorlax': '😴',
    'Jigglypuff': '🎵',
    'Gyarados': '🐉',
    'Eevee': '🦊'
  };

  for (const pokemon in emojiMap) {
    if (nombre.includes(pokemon)) {
      return emojiMap[pokemon];
    }
  }
  return '⭐';
}

// Función para scroll suave a productos
function scrollToProducts() {
  document.getElementById('productos').scrollIntoView({
    behavior: 'smooth'
  });
}

// Funciones adicionales para interactividad

// Animación de entrada para las cards
function animarEntradaCards() {
  const cards = document.querySelectorAll('.producto-card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';

    setTimeout(() => {
      card.style.transition = 'all 0.5s ease';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, index * 100);
  });
}

// Intersection Observer para animaciones al hacer scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observar elementos cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  const elementsToAnimate = document.querySelectorAll('.producto-card, .stat, .filtro-grupo');
  elementsToAnimate.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
  });
});

// Efecto parallax suave para el hero
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const parallax = document.querySelector('.hero');
  const speed = scrolled * 0.5;

  if (parallax) {
    parallax.style.transform = `translateY(${speed}px)`;
  }
});

// Función para manejar el menú móvil (preparada para futuras mejoras)
function toggleMobileMenu() {
  // Implementación futura para menú móvil
  console.log('Menú móvil activado');
}

// Event listeners adicionales
document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll para todos los enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Efecto hover para las cards de productos
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('.producto-card')) {
      const card = e.target.closest('.producto-card');
      card.style.transform = 'translateY(-10px) scale(1.02)';
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('.producto-card')) {
      const card = e.target.closest('.producto-card');
      card.style.transform = 'translateY(0) scale(1)';
    }
  });
});

// Función para manejar errores de carga de imágenes
function manejarErrorImagen(img, nombreProducto) {
  // URLs de respaldo para diferentes tipos de bowls
  const imagenesRespaldo = {
    'Squirtle': 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400&h=300&fit=crop&crop=center',
    'Pikachu': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop&crop=center',
    'Bulbasaur': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop&crop=center',
    'Charmander': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop&crop=center',
    'Snorlax': 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop&crop=center',
    'Jigglypuff': 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=400&h=300&fit=crop&crop=center',
    'Gyarados': 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=400&h=300&fit=crop&crop=center',
    'Eevee': 'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=400&h=300&fit=crop&crop=center'
  };

  // Buscar qué Pokémon corresponde al producto
  let pokemonEncontrado = null;
  for (const pokemon in imagenesRespaldo) {
    if (nombreProducto.includes(pokemon)) {
      pokemonEncontrado = pokemon;
      break;
    }
  }

  // Si encontramos el Pokémon y tenemos una imagen de respaldo
  if (pokemonEncontrado && img.src !== imagenesRespaldo[pokemonEncontrado]) {
    img.src = imagenesRespaldo[pokemonEncontrado];
  } else {
    // Si todo falla, usar un placeholder con el emoji del Pokémon
    const emoji = obtenerEmojiPokemon(nombreProducto);
    img.style.display = 'none';
    img.parentElement.innerHTML = `
      <div style="
        width: 100%;
        height: 100%;
        background: linear-gradient(45deg, #00c9ff, #92fe9d, #ff6b9d);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 4rem;
        color: white;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      ">${emoji}</div>
      <div class="imagen-overlay">
        <div class="pokemon-badge">${emoji}</div>
      </div>
    `;
  }
}