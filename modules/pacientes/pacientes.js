/* =========================================================
   MÓDULO PACIENTES
   ========================================================= */

(function () {

    'use strict';


    /* =====================================================
       CONFIGURACIÓN
    ===================================================== */

    const CONFIG = {

        // Acción que utilizaremos cuando conectemos GAS
        API_ACTION: 'listar_residentes',

        // true = utiliza datos locales de prueba
        // false = intenta consultar la API
        MODO_PRUEBA: false

    };


    /* =====================================================
       ESTADO DEL MÓDULO
    ===================================================== */

    let pacientes = [];

    let pacientesFiltrados = [];

    let filtroBusqueda = '';

    let filtroEstado = 'TODOS';


    /* =====================================================
       MOUNT
       ===================================================== */

    window.mount_pacientes = function () {

        console.log('================================');
        console.log('Módulo PACIENTES iniciado');
        console.log('================================');

        inicializarEventos();

        cargarPacientes();

    };


    /* =====================================================
       INICIALIZACIÓN DE EVENTOS
    ===================================================== */

    function inicializarEventos() {

        const search =
            document.getElementById('pacientesSearch');

        const estado =
            document.getElementById('pacientesEstadoFilter');

        const actualizar =
            document.getElementById('btnActualizarPacientes');

        const nuevo =
            document.getElementById('btnNuevoPaciente');

        const tabla =
            document.getElementById('pacientesTableBody');


        /* -----------------------------------------------
           BUSCADOR
        ------------------------------------------------ */

        if (search) {

            search.addEventListener(
                'input',
                function (event) {

                    filtroBusqueda =
                        event.target.value
                            .trim()
                            .toLowerCase();

                    aplicarFiltros();

                }
            );

        }


        /* -----------------------------------------------
           FILTRO DE ESTADO
        ------------------------------------------------ */

        if (estado) {

            estado.addEventListener(
                'change',
                function (event) {

                    filtroEstado =
                        event.target.value;

                    aplicarFiltros();

                }
            );

        }


        /* -----------------------------------------------
           ACTUALIZAR
        ------------------------------------------------ */

        if (actualizar) {

            actualizar.addEventListener(
                'click',
                function () {

                    cargarPacientes();

                }
            );

        }


        /* -----------------------------------------------
           NUEVO PACIENTE
        ------------------------------------------------ */

        if (nuevo) {

            nuevo.addEventListener(
                'click',
                function () {

                    nuevoPaciente();

                }
            );

        }


        /* -----------------------------------------------
           ACCIONES DE TABLA
        ------------------------------------------------ */

        if (tabla) {

            tabla.addEventListener(
                'click',
                manejarAccionTabla
            );

        }

    }


    /* =====================================================
       CARGAR PACIENTES
    ===================================================== */

    async function cargarPacientes() {

        mostrarLoading(true);

        ocultarEmpty();

        try {

            pacientes =
                await obtenerPacientes();

            if (!Array.isArray(pacientes)) {

                throw new Error(
                    'La respuesta de pacientes no es válida.'
                );

            }


            console.log(
                'Pacientes cargados:',
                pacientes
            );


            aplicarFiltros();

        }
        catch (error) {

            console.error(
                'Error cargando pacientes:',
                error
            );

            pacientes = [];

            pacientesFiltrados = [];

            renderizarTabla();

            actualizarResumen();

            mostrarError(
                'No fue posible cargar los pacientes.'
            );

        }
        finally {

            mostrarLoading(false);

        }

    }


    /* =====================================================
       OBTENER PACIENTES
       
       Esta función es el punto de conexión con GAS.
    ===================================================== */

    async function obtenerPacientes() {


        /* -----------------------------------------------
           MODO PRUEBA
        ------------------------------------------------ */

        if (CONFIG.MODO_PRUEBA) {

            return obtenerPacientesDemo();

        }


        /* -----------------------------------------------
           API REAL
        ------------------------------------------------ */

        if (typeof window.api !== 'function') {

            throw new Error(
                'La función api() no está disponible.'
            );

        }


        const respuesta = await window.api({

            action: CONFIG.API_ACTION

        });


        console.log(
            'Respuesta listar_residentes:',
            respuesta
        );


        if (!respuesta) {

            throw new Error(
                'El servidor no devolvió respuesta.'
            );

        }


        if (respuesta.ok === false) {

            throw new Error(
                respuesta.error ||
                'Error devuelto por el servidor.'
            );

        }


        /*
         * Permitimos distintas estructuras
         * de respuesta para facilitar la integración
         * con GAS.
         */

        if (Array.isArray(respuesta)) {

            return respuesta;

        }


        if (Array.isArray(respuesta.data)) {

            return respuesta.data;

        }


        if (Array.isArray(respuesta.pacientes)) {

            return respuesta.pacientes;

        }


        if (Array.isArray(respuesta.residentes)) {

            return respuesta.residentes;

        }


        return [];

    }


    /* =====================================================
       DATOS DE PRUEBA
       
       TEMPORAL
       
       Se eliminan cuando conectemos GAS.
    ===================================================== */

    function obtenerPacientesDemo() {

        return [

            {
                residente_id: 'RES-0001',
                nro_legajo: 'LEG-00001',
                apellido: 'González',
                nombres: 'Elena Beatriz',
                dni: '28.456.721',
                fecha_nacimiento: '1947-03-18',
                fecha_ingreso: '2024-05-12',
                cama_id: 'CAMA-101',
                estado: 'ACTIVO'
            },

            {
                residente_id: 'RES-0002',
                nro_legajo: 'LEG-00002',
                apellido: 'Fernández',
                nombres: 'Roberto Carlos',
                dni: '25.873.412',
                fecha_nacimiento: '1942-11-07',
                fecha_ingreso: '2023-08-21',
                cama_id: 'CAMA-102',
                estado: 'ACTIVO'
            },

            {
                residente_id: 'RES-0003',
                nro_legajo: 'LEG-00003',
                apellido: 'Martínez',
                nombres: 'Norma Alicia',
                dni: '30.124.598',
                fecha_nacimiento: '1950-06-25',
                fecha_ingreso: '2025-01-15',
                cama_id: 'CAMA-103',
                estado: 'ACTIVO'
            },

            {
                residente_id: 'RES-0004',
                nro_legajo: 'LEG-00004',
                apellido: 'Rodríguez',
                nombres: 'Héctor Alberto',
                dni: '24.781.963',
                fecha_nacimiento: '1940-09-12',
                fecha_ingreso: '2022-11-03',
                cama_id: 'CAMA-104',
                estado: 'ACTIVO'
            },

            {
                residente_id: 'RES-0005',
                nro_legajo: 'LEG-00005',
                apellido: 'López',
                nombres: 'María Cristina',
                dni: '29.634.817',
                fecha_nacimiento: '1948-01-30',
                fecha_ingreso: '2024-09-07',
                cama_id: 'CAMA-105',
                estado: 'ACTIVO'
            },

            {
                residente_id: 'RES-0006',
                nro_legajo: 'LEG-00006',
                apellido: 'Romero',
                nombres: 'Juan José',
                dni: '23.987.541',
                fecha_nacimiento: '1939-12-05',
                fecha_ingreso: '2021-06-18',
                cama_id: 'CAMA-106',
                estado: 'ACTIVO'
            },

            {
                residente_id: 'RES-0007',
                nro_legajo: 'LEG-00007',
                apellido: 'Sosa',
                nombres: 'Teresa Mabel',
                dni: '31.245.789',
                fecha_nacimiento: '1952-04-16',
                fecha_ingreso: '2025-03-22',
                cama_id: 'CAMA-107',
                estado: 'ACTIVO'
            },

            {
                residente_id: 'RES-0008',
                nro_legajo: 'LEG-00008',
                apellido: 'Álvarez',
                nombres: 'Carlos Alberto',
                dni: '22.654.398',
                fecha_nacimiento: '1938-08-21',
                fecha_ingreso: '2020-10-11',
                cama_id: 'CAMA-122',
                estado: 'ACTIVO'
            },

            {
                residente_id: 'RES-0009',
                nro_legajo: 'LEG-00009',
                apellido: 'Torres',
                nombres: 'Beatriz Susana',
                dni: '32.187.654',
                fecha_nacimiento: '1954-02-11',
                fecha_ingreso: '2025-07-04',
                cama_id: 'CAMA-109',
                estado: 'ACTIVO'
            },

            {
                residente_id: 'RES-0010',
                nro_legajo: 'LEG-00010',
                apellido: 'Ramírez',
                nombres: 'Miguel Ángel',
                dni: '26.541.932',
                fecha_nacimiento: '1944-10-28',
                fecha_ingreso: '2024-02-26',
                cama_id: 'CAMA-110',
                estado: 'ACTIVO'
            },

            {
                residente_id: 'RES-0011',
                nro_legajo: 'LEG-00011',
                apellido: 'Acosta',
                nombres: 'Silvia Beatriz',
                dni: '29.876.345',
                fecha_nacimiento: '1949-07-19',
                fecha_ingreso: '2023-04-17',
                cama_id: 'CAMA-111',
                estado: 'ACTIVO'
            },

            {
                residente_id: 'RES-0012',
                nro_legajo: 'LEG-00012',
                apellido: 'Benítez',
                nombres: 'Oscar Raúl',
                dni: '21.543.876',
                fecha_nacimiento: '1937-05-03',
                fecha_ingreso: '2022-04-09',
                cama_id: 'CAMA-123',
                estado: 'ACTIVO'
            },

            {
                residente_id: 'RES-0013',
                nro_legajo: 'LEG-00013',
                apellido: 'Molina',
                nombres: 'Alicia Esther',
                dni: '30.765.432',
                fecha_nacimiento: '1951-09-14',
                fecha_ingreso: '2025-02-10',
                cama_id: 'CAMA-113',
                estado: 'ACTIVO'
            },

            {
                residente_id: 'RES-0014',
                nro_legajo: 'LEG-00014',
                apellido: 'Suárez',
                nombres: 'Eduardo Daniel',
                dni: '27.432.198',
                fecha_nacimiento: '1946-12-22',
                fecha_ingreso: '2023-12-01',
                cama_id: 'CAMA-114',
                estado: 'ACTIVO'
            },

            {
                residente_id: 'RES-0015',
                nro_legajo: 'LEG-00015',
                apellido: 'Castro',
                nombres: 'Mirta Graciela',
                dni: '33.219.876',
                fecha_nacimiento: '1956-03-09',
                fecha_ingreso: '2026-01-20',
                cama_id: 'CAMA-115',
                estado: 'ACTIVO'
            },

            {
                residente_id: 'RES-0016',
                nro_legajo: 'LEG-00016',
                apellido: 'Ortiz',
                nombres: 'Ricardo Antonio',
                dni: '20.876.543',
                fecha_nacimiento: '1936-06-17',
                fecha_ingreso: '2019-08-14',
                cama_id: 'CAMA-124',
                estado: 'ACTIVO'
            },

            {
                residente_id: 'RES-0017',
                nro_legajo: 'LEG-00017',
                apellido: 'Ríos',
                nombres: 'Carmen Luisa',
                dni: '28.345.671',
                fecha_nacimiento: '1947-11-26',
                fecha_ingreso: '2024-11-18',
                cama_id: 'CAMA-117',
                estado: 'ACTIVO'
            },

            {
                residente_id: 'RES-0018',
                nro_legajo: 'LEG-00018',
                apellido: 'Núñez',
                nombres: 'Jorge Omar',
                dni: '24.678.912',
                fecha_nacimiento: '1941-01-15',
                fecha_ingreso: '2022-09-30',
                cama_id: 'CAMA-118',
                estado: 'ACTIVO'
            },

            {
                residente_id: 'RES-0019',
                nro_legajo: 'LEG-00019',
                apellido: 'Vera',
                nombres: 'Margarita Elena',
                dni: '27.891.234',
                fecha_nacimiento: '1945-04-08',
                fecha_ingreso: '2025-05-06',
                cama_id: 'CAMA-119',
                estado: 'EGRESADO'
            },

            {
                residente_id: 'RES-0020',
                nro_legajo: 'LEG-00020',
                apellido: 'Cabrera',
                nombres: 'Antonio José',
                dni: '23.456.789',
                fecha_nacimiento: '1939-10-13',
                fecha_ingreso: '2021-11-22',
                cama_id: 'CAMA-120',
                estado: 'EGRESADO'
            }

        ];

    }


    /* =====================================================
       FILTROS
    ===================================================== */

    function aplicarFiltros() {

        pacientesFiltrados =
            pacientes.filter(function (paciente) {

                const texto =
                    construirTextoBusqueda(paciente);


                const coincideBusqueda =
                    !filtroBusqueda ||
                    texto.includes(filtroBusqueda);


                const estadoPaciente =
                    normalizarEstado(
                        paciente.estado
                    );


                const coincideEstado =
                    filtroEstado === 'TODOS' ||
                    estadoPaciente === filtroEstado;


                return (
                    coincideBusqueda &&
                    coincideEstado
                );

            });


        /*
         * Orden alfabético:
         * apellido → nombre
         */

        pacientesFiltrados.sort(
            function (a, b) {

                const nombreA =
                    `${a.apellido || ''} ${a.nombres || ''}`
                        .toLowerCase();

                const nombreB =
                    `${b.apellido || ''} ${b.nombres || ''}`
                        .toLowerCase();

                return nombreA.localeCompare(
                    nombreB,
                    'es'
                );

            }
        );


        renderizarTabla();

        actualizarResumen();

        actualizarResultadoInfo();

    }


    /* =====================================================
       TEXTO DE BÚSQUEDA
    ===================================================== */

    function construirTextoBusqueda(paciente) {

        return [

            paciente.residente_id,

            paciente.nro_legajo,

            paciente.apellido,

            paciente.nombres,

            paciente.dni

        ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

    }


    /* =====================================================
       RENDER TABLA
    ===================================================== */

    function renderizarTabla() {

        const tbody =
            document.getElementById(
                'pacientesTableBody'
            );


        if (!tbody) {
            return;
        }


        tbody.innerHTML = '';


        if (
            pacientesFiltrados.length === 0
        ) {

            mostrarEmpty(true);

            return;

        }


        mostrarEmpty(false);


        pacientesFiltrados.forEach(
            function (paciente) {

                const tr =
                    document.createElement('tr');


                const estado =
                    normalizarEstado(
                        paciente.estado
                    );


                tr.innerHTML = `

                    <td>
                        <span class="paciente-legajo">
                            ${escapeHTML(
                                paciente.nro_legajo || '-'
                            )}
                        </span>
                    </td>

                    <td>
                        <span class="paciente-nombre">
                            ${escapeHTML(
                                construirNombre(paciente)
                            )}
                        </span>
                    </td>

                    <td>
                        <span class="paciente-dni">
                            ${escapeHTML(
                                paciente.dni || '-'
                            )}
                        </span>
                    </td>

                    <td>
                        <span class="paciente-fecha">
                            ${formatearFecha(
                                paciente.fecha_nacimiento
                            )}
                        </span>
                    </td>

                    <td>
                        <span class="paciente-fecha">
                            ${formatearFecha(
                                paciente.fecha_ingreso
                            )}
                        </span>
                    </td>

                    <td>
                        <span class="paciente-cama">
                            ${escapeHTML(
                                paciente.cama_id || '-'
                            )}
                        </span>
                    </td>

                    <td>
                        ${crearBadgeEstado(estado)}
                    </td>

                    <td>

                        <div class="paciente-actions">

                            <button
                                type="button"
                                class="paciente-action-btn"
                                data-action="ver"
                                data-id="${escapeHTML(
                                    paciente.residente_id
                                )}"
                                title="Ver paciente"
                                aria-label="Ver paciente">

                                👁

                            </button>


                            <button
                                type="button"
                                class="paciente-action-btn"
                                data-action="editar"
                                data-id="${escapeHTML(
                                    paciente.residente_id
                                )}"
                                title="Editar paciente"
                                aria-label="Editar paciente">

                                ✎

                            </button>

                        </div>

                    </td>

                `;


                tbody.appendChild(tr);

            }
        );

    }


    /* =====================================================
       BADGE DE ESTADO
    ===================================================== */

    function crearBadgeEstado(estado) {

        const clase =
            estado === 'ACTIVO'
                ? 'activo'
                : 'egresado';


        const texto =
            estado === 'ACTIVO'
                ? 'Activo'
                : 'Egresado';


        return `
            <span class="estado-badge ${clase}">
                ${texto}
            </span>
        `;

    }


    /* =====================================================
       RESUMEN
    ===================================================== */

    function actualizarResumen() {

        const total =
            pacientes.length;


        const activos =
            pacientes.filter(
                function (paciente) {

                    return (
                        normalizarEstado(
                            paciente.estado
                        ) === 'ACTIVO'
                    );

                }
            ).length;


        const egresados =
            pacientes.filter(
                function (paciente) {

                    return (
                        normalizarEstado(
                            paciente.estado
                        ) === 'EGRESADO'
                    );

                }
            ).length;


        establecerTexto(
            'pacientesTotal',
            total
        );


        establecerTexto(
            'pacientesActivos',
            activos
        );


        establecerTexto(
            'pacientesEgresados',
            egresados
        );

    }


    /* =====================================================
       RESULTADO DE BÚSQUEDA
    ===================================================== */

    function actualizarResultadoInfo() {

        const elemento =
            document.getElementById(
                'pacientesResultadoInfo'
            );


        if (!elemento) {
            return;
        }


        const cantidad =
            pacientesFiltrados.length;


        const texto =
            cantidad === 1
                ? '1 registro'
                : `${cantidad} registros`;


        elemento.textContent = texto;

    }


    /* =====================================================
       ACCIONES DE TABLA
    ===================================================== */

    function manejarAccionTabla(event) {

        const button =
            event.target.closest(
                '[data-action]'
            );


        if (!button) {
            return;
        }


        const action =
            button.dataset.action;


        const id =
            button.dataset.id;


        const paciente =
            pacientes.find(
                function (item) {

                    return (
                        String(item.residente_id) ===
                        String(id)
                    );

                }
            );


        if (!paciente) {

            console.warn(
                'Paciente no encontrado:',
                id
            );

            return;

        }


        switch (action) {

            case 'ver':

                verPaciente(paciente);

                break;


            case 'editar':

                editarPaciente(paciente);

                break;


            default:

                console.warn(
                    'Acción desconocida:',
                    action
                );

        }

    }


    /* =====================================================
       VER PACIENTE
    ===================================================== */

    function verPaciente(paciente) {

        console.log(
            'Ver paciente:',
            paciente
        );


        /*
         * Por ahora mostramos la información.
         *
         * Posteriormente esto debería abrir
         * una ficha completa del residente.
         */

        const nombre =
            construirNombre(paciente);


        alert(
            `Paciente\n\n` +

            `Legajo: ${
                paciente.nro_legajo || '-'
            }\n` +

            `Nombre: ${
                nombre
            }\n` +

            `DNI: ${
                paciente.dni || '-'
            }\n` +

            `Nacimiento: ${
                formatearFecha(
                    paciente.fecha_nacimiento
                )
            }\n` +

            `Ingreso: ${
                formatearFecha(
                    paciente.fecha_ingreso
                )
            }\n` +

            `Cama: ${
                paciente.cama_id || '-'
            }\n` +

            `Estado: ${
                paciente.estado || '-'
            }`
        );

    }


    /* =====================================================
       EDITAR PACIENTE
    ===================================================== */

    function editarPaciente(paciente) {

        console.log(
            'Editar paciente:',
            paciente
        );


        /*
         * Próximo paso:
         *
         * abrir formulario de edición.
         */

        alert(
            `Editar paciente:\n\n` +
            `${construirNombre(paciente)}\n\n` +
            `ID: ${paciente.residente_id}`
        );

    }


    /* =====================================================
       NUEVO PACIENTE
    ===================================================== */

    function nuevoPaciente() {

        console.log(
            'Nuevo paciente'
        );


        /*
         * Próximo paso:
         *
         * abrir formulario de alta.
         */

        alert(
            'Formulario de nuevo paciente'
        );

    }


    /* =====================================================
       ESTADO DE CARGA
    ===================================================== */

    function mostrarLoading(mostrar) {

        const loading =
            document.getElementById(
                'pacientesLoading'
            );


        if (!loading) {
            return;
        }


        loading.hidden = !mostrar;

    }


    /* =====================================================
       ESTADO VACÍO
    ===================================================== */

    function mostrarEmpty(mostrar) {

        const empty =
            document.getElementById(
                'pacientesEmptyState'
            );


        if (!empty) {
            return;
        }


        empty.hidden = !mostrar;

    }


    function ocultarEmpty() {

        mostrarEmpty(false);

    }


    /* =====================================================
       ERROR
    ===================================================== */

    function mostrarError(mensaje) {

        const empty =
            document.getElementById(
                'pacientesEmptyState'
            );


        if (!empty) {
            return;
        }


        empty.hidden = false;


        empty.innerHTML = `

            <div class="empty-icon">
                ⚠️
            </div>

            <h3>
                No fue posible cargar los pacientes
            </h3>

            <p>
                ${escapeHTML(mensaje)}
            </p>

        `;

    }


    /* =====================================================
       UTILIDADES
    ===================================================== */

    function construirNombre(paciente) {

        return [

            paciente.apellido,

            paciente.nombres

        ]
            .filter(Boolean)
            .join(', ');

    }


    function normalizarEstado(estado) {

        return String(
            estado || ''
        )
            .trim()
            .toUpperCase();

    }


    function formatearFecha(fecha) {

        if (!fecha) {
            return '-';
        }


        const partes =
            String(fecha)
                .split('T')[0]
                .split('-');


        if (partes.length !== 3) {
            return fecha;
        }


        return `${partes[2]}/${partes[1]}/${partes[0]}`;

    }


    function establecerTexto(id, valor) {

        const elemento =
            document.getElementById(id);


        if (elemento) {

            elemento.textContent =
                String(valor);

        }

    }


    /* =====================================================
       ESCAPE HTML
       
       Importante cuando los datos vienen de Sheets/API.
    ===================================================== */

    function escapeHTML(valor) {

        return String(valor ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

    }


})();
