// Utilidad para seleccionar elementos
const $ = (selector) => document.querySelector(selector);

/* =========================
   Elementos de la interfaz
========================= */
const botonInk = $("#botonInk");
const botonCarrito = $("#botonCarrito");
const contadorCarrito = $("#contadorCarrito");
const contenedorProductos = $("#listaProductos");
const botonSubir = $("#botonSubir");
const botonAnterior = $("#botonAnterior");
const botonSiguiente = $("#botonSiguiente");
const ventanaCarrusel = $("#ventanaCarrusel");


/* Modal del carrito */
const modalCarrito = $("#modalCarrito");
const botonCerrarCarrito = $("#botonCerrarCarrito");
const listaCarrito = $("#listaCarrito");
const subtotalCarrito = $("#subtotalCarrito");

/* =========================
   Carrusel: movimiento
========================= */
let indice = 0;

function obtenerPaso() {
  const tarjeta = document.querySelector(".tarjeta-producto");
  if (!tarjeta) return 0;
  const gap = 14;
  return tarjeta.getBoundingClientRect().width + gap;
}

function maxIndice() {
  const paso = obtenerPaso();
  if (!ventanaCarrusel || paso === 0) return 0;

  const visibles = Math.floor(ventanaCarrusel.clientWidth / paso) || 1;
  return Math.max(0, PRODUCTOS.length - visibles);
}

function actualizarCarrusel() {
  const paso = obtenerPaso();
  const max = maxIndice();

  if (indice > max) indice = max;
  if (indice < 0) indice = 0;

  const x = -indice * paso;
  if (contenedorProductos) {
    contenedorProductos.style.transform = `translateX(${x}px)`;
  }

  if (botonAnterior) botonAnterior.disabled = indice === 0;
  if (botonSiguiente) botonSiguiente.disabled = indice === max;
}

/* Flechas */
botonAnterior?.addEventListener("click", () => {
  indice -= 1;
  actualizarCarrusel();
});

botonSiguiente?.addEventListener("click", () => {
  indice += 1;
  actualizarCarrusel();
});

let arrastrando = false;
let xInicio = 0;
let xActual = 0;

ventanaCarrusel?.addEventListener("pointerdown", (e) => {
  // NO iniciar arrastre si es un botón
  if (e.target.closest("button")) {
    return;
  }
  
  arrastrando = true;
  xInicio = e.clientX;
  xActual = 0;
  ventanaCarrusel.setPointerCapture(e.pointerId);
});

ventanaCarrusel?.addEventListener("pointermove", (e) => {
  if (!arrastrando) return;
  xActual = e.clientX - xInicio;
});

ventanaCarrusel?.addEventListener("pointerup", () => {
  if (!arrastrando) return;
  arrastrando = false;

  // umbral para cambiar de slide
  const umbral = 50;
  if (xActual > umbral) indice -= 1;
  if (xActual < -umbral) indice += 1;

  actualizarCarrusel();
});

/* Recalcular al cambiar tamaño */
window.addEventListener("resize", actualizarCarrusel);

/* =========================
   Datos
========================= */
const PRODUCTOS = [
  { id: "Zapatos",   nombre: "Zapatos",   temporada: "2026", precioAnterior: 300000, precioActual: 180000, imagen: "assets/img/p1.jpg" },
  { id: "duran",    nombre: "Gorra",    temporada: "2026", precioAnterior: 120000, precioActual: 80000, imagen: "assets/img/p2.jpg" },
  { id: "the-eye",  nombre: "Jean",  temporada: "2026", precioAnterior: 290000, precioActual: 170000, imagen: "assets/img/p3.jpg" },
  { id: "carnera",  nombre: "Buzo",  temporada: "2026", precioAnterior: 240000, precioActual: 144000, imagen: "assets/img/p4.jpg" },
  { id: "the-code", nombre: "Camiseta", temporada: "2026", precioAnterior: 190000, precioActual: 100000, imagen: "assets/img/p5.jpg" },
];


const carrito = new Map();

/* =========================
    Utilidades
========================= */
function formatoMonedaCOP(valor) {
  return valor.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

function buscarProductoPorId(id) {
  return PRODUCTOS.find((p) => p.id === id);
}


/* =========================
   Productos
========================= */
function renderizarProductos() {
  if (!contenedorProductos) return;

  contenedorProductos.innerHTML = PRODUCTOS.map((p) => `
    <article class="tarjeta-producto">
      <div class="tarjeta-producto__imagen" style="background-image:url('${p.imagen}')"></div>

      <div class="tarjeta-producto__cuerpo">
        <div class="tarjeta-producto__temporada">${p.temporada}</div>
        <div class="tarjeta-producto__nombre">${p.nombre}</div>

        <div class="tarjeta-producto__precios">
          <span class="precio-anterior">${formatoMonedaCOP(p.precioAnterior)}</span>
          <span class="precio-actual">${formatoMonedaCOP(p.precioActual)}</span>
        </div>
      </div>

      <button class="tarjeta-producto__boton" type="button" data-agregar="${p.id}">
        Agregar al carrito
      </button>
    </article>
  `).join("");

  // Agregar listeners a los botones después de renderizar
  const botones = contenedorProductos.querySelectorAll("[data-agregar]");
  
  botones.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.agregar;
      agregarAlCarrito(id);
      actualizarCarritoUI();
    });
  });
}

