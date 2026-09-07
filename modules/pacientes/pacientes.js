/* =========================================================
   PACIENTES
   ========================================================= */

const CONFIG = {
    API_ACTION: 'listar_residentes'
};


/* =========================================================
   ESTADO DEL MÓDULO
   ========================================================= */

let pacientes = [];
let pacientesFiltrados = [];


/* =========================================================
   MOUNT
   ========================================================= */

window.mount_pacientes = async function () {

    console.log('Montando módulo Pacientes...');

    inicializarEventos();

    await cargarPacientes();

};


/* =========================================================
   EVENTOS
   ========================================================= */

function inicializarEventos() {

    const search =
        document.getElementById(
            'pacientesSearch'
        );

    if (search) {

        search.addEventListener(
            'input',
            aplicarFiltros
        );

    }


    const filtroEstado =
        document.getElementById(
            'pacientesEstadoFilter'
        );

    if (filtroEstado) {

        filtroEstado.addEventListener(
            'change',
            aplicarFiltros
        );

    }


    const btnActualizar =
        document.getElementById(
            'btnActualizarPacientes'
        );

    if (btnActualizar) {

        btnActualizar.addEventListener(
            'click',
            cargarPacientes
        );

    }


    const btnNuevo =
        document.getElementById(
            'btnNuevoPaciente'
        );

    if (btnNuevo) {

        btnNuevo.addEventListener(
            'click',
            nuevoPaciente
        );

    }


    const tbody =
        document.getElementById(
            'pacientesTableBody'
        );

    if (tbody) {

        tbody.addEventListener(
            'click',
            manejarAccionTabla
        );

    }

}


/* =========================================================
   CARGAR PACIENTES
   ========================================================= */

async function cargarPacientes() {

    mostrarLoading();

    ocultarError();

    try {

        const datos =
            await obtenerPacientes();


        if (!Array.isArray(datos)) {

            throw new Error(
                'El servidor no devolvió una lista válida de pacientes.'
            );

        }


        pacientes = datos;

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
            error.message ||
            'No fue posible cargar los pacientes.'
        );

    }

    finally {

        ocultarLoading();

    }

}


/* =========================================================
   OBTENER PACIENTES DESDE API
   ========================================================= */

