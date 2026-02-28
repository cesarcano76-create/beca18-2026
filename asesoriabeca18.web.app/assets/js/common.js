/**
 * Módulo de utilidades comunes para todas las páginas
 * Incluye carga de componentes, utilidades generales y funciones comunes
 */

// Función para cargar componentes HTML como header y footer
async function loadComponent(elementId, componentPath) {
    try {
      const response = await fetch(componentPath);
      if (!response.ok) {
        throw new Error(`Error cargando el componente: ${componentPath}`);
      }
      const html = await response.text();
      document.getElementById(elementId).innerHTML = html;
      
      return true;
    } catch (error) {
      console.error('Error cargando componente:', error);
      return false;
    }
  }
  
  // Función que inicializa todos los componentes
  async function initComponents() {
    try {
      // Cargar header y footer
      await Promise.all([
        loadComponent('header-container', '/components/header.html'),
        loadComponent('footer-container', '/components/footer.html')
      ]);
      
      // Asegurarnos que el menú móvil esté oculto inicialmente
      const mainNav = document.querySelector('.main-nav');
      if (mainNav) {
        // Aplicar estos estilos directamente para más seguridad
        if (window.innerWidth <= 768) {
          mainNav.style.display = 'none';
        }
      }
      
      // Inicializar funcionalidades del header después de cargarlo
      if (typeof initHeader === 'function') {
        initHeader();
      }
      
      // Marcar la página activa en el menú
      highlightCurrentPage();
      
    } catch (error) {
      console.error('Error inicializando componentes:', error);
    }
  }
  
  // Función para resaltar la página actual en el menú de navegación
  function highlightCurrentPage() {
    // Obtener la URL actual
    const currentPath = window.location.pathname;
    
    // Seleccionar el elemento nav correcto basado en la URL
    let navId = '';
    
    if (currentPath === '/' || currentPath.includes('index.html')) {
      navId = 'nav-inicio';
    } else if (currentPath.includes('sobre-mi')) {
      navId = 'nav-sobre-mi';
    } else if (currentPath.includes('servicio')) {
      navId = 'nav-servicio';
    } else if (currentPath.includes('contacto')) {
      navId = 'nav-contacto';
    }
    
    // Si se encontró un ID de navegación, añadir la clase 'active-nav'
    if (navId) {
      const navElement = document.getElementById(navId);
      if (navElement) {
        navElement.classList.add('active-nav');
      }
    }
    
    // Si es una página de herramientas, marcar el dropdown como activo
    if (
      currentPath.includes('calculadoras') || 
      currentPath.includes('herramientas')
    ) {
      const dropdown = document.querySelector('.dropdown-toggle');
      if (dropdown) {
        dropdown.classList.add('active-nav');
      }
    }
  }
  
  // Iniciar componentes cuando el DOM esté completamente cargado
  document.addEventListener('DOMContentLoaded', initComponents);
  
  /**
   * Utilidades generales para todas las páginas
   */
  
  // Función para desplazarse suavemente a un elemento
  function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
  
  // Formatear fecha en formato legible
  function formatDate(dateString) {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  }
  
  // Función para validar un email
  function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }