const MODULES = {

  /*
   * Sesión
   *
   * No es un módulo de navegación.
   * Se monta permanentemente en sessionBar.
   */

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

  /*
   * Sesión no es un módulo navegable.
   */

  if (
    name === 'sesion'
  ) {

    return;

  }


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
   CARGAR SESIÓN
========================================= */

async function loadSessionModule() {

  const container =
    document.getElementById(
      'sessionBar'
    );


  const module =
    MODULES.sesion;


  if (
    !container ||
    !module
  ) {

    return;

  }


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


    container.innerHTML =
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
     * Inicializar sesión
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
      'Error cargando módulo de sesión:',
      error
    );


    container.innerHTML = `

      <div class="session-bar-error">

        ⚠️ No se pudo cargar la sesión.

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

      /*
       * Evitar cargar el mismo script
       * más de una vez.
       */

      const existing =
        document.querySelector(
          `script[src="${src}"]`
        );


      if (existing) {

        resolve();

        return;

      }


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
