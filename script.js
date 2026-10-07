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

// Gestión de interactividad global
document.addEventListener('DOMContentLoaded', () => {
    // Asegurar que la pantalla no se quede en negro (limpiar fade-out si existe)
    document.body.classList.remove('fade-out');

    const projectCards = document.querySelectorAll('.project-card');

    // Los videos ahora se reproducen automáticamente y de forma perpetua 
    // gracias a los atributos HTML (autoplay muted loop playsinline).
    // Se ha eliminado la lógica de pausa inicial y de Hover para mejorar el dinamismo visual.

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

    // --- NAVEGACIÓN MÓVIL ---
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');
    
    if (nav && navLinks) {
        // Inyectar botón de hamburguesa
        const toggle = document.createElement('button');
        toggle.className = 'mobile-nav-toggle';
        toggle.setAttribute('aria-label', 'Menu');
        toggle.innerHTML = `
            <div class="hamburger-box">
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            </div>
        `;
        
        nav.appendChild(toggle);
        
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            toggle.classList.toggle('active');
            
            // Prevenir scroll
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Cerrar al hacer clic en un link (para las transiciones)
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                toggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Cerrar al hacer clic fuera del menú
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !toggle.contains(e.target)) {
                navLinks.classList.remove('active');
                toggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});

// --- ELIMINAR FADE-OUT AL VOLVER ATRÁS (BFCACHE) ---
// Este evento se dispara incluso cuando la página se carga desde el historial/caché del navegador
window.addEventListener('pageshow', (event) => {
    if (event.persisted || document.body.classList.contains('fade-out')) {
        document.body.classList.remove('fade-out');
    }
});

// --- SISTEMA DE PARTÍCULAS FÍSICAS (TECH ART) ---
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.particles');
    if (!container) return;
    
    // Limpiar pseudo-elementos (por si quedaron de la versión CSS)
    container.style.cssText = 'background: transparent;';
    
    const numParticles = 75; // Mas cantidad
    const particles = [];
    
    for (let i = 0; i < numParticles; i++) {
        const p = document.createElement('div');
        p.className = 'particle-node';
        
        // Random properties
        const size = Math.random() * 4 + 1; // 1px to 5px
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        
        // Colores tech art (azul o púrpura)
        const isBlue = Math.random() > 0.5;
        const color = isBlue ? 'rgba(88, 166, 255, ' : 'rgba(210, 168, 255, ';
        const alpha = Math.random() * 0.5 + 0.5; // Alta opacidad
        p.style.background = `${color}${alpha})`;
        p.style.boxShadow = `0 0 ${size * 2}px ${color}${alpha})`;
        
        container.appendChild(p);
        
        particles.push({
            el: p,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            baseX: Math.random() * window.innerWidth,
            baseY: Math.random() * window.innerHeight,
            vx: (Math.random() - 0.5) * 0.4, // Drift horizontal
            vy: (Math.random() - 0.5) * 0.4, // Drift vertical
            angle: Math.random() * Math.PI * 2,
            angleSpeed: (Math.random() - 0.5) * 0.02,
            orbitRadius: Math.random() * 40 + 10,
            sinSpeed: Math.random() * 0.02 + 0.005,
            time: Math.random() * 100
        });
    }
    
    function animate() {
        particles.forEach(p => {
            // Movimiento base de deriva (drift)
            p.baseX += p.vx;
            p.baseY += p.vy - 0.3; // Flotan ligeramente hacia arriba
            
            // Loop en la pantalla
            if (p.baseY < -50) p.baseY = window.innerHeight + 50;
            if (p.baseX < -50) p.baseX = window.innerWidth + 50;
            if (p.baseX > window.innerWidth + 50) p.baseX = -50;
            
            // Movimiento sinusoidal y órbita (físico)
            p.time += p.sinSpeed;
            p.angle += p.angleSpeed;
            
            // Combinación de órbita circular y onda sinusoidal
            const offsetX = Math.cos(p.angle) * p.orbitRadius + Math.sin(p.time) * 20;
            const offsetY = Math.sin(p.angle) * p.orbitRadius + Math.cos(p.time) * 20;
            
            p.x = p.baseX + offsetX;
            p.y = p.baseY + offsetY;
            
            p.el.style.transform = `translate(${p.x}px, ${p.y}px)`;
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
});
