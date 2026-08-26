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


  const validateButton =
    document.getElementById(
      'validateButton'
    );


  const actionButton =
    document.getElementById(
      'actionButton'
    );


  const logoutButton =
    document.getElementById(
      'logoutButton'
    );


  loginButton.onclick =
    login;


  validateButton.onclick =
    validateSession;


  actionButton.onclick =
    protectedAction;


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


  writeLog(
    'Módulo de sesión iniciado.'
  );

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


    writeLog(
      'Login correcto.',
      'success'
    );


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


  writeLog(
    'Sesión renovada por 10 minutos.',
    'success'
  );


  return true;

}


/* =========================================
   ACCIÓN PROTEGIDA
========================================= */

async function protectedAction() {

  const valid =
    await validateSession();


  if (!valid) {

    return;

  }


  writeLog(
    '✓ Acción protegida autorizada.',
    'success'
  );

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


  document
    .getElementById(
      'timer'
    )
    .textContent =

    String(minutes)
      .padStart(2,'0')

    + ':'

    +

    String(secs)
      .padStart(2,'0');

}


/* =========================================
   UI
========================================= */

function updateUI() {

  const active =
    !!window.session;


  document
    .getElementById(
      'status'
    )
    .textContent =
    active
      ? 'Sesión activa'
      : 'Sin sesión';


  document
    .getElementById(
      'userInfo'
    )
    .textContent =
    active
      ? window.session.user.usuario
      : '—';


  document
    .getElementById(
      'roleInfo'
    )
    .textContent =
    active
      ? window.session.user.rol
      : '—';


  document
    .getElementById(
      'tokenInfo'
    )
    .textContent =
    active
      ? maskToken(
          window.session.token
        )
      : '—';


  document
    .getElementById(
      'expiresInfo'
    )
    .textContent =
    active
      ? new Date(
          window.session.expiresAt
        ).toLocaleString()
      : '—';


  document
    .getElementById(
      'validateButton'
    )
    .disabled =
    !active;


  document
    .getElementById(
      'actionButton'
    )
    .disabled =
    !active;


  document
    .getElementById(
      'logoutButton'
    )
    .disabled =
    !active;

}


/* =========================================
   LIMPIAR
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


  document
    .getElementById(
      'timer'
    )
    .textContent =
    '—';


  document
    .getElementById(
      'loginModal'
    )
    .style.display =
    'flex';


  writeLog(
    'Sesión finalizada.'
  );

}


/* =========================================
   LOG
========================================= */

function writeLog(
  message,
  type = ''
) {

  const log =
    document.getElementById(
      'log'
    );


  const line =
    document.createElement(
      'div'
    );


  line.textContent =
    `[${new Date().toLocaleTimeString()}] ${message}`;


  if (type === 'error') {

    line.style.color =
      '#fca5a5';

  }


  if (type === 'success') {

    line.style.color =
      '#86efac';

  }


  log.appendChild(
    line
  );


  log.scrollTop =
    log.scrollHeight;

}


/* =========================================
   TOKEN
========================================= */

function maskToken(
  token
) {

  if (!token) {

    return '—';

  }


  return (

    token.substring(0,6)

    +

    '••••••••••'

    +

    token.substring(
      token.length - 6
    )

  );

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


  error.textContent =
    message;


  error.style.display =
    'block';

}
