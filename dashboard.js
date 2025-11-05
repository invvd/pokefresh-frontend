// Dashboard para administración de ventas
const API_BASE_URL = 'http://localhost:4000/api';

document.addEventListener('DOMContentLoaded', function () {
  // Verificar autenticación
  verificarAutenticacion();

  // Cargar datos iniciales
  cargarDatos();

  // Configurar fechas por defecto
  configurarFechasPorDefecto();
});

// Verificar si el usuario está autenticado
function verificarAutenticacion() {
  const session = localStorage.getItem('pokefresh_admin_session');

  if (!session) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const sessionData = JSON.parse(session);
    if (!sessionData.isAuthenticated) {
      window.location.href = 'login.html';
      return;
    }

    // Mostrar nombre de usuario
    document.getElementById('username-display').textContent = sessionData.username;

  } catch (e) {
    localStorage.removeItem('pokefresh_admin_session');
    window.location.href = 'login.html';
  }
}

// Cerrar sesión
function cerrarSesion() {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    localStorage.removeItem('pokefresh_admin_session');
    window.location.href = 'login.html';
  }
}

// Cargar y mostrar datos de ventas
async function cargarDatos() {
  const ventas = await obtenerVentasGuardadas();

  actualizarEstadisticas(ventas);
  mostrarTablaVentas(ventas);
  mostrarProductosPopulares(ventas);
  mostrarGestionPedidos(ventas);
}

// Obtener ventas del backend o localStorage como fallback
async function obtenerVentasGuardadas() {
  try {
    const session = JSON.parse(localStorage.getItem('pokefresh_admin_session') || '{}');

    if (session.token && !session.offline) {
      // Intentar obtener desde el backend
      const response = await fetch(`${API_BASE_URL}/orders`, {
        headers: {
          'Authorization': `Bearer ${session.token}`
        }
      });

      if (response.ok) {
        const orders = await response.json();
        // Guardar también en localStorage como cache
        localStorage.setItem('pokefresh_ventas', JSON.stringify(orders));
        return orders;
      }
    }
  } catch (error) {
    console.error('Error obteniendo órdenes del backend:', error);
  }

  // Fallback: usar localStorage
  let ventas = JSON.parse(localStorage.getItem('pokefresh_ventas') || '[]');

  // Si no hay ventas, generar datos de ejemplo
  if (ventas.length === 0) {
    ventas = generarVentasEjemplo();
    localStorage.setItem('pokefresh_ventas', JSON.stringify(ventas));
  }

  return ventas;
}

// Generar datos de ejemplo para demostración
function generarVentasEjemplo() {
  const productos = [
    { id: 1, nombre: "Bowl Pikachu Tropical", precio: 12500 },
    { id: 2, nombre: "Bowl Squirtle Oceánico", precio: 11900 },
    { id: 3, nombre: "Bowl Bulbasaur Garden", precio: 10500 },
    { id: 4, nombre: "Bowl Charmander Fire", precio: 13200 },
    { id: 5, nombre: "Bowl Snorlax Comfort", precio: 14800 },
    { id: 6, nombre: "Bowl Jigglypuff Sweet", precio: 11300 },
    { id: 7, nombre: "Bowl Gyarados Storm", precio: 15500 },
    { id: 8, nombre: "Bowl Eevee Evolution", precio: 12900 }
  ];

  const ventas = [];
  const hoy = new Date();

  // Generar 20 ventas de ejemplo en los últimos 30 días
  for (let i = 0; i < 20; i++) {
    const fechaVenta = new Date(hoy);
    fechaVenta.setDate(fechaVenta.getDate() - Math.floor(Math.random() * 30));

    const cantidadProductos = Math.floor(Math.random() * 3) + 1; // 1-3 productos por venta
    const productosVenta = [];
    let totalVenta = 0;
    let totalCantidad = 0;

    for (let j = 0; j < cantidadProductos; j++) {
      const producto = productos[Math.floor(Math.random() * productos.length)];
      const cantidad = Math.floor(Math.random() * 2) + 1; // 1-2 unidades por producto

      productosVenta.push({
        ...producto,
        cantidad: cantidad
      });

      totalVenta += producto.precio * cantidad;
      totalCantidad += cantidad;
    }

    // Determinar estado basado en la fecha (pedidos más recientes tienden a estar pendientes)
    let estado;
    const diasDiferencia = Math.floor((hoy - fechaVenta) / (1000 * 60 * 60 * 24));

    if (diasDiferencia === 0) {
      estado = ['pendiente', 'procesando'][Math.floor(Math.random() * 2)];
    } else if (diasDiferencia <= 2) {
      estado = ['procesando', 'completado', 'pendiente'][Math.floor(Math.random() * 3)];
    } else {
      estado = ['completado', 'completado', 'procesando'][Math.floor(Math.random() * 3)];
    }

    ventas.push({
      id: `PF${String(i + 1).padStart(4, '0')}`,
      fecha: fechaVenta.toISOString(),
      productos: productosVenta,
      totalCantidad: totalCantidad,
      total: totalVenta,
      estado: estado
    });
  }

  return ventas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
}

