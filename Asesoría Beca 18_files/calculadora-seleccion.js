/**
 * Calculadora de Selección Beca 18
 * Maneja la carga de datos, filtrado, cálculo y visualización de resultados de selección
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const seleccionForm = document.getElementById('seleccionForm');
    const resultadoSeleccion = document.getElementById('resultadoSeleccion');
    const iesSelect = document.getElementById('iesSeleccion');
    const iesInfo = document.getElementById('iesInfo');
    const puntajePreseleccionInput = document.getElementById('puntajePreseleccion');
    const puntajePreseleccionError = document.getElementById('puntajePreseleccionError');
    const limpiarFormSeleccionBtn = document.getElementById('limpiarFormSeleccion');
    const recomendacionesModal = document.getElementById('recomendacionesModal');
    const recomendacionesContent = document.getElementById('recomendacionesContent');
    const cerrarRecomendaciones = document.getElementById('cerrarRecomendaciones');
    const cerrarRecomendacionesBtn = document.getElementById('cerrarRecomendacionesBtn');
    const descargarResultadoBtn = document.getElementById('descargarResultadoSeleccion');
    const downloadOptions = document.querySelector('.download-options');
  
    // Datos IES y estado de acceso
    let iesData = [];
    let accessUnlocked = false;
  
    // Inicializar elementos
    if (seleccionForm) {
      inicializarEventos();
      cargarIES();
    }
  
    /**
     * Inicializa todos los eventos necesarios para la calculadora
     */
    function inicializarEventos() {
      // Validación de puntaje
      puntajePreseleccionInput.addEventListener('input', validarPuntajePreseleccion);
  
      // Evento para limpiar formulario
      limpiarFormSeleccionBtn.addEventListener('click', limpiarFormulario);
  
      // Evento de selección de IES
      iesSelect.addEventListener('change', function() {
        const selectedIESName = this.value;
        if (selectedIESName) {
          mostrarInfoIES(selectedIESName);
        } else {
          iesInfo.style.display = 'none';
        }
      });
  
      // Evento de envío del formulario
      seleccionForm.addEventListener('submit', calcularSeleccion);
  
      // Evento para descargar resultado
      descargarResultadoBtn.addEventListener('click', descargarResultado);
  
      // Eventos para cerrar modal de recomendaciones
      if (cerrarRecomendaciones) {
        cerrarRecomendaciones.addEventListener('click', function() {
          recomendacionesModal.style.display = 'none';
        });
      }
      
      if (cerrarRecomendacionesBtn) {
        cerrarRecomendacionesBtn.addEventListener('click', function() {
          recomendacionesModal.style.display = 'none';
        });
      }
  
      // Cerrar modal al hacer clic fuera
      window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
          recomendacionesModal.style.display = 'none';
        }
      });
    }
  
    /**
     * Valida que el puntaje de preselección esté dentro del rango permitido
     */
    function validarPuntajePreseleccion() {
      let value = parseInt(this.value);
      
      if (isNaN(value) || value < 0 || value > 180) {
        puntajePreseleccionError.textContent = 'Por favor, ingrese un número entre 0 y 180.';
        this.setCustomValidity('Puntaje inválido');
      } else {
        puntajePreseleccionError.textContent = '';
        this.setCustomValidity('');
      }
    }
  
    /**
     * Limpia el formulario y restablece todos los campos
     */
    function limpiarFormulario() {
      seleccionForm.reset();
      
      if (resultadoSeleccion) {
        resultadoSeleccion.innerHTML = '';
        resultadoSeleccion.style.display = 'none';
      }
      
      if (iesInfo) {
        iesInfo.style.display = 'none';
      }
      
      if (puntajePreseleccionError) {
        puntajePreseleccionError.textContent = '';
      }
      
      if (downloadOptions) {
        downloadOptions.style.display = 'none';
      }
      
      // Reinicializar los filtros
      cargarRegiones();
    }
  
    /**
     * Carga los datos de IES desde el archivo JSON
     */
    async function cargarIES() {
      try {
        const response = await fetch('./assets/data/ies-data.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        iesData = await response.json();
        
        // Cargar las regiones únicas en el selector de regiones
        cargarRegiones();
      } catch (error) {
        console.error('Error al cargar los datos de IES:', error);
        document.getElementById('regionIES').innerHTML = '<option value="">Error al cargar regiones</option>';
        iesSelect.innerHTML = '<option value="">Error al cargar IES</option>';
      }
    }
  
    /**
     * Carga las regiones únicas en el selector
     */
    function cargarRegiones() {
      const regionSelect = document.getElementById('regionIES');
      regionSelect.innerHTML = '<option value="">Selecciona una región (obligatorio)</option>';
      
      // Obtener regiones únicas y ordenarlas alfabéticamente
      const regiones = [...new Set(iesData.map(ies => ies.regionIES))].sort();
      
      // Añadir cada región como opción
      regiones.forEach(region => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
      });
      
      // Añadir evento de cambio para actualizar los demás filtros
      regionSelect.addEventListener('change', function() {
        actualizarTiposIES();
        actualizarGestionesIES();
        filtrarIES();
      });
    }
  
    /**
     * Actualiza los checkboxes de Tipo de IES según la región seleccionada
     */
    function actualizarTiposIES() {
      const regionSeleccionada = document.getElementById('regionIES').value;
      const tipoIESContainer = document.getElementById('tipoIESContainer');
      
      // Limpiar container
      tipoIESContainer.innerHTML = '';
      
      // Filtrar IES por región si hay alguna seleccionada
      const iesFiltradas = regionSeleccionada
        ? iesData.filter(ies => ies.regionIES === regionSeleccionada)
        : iesData;
      
      // Obtener los tipos únicos de IES disponibles
      const tiposDisponibles = [...new Set(iesFiltradas.map(ies => ies.tipoIES))];
      
      // Crear los nuevos checkboxes
      tiposDisponibles.forEach(tipo => {
        const label = document.createElement('label');
        
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = 'tipoIES';
        input.value = tipo.toLowerCase();
        input.dataset.tipo = tipo;
        
        // Agregar evento de cambio
        input.addEventListener('change', function() {
          actualizarGestionesIES();
          filtrarIES();
        });
        
        label.appendChild(input);
        label.appendChild(document.createTextNode(' ' + tipo));
        tipoIESContainer.appendChild(label);
      });
    }
  
    /**
     * Actualiza los checkboxes de Gestión IES según la región y tipos seleccionados
     */
    function actualizarGestionesIES() {
      const regionSeleccionada = document.getElementById('regionIES').value;
      const gestionIESContainer = document.getElementById('gestionIESContainer');
      
      // Limpiar container
      gestionIESContainer.innerHTML = '';
      
      // Obtener los tipos seleccionados
      const tiposSeleccionados = Array.from(
        document.querySelectorAll('input[name="tipoIES"]:checked')
      ).map(cb => cb.dataset.tipo);
      
      // Filtrar IES por región y tipos seleccionados
      let iesFiltradas = iesData;
      
      if (regionSeleccionada) {
        iesFiltradas = iesFiltradas.filter(ies => ies.regionIES === regionSeleccionada);
      }
      
      if (tiposSeleccionados.length > 0) {
        iesFiltradas = iesFiltradas.filter(ies => tiposSeleccionados.includes(ies.tipoIES));
      }
      
      // Obtener las gestiones únicas disponibles
      const gestionesDisponibles = [...new Set(iesFiltradas.map(ies => ies.gestionIES))];
      
      // Crear los nuevos checkboxes
      gestionesDisponibles.forEach(gestion => {
        const label = document.createElement('label');
        
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = 'gestionIES';
        input.value = gestion.toLowerCase();
        input.dataset.gestion = gestion;
        
        // Agregar evento de cambio
        input.addEventListener('change', function() {
          filtrarIES();
        });
        
        label.appendChild(input);
        label.appendChild(document.createTextNode(' ' + gestion));
        gestionIESContainer.appendChild(label);
      });
    }
  
    /**
     * Filtra las IES según la región, tipos y gestiones seleccionadas
     */
    function filtrarIES() {
      const regionSeleccionada = document.getElementById('regionIES').value;
      
      // Si no hay región seleccionada, limpiar el selector de IES
      if (!regionSeleccionada) {
        iesSelect.innerHTML = '<option value="">Selecciona una región primero</option>';
        iesInfo.style.display = 'none';
        return;
      }
      
      // Obtener los tipos y gestiones seleccionados
      const tiposSeleccionados = Array.from(
        document.querySelectorAll('input[name="tipoIES"]:checked')
      ).map(cb => cb.dataset.tipo);
      
      const gestionesSeleccionadas = Array.from(
        document.querySelectorAll('input[name="gestionIES"]:checked')
      ).map(cb => cb.dataset.gestion);
      
      // Aplicar filtros encadenados
      let iesFiltradas = iesData;
      
      // Filtrar por región
      iesFiltradas = iesFiltradas.filter(ies => ies.regionIES === regionSeleccionada);
      
      // Filtrar por tipos seleccionados
      if (tiposSeleccionados.length > 0) {
        iesFiltradas = iesFiltradas.filter(ies => tiposSeleccionados.includes(ies.tipoIES));
      }
      
      // Filtrar por gestiones seleccionadas
      if (gestionesSeleccionadas.length > 0) {
        iesFiltradas = iesFiltradas.filter(ies => gestionesSeleccionadas.includes(ies.gestionIES));
      }
      
      // Crear un mapa para eliminar duplicados basados en nombreIES
      const iesUnicas = new Map();
      iesFiltradas.forEach(ies => {
        if (!iesUnicas.has(ies.nombreIES)) {
          iesUnicas.set(ies.nombreIES, ies);
        }
      });
      
      // Convertir el mapa a un array
      iesFiltradas = Array.from(iesUnicas.values());
      
      // Actualizar el selector de IES
      iesSelect.innerHTML = '<option value="">Selecciona una IES</option>';
      
      // Ordenar IES por nombre
      iesFiltradas.sort((a, b) => a.nombreIES.localeCompare(b.nombreIES));
      
      // Añadir cada IES como opción
      iesFiltradas.forEach(ies => {
        const option = document.createElement('option');
        option.value = ies.nombreIES;
        option.textContent = ies.nombreIES;
        option.dataset.region = ies.regionIES;
        iesSelect.appendChild(option);
      });
      
      // Ocultar la información de IES
      iesInfo.style.display = 'none';
    }

    /**
   * Muestra la información detallada de la IES seleccionada
   */
  function mostrarInfoIES(iesNombre) {
    // Obtener la región seleccionada
    const regionSeleccionada = document.getElementById('regionIES').value;
    
    // Buscar la IES que coincida con el nombre y la región
    const ies = iesData.find(item => 
      item.nombreIES === iesNombre && 
      item.regionIES === regionSeleccionada
    );
    
    if (!ies) {
      console.error("No se encontró la IES seleccionada en la región indicada");
      return;
    }
    
    // Asignar valores a los campos
    document.getElementById('codigoTipoIES').value = ies.codigoTipoIES;
    document.getElementById('tipoIES').value = ies.tipoIES;
    document.getElementById('regionIESInfo').value = ies.regionIES;
    document.getElementById('siglasIES').value = ies.siglasIES;
    document.getElementById('topIES').value = ies.topIES;
    document.getElementById('rankingIES').value = ies.rankingIES;
    document.getElementById('puntajeRankingIES').value = ies.puntajeRankingIES;
    document.getElementById('gestionIES').value = ies.gestionIES;
    document.getElementById('puntajeGestionIES').value = ies.puntajeGestionIES;
    document.getElementById('ratioSelectividad').value = ies.ratioSelectividad;
    document.getElementById('puntajeRatioSelectividad').value = ies.puntajeRatioSelectividad;
    document.getElementById('puntosExtraPAO').value = ies.puntosExtraPAO;
    
    // Mostrar la sección de información
    iesInfo.style.display = 'block';
  }

  /**
   * Calcula el puntaje de selección y muestra los resultados
   */
  function calcularSeleccion(e) {
    e.preventDefault();
    
    // Obtener valores del formulario
    const nombre = document.getElementById('nombreSeleccion').value;
    const modalidad = document.getElementById('modalidadSeleccion').value;
    const iesSeleccionadaNombre = iesSelect.value;
    const regionSeleccionada = document.getElementById('regionIES').value;
    
    // Validar campos obligatorios
    if (!regionSeleccionada) {
      alert('Por favor, seleccione una región.');
      return;
    }
    
    // Buscar la IES seleccionada
    const selectedIES = iesData.find(ies => 
      ies.nombreIES === iesSeleccionadaNombre && 
      ies.regionIES === regionSeleccionada
    );
    
    if (!selectedIES) {
      alert('Por favor, seleccione una IES válida.');
      return;
    }
    
    // Validar puntaje de preselección
    const puntajePreseleccion = parseInt(puntajePreseleccionInput.value);
    if (isNaN(puntajePreseleccion) || puntajePreseleccion < 0 || puntajePreseleccion > 180) {
      alert('Por favor, ingrese un puntaje de preselección válido entre 0 y 180.');
      return;
    }
    
    // Calcular puntajes
    const puntajeRanking = parseInt(selectedIES.puntajeRankingIES) || 0;
    const puntajeGestion = parseInt(selectedIES.puntajeGestionIES) || 0;
    const puntajeSelectividad = parseInt(selectedIES.puntajeRatioSelectividad) || 0;
    const puntajeTotal = puntajePreseleccion + puntajeRanking + puntajeGestion + puntajeSelectividad;
    const puntajeIES = puntajeRanking + puntajeGestion + puntajeSelectividad;
    
    // Determinar color según el puntaje
    let colorClase = '';
    if (puntajeTotal >= 120) {
      colorClase = 'success';
    } else if (puntajeTotal >= 110) {
      colorClase = 'info'; // Añadimos esta clase para el rango 110-119
    } else if (puntajeTotal >= 100) {
      colorClase = 'warning';
    } else {
      colorClase = 'danger';
    }
    
    // Mensaje personalizado según puntaje
    let mensajePersonalizado = '';
    if (puntajeTotal >= 120) {
      mensajePersonalizado = `¡Felicidades, ${nombre}! Tienes una excelente probabilidad de ganar la beca. Asegúrate de completar tu postulación en las fechas indicadas.`;
    } else if (puntajeTotal >= 110) {
      mensajePersonalizado = `¡Muy bien, ${nombre}! Tienes buenas posibilidades de ganar la beca. No olvides estar pendiente del cronograma de postulación.`;
    } else if (puntajeTotal >= 100) {
      mensajePersonalizado = `${nombre}, tienes posibilidades de ganar la beca. Te recomendamos revisar otras IES que podrían aumentar tu puntaje.`;
    } else {
      mensajePersonalizado = `${nombre}, tu puntaje está por debajo del promedio. Te sugerimos explorar otras IES que podrían mejorar tu puntaje significativamente.`;
    }
    
    // Puntaje máximo según modalidad
    const puntajeMaximo = modalidad === 'eib' ? 210 : 200;
    
    // Crear el resultado
    let resultado = `<h2>Reporte de Selección para ${nombre}</h2>`;
    resultado += `<div class="resultado-principal ${colorClase}">Tu puntaje de selección es: <strong>${puntajeTotal}</strong> puntos</div>`;
    resultado += '<div class="resultado-detalle"><h4>Desglose del puntaje:</h4><ul>';
    
    resultado += `<li>✅ Modalidad (M): ${modalidad}</li>`;
    resultado += `<li>✅ PS (Puntaje de Preselección): <span class="puntaje-detalle">${puntajePreseleccion} puntos</span></li>`;
    resultado += `<li>✅ C (Puntaje por Ranking): <span class="puntaje-detalle">+${puntajeRanking} puntos</span></li>`;
    resultado += `<li>✅ G (Puntaje por Gestión): <span class="puntaje-detalle">+${puntajeGestion} puntos</span></li>`;
    resultado += `<li>✅ S (Puntaje por Selectividad): <span class="puntaje-detalle">+${puntajeSelectividad} puntos</span></li>`;
    resultado += `<li>✅ IES elegida: ${selectedIES.nombreIES} <span class="puntaje-detalle">(+${puntajeIES} puntos en total)</span></li>`;
    
    resultado += '</ul></div>';
    
    // Fórmula
    resultado += `<div class="formula">Fórmula aplicada: Puntaje Total = PS + C + G + S</div>`;
    
    // Puntaje máximo
    resultado += `<p class="puntaje-maximo">Puntaje máximo para esta modalidad: ${puntajeMaximo} puntos</p>`;
    
    // Mensaje personalizado
    resultado += `<p class="mensaje-animo">${mensajePersonalizado}</p>`;
    
    // Botón para ver recomendaciones
    if (puntajeTotal < 120) {
      resultado += `
        <div class="recomendaciones-section">
          <button id="mostrarRecomendaciones" class="btn-custom" style="margin-top: 20px;">
            Ver IES Recomendadas
          </button>
        </div>
      `;
    }
    
    // Actualizar contenedor de resultados y mostrar
    resultadoSeleccion.innerHTML = resultado;
    resultadoSeleccion.style.display = 'block';
    downloadOptions.style.display = 'flex';
    
    // Botón de recomendaciones
    const btnRecomendaciones = document.getElementById('mostrarRecomendaciones');
    if (btnRecomendaciones) {
      btnRecomendaciones.addEventListener('click', function() {
        mostrarRecomendaciones(puntajeTotal, regionSeleccionada, selectedIES);
      });
    }
    
    // Hacer scroll hasta el resultado
    resultadoSeleccion.scrollIntoView({ behavior: 'smooth' });
  }

  /**
   * Muestra el diálogo de IES recomendadas para mejorar puntaje
   */
  function mostrarRecomendaciones(puntajeActual, regionActual, iesActual) {
    // Permitir acceso con un simple interruptor para la demostración
    // En un sistema real, podría verificar si el usuario ha pagado o visto un anuncio
    accessUnlocked = true;
    
    if (!accessUnlocked) {
      alert('Para ver las recomendaciones, necesitas desbloquear esta función.');
      return;
    }
    
    // Filtrar IES que ofrecen mejor puntaje que la actual
    const puntajeIESActual = parseInt(iesActual.puntajeRankingIES) + 
                            parseInt(iesActual.puntajeGestionIES) + 
                            parseInt(iesActual.puntajeRatioSelectividad);
    
    // Encontrar IES recomendadas
    const recomendadas = iesData.filter(ies => {
      const puntajeIES = parseInt(ies.puntajeRankingIES) + 
                         parseInt(ies.puntajeGestionIES) + 
                         parseInt(ies.puntajeRatioSelectividad);
      
      return puntajeIES > puntajeIESActual && ies.nombreIES !== iesActual.nombreIES;
    }).sort((a, b) => {
      const puntajeA = parseInt(a.puntajeRankingIES) + parseInt(a.puntajeGestionIES) + parseInt(a.puntajeRatioSelectividad);
      const puntajeB = parseInt(b.puntajeRankingIES) + parseInt(b.puntajeGestionIES) + parseInt(b.puntajeRatioSelectividad);
      
      return puntajeB - puntajeA; // Ordenar de mayor a menor puntaje
    });
    
    // Generar el contenido del diálogo
    let contenido = `
      <p>En base a tu puntaje actual (${puntajeActual} puntos), te mostramos IES que podrían mejorar tu puntaje:</p>
    `;
    
    // IES en la misma región
    const iesEnRegion = recomendadas.filter(ies => ies.regionIES === regionActual);
    if (iesEnRegion.length > 0) {
      contenido += `<div class="recommended-section"><h4 class="recommended-title">👉 En tu región (${regionActual}):</h4>`;
      
      iesEnRegion.slice(0, 3).forEach(ies => {
        const puntajeC = parseInt(ies.puntajeRankingIES) || 0;
        const puntajeG = parseInt(ies.puntajeGestionIES) || 0;
        const puntajeS = parseInt(ies.puntajeRatioSelectividad) || 0;
        const puntajeTotal = puntajeC + puntajeG + puntajeS;
        
        contenido += `
          <div class="recommended-card">
            <h5 class="recommended-card-title">🏢 ${ies.nombreIES}</h5>
            <div class="recommended-info">
              <div class="recommended-details">
                <p>Región: ${ies.regionIES}</p>
                <p>Tipo: ${ies.tipoIES}</p>
                <p>Gestión: ${ies.gestionIES}</p>
              </div>
              <div class="recommended-points">
                <p>C: <span>+${puntajeC}</span></p>
                <p>G: <span>+${puntajeG}</span></p>
                <p>S: <span>+${puntajeS}</span></p>
              </div>
            </div>
            <div class="recommended-total">
              <span>Podrías obtener:</span>
              <span class="recommended-points-value">+${puntajeTotal} puntos</span>
            </div>
          </div>
        `;
      });
      
      contenido += `</div>`;
    }
    
    // IES en otras regiones
    const iesOtrasRegiones = recomendadas.filter(ies => ies.regionIES !== regionActual);
    if (iesOtrasRegiones.length > 0) {
      contenido += `<div class="recommended-section"><h4 class="recommended-title">👉 En otras regiones:</h4>`;
      
      iesOtrasRegiones.slice(0, 3).forEach(ies => {
        const puntajeC = parseInt(ies.puntajeRankingIES) || 0;
        const puntajeG = parseInt(ies.puntajeGestionIES) || 0;
        const puntajeS = parseInt(ies.puntajeRatioSelectividad) || 0;
        const puntajeTotal = puntajeC + puntajeG + puntajeS;
        
        contenido += `
          <div class="recommended-card">
            <h5 class="recommended-card-title">🏢 ${ies.nombreIES}</h5>
            <div class="recommended-info">
              <div class="recommended-details">
                <p>Región: ${ies.regionIES}</p>
                <p>Tipo: ${ies.tipoIES}</p>
                <p>Gestión: ${ies.gestionIES}</p>
              </div>
              <div class="recommended-points">
                <p>C: <span>+${puntajeC}</span></p>
                <p>G: <span>+${puntajeG}</span></p>
                <p>S: <span>+${puntajeS}</span></p>
              </div>
            </div>
            <div class="recommended-total">
              <span>Podrías obtener:</span>
              <span class="recommended-points-value">+${puntajeTotal} puntos</span>
            </div>
          </div>
        `;
      });
      
      contenido += `</div>`;
    }
    
    // Información importante
    contenido += `
      <div class="info-card" style="margin-top: 20px;">
        <h4>⚠️ Información Importante</h4>
        <ul style="padding-left: 20px;">
          <li>Infórmate sobre el proceso de admisión de las IES.</li>
          <li>Verifica la disponibilidad de tu carrera.</li>
          <li>Ten en cuenta la ubicación e ingreso.</li>
          <li>Considera el puntaje que podrías sumar a tu PS.</li>
        </ul>
      </div>
    `;
    
    // Mostrar el diálogo
    recomendacionesContent.innerHTML = contenido;
    recomendacionesModal.style.display = 'block';
  }

  /**
   * Genera y descarga una imagen o PDF del resultado
   */
  function descargarResultado() {
    const elemento = document.getElementById('resultadoSeleccion');
    const formato = document.getElementById('formatoDescargaSeleccion').value;
    
    // Asegurarnos que el elemento tenga posición relativa
    const originalPosition = window.getComputedStyle(elemento).position;
    elemento.style.position = 'relative';
    
    // Añadir temporalmente una marca de agua
    const watermark = document.createElement('div');
    watermark.className = 'watermark';
    watermark.textContent = 'Juffyto Segovia Asesoría BECA 18 2025';
    watermark.style.position = 'absolute';
    watermark.style.top = '50%';
    watermark.style.left = '50%';
    watermark.style.transform = 'translate(-50%, -50%) rotate(-45deg)';
    watermark.style.fontSize = '40px';
    watermark.style.opacity = '0.4';
    watermark.style.color = 'rgba(255, 0, 0, 0.751)';
    watermark.style.pointerEvents = 'none';
    watermark.style.whiteSpace = 'nowrap';
    watermark.style.zIndex = '1000';
    watermark.style.textAlign = 'center';
    watermark.style.width = '100%';
    
    elemento.appendChild(watermark);
    
    // Reducir la escala para mejorar el rendimiento
    const scale = formato === 'pdf' ? 1.5 : 1;
    
    // Esperar a que la marca de agua se aplique completamente
    setTimeout(() => {
      html2canvas(elemento, {
        scale: scale,
        logging: false,
        useCORS: true,
        backgroundColor: '#F0F0F0',
        onclone: function(clonedDoc) {
          const clonedElement = clonedDoc.querySelector('#resultadoSeleccion');
          clonedElement.style.padding = '15px';
          clonedElement.style.borderRadius = '5px';
        }
      }).then(canvas => {
        // Restaurar el estilo original del elemento
        elemento.style.position = originalPosition;
        
        // Eliminar la marca de agua temporal del DOM
        elemento.removeChild(watermark);
        
        if (formato === 'png') {
          // Descargar como PNG
          const link = document.createElement('a');
          link.download = 'Reporte_Seleccion_Beca18.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
        } else {
          // Descargar como PDF con compresión para reducir tamaño
          const imgData = canvas.toDataURL('image/jpeg', 0.75);
          const { jsPDF } = window.jspdf;
          const pdf = new jsPDF('p', 'mm', 'a4');
          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          
          pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
          pdf.save('Reporte_Seleccion_Beca18.pdf');
        }
      }).catch(function(error) {
        console.error('Error en html2canvas:', error);
        alert('Hubo un error al generar la imagen. Por favor, inténtelo de nuevo.');
        
        // Asegurarse de limpiar incluso en caso de error
        elemento.style.position = originalPosition;
        if (elemento.contains(watermark)) {
          elemento.removeChild(watermark);
        }
      });
    }, 100);
  }

  /**
   * Desbloquea el acceso a las funciones premium
   * (Simulación - en producción se verificaría un pago o similar)
   */
  function unlockAccess() {
    accessUnlocked = true;
  }

  /**
   * Verifica si el usuario tiene acceso a las funciones premium
   */
  function isAccessUnlocked() {
    return accessUnlocked;
  }
});

