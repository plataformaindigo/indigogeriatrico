document.addEventListener(
  'DOMContentLoaded',
  async function() {

    const components =
      document.querySelectorAll(
        '[include]'
      );


    for (
      const element
      of components
    ) {

      const file =
        element.getAttribute(
          'include'
        );


      try {

        const response =
          await fetch(file);


        if (!response.ok) {

          throw new Error(
            `No se pudo cargar ${file}`
          );

        }


        const html =
          await response.text();


        element.innerHTML =
          html;


        /*
         * Ejecutar scripts
         */

        const scripts =
          element.querySelectorAll(
            'script'
          );


        for (
          const oldScript
          of scripts
        ) {

          const newScript =
            document.createElement(
              'script'
            );


          if (oldScript.src) {

            newScript.src =
              oldScript.src;

          }
          else {

            newScript.textContent =
              oldScript.textContent;

          }


          document.body.appendChild(
            newScript
          );

        }

      }

      catch (error) {

        console.error(
          'Include:',
          error
        );

      }

    }

  }
);