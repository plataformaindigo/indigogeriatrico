window.session =
  null;


let sessionTimer =
  null;


/* =========================================
   MONTAJE
========================================= */

window.mount_sesion =
async function() {

  const loginButton =
    document.getElementById(
      'loginButton'
    );


  if (loginButton) {

    loginButton.onclick =
      login;

  }


  const password =
    document.getElementById(
      'password'
    );


  if (password) {

    password.addEventListener(
      'keydown',
      event => {

        if (
          event.key === 'Enter'
        ) {

          login();

        }

      }
    );

  }


  updateUI();

};


/* =========================================
   LOGIN
========================================= */

async function login() {

  const usuario =
    document
      .getElementById(
        'usuario'
      )
      .value
      .trim();


  const password =
    document
      .getElementById(
        'password'
      )
      .value;


  if (
    !usuario ||
    !password
  ) {

    showError(
      'Ingresá usuario y contraseña.'
    );

    return;

  }


  try {

    loadingModalON(
      'Iniciando sesión...'
    );


    const result =
      await api({

        action:
          'login',

        usuario:
          usuario,

        password:
          password

      });


    loadingModalOFF();


    if (!result.ok) {

      showError(
        result.error
      );

      return;

    }


    window.session = {

      token:
        result.token,

      user:
        result.user,

      permisos:
        result.permisos || {},

      expiresAt:
        result.expiresAt

    };


    document
      .getElementById(
        'password'
      )
      .value =
      '';


    document
      .getElementById(
        'loginError'
      )
      .style.display =
      'none';


    document
      .getElementById(
        'loginModal'
      )
      .style.display =
      'none';


    updateUI();


    if (
      typeof window.buildNavigation ===
      'function'
    ) {

      window.buildNavigation();

    }


    startTimer();

  }

  catch (error) {

    loadingModalOFF();


    console.error(
      error
    );


    showError(
      'No se pudo completar la operación.'
    );

  }

}


/* =========================================
   VALIDAR
========================================= */

async function validateSession() {

  if (!window.session) {

    return false;

  }


  const result =
    await api({

      action:
        'validate',

      usuario:
        window.session.user.usuario,

      token:
        window.session.token

    });


  if (!result.ok) {

    clearSession();

    return false;

  }


  window.session.user = {

    id:
      result.session.id,

    usuario:
      result.session.usuario,

    rol:
      result.session.rol

  };


  window.session.permisos =
    result.session.permisos || {};


  window.session.expiresAt =
    result.session.expiresAt;


  updateUI();


  if (
    typeof window.buildNavigation ===
    'function'
  ) {

    window.buildNavigation();

  }


  return true;

}


/* =========================================
   LOGOUT
========================================= */

window.logout =
async function() {

  if (!window.session) {

    return;

  }


  try {

    await api({

      action:
        'logout',

      usuario:
        window.session.user.usuario,

      token:
        window.session.token

    });

  }

  finally {

    clearSession();

  }

};


/* =========================================
   TIMER
========================================= */

function startTimer() {

  clearInterval(
    sessionTimer
  );


  sessionTimer =
    setInterval(
      updateTimer,
      1000
    );


  updateTimer();

}


function updateTimer() {

  const timer =
    document.getElementById(
      'sessionTimer'
    );


  if (!timer) {

    return;

  }


  if (!window.session) {

    timer.textContent =
      '—';

    return;

  }


  const remaining =
    new Date(
      window.session.expiresAt
    ).getTime()
    -
    Date.now();


  if (
    remaining <= 0
  ) {

    clearSession();

    return;

  }


  const seconds =
    Math.floor(
      remaining / 1000
    );


  const minutes =
    Math.floor(
      seconds / 60
    );


  const secs =
    seconds % 60;


  timer.textContent =

    String(minutes)
      .padStart(2, '0')

    + ':'

    +

    String(secs)
      .padStart(2, '0');

}


/* =========================================
   ACTUALIZAR UI
========================================= */

function updateUI() {

  const user =
    document.getElementById(
      'sessionUser'
    );


  const role =
    document.getElementById(
      'sessionRole'
    );


  const logoutButton =
    document.getElementById(
      'sessionLogout'
    );


  const timer =
    document.getElementById(
      'sessionTimer'
    );


  const active =
    !!window.session;


  if (user) {

    user.textContent =
      active
        ? window.session.user.usuario
        : '—';

  }


  if (role) {

    role.textContent =
      active
        ? window.session.user.rol
        : '—';

  }


  if (!active && timer) {

    timer.textContent =
      '—';

  }


  if (logoutButton) {

    logoutButton.disabled =
      !active;

  }


  const bar =
    document.getElementById(
      'sessionBar'
    );


  if (bar) {

    bar.classList.toggle(
      'inactive',
      !active
    );

  }

}


/* =========================================
   LIMPIAR SESIÓN
========================================= */

function clearSession() {

  window.session =
    null;


  clearInterval(
    sessionTimer
  );


  sessionTimer =
    null;


  updateUI();


  if (
    typeof window.buildNavigation ===
    'function'
  ) {

    window.buildNavigation();

  }


  const timer =
    document.getElementById(
      'sessionTimer'
    );


  if (timer) {

    timer.textContent =
      '—';

  }


  const modal =
    document.getElementById(
      'loginModal'
    );


  if (modal) {

    modal.style.display =
      'flex';

  }

}


/* =========================================
   ERROR
========================================= */

function showError(
  message
) {

  const error =
    document.getElementById(
      'loginError'
    );


  if (!error) {

    return;

  }


  error.textContent =
    message;


  error.style.display =
    'block';

}