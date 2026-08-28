```javascript
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


  const logoutButton =
    document.getElementById(
      'logoutButton'
    );


  loginButton.onclick =
    login;


  logoutButton.onclick =
    logout;


  document
    .getElementById(
      'password'
    )
    .addEventListener(
      'keydown',
      event => {

        if (
          event.key === 'Enter'
        ) {

          login();

        }

      }
    );


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

    const result =
      await api({

        action:
          'login',

        usuario:
          usuario,

        password:
          password

      });


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
        'loginModal'
      )
      .style.display =
      'none';


    updateUI();


    startTimer();

  }

  catch (error) {

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


  window.session.expiresAt =
    result.session.expiresAt;


  updateUI();


  return true;

}


/* =========================================
   LOGOUT
========================================= */

async function logout() {

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

}


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

  if (!window.session) {

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


  const timer =
    document.getElementById(
      'timer'
    );


  if (!timer) {

    return;

  }


  timer.textContent =

    String(minutes)
      .padStart(
        2,
        '0'
      )

    + ':'

    +

    String(secs)
      .padStart(
        2,
        '0'
      );

}


/* =========================================
   UI
========================================= */

function updateUI() {

  const active =
    !!window.session;


  const status =
    document.getElementById(
      'status'
    );


  const statusDot =
    document.getElementById(
      'statusDot'
    );


  const userInfo =
    document.getElementById(
      'userInfo'
    );


  const roleInfo =
    document.getElementById(
      'roleInfo'
    );


  const logoutButton =
    document.getElementById(
      'logoutButton'
    );


  if (status) {

    status.textContent =
      active
        ? 'Sesión activa'
        : 'Sin sesión';

  }


  if (statusDot) {

    statusDot.classList.toggle(
      'online',
      active
    );


    statusDot.classList.toggle(
      'offline',
      !active
    );

  }


  if (userInfo) {

    userInfo.textContent =
      active
        ? window.session.user.usuario
        : '—';

  }


  if (roleInfo) {

    roleInfo.textContent =
      active
        ? window.session.user.rol
        : '—';

  }


  if (logoutButton) {

    logoutButton.disabled =
      !active;

  }


  if (!active) {

    const timer =
      document.getElementById(
        'timer'
      );


    if (timer) {

      timer.textContent =
        '—';

    }

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


  const timer =
    document.getElementById(
      'timer'
    );


  if (timer) {

    timer.textContent =
      '—';

  }


  const loginModal =
    document.getElementById(
      'loginModal'
    );


  if (loginModal) {

    loginModal.style.display =
      'flex';

  }


  const usuario =
    document.getElementById(
      'usuario'
    );


  if (usuario) {

    usuario.focus();

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
```
