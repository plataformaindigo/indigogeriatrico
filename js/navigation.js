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


  /*
   * Eventos
   */

  if (loginButton) {

    loginButton.onclick =
      login;

  }


  if (validateButton) {

    validateButton.onclick =
      validateSession;

  }


  if (actionButton) {

    actionButton.onclick =
      protectedAction;

  }


  if (logoutButton) {

    logoutButton.onclick =
      logout;

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
   ACCIÓN PROTEGIDA
========================================= */

async function protectedAction() {

  const valid =
    await validateSession();


  if (!valid) {

    return;

  }

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

  const timer =
    document.getElementById(
      'timer'
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


  const status =
    document.getElementById(
      'status'
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


    status.classList.toggle(
      'online',
      active
    );


    status.classList.toggle(
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


  /*
   * Estos datos continúan existiendo
   * internamente pero no se muestran.
   */

  const tokenInfo =
    document.getElementById(
      'tokenInfo'
    );


  if (tokenInfo) {

    tokenInfo.textContent =
      active
        ? maskToken(
            window.session.token
          )
        : '—';

  }


  const expiresInfo =
    document.getElementById(
      'expiresInfo'
    );


  if (expiresInfo) {

    expiresInfo.textContent =
      active
        ? new Date(
            window.session.expiresAt
          ).toLocaleString()
        : '—';

  }


  const validateButton =
    document.getElementById(
      'validateButton'
    );


  if (validateButton) {

    validateButton.disabled =
      !active;

  }


  const actionButton =
    document.getElementById(
      'actionButton'
    );


  if (actionButton) {

    actionButton.disabled =
      !active;

  }


  updateTimer();

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


  /*
   * El registro ya no forma parte
   * de la interfaz visible.
   */

  if (!log) {

    return;

  }


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


  if (!error) {

    return;

  }


  error.textContent =
    message;


  error.style.display =
    'block';

}
