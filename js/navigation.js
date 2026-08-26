const MODULES = {

  sesion: {

    title: 'Sesión',

    emoji: '🔐',

    file:
      './modules/sesion.html',

    script:
      './modules/sesion.js'

  },


  ocupacion: {

    title: 'Ocupación',

    emoji: '🛏️'

  },


  pacientes: {

    title: 'Pacientes',

    emoji: '👥'

  },


  enfermeria: {

    title: 'Enfermería',

    emoji: '🩺'

  },


  farmacia: {

    title: 'Farmacia',

    emoji: '💊'

  },


  cocina: {

    title: 'Cocina',

    emoji: '🍽️'

  },


  nutricion: {

    title: 'Nutrición',

    emoji: '🥗'

  },


  profesionales: {

    title: 'Profesionales',

    emoji: '👨‍⚕️'

  },


  rrhh: {

    title: 'RRHH',

    emoji: '👔'

  },


  compras: {

    title: 'Compras',

    emoji: '🛒'

  },


  facturacion: {

    title: 'Facturación',

    emoji: '🧾'

  },


  administracion: {

    title: 'Administración',

    emoji: '📊'

  }

};


let ACTIVE_MODULE =
  null;


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


  const app =
    document.getElementById(
      'app'
    );


  const module =
    MODULES[name];


  if (!module) {

    return;

  }


  /*
   * Módulo Sesión
   */

  if (
    name === 'sesion'
  ) {

    await loadHtmlModule(
      module
    );

    return;

  }


  /*
   * Módulos todavía
   * en desarrollo.
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


/* =========================================
   CARGAR HTML
========================================= */

async function loadHtmlModule(
  module
) {

  const app =
    document.getElementById(
      'app'
    );


  app.innerHTML = `

    <div class="loading">
      Cargando módulo...
    </div>

  `;


  try {

    const response =
      await fetch(
        module.file
      );


    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}`
      );

    }


    app.innerHTML =
      await response.text();


    /*
     * Cargar JS del módulo
     */

    if (
      module.script
    ) {

      await loadScript(
        module.script
      );

    }


    /*
     * Inicializar módulo
     */

    if (
      typeof window.mount_sesion ===
      'function'
    ) {

      await window.mount_sesion();

    }

  }

  catch (error) {

    console.error(
      error
    );


    app.innerHTML = `

      <div class="module-placeholder">

        <div class="emoji">
          ⚠️
        </div>

        <h2>
          Error cargando ${module.title}
        </h2>

        <p>
          ${error.message}
        </p>

      </div>

    `;

  }

}


/* =========================================
   CARGAR SCRIPT
========================================= */

function loadScript(
  src
) {

  return new Promise(
    (
      resolve,
      reject
    ) => {

      const script =
        document.createElement(
          'script'
        );


      script.src =
        src;


      script.onload =
        resolve;


      script.onerror =
        () => reject(

          new Error(
            `No se pudo cargar ${src}`
          )

        );


      document.body.appendChild(
        script
      );

    }
  );

}
