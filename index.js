

const productosJSON = `[
  { "id": 1, "nombre": "Cheeseburger", "descripcion": "Medallón de carne, cheddar, pepinos y ketchup", "categoria": "Clásicas", "precio": 7500, "stock": 10, "imagen": "img/1.jpg" },
  { "id": 2, "nombre": "Clásica Completa", "descripcion": "Carne, lechuga, tomate y cebolla", "categoria": "Clásicas", "precio": 8200, "stock": 8, "imagen": "img/2.jpg" },
  { "id": 3, "nombre": "Cuarto de Libra", "descripcion": "Carne de 200 g, cheddar, cebolla y tomate", "categoria": "Clásicas", "precio": 9900, "stock": 0, "imagen": "img/3.jpg" },
  { "id": 4, "nombre": "Bacon BBQ", "descripcion": "Carne, panceta crocante, cheddar y salsa barbacoa", "categoria": "Especiales", "precio": 12500, "stock": 5, "imagen": "img/4.jpg" },
  { "id": 5, "nombre": "Provoleta", "descripcion": "Carne, provoleta fundida y cebolla caramelizada", "categoria": "Especiales", "precio": 13200, "stock": 4, "imagen": "img/5.jpg" },
  { "id": 6, "nombre": "Doble Cheddar", "descripcion": "Doble carne, doble cheddar, cebolla y lechuga", "categoria": "Especiales", "precio": 14000, "stock": 3, "imagen": "img/6.jpg" },
  { "id": 7, "nombre": "Combo Clásico", "descripcion": "Hamburguesa completa con papas fritas", "categoria": "Combos", "precio": 15900, "stock": 6, "imagen": "img/7.jpg" },
  { "id": 8, "nombre": "Combo Crispy", "descripcion": "Pollo crispy, coleslaw y papas fritas", "categoria": "Combos", "precio": 16500, "stock": 2, "imagen": "img/8.jpg" },
  { "id": 9, "nombre": "Combo Onion", "descripcion": "Carne, aros de cebolla, cheddar y papas fritas", "categoria": "Combos", "precio": 17800, "stock": 1, "imagen": "img/9.jpg" }
]`;

 
// ---------- PARTE 3 - JSON y localStorage ----------
 
// convierto el json a un array de objetos
const productos = JSON.parse(productosJSON);
 
// lo guardo en localStorage con la clave "productos"
localStorage.setItem("productos", JSON.stringify(productos));
 
// lo vuelvo a obtener directamente del localStorage y lo muestro en consola
const productosGuardados = JSON.parse(localStorage.getItem("productos"));
console.table(productosGuardados);
 
// ---------- Elementos del DOM ----------
 
const titulo = document.getElementById("titulo-burger");
const contadorCarrito = document.getElementById("contador-carrito");
const buscador = document.getElementById("buscador");
const selectOrden = document.getElementById("orden");
const radiosCategoria = document.getElementsByName("categoria");
const contenedorProductos = document.getElementById("products-container");
const listaCarrito = document.getElementById("cart-list");
const totalCarrito = document.getElementById("cart-total");
const botonVaciar = document.getElementById("boton-vaciar");
 
// si ya había un carrito guardado lo recupero, sino arranca vacío
let carrito = JSON.parse(localStorage.getItem("carrito"));
if (carrito === null) {
  carrito = [];
}
 
// ---------- Funciones auxiliares ----------
 
function formatearPrecio(numero) {
  return "$ " + numero.toLocaleString("es-AR");
}
 
// saca las tildes y pasa a minúscula para poder comparar "clasicas" con "Clásicas"
function limpiarTexto(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}
 
function obtenerCategoriaSeleccionada() {
  let seleccionada = "todas";
  for (let i = 0; i < radiosCategoria.length; i++) {
    if (radiosCategoria[i].checked) {
      seleccionada = radiosCategoria[i].value;
    }
  }
  return seleccionada;
}
 
// ---------- Mostrar productos ----------
 
function mostrarProductos(lista) {
  contenedorProductos.innerHTML = "";
 
  if (lista.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.textContent = "No se encontraron productos";
    mensaje.classList.add("mensaje-vacio");
    contenedorProductos.appendChild(mensaje);
    return;
  }
 
  for (let i = 0; i < lista.length; i++) {
    const producto = lista[i];
 
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("tarjeta");
 
    const imagen = document.createElement("img");
    imagen.src = producto.imagen;
    imagen.alt = producto.nombre;
 
    const nombre = document.createElement("h4");
    nombre.textContent = producto.nombre;
 
    const descripcion = document.createElement("p");
    descripcion.textContent = producto.descripcion;
 
    const precio = document.createElement("p");
    precio.classList.add("precio");
    precio.textContent = formatearPrecio(producto.precio);
 
    const boton = document.createElement("button");
    boton.classList.add("boton-agregar");
 
    if (producto.stock === 0) {
      boton.textContent = "SIN STOCK";
      boton.disabled = true;
    } else {
      boton.textContent = "AGREGAR AL CARRITO";
      boton.addEventListener("click", function () {
        agregarAlCarrito(producto.id);
      });
    }
 
    tarjeta.appendChild(imagen);
    tarjeta.appendChild(nombre);
    tarjeta.appendChild(descripcion);
    tarjeta.appendChild(precio);
    tarjeta.appendChild(boton);
 
    contenedorProductos.appendChild(tarjeta);
  }
}
 
