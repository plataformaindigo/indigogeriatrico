/* =========================================
   APLICACIÓN
========================================= */


/* =========================================
   NAVEGACIÓN
========================================= */

document
  .querySelectorAll(
    '.nav-button'
  )
  .forEach(
    button => {

      button.addEventListener(
        'click',
        () => {

          navigateTo(
            button.dataset.module
          );

        }
      );

    }
  );


/* =========================================
   CERRAR SESIÓN
========================================= */

document
  .getElementById(
    'sessionLogout'
  )
  .addEventListener(
    'click',
    () => {

      if (
        typeof window.logout ===
        'function'
      ) {

        window.logout();

      }

    }
  );


/* =========================================
   INICIALIZAR APLICACIÓN
========================================= */

initializeApp();


/* =========================================
   INICIALIZACIÓN
========================================= */

async function initializeApp() {

  try {

    /*
     * Primero cargamos el HTML del modal
     * de inicio de sesión.
     */

    await loadSessionHTML();


    /*
     * Después cargamos la lógica
     * del módulo de sesión.
     */

    await loadScript(
      MODULES.sesion.script
    );


    /*
     * Finalmente montamos la sesión.
     */

    if (
      typeof window.mount_sesion ===
      'function'
    ) {

      await window.mount_sesion();

    }


    /*
     * Y mostramos el primer módulo
     * de la aplicación.
     */

    navigateTo(
      'ocupacion'
    );

  }

  catch (error) {

    console.error(
      'Error inicializando aplicación:',
      error
    );

  }

}


/* =========================================
   CARGAR HTML DE SESIÓN
========================================= */

async function loadSessionHTML() {

  const module =
    MODULES.sesion;


  if (!module) {

    throw new Error(
      'No existe la configuración del módulo de sesión.'
    );

  }


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


  /*
   * El modal se agrega directamente
   * al body.
   *
   * NO entra dentro de #app.
   */

  document
    .body
    .insertAdjacentHTML(
      'beforeend',
      html
    );

}


/* =========================================
   CARGAR JAVASCRIPT
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
        () => {

          resolve();

        };


      script.onerror =
        () => {

          reject(

            new Error(
              `No se pudo cargar ${src}`
            )

          );

        };


      document.body.appendChild(
        script
      );

    }
  );

}
