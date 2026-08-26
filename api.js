async function api(data) {

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


  if (!response.ok) {

    throw new Error(
      `HTTP ${response.status}`
    );

  }


  return response.json();

}