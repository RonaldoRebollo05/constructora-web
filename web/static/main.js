document.addEventListener('DOMContentLoaded', () => {
    // 1. Iniciar animaciones de scroll
    AOS.init({ once: true, offset: 100 });
    
    // 2. Iniciar fondo
    iniciarFondoDinamico();
    
    // 3. Cargar proyectos de la BD
    cargarProyectosReales();
    
    // 4. Configurar el formulario de contacto (NUEVO)
    configurarFormulario();
});

/* --- FUNCIÓN: CARGAR PROYECTOS CON LIGHTBOX --- */
function cargarProyectosReales() {
    const contenedor = document.getElementById('project-container');
    if (!contenedor) return;

    fetch('/api/proyectos/')
        .then(response => response.json())
        .then(data => {
            contenedor.innerHTML = ''; // Limpiar contenedor

            data.forEach((proyecto, index) => {
                const tarjeta = document.createElement('div');
                tarjeta.classList.add('project-card');
                tarjeta.setAttribute('data-aos', 'fade-up');
                tarjeta.setAttribute('data-aos-delay', (index * 100).toString());

                tarjeta.innerHTML = `
                    <a href="${proyecto.imagen}" data-lightbox="galeria-proyectos" data-title="${proyecto.titulo}">
                        <img src="${proyecto.imagen}" alt="${proyecto.titulo}">
                    </a>

                    <div class="project-overlay">
                        <div class="project-cat">${proyecto.categoria}</div>
                        <h3 class="project-title">${proyecto.titulo}</h3>
                        <p>${proyecto.descripcion}</p>
                    </div>
                `;
                contenedor.appendChild(tarjeta);
            });
        })
        .catch(error => console.error('Error cargando proyectos:', error));
}

/* --- FUNCIÓN: ENVIAR FORMULARIO DE CONTACTO --- */
function configurarFormulario() {
    const form = document.getElementById('form-contacto');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Evita recarga de página

        const datos = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            mensaje: document.getElementById('mensaje').value
        };

        const boton = form.querySelector('button');
        const textoOriginal = boton.textContent;
        boton.textContent = 'Enviando...';
        boton.disabled = true;

        fetch('/api/contacto/', {
            method: 'POST',
            body: JSON.stringify(datos),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'ok') {
                alert('¡Gracias! Hemos recibido tu mensaje.');
                form.reset();
            } else {
                alert('Hubo un error al enviar el mensaje.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error de conexión.');
        })
        .finally(() => {
            boton.textContent = textoOriginal;
            boton.disabled = false;
        });
    });
}

/* --- FONDO DE PARTÍCULAS (CANVAS) --- */
function iniciarFondoDinamico() {
    const canvas = document.getElementById('canvas-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particlesArray;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        init();
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.directionX = (Math.random() * 0.4) - 0.2;
            this.directionY = (Math.random() * 0.4) - 0.2;
            this.size = Math.random() * 2 + 1;
            this.color = '#e6b800';
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 15000;
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                    ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = 'rgba(230, 184, 0,' + opacityValue + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }
    init(); animate();
}