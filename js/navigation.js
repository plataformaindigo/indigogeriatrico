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

    emoji: '🛏️',

        file:
      './modules/ocupacion.html'

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
   * Los módulos que todavía no
   * tienen HTML propio.
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
