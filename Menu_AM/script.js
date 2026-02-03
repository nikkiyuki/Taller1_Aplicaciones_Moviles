// Selecciona todos los enlaces del menú de navegación
const enlacesMenu = document.querySelectorAll('nav a');

// Recorre cada enlace
enlacesMenu.forEach(enlace => {
    enlace.addEventListener('click', function (evento) {
        // Evita el salto brusco por defecto
        evento.preventDefault();

        // Obtiene el id de la sección destino (sin el #)
        const idSeccion = this.getAttribute('href').substring(1);

        // Busca la sección en el documento
        const seccionDestino = document.getElementById(idSeccion);

        // Desplazamiento suave hacia la sección
        seccionDestino.scrollIntoView({
            behavior: 'smooth'
        });
    });
});
