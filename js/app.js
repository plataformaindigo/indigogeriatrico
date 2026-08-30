const NAV_MODULES = [

  {
    id: 'ocupacion',
    label: '🛏️ Ocupación',
    permission: 'ocupacion'
  },

  {
    id: 'pacientes',
    label: '👥 Pacientes',
    permission: 'pacientes'
  },

  {
    id: 'enfermeria',
    label: '🩺 Enfermería',
    permission: 'enfermeria'
  },

  {
    id: 'farmacia',
    label: '💊 Farmacia',
    permission: 'farmacia'
  },

  {
    id: 'cocina',
    label: '🍽️ Cocina',
    permission: 'cocina'
  },

  {
    id: 'nutricion',
    label: '🥗 Nutrición',
    permission: 'nutricion'
  },

  {
    id: 'profesionales',
    label: '👨‍⚕️ Profesionales',
    permission: 'profesionales'
  },

  {
    id: 'rrhh',
    label: '👔 RRHH',
    permission: 'rrhh'
  },

  {
    id: 'compras',
    label: '🛒 Compras',
    permission: 'compras'
  },

  {
    id: 'facturacion',
    label: '🧾 Facturación',
    permission: 'facturacion'
  },

  {
    id: 'administracion',
    label: '📊 Administración',
    permission: 'administracion'
  }

];


window.buildNavigation =
function() {

  const navigation =
    document.getElementById(
      'navigation'
    );


  if (!navigation) {

    return;

  }


  navigation.innerHTML =
    '';


  if (!window.session) {

    return;

  }


  const permisos =
    window.session.permisos || {};


  NAV_MODULES.forEach(
    module => {

      const permission =
        permisos[
          module.permission
        ];


      if (
        !permission ||
        permission.read !== true
      ) {

        return;

      }


      const button =
        document.createElement(
          'button'
        );


      button.className =
        'nav-button';


      button.dataset.module =
        module.id;


      button.textContent =
        module.label;


      button.addEventListener(
        'click',
        () => {

          navigateTo(
            module.id
          );

        }
      );


      navigation.appendChild(
        button
      );

    }
  );

};


const sessionLogout =
  document.getElementById(
    'sessionLogout'
  );


if (sessionLogout) {

  sessionLogout.addEventListener(
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

}


initializeApp();


async function initializeApp() {

  try {

    await loadSessionHTML();


    await loadScript(
      MODULES.sesion.script
    );


    if (
      typeof window.mount_sesion ===
      'function'
    ) {

      await window.mount_sesion();

    }


    if (
      typeof window.buildNavigation ===
      'function'
    ) {

      window.buildNavigation();

    }

  }

  catch (error) {

    console.error(
      'Error inicializando aplicación:',
      error
    );

  }

}


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


  document
    .body
    .insertAdjacentHTML(
      'beforeend',
      html
    );

}


function loadScript(
  src
) {

  return new Promise(
    (
      resolve,
      reject
    ) => {

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

