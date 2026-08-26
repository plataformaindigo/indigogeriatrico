/* =========================================
   APLICACIÓN
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


/*
 * Arrancar mostrando Sesión.
 */

navigateTo(
  'sesion'
);