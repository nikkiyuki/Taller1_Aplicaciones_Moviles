// Agregar un evento de clic a los enlaces del menú
const menuLinks = document.querySelectorAll('.menu a');

menuLinks.forEach(link => {
    link.addEventListener('click', (event) => {
        event.preventDefault(); // Prevenir el comportamiento predeterminado del enlace

        const targetId = link.getAttribute('href').substring(1); // Obtener el ID de la sección objetivo
        const targetSection = document.getElementById(targetId);

        // Desplazarse suavemente hacia la sección objetivo
        targetSection.scrollIntoView({
            behavior: 'smooth'
        });
    });
});