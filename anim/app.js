window.addEventListener("load", () => {

  gsap.to("#nube", {
    x: 800,
    duration: 10,
    repeat: -1,
    ease: "linear"
  });

  gsap.to("#bici", {
     x: 800,
    duration: 10,
    repeat: -1,
    ease: "linear"
  });

  gsap.to("#sol", {
    rotation: 360,
    duration: 20,
    repeat: -1,
    ease: "linear",
    transformOrigin: "50% 50%"
  });

});


const birds = new Howl({
  src: ["./sound/birds.mp3"],
  loop: true,
  volume: 0.4
});

// Activar sonido con el primer clic 
window.addEventListener("click", () => {
  birds.play();
}, { once: true });
