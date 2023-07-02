document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('carrito')) {
    carrito = new Map(JSON.parse(localStorage.getItem('carrito')));
    actualizarTablaCarrito();
  }
  fetchData();
});

const fetchData = async () => {
  try {
    const res = await fetch('data.json');
    const data = await res.json();
    hacerProductos(data);
  } catch (error) {
    console.log(error);
  }
};

const items = document.getElementById('items');
let carrito = new Map();

const hacerProductos = (data) => {
  data.forEach((producto) => {
    const productoDiv = document.createElement('div');
    productoDiv.classList.add('producto');

    const imagen = document.createElement('img');
    imagen.src = producto.img;

    const nombre = document.createElement('h2');
    nombre.textContent = producto.nombre;

    const precio = document.createElement('p');
    precio.textContent = `${producto.precio}$`;

    const kilos = document.createElement('h5');
    kilos.textContent = `${producto.KG} KG`;

    const boton = document.createElement('button');
    boton.textContent = 'Agregar al carrito';
    boton.classList.add('btn-agregar-carrito');
    boton.dataset.id = producto.id;

    productoDiv.appendChild(imagen);
    productoDiv.appendChild(nombre);
    productoDiv.appendChild(precio);
    productoDiv.appendChild(kilos);
    productoDiv.appendChild(boton);

    items.appendChild(productoDiv);
  });

  const botones = document.querySelectorAll('.btn-agregar-carrito');
  botones.forEach((boton) => {
    boton.addEventListener('click', agregarAlCarrito);
  });
};

const agregarAlCarrito = (event) => {
  const productoDiv = event.target.parentNode;
  const productId = productoDiv.querySelector('.btn-agregar-carrito').dataset.id;
  const nombre = productoDiv.querySelector('h2').textContent;
  const precio = parseFloat(productoDiv.querySelector('p').textContent.replace('$', ''));

  if (carrito.has(productId)) {
    const producto = carrito.get(productId);
    producto.cantidad++;
  } else {
    carrito.set(productId, {
      id: productId,
      nombre: nombre,
      precio: precio,
      cantidad: 1,
    });
  }
  guardarCarritoEnLocalStorage();
  actualizarTablaCarrito();
};

const carritoBody = document.getElementById('carrito-body');

const cancelarProducto = (productId) => {
  if (carrito.has(productId)) {
    carrito.delete(productId);
  }
  actualizarTablaCarrito();
};

function actualizarTablaCarrito() {
  carritoBody.innerHTML = '';

  let totalPagar = 0;

  carrito.forEach((producto) => {
    const subtotal = producto.precio * producto.cantidad;

    totalPagar += subtotal;

    const fila = document.createElement('tr');

    const numeralCell = document.createElement('td');
    numeralCell.textContent = producto.id;

    const productoCell = document.createElement('td');
    productoCell.textContent = producto.nombre;

    const precioCell = document.createElement('td');
    precioCell.textContent = `$${producto.precio}`;

    const cantidadCell = document.createElement('td');
    const btnDisminuir = document.createElement('button');
    btnDisminuir.textContent = '-';
    btnDisminuir.classList.add('btn-disminuir');
    btnDisminuir.addEventListener('click', () => disminuirCantidad(producto.id));
    const cantidadTexto = document.createElement('span');
    cantidadTexto.textContent = producto.cantidad;
    const btnAumentar = document.createElement('button');
    btnAumentar.textContent = '+';
    btnAumentar.classList.add('btn-aumentar');
    btnAumentar.addEventListener('click', () => aumentarCantidad(producto.id));
    cantidadCell.appendChild(btnDisminuir);
    cantidadCell.appendChild(cantidadTexto);
    cantidadCell.appendChild(btnAumentar);

    const subtotalCell = document.createElement('td');
    subtotalCell.textContent = `$${subtotal}`;

    const eliminarProductoCell = document.createElement('td');
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = '🗑️';
    btnEliminar.classList.add('btn-eliminar');
    btnEliminar.addEventListener('click', () => cancelarProducto(producto.id));
    eliminarProductoCell.appendChild(btnEliminar);

    fila.appendChild(numeralCell);
    fila.appendChild(productoCell);
    fila.appendChild(precioCell);
    fila.appendChild(cantidadCell);
    fila.appendChild(subtotalCell);
    fila.appendChild(eliminarProductoCell);
    carritoBody.appendChild(fila);
  });

  const menuFooter = document.createElement('tr');

  const filaFooter = document.createElement('td');
  filaFooter.textContent = `Total a pagar: $${totalPagar}`;

  const confirmar = document.createElement('tr');

  const btnConfirmarCompra = document.createElement('button');
  btnConfirmarCompra.classList.add('btn-confirmar-compra');
  btnConfirmarCompra.textContent = 'Confirmar Compra';

  btnConfirmarCompra.addEventListener('click', () => {

    Swal.fire(
      'Se ha realizado con exito la compra',
      'Gracias por confiar en nosotros!',
      'Exitos'
    )
  });



  if (carrito.size > 0) {
    btnConfirmarCompra.disabled = false;
  } else {
    btnConfirmarCompra.disabled = true;
  }

  confirmar.appendChild(btnConfirmarCompra);
  menuFooter.appendChild(filaFooter);

  carritoBody.appendChild(menuFooter);
  carritoBody.appendChild(confirmar);

  guardarCarritoEnLocalStorage();
}

function guardarCarritoEnLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(Array.from(carrito.entries())));
}

function disminuirCantidad(productId) {
  if (carrito.has(productId)) {
    const producto = carrito.get(productId);
    if (producto.cantidad > 1) {
      producto.cantidad--;
    }
  }
  actualizarTablaCarrito();
}

function aumentarCantidad(productId) {
  if (carrito.has(productId)) {
    const producto = carrito.get(productId);
    producto.cantidad++;
  }
  actualizarTablaCarrito();
}




