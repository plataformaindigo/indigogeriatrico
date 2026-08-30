async function api(data) {

  console.log('========== API REQUEST ==========');
  console.log('URL:', APP_CONFIG.API_URL);
  console.log('Action:', data.action);
  console.log('Usuario:', data.usuario || '');

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


    const raw =
      await response.text();


    console.log(
      'Respuesta RAW del servidor:'
    );

    console.log(
      raw
    );


    let result;


    try {

      result =
        JSON.parse(raw);

    }

    catch (error) {

      console.error(
        'ERROR: la respuesta no es JSON válido'
      );

      console.error(
        error
      );

      throw new Error(
        'La respuesta del servidor no es JSON válido.'
      );

    }


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

    console.error(
      '========== API FIN ERROR =========='
    );


    throw error;

  }

}
