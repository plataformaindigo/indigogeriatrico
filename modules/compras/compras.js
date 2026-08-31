/* =========================================
MÓDULO PROVEEDORES
DEMO SIN BACKEND
========================================= */

window.mount_proveedores =
function() {

const proveedores = [

```
{

  nombre:
    'Distribuidora Médica Rosario',

  cuit:
    '30-71234567-8',

  rubro:
    'Insumos médicos',

  contacto:
    'Laura Gómez',

  activo:
    true

},


{

  nombre:
    'Alimentos del Litoral',

  cuit:
    '30-72345678-9',

  rubro:
    'Alimentos',

  contacto:
    'Martín López',

  activo:
    true

},


{

  nombre:
    'Limpieza Integral SRL',

  cuit:
    '30-73456789-0',

  rubro:
    'Limpieza',

  contacto:
    'Carolina Pérez',

  activo:
    true

},


{

  nombre:
    'Farmacéutica del Centro',

  cuit:
    '30-74567890-1',

  rubro:
    'Farmacia',

  contacto:
    'Daniel Rossi',

  activo:
    false

}
```

];

const tabla =
document.getElementById(
'tablaProveedores'
);

const buscador =
document.getElementById(
'buscarProveedor'
);

const total =
document.getElementById(
'totalProveedores'
);

const activos =
document.getElementById(
'proveedoresActivos'
);

const inactivos =
document.getElementById(
'proveedoresInactivos'
);

function render(
filtro = ''
) {

```
const texto =
  filtro
    .toLowerCase()
    .trim();


const filtrados =
  proveedores.filter(
    proveedor => {

      return (

        proveedor.nombre
          .toLowerCase()
          .includes(texto)

        ||

        proveedor.cuit
          .toLowerCase()
          .includes(texto)

        ||

        proveedor.rubro
          .toLowerCase()
          .includes(texto)

      );

    }
  );


tabla.innerHTML = '';


filtrados.forEach(
  proveedor => {


    const row =
      document.createElement(
        'tr'
      );


    row.innerHTML = `

      <td>

        <strong>
          ${proveedor.nombre}
        </strong>

      </td>


      <td>
        ${proveedor.cuit}
      </td>


      <td>
        ${proveedor.rubro}
      </td>


      <td>
        ${proveedor.contacto}
      </td>


      <td>

        <span
          class="proveedores-status ${
            proveedor.activo
              ? 'active'
              : 'inactive'
          }"
        >

          ${
            proveedor.activo
              ? 'Activo'
              : 'Inactivo'
          }

        </span>

      </td>

    `;


    tabla.appendChild(
      row
    );

  }
);
```

}

total.textContent =
proveedores.length;

activos.textContent =
proveedores.filter(
proveedor =>
proveedor.activo
).length;

inactivos.textContent =
proveedores.filter(
proveedor =>
!proveedor.activo
).length;

buscador.addEventListener(
'input',
() => {

```
  render(
    buscador.value
  );

}
```

);

document
.getElementById(
'btnNuevoProveedor'
)
.addEventListener(
'click',
() => {

```
    alert(
      'Demo: aquí se abriría el formulario de nuevo proveedor.'
    );

  }
);
```

render();

};
