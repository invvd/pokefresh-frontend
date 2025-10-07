// Sistema de autenticación simple (solo frontend)
document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');

  // Credenciales de prueba (en un sistema real, esto sería validado por el backend)
  const VALID_CREDENTIALS = {
    username: 'admin',
    password: 'pokefresh2025'
  };

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Remover mensajes anteriores
    const existingMessage = document.querySelector('.error-message, .success-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Validar credenciales
    if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
      // Éxito - guardar sesión
      localStorage.setItem('pokefresh_admin_session', JSON.stringify({
        username: username,
        loginTime: new Date().toISOString(),
        isAuthenticated: true
      }));

      // Mostrar mensaje de éxito
      showMessage('✅ ¡Inicio de sesión exitoso! Redirigiendo...', 'success');

      // Redirigir al dashboard después de 1.5 segundos
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);

    } else {
      // Error en credenciales
      showMessage('❌ Credenciales incorrectas. Intenta nuevamente.', 'error');

      // Limpiar campos
      document.getElementById('password').value = '';
      document.getElementById('username').focus();
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