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
    // Asegurar que la pantalla no se quede en negro (limpiar fade-out si existe)
    document.body.classList.remove('fade-out');

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

    // --- SISTEMA DE TRANSICIONES ENTRE PÁGINAS ---
    const links = document.querySelectorAll('a[href]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const url = this.getAttribute('href');
            
            // Ignorar enlaces externos, anclas o tabs nuevas
            if (!url || url.startsWith('#') || this.target === '_blank' || url.startsWith('http') || url.startsWith('mailto:')) {
                return;
            }

            e.preventDefault(); // Detener el salto instantáneo
            document.body.classList.add('fade-out'); // Activar transición CSS

            // Si es un botón de volver atrás, intentar recuperar historial para mantener el scroll
            if (this.classList.contains('back-link')) {
                setTimeout(() => {
                    history.back();
                }, 200);
                return;
            }

            // Esperar los 200ms definidos en CSS para cargar la url
            setTimeout(() => {
                window.location.href = url;
            }, 200); 
        });
    });

    // --- TARJETAS DE PROYECTO CLICABLES ---
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        const linkBtn = card.querySelector('a.btn');
        if (linkBtn && linkBtn.getAttribute('href') !== '#') {
            card.style.cursor = 'pointer';
            card.addEventListener('click', (e) => {
                // Prevenir que se active 2 veces si el usuario hace clic exacto en el boton
                if (e.target.tagName !== 'A' && !e.target.closest('a')) {
                    linkBtn.click(); // Dispara el PJAX de la transicion o el salto nativo
                }
            });
        }
    });
});

// --- ELIMINAR FADE-OUT AL VOLVER ATRÁS (BFCACHE) ---
// Este evento se dispara incluso cuando la página se carga desde el historial/caché del navegador
window.addEventListener('pageshow', (event) => {
    if (event.persisted || document.body.classList.contains('fade-out')) {
        document.body.classList.remove('fade-out');
    }
});
