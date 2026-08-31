const MODULES = {

  sesion: {

    title: 'Sesión',

    emoji: '🔐',

    file:
      './modules/sesion/sesion.html',

    script:
      './modules/sesion/sesion.js'

  },


  ocupacion: {

    title: 'Ocupación',

    emoji: '🛏️',

    file:
      './modules/ocupacion/ocupacion.html',

    script:
      './modules/ocupacion/ocupacion.js',

    style:
      './modules/ocupacion/ocupacion.css'

  },


  pacientes: {

    title: 'Pacientes',

    emoji: '👥',

    file:
      './modules/pacientes/pacientes.html',

    script:
      './modules/pacientes/pacientes.js',

    style:
      './modules/pacientes/pacientes.css'

  },


  enfermeria: {

    title: 'Enfermería',

    emoji: '🩺',

    file:
      './modules/enfermeria/enfermeria.html',

    script:
      './modules/enfermeria/enfermeria.js',

    style:
      './modules/enfermeria/enfermeria.css'

  },


  farmacia: {

    title: 'Farmacia',

    emoji: '💊',

    file:
      './modules/farmacia/farmacia.html',

    script:
      './modules/farmacia/farmacia.js',

    style:
      './modules/farmacia/farmacia.css'

  },


  cocina: {

    title: 'Cocina',

    emoji: '🍽️',

    file:
      './modules/cocina/cocina.html',

    script:
      './modules/cocina/cocina.js',

    style:
      './modules/cocina/cocina.css'

  },


  nutricion: {

    title: 'Nutrición',

    emoji: '🥗',

    file:
      './modules/nutricion/nutricion.html',

    script:
      './modules/nutricion/nutricion.js',

    style:
      './modules/nutricion/nutricion.css'

  },


  profesionales: {

    title: 'Profesionales',

    emoji: '👨‍⚕️',

    file:
      './modules/profesionales/profesionales.html',

    script:
      './modules/profesionales/profesionales.js',

    style:
      './modules/profesionales/profesionales.css'

  },


  rrhh: {

    title: 'RRHH',

    emoji: '👔',

    file:
      './modules/rrhh/rrhh.html',

    script:
      './modules/rrhh/rrhh.js',

    style:
      './modules/rrhh/rrhh.css'

  },


  compras: {

    title: 'Compras',

    emoji: '🛒',

    file:
      './modules/compras/compras.html',

    script:
      './modules/compras/compras.js',

    style:
      './modules/compras/compras.css'

  },


  facturacion: {

    title: 'Facturación',

    emoji: '🧾',

    file:
      './modules/facturacion/facturacion.html',

    script:
      './modules/facturacion/facturacion.js',

    style:
      './modules/facturacion/facturacion.css'

  },


  administracion: {

    title: 'Administración',

    emoji: '📊',

    file:
      './modules/administracion/administracion.html',

    script:
      './modules/administracion/administracion.js',

    style:
      './modules/administracion/administracion.css'

  },


  proveedores: {

    title: 'Proveedores',

    emoji: '🚚',

    file:
      './modules/proveedores/proveedores.html',

    script:
      './modules/proveedores/proveedores.js',

    style:
      './modules/proveedores/proveedores.css'

  }

};

let ACTIVE_MODULE =
  null;


/* =========================================
   NAVEGAR
========================================= */

/* =========================================
   NAVEGAR
========================================= */

async function navigateTo(
  name
) {

  if (
    ACTIVE_MODULE === name
  ) {

    return;

  }


  const app =
    document.getElementById(
      'app'
    );


  const module =
    MODULES[name];


  if (
    !app ||
    !module
  ) {

    return;

  }


  ACTIVE_MODULE =
    name;


  document
    .querySelectorAll(
      '.nav-button'
    )
    .forEach(
      button => {

        button.classList.toggle(

          'active',

          button.dataset.module ===
          name

        );

      }
    );


  /*
   * =======================================
   * CARGAR HTML
   * =======================================
   */

  if (module.file) {

    try {

      const response =
        await fetch(
          module.file
        );


      if (!response.ok) {

        throw new Error(
          `No se pudo cargar ${module.file} — HTTP ${response.status}`
        );

      }


      const html =
        await response.text();


      app.innerHTML =
        html;

    }

    catch (error) {

      console.error(
        error
      );


      app.innerHTML = `

        <div class="module-placeholder">

          <div class="emoji">
            ❌
          </div>

          <h2>
            ${module.title}
          </h2>

          <p>
            No se pudo cargar el módulo.
          </p>

        </div>

      `;

      return;

    }

  }

  else {

    /*
     * Módulo todavía sin HTML
     */

    app.innerHTML = `

      <div class="module-placeholder">

        <div class="emoji">
          ${module.emoji}
        </div>

        <h2>
          ${module.title}
        </h2>

        <p>
          Módulo en desarrollo
        </p>

      </div>

    `;

  }


  /*
   * =======================================
   * CARGAR CSS
   * =======================================
   */

  if (module.style) {

    const existingStyle =
      document.querySelector(
        `link[data-module-style="${name}"]`
      );


    if (!existingStyle) {

      const style =
        document.createElement(
          'link'
        );


      style.rel =
        'stylesheet';


      style.href =
        module.style;


      style.dataset.moduleStyle =
        name;


      document.head.appendChild(
        style
      );

    }

  }


  /*
   * =======================================
   * CARGAR JAVASCRIPT
   * =======================================
   */

  if (module.script) {

    try {

      await loadScript(
        module.script
      );

    }

    catch (error) {

      console.error(
        error
      );

      return;

    }

  }


  /*
   * =======================================
   * MONTAR MÓDULO
   * =======================================
   */

  const mountFunction =
    `mount_${name}`;


  if (
    typeof window[mountFunction] ===
    'function'
  ) {

    await window[
      mountFunction
    ]();

  }

}
