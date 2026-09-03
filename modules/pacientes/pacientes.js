/* =========================================
   INDIGO GERIÁTRICO
   MÓDULO PACIENTES
========================================= */

(function () {

  'use strict';


  /* =========================================
     ESTADO DEL MÓDULO
  ========================================== */

  let pacientes = [];

  let pacienteSeleccionado = null;

  let filtroActual = {
    busqueda: '',
    estado: '',
    tipoIngreso: ''
  };


  /* =========================================
     DATOS DE PRUEBA
     
     TEMPORAL:
     Se utilizan mientras no exista la acción
     correspondiente en GAS.
  ========================================== */

  const PACIENTES_DEMO = [

    {
      residente_id: 'RES-0001',
      nro_legajo: 'LEG-00001',
      apellido: 'González',
      nombres: 'Elena Beatriz',
      dni: '28456789',
      fecha_nacimiento: '1942-03-15',
      sexo: 'F',
      nacionalidad: 'Argentina',
      estado_civil: 'VIUDA',
      fecha_ingreso: '2024-05-12',
      fecha_egreso: '',
      estado: 'ACTIVO',
      cama_id: 'CAMA-101',
      tipo_ingreso: 'PERMANENTE',
      observaciones:
        'Ingreso por necesidad de cuidados integrales.'
    },

    {
      residente_id: 'RES-0002',
      nro_legajo: 'LEG-00002',
      apellido: 'Fernández',
      nombres: 'Roberto Carlos',
      dni: '26789456',
      fecha_nacimiento: '1938-07-22',
      sexo: 'M',
      nacionalidad: 'Argentina',
      estado_civil: 'CASADO',
      fecha_ingreso: '2023-08-21',
      fecha_egreso: '',
      estado: 'ACTIVO',
      cama_id: 'CAMA-102',
      tipo_ingreso: 'PERMANENTE',
      observaciones:
        'Requiere asistencia parcial para actividades diarias.'
    },

    {
      residente_id: 'RES-0003',
      nro_legajo: 'LEG-00003',
      apellido: 'Martínez',
      nombres: 'Norma Alicia',
      dni: '30124567',
      fecha_nacimiento: '1945-11-08',
      sexo: 'F',
      nacionalidad: 'Argentina',
      estado_civil: 'DIVORCIADA',
      fecha_ingreso: '2025-01-15',
      fecha_egreso: '',
      estado: 'ACTIVO',
      cama_id: 'CAMA-103',
      tipo_ingreso: 'PERMANENTE',
      observaciones:
        'Adaptación satisfactoria al establecimiento.'
    },

    {
      residente_id: 'RES-0004',
      nro_legajo: 'LEG-00004',
      apellido: 'Rodríguez',
      nombres: 'Héctor Alberto',
      dni: '25678901',
      fecha_nacimiento: '1936-05-19',
      sexo: 'M',
      nacionalidad: 'Argentina',
      estado_civil: 'VIUDO',
      fecha_ingreso: '2022-11-03',
      fecha_egreso: '',
      estado: 'ACTIVO',
      cama_id: 'CAMA-104',
      tipo_ingreso: 'PERMANENTE',
      observaciones:
        'Antecedente de traslado interno por adaptación de habitación.'
    },

    {
      residente_id: 'RES-0005',
      nro_legajo: 'LEG-00005',
      apellido: 'López',
      nombres: 'María Cristina',
      dni: '29345678',
      fecha_nacimiento: '1941-09-27',
      sexo: 'F',
      nacionalidad: 'Argentina',
      estado_civil: 'CASADA',
      fecha_ingreso: '2024-09-07',
      fecha_egreso: '',
      estado: 'ACTIVO',
      cama_id: 'CAMA-105',
      tipo_ingreso: 'PERMANENTE',
      observaciones:
        'Requiere supervisión durante comidas.'
    },

    {
      residente_id: 'RES-0006',
      nro_legajo: 'LEG-00006',
      apellido: 'Romero',
      nombres: 'Juan José',
      dni: '24890123',
      fecha_nacimiento: '1935-02-11',
      sexo: 'M',
      nacionalidad: 'Argentina',
      estado_civil: 'VIUDO',
      fecha_ingreso: '2021-06-18',
      fecha_egreso: '',
      estado: 'ACTIVO',
      cama_id: 'CAMA-106',
      tipo_ingreso: 'PERMANENTE',
      observaciones:
        'Realiza controles médicos externos periódicos.'
    },

    {
      residente_id: 'RES-0007',
      nro_legajo: 'LEG-00007',
      apellido: 'Sosa',
      nombres: 'Teresa Mabel',
      dni: '31567890',
      fecha_nacimiento: '1948-12-03',
      sexo: 'F',
      nacionalidad: 'Argentina',
      estado_civil: 'SOLTERA',
      fecha_ingreso: '2025-03-22',
      fecha_egreso: '',
      estado: 'ACTIVO',
      cama_id: 'CAMA-107',
      tipo_ingreso: 'PERMANENTE',
      observaciones:
        'Realiza salidas temporarias con familiares.'
    },

    {
      residente_id: 'RES-0008',
      nro_legajo: 'LEG-00008',
      apellido: 'Álvarez',
      nombres: 'Carlos Alberto',
      dni: '23987654',
      fecha_nacimiento: '1933-06-28',
      sexo: 'M',
      nacionalidad: 'Argentina',
      estado_civil: 'CASADO',
      fecha_ingreso: '2020-10-11',
      fecha_egreso: '',
      estado: 'ACTIVO',
      cama_id: 'CAMA-122',
      tipo_ingreso: 'PERMANENTE',
      observaciones:
        'Trasladado a habitación accesible.'
    },

    {
      residente_id: 'RES-0009',
      nro_legajo: 'LEG-00009',
      apellido: 'Torres',
      nombres: 'Beatriz Susana',
      dni: '32789012',
      fecha_nacimiento: '1950-04-16',
      sexo: 'F',
      nacionalidad: 'Argentina',
      estado_civil: 'DIVORCIADA',
      fecha_ingreso: '2025-07-04',
      fecha_egreso: '2025-10-02',
      estado: 'EGRESADO',
      cama_id: 'CAMA-109',
      tipo_ingreso: 'TEMPORARIO',
      observaciones:
        'Estadía temporal finalizada.'
    },

    {
      residente_id: 'RES-0010',
      nro_legajo: 'LEG-00010',
      apellido: 'Ramírez',
      nombres: 'Miguel Ángel',
      dni: '26123456',
      fecha_nacimiento: '1939-10-21',
      sexo: 'M',
      nacionalidad: 'Argentina',
      estado_civil: 'CASADO',
      fecha_ingreso: '2024-02-26',
      fecha_egreso: '',
      estado: 'ACTIVO',
      cama_id: 'CAMA-110',
      tipo_ingreso: 'PERMANENTE',
      observaciones:
        'Asiste periódicamente a consultas externas.'
    },

    {
      residente_id: 'RES-0011',
      nro_legajo: 'LEG-00011',
      apellido: 'Acosta',
      nombres: 'Silvia Beatriz',
      dni: '30456789',
      fecha_nacimiento: '1946-01-30',
      sexo: 'F',
      nacionalidad: 'Argentina',
      estado_civil: 'VIUDA',
      fecha_ingreso: '2023-04-17',
      fecha_egreso: '',
      estado: 'ACTIVO',
      cama_id: 'CAMA-111',
      tipo_ingreso: 'PERMANENTE',
      observaciones:
        'Requiere asistencia para movilidad.'
    },

    {
      residente_id: 'RES-0012',
      nro_legajo: 'LEG-00012',
      apellido: 'Benítez',
      nombres: 'Oscar Raúl',
      dni: '25109876',
      fecha_nacimiento: '1937-08-14',
      sexo: 'M',
      nacionalidad: 'Argentina',
      estado_civil: 'VIUDO',
      fecha_ingreso: '2022-04-09',
      fecha_egreso: '',
      estado: 'ACTIVO',
      cama_id: 'CAMA-123',
      tipo_ingreso: 'PERMANENTE',
      observaciones:
        'Trasladado por adaptación de movilidad.'
    },

    {
      residente_id: 'RES-0013',
      nro_legajo: 'LEG-00013',
      apellido: 'Molina',
      nombres: 'Alicia Esther',
      dni: '31876543',
      fecha_nacimiento: '1949-03-07',
      sexo: 'F',
      nacionalidad: 'Argentina',
      estado_civil: 'CASADA',
      fecha_ingreso: '2025-02-10',
      fecha_egreso: '',
      estado: 'ACTIVO',
      cama_id: 'CAMA-113',
      tipo_ingreso: 'PERMANENTE',
      observaciones:
        'Buena adaptación al establecimiento.'
    },

    {
      residente_id: 'RES-0014',
      nro_legajo: 'LEG-00014',
      apellido: 'Suárez',
      nombres: 'Eduardo Daniel',
      dni: '27345678',
      fecha_nacimiento: '1940-11-25',
      sexo: 'M',
      nacionalidad: 'Argentina',
      estado_civil: 'DIVORCIADO',
      fecha_ingreso: '2023-12-01',
      fecha_egreso: '',
      estado: 'ACTIVO',
      cama_id: 'CAMA-114',
      tipo_ingreso: 'PERMANENTE',
      observaciones:
        'Requiere supervisión en desplazamientos.'
    },

    {
      residente_id: 'RES-0015',
      nro_legajo: 'LEG-00015',
      apellido: 'Castro',
      nombres: 'Mirta Graciela',
      dni: '32901234',
      fecha_nacimiento: '1952-06-18',
      sexo: 'F',
      nacionalidad: 'Argentina',
      estado_civil: 'SOLTERA',
      fecha_ingreso: '2026-01-20',
      fecha_egreso: '',
      estado: 'ACTIVO',
      cama_id: 'CAMA-115',
      tipo_ingreso: 'TEMPORARIO',
      observaciones:
        'Ingreso reciente en período de adaptación.'
    },

    {
      residente_id: 'RES-0016',
      nro_legajo: 'LEG-00016',
      apellido: 'Ortiz',
      nombres: 'Ricardo Antonio',
      dni: '24567890',
      fecha_nacimiento: '1934-09-02',
      sexo: 'M',
      nacionalidad: 'Argentina',
      estado_civil: 'CASADO',
      fecha_ingreso: '2019-08-14',
      fecha_egreso: '',
      estado: 'ACTIVO',
      cama_id: 'CAMA-124',
      tipo_ingreso: 'PERMANENTE',
      observaciones:
        'Trasladado de sector por necesidades de atención.'
    },

    {
      residente_id: 'RES-0017',
      nro_legajo: 'LEG-00017',
      apellido: 'Ríos',
      nombres: 'Carmen Luisa',
      dni: '31234567',
      fecha_nacimiento: '1947-12-29',
      sexo: 'F',
      nacionalidad: 'Argentina',
      estado_civil: 'VIUDA',
      fecha_ingreso: '2024-11-18',
      fecha_egreso: '',
      estado: 'ACTIVO',
      cama_id: 'CAMA-117',
      tipo_ingreso: 'PERMANENTE',
      observaciones:
        'Requiere acompañamiento para actividades recreativas.'
    },

    {
      residente_id: 'RES-0018',
      nro_legajo: 'LEG-00018',
      apellido: 'Núñez',
      nombres: 'Jorge Omar',
      dni: '25890123',
      fecha_nacimiento: '1936-04-12',
      sexo: 'M',
      nacionalidad: 'Argentina',
      estado_civil: 'VIUDO',
      fecha_ingreso: '2022-09-30',
      fecha_egreso: '',
      estado: 'ACTIVO',
      cama_id: 'CAMA-118',
      tipo_ingreso: 'PERMANENTE',
      observaciones:
        'Requiere asistencia parcial.'
    },

    {
      residente_id: 'RES-0019',
      nro_legajo: 'LEG-00019',
      apellido: 'Vera',
      nombres: 'Margarita Elena',
      dni: '29678901',
      fecha_nacimiento: '1943-08-05',
      sexo: 'F',
      nacionalidad: 'Argentina',
      estado_civil: 'CASADA',
      fecha_ingreso: '2025-05-06',
      fecha_egreso: '2026-07-18',
      estado: 'EGRESADO',
      cama_id: 'CAMA-119',
      tipo_ingreso: 'PERMANENTE',
      observaciones:
        'Egreso por indicación médica.'
    },

    {
      residente_id: 'RES-0020',
      nro_legajo: 'LEG-00020',
      apellido: 'Cabrera',
      nombres: 'Antonio José',
      dni: '23123456',
      fecha_nacimiento: '1932-10-17',
      sexo: 'M',
      nacionalidad: 'Argentina',
      estado_civil: 'CASADO',
      fecha_ingreso: '2021-11-22',
      fecha_egreso: '2026-03-14',
      estado: 'EGRESADO',
      cama_id: 'CAMA-120',
      tipo_ingreso: 'PERMANENTE',
      observaciones:
        'Egreso por traslado a domicilio familiar.'
    }

  ];


  /* =========================================
     MOUNT
  ========================================== */

  window.mount_pacientes =
    async function () {

      console.log(
        '[PACIENTES] Montando módulo'
      );

      inicializarEventos();

      await cargarPacientes();

    };


  /* =========================================
     EVENTOS
  ========================================== */

  function inicializarEventos() {

    const busqueda =
      document.getElementById(
        'pacienteBusqueda'
      );

    const estado =
      document.getElementById(
        'pacienteEstado'
      );

    const ingreso =
      document.getElementById(
        'pacienteIngreso'
      );

    const limpiar =
      document.getElementById(
        'btnLimpiarFiltros'
      );

    const nuevo =
      document.getElementById(
        'btnNuevoPaciente'
      );

    const volver =
      document.getElementById(
        'btnVolverPacientes'
      );

    const cerrar =
      document.getElementById(
        'btnCerrarPacienteModal'
      );

    const cancelar =
      document.getElementById(
        'btnCancelarPaciente'
      );

    const form =
      document.getElementById(
        'pacienteForm'
      );


    if (busqueda) {

      busqueda.addEventListener(
        'input',
        aplicarFiltros
      );

    }


    if (estado) {

      estado.addEventListener(
        'change',
        aplicarFiltros
      );

    }


    if (ingreso) {

      ingreso.addEventListener(
        'change',
        aplicarFiltros
      );

    }


    if (limpiar) {

      limpiar.addEventListener(
        'click',
        limpiarFiltros
      );

    }


    if (nuevo) {

      nuevo.addEventListener(
        'click',
        abrirNuevoPaciente
      );

    }


    if (volver) {

      volver.addEventListener(
        'click',
        volverListado
      );

    }


    if (cerrar) {

      cerrar.addEventListener(
        'click',
        cerrarModal
      );

    }


    if (cancelar) {

      cancelar.addEventListener(
        'click',
        cerrarModal
      );

    }


    if (form) {

      form.addEventListener(
        'submit',
        guardarPaciente
      );

    }


    document
      .querySelectorAll(
        '.ficha-tab'
      )
      .forEach(
        tab => {

          tab.addEventListener(
            'click',
            () => {

              cambiarFichaTab(
                tab.dataset.tab
              );

            }
          );

        }
      );

  }


  /* =========================================
     CARGAR PACIENTES
  ========================================== */

  async function cargarPacientes() {

    mostrarCarga();

    try {

      /*
       * =======================================
       * BACKEND
       *
       * Cuando implementemos GAS:
       *
       * const result = await api({
       *   action: 'obtenerPacientes'
       * });
       *
       * pacientes = result.data || [];
       *
       * =======================================
       */

      /*
       * Por ahora usamos datos demo.
       */

      await new Promise(
        resolve =>
          setTimeout(
            resolve,
            250
          )
      );


      pacientes =
        [...PACIENTES_DEMO];


      actualizarResumen();

      aplicarFiltros();

    }

    catch (error) {

      console.error(
        '[PACIENTES]',
        error
      );

      mostrarError(
        'No se pudieron cargar los pacientes.'
      );

    }

  }


  /* =========================================
     FILTROS
  ========================================== */

  function aplicarFiltros() {

    const busqueda =
      document
        .getElementById(
          'pacienteBusqueda'
        )
        ?.value
        .trim()
        .toLowerCase() || '';


    const estado =
      document
        .getElementById(
          'pacienteEstado'
        )
        ?.value || '';


    const tipoIngreso =
      document
        .getElementById(
          'pacienteIngreso'
        )
        ?.value || '';


    filtroActual = {
      busqueda,
      estado,
      tipoIngreso
    };


    const filtrados =
      pacientes.filter(
        paciente => {

          const texto =
            [
              paciente.apellido,
              paciente.nombres,
              paciente.dni,
              paciente.nro_legajo
            ]
              .join(' ')
              .toLowerCase();


          const coincideBusqueda =
            !busqueda ||
            texto.includes(
              busqueda
            );


          const coincideEstado =
            !estado ||
            paciente.estado === estado;


          const coincideIngreso =
            !tipoIngreso ||
            paciente.tipo_ingreso ===
            tipoIngreso;


          return (
            coincideBusqueda &&
            coincideEstado &&
            coincideIngreso
          );

        }
      );


    renderTabla(
      filtrados
    );

  }


  function limpiarFiltros() {

    const busqueda =
      document.getElementById(
        'pacienteBusqueda'
      );

    const estado =
      document.getElementById(
        'pacienteEstado'
      );

    const ingreso =
      document.getElementById(
        'pacienteIngreso'
      );


    if (busqueda) {

      busqueda.value = '';

    }

    if (estado) {

      estado.value = '';

    }

    if (ingreso) {

      ingreso.value = '';

    }


    aplicarFiltros();

  }


  /* =========================================
     TABLA
  ========================================== */

  function renderTabla(
    lista
  ) {

    const tbody =
      document.getElementById(
        'pacientesTableBody'
      );


    if (!tbody) {

      return;

    }


    if (!lista.length) {

      tbody.innerHTML = `

        <tr>

          <td
            colspan="8"
            class="table-loading"
          >
            No se encontraron pacientes.
          </td>

        </tr>

      `;

      return;

    }


    tbody.innerHTML =
      lista
        .map(
          paciente =>
            `

              <tr>

                <td>
                  <span class="paciente-legajo">
                    ${escapeHtml(
                      paciente.nro_legajo
                    )}
                  </span>
                </td>


                <td>

                  <div class="paciente-name">
                    ${escapeHtml(
                      paciente.apellido
                    )},
                    ${escapeHtml(
                      paciente.nombres
                    )}
                  </div>

                </td>


                <td>
                  ${escapeHtml(
                    paciente.dni
                  )}
                </td>


                <td>
                  ${formatearFecha(
                    paciente.fecha_ingreso
                  )}
                </td>


                <td>
                  ${escapeHtml(
                    paciente.cama_id || '—'
                  )}
                </td>


                <td>
                  ${escapeHtml(
                    paciente.tipo_ingreso
                  )}
                </td>


                <td>
                  ${renderEstado(
                    paciente
                  )}
                </td>


                <td>

                  <button
                    class="btn-ver-paciente"
                    type="button"
                    data-residente-id="${escapeHtml(
                      paciente.residente_id
                    )}"
                  >
                    Ver
                  </button>

                </td>

              </tr>

            `
        )
        .join('');


    tbody
      .querySelectorAll(
        '.btn-ver-paciente'
      )
      .forEach(
        button => {

          button.addEventListener(
            'click',
            () => {

              abrirFicha(
                button.dataset.residenteId
              );

            }
          );

        }
      );

  }


  function renderEstado(
    paciente
  ) {

    const clase =
      paciente.estado ===
      'ACTIVO'
        ? 'status-activo'
        : 'status-egresado';


    return `

      <span
        class="status-badge ${clase}"
      >
        ${escapeHtml(
          paciente.estado
        )}
      </span>

    `;

  }


  /* =========================================
     RESUMEN
  ========================================== */

  function actualizarResumen() {

    const total =
      pacientes.length;


    const activos =
      pacientes.filter(
        p =>
          p.estado === 'ACTIVO'
      ).length;


    const temporarios =
      pacientes.filter(
        p =>
          p.tipo_ingreso ===
          'TEMPORARIO' &&
          p.estado === 'ACTIVO'
      ).length;


    const egresados =
      pacientes.filter(
        p =>
          p.estado === 'EGRESADO'
      ).length;


    setText(
      'totalPacientes',
      total
    );

    setText(
      'totalActivos',
      activos
    );

    setText(
      'totalTemporarios',
      temporarios
    );

    setText(
      'totalEgresados',
      egresados
    );

  }


  /* =========================================
     FICHA
  ========================================== */

  function abrirFicha(
    residenteId
  ) {

    const paciente =
      pacientes.find(
        p =>
          p.residente_id ===
          residenteId
      );


    if (!paciente) {

      return;

    }


    pacienteSeleccionado =
      paciente;


    setText(
      'fichaNombre',
      `${paciente.apellido}, ${paciente.nombres}`
    );

    setText(
      'fichaLegajo',
      paciente.nro_legajo
    );

    setText(
      'fichaDni',
      paciente.dni
    );

    setText(
      'fichaNacimiento',
      formatearFecha(
        paciente.fecha_nacimiento
      )
    );

    setText(
      'fichaSexo',
      paciente.sexo
    );

    setText(
      'fichaNacionalidad',
      paciente.nacionalidad
    );

    setText(
      'fichaEstadoCivil',
      paciente.estado_civil
    );

    setText(
      'fichaIngreso',
      formatearFecha(
        paciente.fecha_ingreso
      )
    );

    setText(
      'fichaTipoIngreso',
      paciente.tipo_ingreso
    );

    setText(
      'fichaCama',
      paciente.cama_id || '—'
    );

    setText(
      'fichaEgreso',
      paciente.fecha_egreso
        ? formatearFecha(
            paciente.fecha_egreso
          )
        : '—'
    );

    setText(
      'fichaObservaciones',
      paciente.observaciones ||
      'Sin observaciones.'
    );


    const estado =
      document.getElementById(
        'fichaEstado'
      );


    if (estado) {

      estado.textContent =
        paciente.estado;


      estado.className =
        'status-badge ' +
        (
          paciente.estado ===
          'ACTIVO'
            ? 'status-activo'
            : 'status-egresado'
        );

    }


    const listado =
      document.querySelector(
        '.pacientes-table-container'
      );


    const filters =
      document.querySelector(
        '.pacientes-filters'
      );


    const summary =
      document.querySelector(
        '.pacientes-summary'
      );


    const header =
      document.querySelector(
        '.pacientes-header'
      );


    if (listado) {

      listado.classList.add(
        'hidden'
      );

    }

    if (filters) {

      filters.classList.add(
        'hidden'
      );

    }

    if (summary) {

      summary.classList.add(
        'hidden'
      );

    }

    if (header) {

      header.classList.add(
        'hidden'
      );

    }


    const ficha =
      document.getElementById(
        'pacienteFicha'
      );


    if (ficha) {

      ficha.classList.remove(
        'hidden'
      );

    }


    cambiarFichaTab(
      'contactos'
    );

  }


  function volverListado() {

    pacienteSeleccionado =
      null;


    const ficha =
      document.getElementById(
        'pacienteFicha'
      );


    if (ficha) {

      ficha.classList.add(
        'hidden'
      );

    }


    document
      .querySelectorAll(
        '.pacientes-header, .pacientes-filters, .pacientes-summary, .pacientes-table-container'
      )
      .forEach(
        element => {

          element.classList.remove(
            'hidden'
          );

        }
      );

  }


  /* =========================================
     FICHA — RELACIONES
  ========================================== */

  function cambiarFichaTab(
    tab
  ) {

    document
      .querySelectorAll(
        '.ficha-tab'
      )
      .forEach(
        button => {

          button.classList.toggle(
            'active',
            button.dataset.tab === tab
          );

        }
      );


    const container =
      document.getElementById(
        'fichaRelatedContent'
      );


    if (!container) {

      return;

    }


    if (!pacienteSeleccionado) {

      container.textContent =
        'No hay paciente seleccionado.';

      return;

    }


    if (tab === 'contactos') {

      cargarContactos(
        pacienteSeleccionado
      );

      return;

    }


    if (
      tab === 'documentacion'
    ) {

      cargarDocumentacion(
        pacienteSeleccionado
      );

      return;

    }


    if (
      tab === 'movimientos'
    ) {

      cargarMovimientos(
        pacienteSeleccionado
      );

      return;

    }

  }


  function cargarContactos(
    paciente
  ) {

    const container =
      document.getElementById(
        'fichaRelatedContent'
      );


    container.innerHTML = `

      <p>
        Contactos del paciente
        <strong>
          ${escapeHtml(
            paciente.apellido
          )},
          ${escapeHtml(
            paciente.nombres
          )}
        </strong>
      </p>

      <p class="muted">
        Aquí se cargarán los registros
        de CONTACTOS mediante GAS.
      </p>

    `;

  }


  function cargarDocumentacion(
    paciente
  ) {

    const container =
      document.getElementById(
        'fichaRelatedContent'
      );


    container.innerHTML = `

      <p>
        Documentación del paciente
        <strong>
          ${escapeHtml(
            paciente.apellido
          )},
          ${escapeHtml(
            paciente.nombres
          )}
        </strong>
      </p>

      <p class="muted">
        Aquí se cargarán los registros
        de DOCUMENTACIÓN mediante GAS.
      </p>

    `;

  }


  function cargarMovimientos(
    paciente
  ) {

    const container =
      document.getElementById(
        'fichaRelatedContent'
      );


    container.innerHTML = `

      <p>
        Movimientos del paciente
        <strong>
          ${escapeHtml(
            paciente.apellido
          )},
          ${escapeHtml(
            paciente.nombres
          )}
        </strong>
      </p>

      <p class="muted">
        Aquí se cargarán los registros
        de MOVIMIENTOS mediante GAS.
      </p>

    `;

  }


  /* =========================================
     NUEVO PACIENTE
  ========================================== */

  function abrirNuevoPaciente() {

    const form =
      document.getElementById(
        'pacienteForm'
      );


    if (form) {

      form.reset();

    }


    setText(
      'pacienteModalTitle',
      'Nuevo paciente'
    );


    const id =
      document.getElementById(
        'formResidenteId'
      );


    if (id) {

      id.value = '';

    }


    abrirModal();

  }


  function abrirModal() {

    const modal =
      document.getElementById(
        'pacienteModal'
      );


    if (modal) {

      modal.classList.remove(
        'hidden'
      );

    }

  }


  function cerrarModal() {

    const modal =
      document.getElementById(
        'pacienteModal'
      );


    if (modal) {

      modal.classList.add(
        'hidden'
      );

    }

  }


  async function guardarPaciente(
    event
  ) {

    event.preventDefault();


    const paciente = {

      residente_id:
        document.getElementById(
          'formResidenteId'
        )?.value || '',

      apellido:
        document.getElementById(
          'formApellido'
        )?.value.trim() || '',

      nombres:
        document.getElementById(
          'formNombres'
        )?.value.trim() || '',

      dni:
        document.getElementById(
          'formDni'
        )?.value.trim() || '',

      fecha_nacimiento:
        document.getElementById(
          'formNacimiento'
        )?.value || '',

      sexo:
        document.getElementById(
          'formSexo'
        )?.value || '',

      estado_civil:
        document.getElementById(
          'formEstadoCivil'
        )?.value || '',

      tipo_ingreso:
        document.getElementById(
          'formTipoIngreso'
        )?.value || 'PERMANENTE',

      observaciones:
        document.getElementById(
          'formObservaciones'
        )?.value.trim() || ''

    };


    /*
     * =======================================
     * BACKEND
     *
     * Más adelante:
     *
     * const result = await api({
     *
     *   action:
     *     paciente.residente_id
     *       ? 'actualizarPaciente'
     *       : 'crearPaciente',
     *
     *   paciente
     *
     * });
     *
     * =======================================
     */


    console.log(
      '[PACIENTES] Guardar:',
      paciente
    );


    alert(
      'La interfaz está preparada. Falta conectar la acción de guardado con GAS.'
    );


    cerrarModal();

  }


  /* =========================================
     HELPERS
  ========================================== */

  function mostrarCarga() {

    const tbody =
      document.getElementById(
        'pacientesTableBody'
      );


    if (tbody) {

      tbody.innerHTML = `

        <tr>

          <td
            colspan="8"
            class="table-loading"
          >
            Cargando pacientes...
          </td>

        </tr>

      `;

    }

  }


  function mostrarError(
    mensaje
  ) {

    const tbody =
      document.getElementById(
        'pacientesTableBody'
      );


    if (tbody) {

      tbody.innerHTML = `

        <tr>

          <td
            colspan="8"
            class="table-loading"
          >
            ${escapeHtml(
              mensaje
            )}
          </td>

        </tr>

      `;

    }

  }


  function formatearFecha(
    fecha
  ) {

    if (!fecha) {

      return '—';

    }


    const partes =
      String(
        fecha
      ).split('-');


    if (
      partes.length !== 3
    ) {

      return fecha;

    }


    return (
      partes[2] +
      '/' +
      partes[1] +
      '/' +
      partes[0]
    );

  }


  function setText(
    id,
    value
  ) {

    const element =
      document.getElementById(
        id
      );


    if (element) {

      element.textContent =
        value ?? '—';

    }

  }


  function escapeHtml(
    value
  ) {

    return String(
      value ?? ''
    )
      .replace(
        /&/g,
        '&amp;'
      )
      .replace(
        /</g,
        '&lt;'
      )
      .replace(
        />/g,
        '&gt;'
      )
      .replace(
        /"/g,
        '&quot;'
      )
      .replace(
        /'/g,
        '&#039;'
      );

  }

})();
