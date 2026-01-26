const texto = document.getElementById("texto");
const contador = document.getElementById("contador");

texto.addEventListener("input", function () {
  contador.textContent = texto.value.length;
});