/* =========================
   Carrito: lógica y UI
========================= */
function agregarAlCarrito(idProducto) {
  const producto = buscarProductoPorId(idProducto);
  if (!producto) return;

  const actual = carrito.get(idProducto);
  carrito.set(idProducto, {
    producto,
    cantidad: actual ? actual.cantidad + 1 : 1,
  });
}

function quitarDelCarrito(idProducto) {
  carrito.delete(idProducto);
}

function calcularTotales() {
  let totalCantidad = 0;
  let subtotal = 0;

  for (const item of carrito.values()) {
    totalCantidad += item.cantidad;
    subtotal += item.cantidad * item.producto.precioActual;
  }

  return { totalCantidad, subtotal };
}

function actualizarCarritoUI() {
  const { totalCantidad, subtotal } = calcularTotales();

  if (contadorCarrito) contadorCarrito.textContent = String(totalCantidad);
  if (subtotalCarrito) subtotalCarrito.textContent = formatoMonedaCOP(subtotal);

  if (!listaCarrito) return;

  if (carrito.size === 0) {
    listaCarrito.innerHTML = `<li style="opacity:.7;">Tu carrito está vacío.</li>`;
    return;
  }

  listaCarrito.innerHTML = [...carrito.values()].map(({ producto, cantidad }) => `
    <li class="item-carrito">
      <div>
        <strong>${producto.nombre}</strong><br/>
        <small style="opacity:.7">
          ${producto.temporada} • ${formatoMonedaCOP(producto.precioActual)} • cantidad: ${cantidad}
        </small>
      </div>

      <button type="button" data-quitar="${producto.id}">
        Quitar
      </button>
    </li>
  `).join("");
}

/* =========================
   Modal: abrir/cerrar
========================= */
function abrirModalCarrito() {
  if (!modalCarrito) return;
  modalCarrito.classList.add("activo");
  modalCarrito.setAttribute("aria-hidden", "false");
}

function cerrarModalCarrito() {
  if (!modalCarrito) return;
  modalCarrito.classList.remove("activo");
  modalCarrito.setAttribute("aria-hidden", "true");
}

/* =========================
   Eventos
========================= */
document.addEventListener("click", (e) => {
  const botonQuitar = e.target.closest("[data-quitar]");
  const fondoCerrar = e.target.closest("[data-cerrar]");

  if (botonQuitar) {
    const id = botonQuitar.dataset.quitar;
    quitarDelCarrito(id);
    actualizarCarritoUI();
    return;
  }

  if (fondoCerrar) {
    cerrarModalCarrito();
  }
});



if (botonCarrito) {
  botonCarrito.addEventListener("click", () => {
    actualizarCarritoUI();
    abrirModalCarrito();
  });
}

if (botonCerrarCarrito) {
  botonCerrarCarrito.addEventListener("click", cerrarModalCarrito);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") cerrarModalCarrito();
});

/* =========================
   Ink mode (tema)
========================= */
if (botonInk) {
  botonInk.addEventListener("click", () => {
    const activo = document.body.classList.toggle("ink");
    botonInk.setAttribute("aria-pressed", String(activo));
  });
}

/* =========================
   Botón subir
========================= */
window.addEventListener("scroll", () => {
  if (!botonSubir) return;
  botonSubir.style.display = window.scrollY > 600 ? "block" : "none";
});

if (botonSubir) {
  botonSubir.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* =========================
   Inicialización
========================= */
renderizarProductos();
actualizarCarritoUI();
actualizarCarrusel();

/* =========================
   CURSOR ANIMADO
========================= */
let cursor = document.querySelector(".cursor");
if (!cursor) {
  cursor = document.createElement("div");
  cursor.className = "cursor";
  document.body.appendChild(cursor);
}

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorX = mouseX;
let cursorY = mouseY;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animarCursor() {
  cursorX += (mouseX - cursorX) * 0.15;
  cursorY += (mouseY - cursorY) * 0.15;

  cursor.style.left = cursorX + "px";
  cursor.style.top = cursorY + "px";

  requestAnimationFrame(animarCursor);
}
animarCursor();

// Hover “activo”
function activarCursor() { cursor.classList.add("activo"); }
function desactivarCursor() { cursor.classList.remove("activo"); }

document.addEventListener("mouseover", (e) => {
  if (e.target.closest("button, a, .tarjeta-producto, .carrusel__boton")) activarCursor();
});

document.addEventListener("mouseout", (e) => {
  if (e.target.closest("button, a, .tarjeta-producto, .carrusel__boton")) desactivarCursor();
});

/* =========================
   CURSOR TRAIL (RASTRO)
========================= */
let ultimoTiempo = 0;

document.addEventListener("mousemove", (e) => {
  const ahora = Date.now();

  if (ahora - ultimoTiempo < 30) return;
  ultimoTiempo = ahora;

  const punto = document.createElement("div");
  punto.className = "cursor-trail";
  punto.style.left = e.clientX + "px";
  punto.style.top = e.clientY + "px";

  document.body.appendChild(punto);

  setTimeout(() => {
    punto.remove();
  }, 600);
});