async function obtenerPacientes() {

    if (typeof window.api !== 'function') {

        throw new Error(
            'La función api() no está disponible.'
        );

    }


    if (!window.session) {

        throw new Error(
            'No hay una sesión activa.'
        );

    }


    if (
        !window.session.user ||
        !window.session.user.usuario
    ) {

        throw new Error(
            'No se pudo identificar al usuario.'
        );

    }


    if (!window.session.token) {

        throw new Error(
            'No existe un token de sesión.'
        );

    }


    const respuesta =
        await window.api({

            action:
                CONFIG.API_ACTION,

            usuario:
                window.session.user.usuario,

            token:
                window.session.token

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


    if (Array.isArray(respuesta.data)) {

        return respuesta.data;

    }


    return [];

}


/* =========================================================
   FILTROS
   ========================================================= */

function aplicarFiltros() {

    const searchInput =
        document.getElementById(
            'pacientesSearch'
        );


    const estadoSelect =
        document.getElementById(
            'pacientesEstadoFilter'
        );


    const texto =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : '';


    const estado =
        estadoSelect
            ? estadoSelect.value
            : 'TODOS';


    pacientesFiltrados =
        pacientes.filter(
            paciente => {

                const textoBusqueda =
                    construirTextoBusqueda(
                        paciente
                    );


                const coincideTexto =
                    !texto ||
                    textoBusqueda.includes(
                        texto
                    );


                const estadoPaciente =
                    normalizarEstado(
                        paciente.estado
                    );


                const coincideEstado =
                    estado === 'TODOS' ||
                    estadoPaciente === estado;


                return (
                    coincideTexto &&
                    coincideEstado
                );

            }
        );


    pacientesFiltrados.sort(
        (a, b) => {

            const apellidoA =
                String(
                    a.apellido || ''
                ).toLowerCase();


            const apellidoB =
                String(
                    b.apellido || ''
                ).toLowerCase();


            if (
                apellidoA <
                apellidoB
            ) {
                return -1;
            }


            if (
                apellidoA >
                apellidoB
            ) {
                return 1;
            }


            const nombreA =
                String(
                    a.nombres || ''
                ).toLowerCase();


            const nombreB =
                String(
                    b.nombres || ''
                ).toLowerCase();


            return nombreA.localeCompare(
                nombreB
            );

        }
    );


    renderizarTabla();

    actualizarResumen();

    actualizarResultadoInfo();

}


/* =========================================================
   TEXTO DE BÚSQUEDA
   ========================================================= */

function construirTextoBusqueda(
    paciente
) {

    return [

        paciente.residente_id,

        paciente.nro_legajo,

        paciente.apellido,

        paciente.nombres,

        paciente.dni

    ]

        .filter(
            valor =>
                valor !== null &&
                valor !== undefined
        )

        .join(' ')

        .toLowerCase();

}


/* =========================================================
   RENDERIZAR TABLA
   ========================================================= */

function renderizarTabla() {

    const tbody =
        document.getElementById(
            'pacientesTableBody'
        );


    const emptyState =
        document.getElementById(
            'pacientesEmptyState'
        );


    if (!tbody) {
        return;
    }


    tbody.innerHTML = '';


    if (
        pacientesFiltrados.length === 0
    ) {

        if (emptyState) {

            emptyState.style.display =
                'block';

        }

        return;

    }


    if (emptyState) {

        emptyState.style.display =
            'none';

    }


    pacientesFiltrados.forEach(
        paciente => {

            const tr =
                document.createElement(
                    'tr'
                );


            const nombre =
                construirNombre(
                    paciente
                );


            const estado =
                normalizarEstado(
                    paciente.estado
                );


            const badge =
                crearBadgeEstado(
                    estado
                );


            tr.innerHTML = `

                <td>
                    ${escapeHTML(
                        paciente.nro_legajo || '-'
                    )}
                </td>

                <td>
                    <strong>
                        ${escapeHTML(
                            nombre
                        )}
                    </strong>
                </td>

                <td>
                    ${escapeHTML(
                        paciente.dni || '-'
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        formatearFecha(
                            paciente.fecha_nacimiento
                        )
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        formatearFecha(
                            paciente.fecha_ingreso
                        )
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        paciente.cama_id || '-'
                    )}
                </td>

                <td>
                    ${badge}
                </td>

                <td>

                    <div class="pacientes-actions">

                        <button
                            type="button"
                            class="btn-action btn-view"
                            data-action="ver"
                            data-id="${escapeHTML(
                                paciente.residente_id || ''
                            )}"
                            title="Ver paciente"
                        >
                            Ver
                        </button>

                        <button
                            type="button"
                            class="btn-action btn-edit"
                            data-action="editar"
                            data-id="${escapeHTML(
                                paciente.residente_id || ''
                            )}"
                            title="Editar paciente"
                        >
                            Editar
                        </button>

                    </div>

                </td>

            `;


            tbody.appendChild(tr);

        }
    );

}


/* =========================================================
   BADGE DE ESTADO
   ========================================================= */

function crearBadgeEstado(
    estado
) {

    const estadoNormalizado =
        normalizarEstado(
            estado
        );


    let clase = '';


    switch (estadoNormalizado) {

        case 'ACTIVO':

            clase = 'badge-activo';

            break;


        case 'EGRESADO':

            clase = 'badge-egresado';

            break;


        default:

            clase = 'badge-default';

            break;

    }


    return `
        <span class="badge-estado ${clase}">
            ${escapeHTML(
                estadoNormalizado || '-'
            )}
        </span>
    `;

}


/* =========================================================
   RESUMEN
   ========================================================= */

function actualizarResumen() {

    const total =
        pacientes.length;


    const activos =
        pacientes.filter(
            paciente =>
                normalizarEstado(
                    paciente.estado
                ) === 'ACTIVO'
        ).length;


    const egresados =
        pacientes.filter(
            paciente =>
                normalizarEstado(
                    paciente.estado
                ) === 'EGRESADO'
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


/* =========================================================
   RESULTADO DE FILTROS
   ========================================================= */

function actualizarResultadoInfo() {

    const elemento =
        document.getElementById(
            'pacientesResultadoInfo'
        );


    if (!elemento) {
        return;
    }


    const total =
        pacientes.length;


    const visibles =
        pacientesFiltrados.length;


    if (total === 0) {

        elemento.textContent =
            'No hay pacientes registrados.';

        return;

    }


    if (visibles === total) {

        elemento.textContent =
            `${total} paciente${total !== 1 ? 's' : ''}`;

        return;

    }


    elemento.textContent =
        `${visibles} de ${total} pacientes`;

}


/* =========================================================
   ACCIONES DE TABLA
   ========================================================= */

function manejarAccionTabla(
    event
) {

    const button =
        event.target.closest(
            'button[data-action]'
        );


    if (!button) {
        return;
    }


    const action =
        button.dataset.action;


    const residenteId =
        button.dataset.id;


    if (!residenteId) {
        return;
    }


    switch (action) {

        case 'ver':

            verPaciente(
                residenteId
            );

            break;


        case 'editar':

            editarPaciente(
                residenteId
            );

            break;

    }

}


/* =========================================================
   VER PACIENTE
   ========================================================= */

function verPaciente(
    residenteId
) {

    const paciente =
        pacientes.find(
            item =>
                String(
                    item.residente_id
                ) === String(
                    residenteId
                )
        );


    if (!paciente) {

        alert(
            'No se encontró el paciente.'
        );

        return;

    }


    alert(
        `Paciente: ${construirNombre(paciente)}\n` +
        `Legajo: ${paciente.nro_legajo || '-'}\n` +
        `DNI: ${paciente.dni || '-'}\n` +
        `Estado: ${normalizarEstado(paciente.estado)}\n` +
        `Cama: ${paciente.cama_id || '-'}`
    );

}


/* =========================================================
   EDITAR PACIENTE
   ========================================================= */

function editarPaciente(
    residenteId
) {

    const paciente =
        pacientes.find(
            item =>
                String(
                    item.residente_id
                ) === String(
                    residenteId
                )
        );


    if (!paciente) {

        alert(
            'No se encontró el paciente.'
        );

        return;

    }


    alert(
        `Editar paciente: ${construirNombre(paciente)}`
    );

}


/* =========================================================
   NUEVO PACIENTE
   ========================================================= */

function nuevoPaciente() {

    alert(
        'La creación de nuevos pacientes será implementada en el formulario de alta.'
    );

}


/* =========================================================
   LOADING
   ========================================================= */

function mostrarLoading() {

    const loading =
        document.getElementById(
            'pacientesLoading'
        );


    const emptyState =
        document.getElementById(
            'pacientesEmptyState'
        );


    if (loading) {

        loading.style.display =
            'flex';

    }


    if (emptyState) {

        emptyState.style.display =
            'none';

    }

}


/* =========================================================
   OCULTAR LOADING
   ========================================================= */

function ocultarLoading() {

    const loading =
        document.getElementById(
            'pacientesLoading'
        );


    if (loading) {

        loading.style.display =
            'none';

    }

}


/* =========================================================
   MOSTRAR ERROR
   ========================================================= */

function mostrarError(
    mensaje
) {

    const emptyState =
        document.getElementById(
            'pacientesEmptyState'
        );


    if (!emptyState) {
        return;
    }


    emptyState.innerHTML = `

        <div class="pacientes-empty-icon">
            ⚠️
        </div>

        <h3>
            No fue posible cargar los pacientes
        </h3>

        <p>
            ${escapeHTML(
                mensaje ||
                'Ocurrió un error inesperado.'
            )}
        </p>

    `;


    emptyState.style.display =
        'block';

}


/* =========================================================
   OCULTAR ERROR
   ========================================================= */

function ocultarError() {

    const emptyState =
        document.getElementById(
            'pacientesEmptyState'
        );


    if (!emptyState) {
        return;
    }


    emptyState.innerHTML = `

        <div class="pacientes-empty-icon">
            👥
        </div>

        <h3>
            No hay pacientes para mostrar
        </h3>

        <p>
            No se encontraron pacientes que coincidan con los filtros.
        </p>

    `;


    emptyState.style.display =
        'none';

}


/* =========================================================
   CONSTRUIR NOMBRE
   ========================================================= */

function construirNombre(
    paciente
) {

    const apellido =
        String(
            paciente.apellido || ''
        ).trim();


    const nombres =
        String(
            paciente.nombres || ''
        ).trim();


    const nombreCompleto =
        `${apellido} ${nombres}`.trim();


    return (
        nombreCompleto ||
        paciente.residente_id ||
        'Sin nombre'
    );

}


/* =========================================================
   NORMALIZAR ESTADO
   ========================================================= */

function normalizarEstado(
    estado
) {

    if (
        estado === null ||
        estado === undefined
    ) {

        return '';

    }


    return String(
        estado
    )
        .trim()
        .toUpperCase();

}


/* =========================================================
   FORMATEAR FECHA
   ========================================================= */

function formatearFecha(
    fecha
) {

    if (!fecha) {

        return '-';

    }


    const valor =
        String(fecha).trim();


    if (!valor) {

        return '-';

    }


    /*
       El backend devuelve las fechas
       en formato YYYY-MM-DD.
    */

    const partes =
        valor.split('-');


    if (
        partes.length === 3 &&
        partes[0].length === 4
    ) {

        return `${partes[2]}/${partes[1]}/${partes[0]}`;

    }


    return valor;

}


/* =========================================================
   ESTABLECER TEXTO
   ========================================================= */

function establecerTexto(
    id,
    texto
) {

    const elemento =
        document.getElementById(
            id
        );


    if (elemento) {

        elemento.textContent =
            texto;

    }

}


/* =========================================================
   ESCAPE HTML
   ========================================================= */

function escapeHTML(
    valor
) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return '';

    }


    return String(valor)
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