// Actualizar estadísticas generales
function actualizarEstadisticas(ventas) {
  const ventasFiltradas = filtrarVentasPorFecha(ventas);

  const totalVentas = ventasFiltradas.reduce((sum, venta) => sum + venta.total, 0);
  const totalPedidos = ventasFiltradas.length;
  const totalBowls = ventasFiltradas.reduce((sum, venta) => sum + venta.totalCantidad, 0);
  const ticketPromedio = totalPedidos > 0 ? totalVentas / totalPedidos : 0;

  document.getElementById('ventas-totales').textContent = `$${totalVentas.toLocaleString('es-CL')} CLP`;
  document.getElementById('total-pedidos').textContent = totalPedidos;
  document.getElementById('total-bowls').textContent = totalBowls;
  document.getElementById('ticket-promedio').textContent = `$${Math.round(ticketPromedio).toLocaleString('es-CL')} CLP`;
}

// Mostrar tabla de ventas
function mostrarTablaVentas(ventas) {
  const tbody = document.getElementById('sales-tbody');
  const noData = document.getElementById('no-data');
  const ventasFiltradas = filtrarVentasPorFecha(ventas);

  if (ventasFiltradas.length === 0) {
    tbody.innerHTML = '';
    noData.style.display = 'block';
    return;
  }

  noData.style.display = 'none';

  tbody.innerHTML = ventasFiltradas.map(venta => {
    const fecha = new Date(venta.fecha);
    const fechaFormateada = fecha.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const productosTexto = venta.productos.map(p =>
      `${p.cantidad}x ${p.nombre}`
    ).join('<br>');

    const estadoClass = `estado-${venta.estado}`;
    const estadoTexto = {
      'completado': '✅ Completado',
      'procesando': '🔄 Procesando',
      'pendiente': '⏳ Pendiente'
    }[venta.estado] || venta.estado;

    return `
            <tr>
                <td>${fechaFormateada}</td>
                <td><strong>${venta.id}</strong></td>
                <td>${productosTexto}</td>
                <td><strong>${venta.totalCantidad}</strong></td>
                <td><strong>$${venta.total.toLocaleString('es-CL')} CLP</strong></td>
                <td><span class="estado-badge ${estadoClass}">${estadoTexto}</span></td>
            </tr>
        `;
  }).join('');
}

