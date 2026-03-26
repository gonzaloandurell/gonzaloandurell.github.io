// Efecto Parallax para los orbes de fondo
document.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.glow-orb');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    if (orbs.length >= 2) {
        orbs[0].style.transform = `translate(${x * 30}px, ${y * 30}px)`;
        orbs[1].style.transform = `translate(${x * -20}px, ${y * -20}px)`;
    }
});

// Sistema de reproducción de videos solo al hacer Hover
document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        const video = card.querySelector('video');
        
        if (video) {
            // Asegurarnos de que el video esté pausado inicialmente
            video.pause();

            card.addEventListener('mouseenter', () => {
                video.play().catch(err => {
                    console.warn("La reproducción del video fue bloqueada por el navegador:", err);
                });
            });

            card.addEventListener('mouseleave', () => {
                video.pause();
                // Opcional: video.currentTime = 0; // Descomentar si quieres que el video empiece de 0 siempre
            });
        }
    });
});
