async function api(data) {

  console.log(
    '========== API REQUEST =========='
  );

  console.log(
    'URL:',
    APP_CONFIG.API_URL
  );

  console.log(
    'Action:',
    data.action
  );

  console.log(
    'Usuario:',
    data.usuario || ''
  );


  try {

    const response =
      await fetch(
        APP_CONFIG.API_URL,
        {

          method:
            'POST',

          headers: {

            'Content-Type':
              'text/plain;charset=utf-8'

          },

          body:
            JSON.stringify(data)

        }
      );


    console.log(
      'HTTP status:',
      response.status
    );

    console.log(
      'HTTP ok:',
      response.ok
    );


    /*
     * =========================================
     * VALIDAR RESPUESTA HTTP
     * =========================================
     */

    if (!response.ok) {

      throw new Error(
        `Error HTTP ${response.status}`
      );

    }


    /*
     * =========================================
     * LEER RESPUESTA
     * =========================================
     */

    const raw =
      await response.text();


    console.log(
      'Respuesta RAW del servidor:'
    );

    console.log(
      raw
    );


    /*
     * =========================================
     * VALIDAR RESPUESTA VACÍA
     * =========================================
     */

    if (!raw) {

      throw new Error(
        'El servidor devolvió una respuesta vacía.'
      );

    }


    /*
     * =========================================
     * PARSEAR JSON
     * =========================================
     */

    let result;


    try {

      result =
        JSON.parse(raw);

    }

    catch (error) {

      console.error(
        'ERROR: la respuesta no es JSON válido.'
      );

      console.error(
        'Respuesta recibida:',
        raw
      );

      console.error(
        error
      );

      throw new Error(
        'La respuesta del servidor no es JSON válido.'
      );

    }


    /*
     * =========================================
     * LOG FINAL
     * =========================================
     */

    console.log(
      'JSON recibido:',
      result
    );

    console.log(
      '========== API FIN =========='
    );


    return result;

  }


  catch (error) {

    console.error(
      '========== API ERROR =========='
    );


    console.error(
      error
    );


    console.error(
      'Mensaje:',
      error.message
    );


    /*
     * =========================================
     * MENSAJE ESPECÍFICO PARA CORS
     * =========================================
     *
     * Failed to fetch normalmente significa
     * que el navegador bloqueó la comunicación,
     * por ejemplo por CORS.
     */

    if (
      error instanceof TypeError &&
      error.message === 'Failed to fetch'
    ) {

      console.error(
        'POSIBLE ERROR CORS:'
      );

      console.error(
        'El navegador no permite leer la respuesta del backend.'
      );

      console.error(
        'Verificar configuración del Web App de Google Apps Script.'
      );

    }


    console.error(
      '========== API FIN ERROR =========='
    );


    throw error;

  }

}