// Mostrar productos más vendidos
function mostrarProductosPopulares(ventas) {
  const ventasFiltradas = filtrarVentasPorFecha(ventas);
  const productosStats = {};

  // Calcular estadísticas por producto
  ventasFiltradas.forEach(venta => {
    venta.productos.forEach(producto => {
      if (!productosStats[producto.id]) {
        productosStats[producto.id] = {
          nombre: producto.nombre,
          precio: producto.precio,
          totalVendidos: 0,
          totalIngresos: 0
        };
      }

      productosStats[producto.id].totalVendidos += producto.cantidad;
      productosStats[producto.id].totalIngresos += producto.precio * producto.cantidad;
    });
  });

  // Convertir a array y ordenar por cantidad vendida
  const productosArray = Object.values(productosStats)
    .sort((a, b) => b.totalVendidos - a.totalVendidos)
    .slice(0, 6); // Top 6 productos

  const container = document.getElementById('popular-products');

  if (productosArray.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #718096;">No hay datos de productos vendidos</p>';
    return;
  }

  container.innerHTML = productosArray.map(producto => `
        <div class="popular-product-card">
            <div class="product-header">
                <span class="product-name">${producto.nombre}</span>
                <span class="product-sales">${producto.totalVendidos} vendidos</span>
            </div>
            <div class="product-details">
                Precio unitario: $${producto.precio.toLocaleString('es-CL')} CLP
            </div>
            <div class="product-revenue">
                Ingresos: $${producto.totalIngresos.toLocaleString('es-CL')} CLP
            </div>
        </div>
    `).join('');
}

// Configurar fechas por defecto (último mes)
function configurarFechasPorDefecto() {
  const hoy = new Date();
  const haceUnMes = new Date();
  haceUnMes.setMonth(haceUnMes.getMonth() - 1);

  document.getElementById('fecha-fin').value = hoy.toISOString().split('T')[0];
  document.getElementById('fecha-inicio').value = haceUnMes.toISOString().split('T')[0];
}

// Filtrar ventas por rango de fechas
function filtrarVentasPorFecha(ventas) {
  const fechaInicio = document.getElementById('fecha-inicio').value;
  const fechaFin = document.getElementById('fecha-fin').value;

  if (!fechaInicio && !fechaFin) {
    return ventas;
  }

  return ventas.filter(venta => {
    const fechaVenta = new Date(venta.fecha).toISOString().split('T')[0];

    if (fechaInicio && fechaVenta < fechaInicio) return false;
    if (fechaFin && fechaVenta > fechaFin) return false;

    return true;
  });
}

// Filtrar por fecha (llamado desde los inputs)
function filtrarPorFecha() {
  cargarDatos();
}

// Limpiar filtros
function limpiarFiltros() {
  document.getElementById('fecha-inicio').value = '';
  document.getElementById('fecha-fin').value = '';
  cargarDatos();
}

