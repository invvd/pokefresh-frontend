// Sistema de autenticación con backend
const API_BASE_URL = 'http://localhost:4000/api';

document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Remover mensajes anteriores
    const existingMessage = document.querySelector('.error-message, .success-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    try {
      // Intentar login con el backend
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Éxito - guardar sesión
        localStorage.setItem('pokefresh_admin_session', JSON.stringify({
          username: data.username,
          token: data.token,
          loginTime: new Date().toISOString(),
          isAuthenticated: true,
          expires_in: data.expires_in
        }));

        // Mostrar mensaje de éxito
        showMessage('✅ ¡Inicio de sesión exitoso! Redirigiendo...', 'success');

        // Redirigir al dashboard después de 1.5 segundos
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1500);
      } else {
        // Error del servidor
        showMessage(`❌ ${data.error || 'Error en el servidor'}`, 'error');
        document.getElementById('password').value = '';
        document.getElementById('username').focus();
      }
    } catch (error) {
      console.error('Error de conexión:', error);

      // Fallback: validación local como antes
      if (username === 'admin' && password === 'pokefresh2025') {
        localStorage.setItem('pokefresh_admin_session', JSON.stringify({
          username: username,
          loginTime: new Date().toISOString(),
          isAuthenticated: true,
          offline: true
        }));

        showMessage('✅ ¡Inicio de sesión exitoso! (modo offline)', 'success');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1500);
      } else {
        showMessage('❌ Sin conexión al servidor. Credenciales incorrectas.', 'error');
        document.getElementById('password').value = '';
        document.getElementById('username').focus();
      }
    }
  });

  // Función para mostrar mensajes
  function showMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `${type}-message`;
    messageDiv.textContent = text;

    const form = document.querySelector('.login-form');
    form.insertBefore(messageDiv, form.firstChild);

    // Remover mensaje después de 4 segundos para mensajes de error
    if (type === 'error') {
      setTimeout(() => {
        if (messageDiv.parentNode) {
          messageDiv.remove();
        }
      }, 4000);
    }
  }

  // Verificar si ya hay una sesión activa
  const existingSession = localStorage.getItem('pokefresh_admin_session');
  if (existingSession) {
    try {
      const session = JSON.parse(existingSession);
      if (session.isAuthenticated) {
        // Ya está autenticado, redirigir al dashboard
        window.location.href = 'dashboard.html';
      }
    } catch (e) {
      // Sesión corrupta, limpiar
      localStorage.removeItem('pokefresh_admin_session');
    }
  }

  // Autocompletar credenciales de demo al hacer clic en ellas
  document.addEventListener('click', function (e) {
    if (e.target.tagName === 'CODE') {
      const value = e.target.textContent;
      if (value === 'admin') {
        document.getElementById('username').value = value;
        document.getElementById('password').focus();
      } else if (value === 'pokefresh2025') {
        document.getElementById('password').value = value;
      }
    }
  });
});