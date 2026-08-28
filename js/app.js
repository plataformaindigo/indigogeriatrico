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
   CERRAR SESIÓN DESDE LA BARRA SUPERIOR
========================================= */

document
  .getElementById(
    'sessionLogout'
  )
  .addEventListener(
    'click',
    () => {

      if (
        typeof logout ===
        'function'
      ) {

        logout();

      }

    }
  );


/* =========================================
   INICIALIZACIÓN
========================================= */

/*
 * El módulo Sesión ya no es una pantalla.
 *
 * Se monta directamente desde navigation.js
 * para mantener la lógica de sesión activa.
 */

loadSession();


/* =========================================
   CARGAR SESIÓN
========================================= */

async function loadSession() {

  try {

    const module =
      MODULES.sesion;


    if (!module) {

      console.error(
        'No existe el módulo de sesión.'
      );

      return;

    }


    /*
     * Cargar el JS del módulo de sesión.
     */

    await loadScript(
      module.script
    );


    /*
     * Montar la sesión.
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
      'Error cargando sesión:',
      error
    );

  }

}