// Exportar a CSV
function exportarCSV() {
  const ventas = obtenerVentasGuardadas();
  const ventasFiltradas = filtrarVentasPorFecha(ventas);

  if (ventasFiltradas.length === 0) {
    alert('No hay datos para exportar');
    return;
  }

  // Crear contenido CSV
  const headers = ['Fecha', 'ID Pedido', 'Productos', 'Cantidad Total', 'Total (CLP)', 'Estado'];
  let csvContent = headers.join(',') + '\n';

  ventasFiltradas.forEach(venta => {
    const fecha = new Date(venta.fecha).toLocaleDateString('es-CL');
    const productos = venta.productos.map(p => `${p.cantidad}x ${p.nombre}`).join('; ');

    const row = [
      fecha,
      venta.id,
      `"${productos}"`,
      venta.totalCantidad,
      venta.total,
      venta.estado
    ];

    csvContent += row.join(',') + '\n';
  });

  // Descargar archivo
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `pokefresh_ventas_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
}

// Generar reporte
function generarReporte() {
  const ventas = obtenerVentasGuardadas();
  const ventasFiltradas = filtrarVentasPorFecha(ventas);

  if (ventasFiltradas.length === 0) {
    alert('No hay datos para generar el reporte');
    return;
  }

  const totalVentas = ventasFiltradas.reduce((sum, venta) => sum + venta.total, 0);
  const totalPedidos = ventasFiltradas.length;
  const totalBowls = ventasFiltradas.reduce((sum, venta) => sum + venta.totalCantidad, 0);

  const fechaInicio = document.getElementById('fecha-inicio').value || 'Inicio';
  const fechaFin = document.getElementById('fecha-fin').value || 'Fin';

  const reporte = `
🍜 REPORTE DE VENTAS POKÉFRESH
=====================================

📅 Período: ${fechaInicio} - ${fechaFin}
📊 Resumen:
• Total de ventas: $${totalVentas.toLocaleString('es-CL')} CLP
• Pedidos realizados: ${totalPedidos}
• Bowls vendidos: ${totalBowls}
• Ticket promedio: $${Math.round(totalVentas / totalPedidos).toLocaleString('es-CL')} CLP

🏆 Top 3 Productos:
${obtenerTop3Productos(ventasFiltradas)}

Generado el: ${new Date().toLocaleString('es-CL')}
    `.trim();

  // Mostrar en nueva ventana para imprimir
  const ventanaReporte = window.open('', '_blank');
  ventanaReporte.document.write(`
        <html>
            <head>
                <title>Reporte PokéFresh</title>
                <style>
                    body { font-family: monospace; padding: 20px; white-space: pre-line; }
                    button { margin: 20px 0; padding: 10px 20px; }
                </style>
            </head>
            <body>
                <button onclick="window.print()">🖨️ Imprimir</button>
                <button onclick="window.close()">❌ Cerrar</button>
                ${reporte}
            </body>
        </html>
    `);
}

// Obtener top 3 productos para el reporte
function obtenerTop3Productos(ventas) {
  const productosStats = {};

  ventas.forEach(venta => {
    venta.productos.forEach(producto => {
      if (!productosStats[producto.id]) {
        productosStats[producto.id] = {
          nombre: producto.nombre,
          totalVendidos: 0
        };
      }
      productosStats[producto.id].totalVendidos += producto.cantidad;
    });
  });

  return Object.values(productosStats)
    .sort((a, b) => b.totalVendidos - a.totalVendidos)
    .slice(0, 3)
    .map((producto, index) => `${index + 1}. ${producto.nombre}: ${producto.totalVendidos} unidades`)
    .join('\n');
}

// === GESTIÓN DE PEDIDOS ===

let filtroEstadoActual = 'all';

// Mostrar la sección de gestión de pedidos
function mostrarGestionPedidos(ventas) {
  actualizarContadoresEstado(ventas);
  mostrarPedidos(ventas);
}

// Actualizar contadores de estado
function actualizarContadoresEstado(ventas) {
  const contadores = {
    all: ventas.length,
    pendiente: ventas.filter(v => v.estado === 'pendiente').length,
    procesando: ventas.filter(v => v.estado === 'procesando').length,
    completado: ventas.filter(v => v.estado === 'completado').length
  };

  Object.keys(contadores).forEach(estado => {
    const elemento = document.getElementById(`count-${estado}`);
    if (elemento) {
      elemento.textContent = contadores[estado];
    }
  });
}

// Filtrar pedidos por estado
function filtrarPorEstado(estado) {
  filtroEstadoActual = estado;

  // Actualizar botones de filtro
  document.querySelectorAll('.status-filter').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-status="${estado}"]`).classList.add('active');

  // Mostrar pedidos filtrados
  const ventas = obtenerVentasGuardadas();
  mostrarPedidos(ventas);
}

