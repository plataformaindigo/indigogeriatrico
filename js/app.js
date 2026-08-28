/* =========================================
   APLICACIÓN
========================================= */


/*
 * Navegación principal
 */

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


/*
 * Inicializar barra de sesión.
 */

loadSessionModule();


/*
 * Mostrar módulo inicial.
 *
 * La sesión ya no ocupa #app.
 */

navigateTo(
  'ocupacion'
);
