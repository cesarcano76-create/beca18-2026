/**
 * Funcionalidad del encabezado
 * Maneja el menú móvil, dropdown y navegación
 */

// Función que inicializa todas las funcionalidades del header
function initHeader() {
    setupMobileMenu();
    setupDropdownMenu();
  }
  
  // Configuración del menú móvil (hamburguesa)
  function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
  
    if (menuToggle && mainNav) {
      // Toggle del menú al hacer clic en el botón hamburguesa
      menuToggle.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        mainNav.classList.toggle('active');
      });
  
      // Cerrar el menú si se hace clic fuera de él
      document.addEventListener('click', function(event) {
        const isClickInsideNav = mainNav.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnToggle && mainNav.classList.contains('active')) {
          mainNav.classList.remove('active');
        }
      });
    }
  }
  
  // Configuración del menú desplegable (dropdown)
  function setupDropdownMenu() {
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdown = document.querySelector('.dropdown');
  
    if (dropdownToggle && dropdown) {
      // Al hacer clic en el dropdown-toggle
      dropdownToggle.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        // Manejo diferente para móvil y escritorio
        if (window.innerWidth <= 768) {
          // En móvil, usamos la clase 'active'
          dropdown.classList.toggle('active');
        } else {
          // En escritorio, usamos la clase 'open'
          dropdown.classList.toggle('open');
        }
      });
  
      // Cerrar el dropdown cuando se hace clic fuera de él
      document.addEventListener('click', function(event) {
        if (!dropdown.contains(event.target)) {
          dropdown.classList.remove('open');
          if (window.innerWidth <= 768) {
            dropdown.classList.remove('active');
          }
        }
      });
  
      // Permitir que los elementos del menú desplegable funcionen
      const dropdownItems = dropdown.querySelectorAll('.dropdown-menu a');
      dropdownItems.forEach(function(item) {
        item.addEventListener('click', function() {
          dropdown.classList.remove('open');
          dropdown.classList.remove('active');
        });
      });
    }
    
    // Manejar cambios de tamaño de ventana
    window.addEventListener('resize', function() {
      const dropdown = document.querySelector('.dropdown');
      if (dropdown) {
        if (window.innerWidth > 768) {
          dropdown.classList.remove('active');
        } else {
          dropdown.classList.remove('open');
        }
      }
      
      // Cerrar menú móvil si cambiamos a escritorio
      const mainNav = document.querySelector('.main-nav');
      if (mainNav && window.innerWidth > 768) {
        mainNav.classList.remove('active');
      }
    });
  }