// Mostrar pedidos en la grilla
function mostrarPedidos(ventas) {
  const container = document.getElementById('orders-grid');
  const noOrders = document.getElementById('no-orders');

  // Filtrar por estado si es necesario
  let ventasFiltradas = ventas;
  if (filtroEstadoActual !== 'all') {
    ventasFiltradas = ventas.filter(venta => venta.estado === filtroEstadoActual);
  }

  // Aplicar filtros de fecha también
  ventasFiltradas = filtrarVentasPorFecha(ventasFiltradas);

  if (ventasFiltradas.length === 0) {
    container.innerHTML = '';
    noOrders.style.display = 'block';
    return;
  }

  noOrders.style.display = 'none';

  container.innerHTML = ventasFiltradas.map(venta => {
    const fecha = new Date(venta.fecha);
    const fechaFormateada = fecha.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const productosHTML = venta.productos.map(producto => `
      <div class="product-item">
        <span class="product-name">${producto.nombre}</span>
        <span class="product-quantity">${producto.cantidad}x</span>
        <span class="product-price">$${(producto.precio * producto.cantidad).toLocaleString('es-CL')} CLP</span>
      </div>
    `).join('');

    const estadoTexto = {
      'pendiente': '⏳ Pendiente',
      'procesando': '🔄 Procesando',
      'completado': '✅ Completado'
    }[venta.estado] || venta.estado;

    const acciones = generarAccionesPedido(venta);

    return `
      <div class="order-card ${venta.estado}">
        <div class="order-header">
          <div>
            <div class="order-id">${venta.id}</div>
            <div class="order-date">${fechaFormateada}</div>
          </div>
          <div class="order-status ${venta.estado}">${estadoTexto}</div>
        </div>
        
        <div class="order-products">
          <h4>🍜 Productos:</h4>
          ${productosHTML}
        </div>
        
        <div class="order-total">
          <span class="order-total-label">Total del pedido:</span>
          <span class="order-total-amount">$${venta.total.toLocaleString('es-CL')} CLP</span>
        </div>
        
        <div class="order-actions">
          ${acciones}
        </div>
      </div>
    `;
  }).join('');
}

// Generar botones de acción según el estado del pedido
function generarAccionesPedido(venta) {
  const acciones = [];

  switch (venta.estado) {
    case 'pendiente':
      acciones.push(`<button class="action-btn btn-process" onclick="cambiarEstadoPedido('${venta.id}', 'procesando')">🔄 Procesar</button>`);
      acciones.push(`<button class="action-btn btn-cancel" onclick="cambiarEstadoPedido('${venta.id}', 'cancelado')">❌ Cancelar</button>`);
      break;

    case 'procesando':
      acciones.push(`<button class="action-btn btn-complete" onclick="cambiarEstadoPedido('${venta.id}', 'completado')">✅ Completar</button>`);
      acciones.push(`<button class="action-btn btn-cancel" onclick="cambiarEstadoPedido('${venta.id}', 'cancelado')">❌ Cancelar</button>`);
      break;

    case 'completado':
      acciones.push(`<button class="action-btn btn-details" onclick="verDetallesPedido('${venta.id}')">👁️ Ver Detalles</button>`);
      break;
  }

  return acciones.join('');
}

// Cambiar estado de un pedido
async function cambiarEstadoPedido(pedidoId, nuevoEstado) {
  const mensaje = {
    'procesando': '¿Confirmas que quieres marcar este pedido como "En Proceso"?',
    'completado': '¿Confirmas que este pedido ha sido completado y entregado?',
    'cancelado': '¿Estás seguro de que quieres CANCELAR este pedido? Esta acción no se puede deshacer.'
  };

  if (!confirm(mensaje[nuevoEstado])) {
    return;
  }

  try {
    const session = JSON.parse(localStorage.getItem('pokefresh_admin_session') || '{}');

    if (session.token && !session.offline) {
      // Intentar actualizar en el backend
      const response = await fetch(`${API_BASE_URL}/orders/${pedidoId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.token}`
        },
        body: JSON.stringify({ status: nuevoEstado })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Estado actualizado en backend:', result);

        // Recargar datos
        cargarDatos();

        // Mostrar notificación
        const notificaciones = {
          'procesando': '🔄 Pedido marcado como "En Proceso"',
          'completado': '✅ Pedido completado exitosamente',
          'cancelado': '❌ Pedido cancelado'
        };

        mostrarNotificacionDashboard(notificaciones[nuevoEstado], nuevoEstado === 'cancelado' ? 'error' : 'success');
        return;
      }
    }
  } catch (error) {
    console.error('Error actualizando estado en backend:', error);
  }

  // Fallback: actualizar en localStorage
  let ventas = JSON.parse(localStorage.getItem('pokefresh_ventas') || '[]');

  // Buscar y actualizar el pedido
  const indice = ventas.findIndex(venta => venta.id === pedidoId);
  if (indice !== -1) {
    ventas[indice].estado = nuevoEstado;

    // Si se cancela, agregar timestamp de cancelación
    if (nuevoEstado === 'cancelado') {
      ventas[indice].fechaCancelacion = new Date().toISOString();
    }

    // Si se completa, agregar timestamp de completado
    if (nuevoEstado === 'completado') {
      ventas[indice].fechaCompletado = new Date().toISOString();
    }

    // Guardar cambios
    localStorage.setItem('pokefresh_ventas', JSON.stringify(ventas));

    // Recargar datos
    cargarDatos();

    // Mostrar notificación
    const notificaciones = {
      'procesando': '🔄 Pedido marcado como "En Proceso" (offline)',
      'completado': '✅ Pedido completado exitosamente (offline)',
      'cancelado': '❌ Pedido cancelado (offline)'
    };

    mostrarNotificacionDashboard(notificaciones[nuevoEstado], nuevoEstado === 'cancelado' ? 'error' : 'success');
  }
}

