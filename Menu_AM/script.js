
const enlacesMenu = document.querySelectorAll('nav a');

// Recorre cada enlace del menú
enlacesMenu.forEach(enlace => {

    // Agrega un evento cuando se hace clic en el enlace
    enlace.addEventListener('click', function (e) {

        // Evita el comportamiento por defecto del enlace
        // (que sería saltar directamente a la sección)
        e.preventDefault();

        // Obtiene el valor del atributo href del enlace (ej: "#section1")
        // y elimina el símbolo "#" para quedarse solo con el id
        const idSeccion = this.getAttribute('href').substring(1);

        // Busca en el documento el elemento que tenga ese id
        const seccion = document.getElementById(idSeccion);

        // Desplaza la pantalla suavemente hasta la sección encontrada
        seccion.scrollIntoView({
            behavior: 'smooth'
        });
    });
});