// ---------- Filtros ----------
 
function aplicarFiltros() {
  // copia del array para no modificar el original
  let lista = productosGuardados.slice();
 
  // 1) categoria
  const categoria = obtenerCategoriaSeleccionada();
  if (categoria !== "todas") {
    lista = lista.filter(function (p) {
      return limpiarTexto(p.categoria) === categoria;
    });
  }
 
  // 2) buscador (nombre o descripcion)
  const texto = buscador.value.toLowerCase();
  if (texto !== "") {
    lista = lista.filter(function (p) {
      const nombre = p.nombre.toLowerCase();
      const descripcion = p.descripcion.toLowerCase();
      return nombre.includes(texto) || descripcion.includes(texto);
    });
  }
 
  // 3) orden por precio
  const orden = selectOrden.value;
  if (orden === "menor") {
    lista.sort(function (a, b) {
      return a.precio - b.precio;
    });
  } else if (orden === "mayor") {
    lista.sort(function (a, b) {
      return b.precio - a.precio;
    });
  }
 
  mostrarProductos(lista);
}
 
// ---------- Carrito ----------
 
function agregarAlCarrito(id) {
  // busco el producto en el array
  let producto = null;
  for (let i = 0; i < productosGuardados.length; i++) {
    if (productosGuardados[i].id === id) {
      producto = productosGuardados[i];
    }
  }
 
  // veo si ya estaba en el carrito
  let itemCarrito = null;
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].id === id) {
      itemCarrito = carrito[i];
    }
  }
 
  if (itemCarrito === null) {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      cantidad: 1
    });
  } else {
    if (itemCarrito.cantidad < producto.stock) {
      itemCarrito.cantidad++;
    } else {
      alert("No hay más stock disponible");
    }
  }
 
  actualizarCarrito();
}
 
function quitarDelCarrito(id) {
  for (let i = 0; i < carrito.length; i++) {
    if (carrito[i].id === id) {
      carrito[i].cantidad--;
      if (carrito[i].cantidad === 0) {
        carrito.splice(i, 1);
      }
      break;
    }
  }
 
  actualizarCarrito();
}
 
function vaciarCarrito() {
  carrito = [];
  actualizarCarrito();
}
 
function actualizarCarrito() {
  listaCarrito.innerHTML = "";
 
  let total = 0;
  let cantidadTotal = 0;
 
  if (carrito.length === 0) {
    const vacio = document.createElement("li");
    vacio.textContent = "Tu carrito está vacío";
    listaCarrito.appendChild(vacio);
  }
 
  for (let i = 0; i < carrito.length; i++) {
    const item = carrito[i];
    const subtotal = item.precio * item.cantidad;
 
    total = total + subtotal;
    cantidadTotal = cantidadTotal + item.cantidad;
 
    const li = document.createElement("li");
 
    const texto = document.createElement("span");
    texto.textContent = item.nombre + " x" + item.cantidad + "  " + formatearPrecio(subtotal);
 
    const botonQuitar = document.createElement("button");
    botonQuitar.textContent = "Quitar";
    botonQuitar.classList.add("boton-quitar");
    botonQuitar.addEventListener("click", function () {
      quitarDelCarrito(item.id);
    });
 
    li.appendChild(texto);
    li.appendChild(botonQuitar);
    listaCarrito.appendChild(li);
  }
 
  totalCarrito.textContent = formatearPrecio(total);
  contadorCarrito.textContent = "Carrito (" + cantidadTotal + ")";
 
  // guardo el carrito en localStorage
  localStorage.setItem("carrito", JSON.stringify(carrito));
}
 
// ---------- Eventos ----------
 
// al hacer click en el título se renderizan los productos
titulo.addEventListener("click", function () {
  aplicarFiltros();
});
 
buscador.addEventListener("keyup", aplicarFiltros);
selectOrden.addEventListener("change", aplicarFiltros);
 
for (let i = 0; i < radiosCategoria.length; i++) {
  radiosCategoria[i].addEventListener("change", aplicarFiltros);
}
 
botonVaciar.addEventListener("click", vaciarCarrito);
 
// muestro el carrito al cargar la página (por si había algo guardado)
actualizarCarrito();