// Ver detalles completos de un pedido
function verDetallesPedido(pedidoId) {
  const ventas = obtenerVentasGuardadas();
  const pedido = ventas.find(venta => venta.id === pedidoId);

  if (!pedido) {
    alert('Pedido no encontrado');
    return;
  }

  const fecha = new Date(pedido.fecha);
  const fechaCompletado = pedido.fechaCompletado ? new Date(pedido.fechaCompletado) : null;

  const productosDetalle = pedido.productos.map(producto =>
    `• ${producto.cantidad}x ${producto.nombre} - $${(producto.precio * producto.cantidad).toLocaleString('es-CL')} CLP`
  ).join('\n');

  const detalle = `
🍜 DETALLES DEL PEDIDO ${pedido.id}
=====================================

📅 Fecha del pedido: ${fecha.toLocaleString('es-CL')}
${fechaCompletado ? `✅ Completado: ${fechaCompletado.toLocaleString('es-CL')}` : ''}
📊 Estado: ${pedido.estado.toUpperCase()}

🛒 Productos:
${productosDetalle}

💰 Total: $${pedido.total.toLocaleString('es-CL')} CLP
📦 Cantidad total de items: ${pedido.totalCantidad}
  `.trim();

  // Mostrar en nueva ventana
  const ventanaDetalle = window.open('', '_blank');
  ventanaDetalle.document.write(`
    <html>
      <head>
        <title>Detalle Pedido ${pedido.id}</title>
        <style>
          body { font-family: monospace; padding: 20px; white-space: pre-line; }
          button { margin: 20px 0; padding: 10px 20px; }
        </style>
      </head>
      <body>
        <button onclick="window.print()">🖨️ Imprimir</button>
        <button onclick="window.close()">❌ Cerrar</button>
        ${detalle}
      </body>
    </html>
  `);
}

// Mostrar notificaciones en el dashboard
function mostrarNotificacionDashboard(mensaje, tipo = 'info') {
  // Crear elemento de notificación
  const notificacion = document.createElement('div');
  notificacion.className = `dashboard-notification ${tipo}`;
  notificacion.innerHTML = `
    <span>${mensaje}</span>
    <button onclick="this.parentElement.remove()">✕</button>
  `;

  // Agregar estilos si no existen
  if (!document.querySelector('#dashboard-notification-styles')) {
    const styles = document.createElement('style');
    styles.id = 'dashboard-notification-styles';
    styles.innerHTML = `
      .dashboard-notification {
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 15px;
        max-width: 350px;
        animation: slideInRight 0.3s ease-out;
      }
      
      .dashboard-notification.success {
        background: linear-gradient(135deg, #48bb78, #38a169);
      }
      
      .dashboard-notification.error {
        background: linear-gradient(135deg, #e53e3e, #c53030);
      }
      
      .dashboard-notification.info {
        background: linear-gradient(135deg, #4299e1, #3182ce);
      }
      
      .dashboard-notification button {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        cursor: pointer;
      }
      
      @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(styles);
  }

  // Agregar al DOM
  document.body.appendChild(notificacion);

  // Auto-remover después de 5 segundos
  setTimeout(() => {
    if (notificacion.parentNode) {
      notificacion.remove();
    }
  }, 5000);
}