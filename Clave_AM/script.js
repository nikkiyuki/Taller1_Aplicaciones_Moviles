document.addEventListener("DOMContentLoaded", function () {

    const input = document.getElementById("password");
    const teclado = document.querySelector(".keys");
    const botonLimpiar = document.getElementById("clear");
  
    let contrasena = "";
  
    // guardar los números originales
    const botones = teclado.querySelectorAll(".number");
    botones.forEach(function (boton) {
      boton.dataset.original = boton.textContent;
    });
  
    // mezclar los botones del teclado
    function mezclarTeclado() {
      let numeros = Array.from(teclado.querySelectorAll(".number"));
  
      numeros.sort(function () {
        return Math.random() - 0.5;
      });
  
      numeros.forEach(function (boton) {
        teclado.insertBefore(boton, botonLimpiar);
      });
    }
  
    // ocultar todos los números
    function ocultarNumeros() {
      let numeros = teclado.querySelectorAll(".number");
      numeros.forEach(function (boton) {
        boton.textContent = "*";
      });
    }
  
    // restaurar los números originales
    function mostrarNumeros() {
      let numeros = teclado.querySelectorAll(".number");
      numeros.forEach(function (boton) {
        boton.textContent = boton.dataset.original;
      });
    }
  
    // evento cuando el mouse entra
    teclado.addEventListener("mouseover", function (e) {
      if (e.target.classList.contains("number")) {
        ocultarNumeros();
      }
    });
  
    // evento cuando el mouse sale
    teclado.addEventListener("mouseout", function (e) {
      if (e.target.classList.contains("number")) {
        mostrarNumeros();
      }
    });
  
    // evento para los clicks
    teclado.addEventListener("click", function (e) {
  
      if (e.target.id === "clear") {
        contrasena = "";
        input.value = "";
        return;
      }
  
      if (e.target.classList.contains("number")) {
        contrasena = contrasena + e.target.dataset.original;
        input.value = contrasena;
  
        mezclarTeclado();
      }
    });
  
    // mezclar al iniciar
    mezclarTeclado();
  });
  teclado.addEventListener("touchstart", function (e) {
  if (e.target.classList.contains("number")) {
    ocultarNumeros();
  }
});

teclado.addEventListener("touchend", function (e) {
  if (e.target.classList.contains("number")) {
    mostrarNumeros();
  }
});
