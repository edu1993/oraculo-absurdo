/**
 * ORÁCULO DE DECISIONES ABSURDAS - App Logic
 * Maneja el logging, carga de datos y generación de decisiones
 */

// ========================================
// INICIALIZACIÓN Y LOGGING
// ========================================

console.log('%c🔮 Oráculo de Decisiones Absurdas - Logs activados', 'color: #00f5ff; font-size: 16px; font-weight: bold;');
console.log('%cTimestamp: ' + new Date().toISOString(), 'color: #666;');

// Log cuando se carga la página
window.addEventListener('load', function() {
    console.log('%c[PAGE LOAD] Página cargada completamente', 'color: #00ff00;');
    console.log('%c[USER AGENT] ' + navigator.userAgent, 'color: #888;');
    console.log('%c[VIEWPORT] ' + window.innerWidth + 'x' + window.innerHeight, 'color: #888;');
    
    // Cargar decisiones desde JSON
    cargarDecisiones();
});

// Log clics en botones
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        const button = e.target.tagName === 'BUTTON' ? e.target : e.target.closest('button');
        const buttonText = button.textContent.trim();
        const cardTitle = button.closest('.group')?.querySelector('h4')?.textContent.trim() || 'Sin título';
        console.log('%c[CLICK] Botón: "' + buttonText + '" | Card: "' + cardTitle + '"', 'color: #ff00ff;');
        console.log('%c[TIMESTAMP] ' + new Date().toLocaleTimeString(), 'color: #666;');
    }
});

// ========================================
// CARGA DE DATOS
// ========================================

let datosDecisiones = null;

async function cargarDecisiones() {
    try {
        console.log('%c[DATA] Cargando decisiones.json...', 'color: #ffa500;');
        const response = await fetch('data/decisiones.json');
        
        if (!response.ok) {
            throw new Error('HTTP error! status: ' + response.status);
        }
        
        datosDecisiones = await response.json();
        console.log('%c[DATA] ✅ Decisiones cargadas: ' + datosDecisiones.categorias.length + ' categorías', 'color: #00ff00;');
        
        // Renderizar las tarjetas
        renderizarDecisiones();
        
    } catch (error) {
        console.error('%c[DATA] ❌ Error cargando decisiones:', 'color: #ff0000;', error);
        mostrarErrorCarga();
    }
}

// ========================================
// RENDERIZADO
// ========================================

function renderizarDecisiones() {
    const main = document.querySelector('main');
    
    // Limpiar contenido existente (excepto el loading)
    const existingContent = main.querySelectorAll('section, footer');
    existingContent.forEach(el => el.remove());
    
    // Ocultar loading
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = 'none';
    
    // Mostrar contenido
    main.style.display = 'block';
    
    datosDecisiones.categorias.forEach(categoria => {
        const section = crearSeccionCategoria(categoria);
        main.insertBefore(section, main.querySelector('footer'));
    });
    
    console.log('%c[RENDER] ✅ Decisiones renderizadas en el DOM', 'color: #00ff00;');
}

function crearSeccionCategoria(categoria) {
    const section = document.createElement('section');
    section.className = 'mb-12';
    
    // Color mapping para Tailwind
    const colorClasses = {
        'neon-cyan': 'text-cyan-400',
        'neon-pink': 'text-pink-400', 
        'neon-purple': 'text-purple-400'
    };
    
    const colorClass = colorClasses[categoria.color] || 'text-gray-400';
    
    section.innerHTML = `
        <h3 class="text-2xl font-bold mb-6 ${colorClass} flex items-center">
            ${categoria.titulo}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="grid-${categoria.id}">
        </div>
    `;
    
    const grid = section.querySelector(`#grid-${categoria.id}`);
    
    categoria.decisiones.forEach(decision => {
        const card = crearCardDecision(decision, categoria.color);
        grid.appendChild(card);
    });
    
    return section;
}

function crearCardDecision(decision, colorTheme) {
    const card = document.createElement('div');
    
    // Color configurations
    const colorConfigs = {
        'neon-cyan': {
            border: 'hover:border-cyan-400/50',
            text: 'group-hover:text-cyan-400',
            buttonBorder: 'border-cyan-400/50',
            buttonText: 'text-cyan-400',
            buttonHover: 'hover:bg-cyan-400',
            glow: 'hover:neon-glow'
        },
        'neon-pink': {
            border: 'hover:border-pink-400/50',
            text: 'group-hover:text-pink-400',
            buttonBorder: 'border-pink-400/50',
            buttonText: 'text-pink-400',
            buttonHover: 'hover:bg-pink-400',
            glow: 'hover:neon-glow-pink'
        },
        'neon-purple': {
            border: 'hover:border-purple-400/50',
            text: 'group-hover:text-purple-400',
            buttonBorder: 'border-purple-400/50',
            buttonText: 'text-purple-400',
            buttonHover: 'hover:bg-purple-400',
            glow: 'hover:neon-glow-purple'
        }
    };
    
    const config = colorConfigs[colorTheme] || colorConfigs['neon-cyan'];
    
    card.className = `group bg-gray-900/80 border border-gray-800 rounded-xl p-4 sm:p-6 ${config.border} ${config.glow} transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2`;
    
    // Convertir opciones a JSON string para el onclick
    const opcionesJSON = JSON.stringify(decision.opciones).replace(/"/g, '&quot;');
    
    card.innerHTML = `
        <h4 class="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-white ${config.text} transition-colors leading-tight">
            ${decision.titulo}
        </h4>
        <p class="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4">${decision.descripcion}</p>
        <button onclick="decidir(${opcionesJSON}, '${decision.id}')" 
                class="w-full py-3 sm:py-3 bg-gradient-to-r from-gray-800 to-gray-900 border ${config.buttonBorder} rounded-lg ${config.buttonText} font-semibold ${config.buttonHover} hover:text-black transition-all duration-300 hover:scale-105 ${config.glow} btn-mobile">
            Decidir por mí
        </button>
        <div id="result-${decision.id}" class="mt-3 sm:mt-4 text-center hidden"></div>
    `;
    
    // Agregar hover logging
    card.addEventListener('mouseenter', function() {
        console.log('%c[HOVER] Mouse entró en: "' + decision.titulo + '"', 'color: #bf00ff;');
    });
    
    return card;
}

function mostrarErrorCarga() {
    const main = document.querySelector('main');
    main.innerHTML = `
        <div class="text-center py-20">
            <p class="text-red-400 text-xl">❌ Error al cargar las decisiones</p>
            <p class="text-gray-500 mt-2">Revisá la consola para más detalles</p>
            <button onclick="location.reload()" class="mt-4 px-6 py-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                Reintentar
            </button>
        </div>
    `;
}

// ========================================
// LÓGICA DE DECISIÓN
// ========================================

function decidir(opciones, id) {
    const resultadoDiv = document.getElementById('result-' + id);
    const resultado = opciones[Math.floor(Math.random() * opciones.length)];
    
    // Log de la decisión
    console.log('%c[DECISIÓN] ID: ' + id, 'color: #00f5ff; font-weight: bold;');
    console.log('%c[RESULTADO] "' + resultado + '"', 'color: #00f5ff;');
    
    resultadoDiv.innerHTML = `
        <div class="result-appear p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-white/20">
            <p class="text-lg font-bold text-white">${resultado}</p>
            <p class="text-xs text-gray-400 mt-1">El universo ha hablado ✨</p>
        </div>
    `;
    resultadoDiv.classList.remove('hidden');
}

// ========================================
// DADO MÁGICO
// ========================================

let dadoActual = null;

function tirarDadoMagico() {
    if (!datosDecisiones) {
        console.log('%c[DADO] ❌ Datos no cargados aún', 'color: #ff0000;');
        return;
    }
    
    // Obtener todas las decisiones de todas las categorías
    const todasLasDecisiones = [];
    datosDecisiones.categorias.forEach(cat => {
        cat.decisiones.forEach(dec => {
            todasLasDecisiones.push({
                ...dec,
                categoria: cat.titulo,
                color: cat.color
            });
        });
    });
    
    // Elegir una al azar
    dadoActual = todasLasDecisiones[Math.floor(Math.random() * todasLasDecisiones.length)];
    
    console.log('%c[DADO] 🎲 Tirando dado mágico...', 'color: #ff00ff; font-weight: bold;');
    console.log('%c[DADO] Categoría: ' + dadoActual.categoria, 'color: #bf00ff;');
    console.log('%c[DADO] Pregunta: ' + dadoActual.titulo, 'color: #bf00ff;');
    
    // Animación del botón
    const btn = document.getElementById('dado-btn');
    btn.classList.add('scale-90');
    setTimeout(() => btn.classList.remove('scale-90'), 150);
    
    // Mostrar resultado
    const resultadoDiv = document.getElementById('resultado-dado');
    const categoriaEl = document.getElementById('dado-categoria');
    const preguntaEl = document.getElementById('dado-pregunta');
    const respuestaContainer = document.getElementById('dado-respuesta-container');
    const respuestaEl = document.getElementById('dado-respuesta');
    const revelarBtn = document.getElementById('dado-revelar-btn');
    
    categoriaEl.textContent = dadoActual.categoria;
    preguntaEl.textContent = dadoActual.titulo;
    respuestaEl.textContent = '';
    
    respuestaContainer.classList.add('hidden');
    revelarBtn.classList.remove('hidden');
    revelarBtn.textContent = 'Revelar respuesta';
    
    resultadoDiv.classList.remove('hidden');
    resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function revelarRespuestaDado() {
    if (!dadoActual) return;
    
    const resultado = dadoActual.opciones[Math.floor(Math.random() * dadoActual.opciones.length)];
    const respuestaEl = document.getElementById('dado-respuesta');
    const respuestaContainer = document.getElementById('dado-respuesta-container');
    const revelarBtn = document.getElementById('dado-revelar-btn');
    
    respuestaEl.textContent = resultado;
    respuestaContainer.classList.remove('hidden');
    revelarBtn.classList.add('hidden');
    
    // Gamification: increment streak and count
    incrementarStats();
    
    // Show confetti effect
    lanzarConfetti();
    
    console.log('%c[DADO] 🎲 RESULTADO: "' + resultado + '"', 'color: #00f5ff; font-weight: bold; font-size: 14px;');
    console.log('%c[DADO] El universo ha hablado ✨', 'color: #00f5ff;');
}

// ========================================
// GAMIFICATION & ENGAGEMENT
// ========================================

let stats = {
    decisiones: parseInt(localStorage.getItem('oraculo_decisiones') || '0'),
    racha: parseInt(localStorage.getItem('oraculo_racha') || '0'),
    ultimaVisita: localStorage.getItem('oraculo_ultima_visita')
};

// Check streak on load
function checkRacha() {
    const hoy = new Date().toDateString();
    const ayer = new Date(Date.now() - 86400000).toDateString();
    
    if (stats.ultimaVisita === hoy) {
        // Same day, keep streak
    } else if (stats.ultimaVisita === ayer) {
        // Consecutive day, increment streak
        stats.racha++;
        mostrarToast('🔥 ¡Racha de ' + stats.racha + ' días!');
    } else if (stats.ultimaVisita) {
        // Streak broken
        if (stats.racha > 0) {
            mostrarToast('😢 Racha perdida. ¡Empezá de nuevo!');
        }
        stats.racha = 1;
    } else {
        // First visit
        stats.racha = 1;
    }
    
    stats.ultimaVisita = hoy;
    guardarStats();
    actualizarStatsUI();
}

function incrementarStats() {
    stats.decisiones++;
    guardarStats();
    actualizarStatsUI();
    
    // Milestone messages
    if (stats.decisiones === 1) {
        mostrarToast('🎉 Primera decisión tomada con el Oráculo!');
    } else if (stats.decisiones === 5) {
        mostrarToast('⭐ ¡5 decisiones! Ya sos experto.');
    } else if (stats.decisiones === 10) {
        mostrarToast('🏆 ¡10 decisiones! Maestro del Oráculo.');
        lanzarConfetti();
    } else if (stats.decisiones === 25) {
        mostrarToast('👑 ¡25 decisiones! Sos uno con el universo.');
        lanzarConfetti();
    } else if (stats.decisiones % 10 === 0) {
        mostrarToast('✨ ¡' + stats.decisiones + ' decisiones! Seguí así.');
    }
}

function guardarStats() {
    localStorage.setItem('oraculo_decisiones', stats.decisiones);
    localStorage.setItem('oraculo_racha', stats.racha);
    localStorage.setItem('oraculo_ultima_visita', stats.ultimaVisita);
}

function actualizarStatsUI() {
    const streakEl = document.getElementById('streak-count');
    const countEl = document.getElementById('decision-count');
    const progressEl = document.getElementById('progress-bar');
    
    if (streakEl) streakEl.textContent = stats.racha;
    if (countEl) countEl.textContent = stats.decisiones;
    
    // Progress to next milestone
    const milestones = [1, 5, 10, 25, 50, 100];
    const nextMilestone = milestones.find(m => m > stats.decisiones) || 100;
    const prevMilestone = milestones.slice().reverse().find(m => m <= stats.decisiones) || 0;
    const progress = ((stats.decisiones - prevMilestone) / (nextMilestone - prevMilestone)) * 100;
    if (progressEl) progressEl.style.width = progress + '%';
}

function toggleStats() {
    const statsBar = document.getElementById('stats-bar');
    if (statsBar) {
        const isHidden = statsBar.classList.contains('-translate-y-full');
        if (isHidden) {
            statsBar.classList.remove('-translate-y-full');
        } else {
            statsBar.classList.add('-translate-y-full');
        }
    }
}

// Toast notifications
function mostrarToast(mensaje) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = mensaje;
    container.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Confetti effect
function lanzarConfetti() {
    const colors = ['#00f5ff', '#ff00ff', '#bf00ff', '#ffff00', '#ff6600'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
            document.body.appendChild(confetti);
            
            // Animate fall
            const duration = 2000 + Math.random() * 2000;
            const rotation = Math.random() * 720 - 360;
            
            confetti.animate([
                { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
                { transform: `translateY(${window.innerHeight + 20}px) rotate(${rotation}deg)`, opacity: 0 }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => confetti.remove();
        }, i * 30);
    }
}

// Easter egg
let easterEggClicks = 0;
function mostrarEasterEgg() {
    easterEggClicks++;
    if (easterEggClicks === 5) {
        mostrarToast('🎉 ¡Encontraste el Easter Egg! Sos un curioso.');
        lanzarConfetti();
        easterEggClicks = 0;
    }
}

// Share functionality
function compartirApp() {
    const text = '🔮 Oráculo de Decisiones Absurdas - Me ayuda a tomar decisiones argentas difíciles. Probalo: ' + window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'Oráculo de Decisiones Absurdas',
            text: text,
            url: window.location.href
        }).catch(() => {
            // Fallback to clipboard
            copiarAlPortapapeles(text);
        });
    } else {
        copiarAlPortapapeles(text);
    }
}

function compartirDecision() {
    const pregunta = document.getElementById('dado-pregunta').textContent;
    const respuesta = document.getElementById('dado-respuesta').textContent;
    const text = `🔮 El Oráculo respondió: "${respuesta}" a "${pregunta}". Probalo: ${window.location.href}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Mi decisión del Oráculo',
            text: text
        });
    } else {
        copiarAlPortapapeles(text);
    }
}

function copiarAlPortapapeles(text) {
    navigator.clipboard.writeText(text).then(() => {
        mostrarToast('📋 Link copiado al portapapeles');
    }).catch(() => {
        mostrarToast('❌ No se pudo copiar');
    });
}

// Scroll to category
function scrollToCategoria(categoriaId) {
    const section = document.querySelector(`#grid-${categoriaId}`)?.closest('section');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Initialize on load
window.addEventListener('load', () => {
    checkRacha();
    
    // Show stats bar after a delay
    setTimeout(() => {
        const statsBar = document.getElementById('stats-bar');
        if (statsBar && (stats.decisiones > 0 || stats.nivel > 1)) {
            statsBar.classList.remove('-translate-y-full');
        }
    }, 1000);
    
    // Initialize XP system
    initXPSystem();
    
    // Check for daily challenge
    checkDailyChallenge();
    
    // Play ambient sound (optional, user gesture needed)
    // initAmbientSound();
});

// ========================================
// SISTEMA DE NIVELES Y XP
// ========================================

let xpSystem = {
    xp: parseInt(localStorage.getItem('oraculo_xp') || '0'),
    nivel: parseInt(localStorage.getItem('oraculo_nivel') || '1'),
    titulo: localStorage.getItem('oraculo_titulo') || 'Novicio del Oráculo'
};

const TITULOS = [
    { nivel: 1, titulo: 'Novicio del Oráculo', xp: 0 },
    { nivel: 2, titulo: 'Aprendiz de Indeciso', xp: 50 },
    { nivel: 3, titulo: 'Caminante del Dilema', xp: 150 },
    { nivel: 4, titulo: 'Maestro de la Duda', xp: 300 },
    { nivel: 5, titulo: 'Oráculo Junior', xp: 500 },
    { nivel: 6, titulo: 'Dictador de Decisiones', xp: 800 },
    { nivel: 7, titulo: 'Señor del Caos Argentino', xp: 1200 },
    { nivel: 8, titulo: 'Emperador de la Indecisión', xp: 1700 },
    { nivel: 9, titulo: 'Dios del Dado Mágico', xp: 2300 },
    { nivel: 10, titulo: 'Leyenda Viva del Oráculo', xp: 3000 }
];

const LOGROS = [
    { id: 'primera_decision', nombre: 'Primeros Pasos', desc: 'Tomá tu primera decisión', icon: '🌟', condicion: () => stats.decisiones >= 1 },
    { id: 'racha_3', nombre: 'Constancia', desc: '3 días seguidos usando el Oráculo', icon: '🔥', condicion: () => stats.racha >= 3 },
    { id: 'racha_7', nombre: 'Adicto', desc: '7 días seguidos (ya no podés parar)', icon: '📅', condicion: () => stats.racha >= 7 },
    { id: 'decisiones_10', nombre: 'Indeciso Profesional', desc: '10 decisiones tomadas', icon: '🎯', condicion: () => stats.decisiones >= 10 },
    { id: 'decisiones_50', nombre: 'Maestro del Caos', desc: '50 decisiones (¿tenés problemas?)', icon: '👑', condicion: () => stats.decisiones >= 50 },
    { id: 'decisiones_100', nombre: 'Leyenda Argentina', desc: '100 decisiones (buscá ayuda)', icon: '🏆', condicion: () => stats.decisiones >= 100 },
    { id: 'nivel_5', nombre: 'Elevando el Nivel', desc: 'Alcanzá nivel 5', icon: '🚀', condicion: () => xpSystem.nivel >= 5 },
    { id: 'dado_5', nombre: 'Jugador', desc: 'Usá el dado mágico 5 veces en un día', icon: '🎲', condicion: () => (stats.usosDadoHoy || 0) >= 5 },
    { id: 'compartir', nombre: 'Influencer', desc: 'Compartí el Oráculo con alguien', icon: '📢', condicion: () => localStorage.getItem('oraculo_compartio') === 'true' }
];

function initXPSystem() {
    actualizarUI_Nivel();
    checkLogros();
}

function ganarXP(cantidad) {
    xpSystem.xp += cantidad;
    
    // Check level up
    const siguienteNivel = TITULOS.find(t => t.nivel === xpSystem.nivel + 1);
    if (siguienteNivel && xpSystem.xp >= siguienteNivel.xp) {
        subirNivel();
    }
    
    guardarXP();
    actualizarUI_Nivel();
}

function subirNivel() {
    xpSystem.nivel++;
    const nuevoTitulo = TITULOS.find(t => t.nivel === xpSystem.nivel);
    xpSystem.titulo = nuevoTitulo.titulo;
    
    // Big celebration
    mostrarToast(`🎉 ¡SUBISTE DE NIVEL! Ahora sos: ${xpSystem.titulo}`);
    lanzarConfetti();
    vibrarTelefono([100, 50, 100, 50, 200]);
    
    // Level up sound
    playSound('levelup');
}

function guardarXP() {
    localStorage.setItem('oraculo_xp', xpSystem.xp);
    localStorage.setItem('oraculo_nivel', xpSystem.nivel);
    localStorage.setItem('oraculo_titulo', xpSystem.titulo);
}

function actualizarUI_Nivel() {
    const nivelEl = document.getElementById('nivel-display');
    const xpBarEl = document.getElementById('xp-bar');
    const tituloEl = document.getElementById('titulo-display');
    
    if (nivelEl) nivelEl.textContent = xpSystem.nivel;
    if (tituloEl) tituloEl.textContent = xpSystem.titulo;
    
    // XP bar
    if (xpBarEl) {
        const siguienteNivel = TITULOS.find(t => t.nivel === xpSystem.nivel + 1);
        const xpActual = xpSystem.xp;
        const xpNecesaria = siguienteNivel ? siguienteNivel.xp : xpActual;
        const xpAnterior = TITULOS.find(t => t.nivel === xpSystem.nivel).xp;
        const progreso = siguienteNivel ? ((xpActual - xpAnterior) / (xpNecesaria - xpAnterior)) * 100 : 100;
        xpBarEl.style.width = progreso + '%';
    }
}

// ========================================
// SISTEMA DE LOGROS (BADGES)
// ========================================

function checkLogros() {
    const logrosDesbloqueados = JSON.parse(localStorage.getItem('oraculo_logros') || '[]');
    
    LOGROS.forEach(logro => {
        if (!logrosDesbloqueados.includes(logro.id) && logro.condicion()) {
            desbloquearLogro(logro);
        }
    });
}

function desbloquearLogro(logro) {
    let logrosDesbloqueados = JSON.parse(localStorage.getItem('oraculo_logros') || '[]');
    logrosDesbloqueados.push(logro.id);
    localStorage.setItem('oraculo_logros', JSON.stringify(logrosDesbloqueados));
    
    // Celebration
    mostrarToast(`🏆 ¡LOGRO DESBLOQUEADO! ${logro.icon} ${logro.nombre}`);
    lanzarConfetti();
    vibrarTelefono(50);
    
    // Award XP
    ganarXP(25);
}

// Override incrementarStats to include XP
const originalIncrementarStats = incrementarStats;
incrementarStats = function() {
    originalIncrementarStats();
    
    // Add XP for each decision
    ganarXP(10);
    
    // Track dado uses today
    const hoy = new Date().toDateString();
    const ultimoUsoDado = localStorage.getItem('oraculo_dado_fecha');
    let usosHoy = parseInt(localStorage.getItem('oraculo_dado_hoy') || '0');
    
    if (ultimoUsoDado !== hoy) {
        usosHoy = 0;
    }
    usosHoy++;
    localStorage.setItem('oraculo_dado_hoy', usosHoy);
    localStorage.setItem('oraculo_dado_fecha', hoy);
    stats.usosDadoHoy = usosHoy;
    
    // Check for dado achievement
    checkLogros();
};

// Override compartirApp to track
const originalCompartirApp = compartirApp;
compartirApp = function() {
    localStorage.setItem('oraculo_compartio', 'true');
    ganarXP(50);
    mostrarToast('📢 ¡+50 XP por compartir!');
    checkLogros();
    return originalCompartirApp();
};

// ========================================
// EFECTOS DE SONIDO Y HÁPTICOS
// ========================================

function vibrarTelefono(pattern) {
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
}

function playSound(tipo) {
    // Simple synthesized sounds using Web Audio API
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    switch(tipo) {
        case 'click':
            osc.frequency.value = 800;
            gain.gain.value = 0.1;
            osc.start();
            osc.stop(ctx.currentTime + 0.05);
            break;
        case 'success':
            osc.frequency.setValueAtTime(523, ctx.currentTime);
            osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
            osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
            gain.gain.value = 0.2;
            osc.start();
            osc.stop(ctx.currentTime + 0.3);
            break;
        case 'levelup':
            // Arpeggio
            [523, 659, 784, 1047].forEach((freq, i) => {
                const o = ctx.createOscillator();
                const g = ctx.createGain();
                o.connect(g);
                g.connect(ctx.destination);
                o.frequency.value = freq;
                g.gain.value = 0.15;
                o.start(ctx.currentTime + i * 0.1);
                o.stop(ctx.currentTime + i * 0.1 + 0.2);
            });
            break;
    }
}

// Add vibration and sound to button clicks
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
        vibrarTelefono(20);
        playSound('click');
    }
});

// ========================================
// DESAFÍOS DIARIOS
// ========================================

const DESAFIOS_DIARIOS = [
    { id: 'dado_3', desc: 'Usá el dado mágico 3 veces', objetivo: 3, premio: 30 },
    { id: 'decisiones_5', desc: 'Tomá 5 decisiones hoy', objetivo: 5, premio: 40 },
    { id: 'compartir', desc: 'Compartí el Oráculo', objetivo: 1, premio: 50 }
];

function checkDailyChallenge() {
    const hoy = new Date().toDateString();
    const ultimoDesafio = localStorage.getItem('oraculo_desafio_fecha');
    
    if (ultimoDesafio !== hoy) {
        // New day, new challenge
        const desafio = DESAFIOS_DIARIOS[Math.floor(Math.random() * DESAFIOS_DIARIOS.length)];
        localStorage.setItem('oraculo_desafio_hoy', JSON.stringify(desafio));
        localStorage.setItem('oraculo_desafio_progreso', '0');
        localStorage.setItem('oraculo_desafio_fecha', hoy);
        
        setTimeout(() => {
            mostrarToast(`🎯 Desafío de hoy: ${desafio.desc} (+${desafio.premio} XP)`);
        }, 2000);
    }
}

function updateDesafioProgreso(tipo) {
    const hoy = new Date().toDateString();
    const desafioStr = localStorage.getItem('oraculo_desafio_hoy');
    const fechaDesafio = localStorage.getItem('oraculo_desafio_fecha');
    
    if (!desafioStr || fechaDesafio !== hoy) return;
    
    const desafio = JSON.parse(desafioStr);
    let progreso = parseInt(localStorage.getItem('oraculo_desafio_progreso') || '0');
    
    if (desafio.id === tipo && progreso < desafio.objetivo) {
        progreso++;
        localStorage.setItem('oraculo_desafio_progreso', progreso);
        
        if (progreso >= desafio.objetivo) {
            mostrarToast(`🎯 ¡Desafío completado! +${desafio.premio} XP`);
            ganarXP(desafio.premio);
            lanzarConfetti();
        }
    }
}

// Add to revelarRespuestaDado
const originalRevelarRespuestaDado = revelarRespuestaDado;
revelarRespuestaDado = function() {
    originalRevelarRespuestaDado();
    updateDesafioProgreso('dado_3');
    playSound('success');
};

// Add to decidir function
const originalDecidir = decidir;
decidir = function(opciones, id) {
    originalDecidir(opciones, id);
    updateDesafioProgreso('decisiones_5');
    playSound('success');
};

// ========================================
// ANIMACIÓN DE DADO 3D
// ========================================

function animarDado3D() {
    const btn = document.getElementById('dado-btn');
    if (!btn) return;
    
    btn.style.transform = 'rotateX(720deg) rotateY(720deg) scale(0.8)';
    btn.style.transition = 'transform 1s ease-out';
    
    setTimeout(() => {
        btn.style.transform = '';
        btn.style.transition = '';
    }, 1000);
}

// Override tirarDadoMagico to add 3D animation
const originalTirarDadoMagico = tirarDadoMagico;
tirarDadoMagico = function() {
    animarDado3D();
    vibrarTelefono([30, 50, 30]);
    setTimeout(() => {
        originalTirarDadoMagico();
    }, 500);
};

// ========================================
// GENERADOR DE IMAGEN PARA INSTAGRAM
// ========================================

const EMOJIS_ARGENTINOS = ['🇦🇷', '🧉', '🥩', '🔥', '🎲', '😎', '💸', '🍕', '🛌', '🎮', '💼', '👨‍👩‍👧', '🛒', '😂', '🤷‍♂️', '🍺', '🏆', '⚽', '🚇', '🚌'];

function generarImagenInstagram(pregunta, respuesta, categoria) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Instagram square 1:1
    canvas.width = 1080;
    canvas.height = 1080;
    
    // Fondo gradiente argentino
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0a0a0f');
    gradient.addColorStop(0.5, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Patrón hexagonal sutil
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.1)';
    ctx.lineWidth = 2;
    for (let i = 0; i < canvas.width; i += 60) {
        for (let j = 0; j < canvas.height; j += 60) {
            dibujarHexagono(ctx, i, j, 20);
        }
    }
    
    // Marco neon
    ctx.strokeStyle = '#00f5ff';
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    
    // Sombra del marco
    ctx.shadowColor = '#00f5ff';
    ctx.shadowBlur = 30;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    ctx.shadowBlur = 0;
    
    // Header con logo
    ctx.fillStyle = '#00f5ff';
    ctx.font = 'bold 60px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🔮 ORÁCULO ABSURDO', canvas.width / 2, 120);
    
    ctx.fillStyle = '#ff00ff';
    ctx.font = '36px Arial, sans-serif';
    ctx.fillText('🇦🇷 Versión Argentina', canvas.width / 2, 170);
    
    // Línea divisoria
    ctx.strokeStyle = '#ff00ff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(100, 200);
    ctx.lineTo(canvas.width - 100, 200);
    ctx.stroke();
    
    // Emojis decorativos alrededor
    ctx.font = '50px Arial';
    const emojisSeleccionados = EMOJIS_ARGENTINOS.sort(() => 0.5 - Math.random()).slice(0, 8);
    ctx.fillText(emojisSeleccionados[0], 80, 300);
    ctx.fillText(emojisSeleccionados[1], canvas.width - 130, 300);
    ctx.fillText(emojisSeleccionados[2], 80, 700);
    ctx.fillText(emojisSeleccionados[3], canvas.width - 130, 700);
    ctx.fillText(emojisSeleccionados[4], 80, 900);
    ctx.fillText(emojisSeleccionados[5], canvas.width - 130, 900);
    
    // Caja de pregunta
    ctx.fillStyle = 'rgba(0, 245, 255, 0.1)';
    ctx.fillRect(150, 280, canvas.width - 300, 200);
    ctx.strokeStyle = '#00f5ff';
    ctx.lineWidth = 3;
    ctx.strokeRect(150, 280, canvas.width - 300, 200);
    
    // Texto pregunta
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 42px Arial, sans-serif';
    ctx.textAlign = 'center';
    
    // Word wrap para pregunta
    const palabrasPregunta = pregunta.split(' ');
    let linea = '';
    let y = 340;
    for (let i = 0; i < palabrasPregunta.length; i++) {
        const testLine = linea + palabrasPregunta[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > canvas.width - 350 && i > 0) {
            ctx.fillText(linea, canvas.width / 2, y);
            linea = palabrasPregunta[i] + ' ';
            y += 50;
        } else {
            linea = testLine;
        }
    }
    ctx.fillText(linea, canvas.width / 2, y);
    
    // Flecha decorativa
    ctx.font = '60px Arial';
    ctx.fillText('⬇️', canvas.width / 2, 520);
    
    // Caja de respuesta
    ctx.fillStyle = 'rgba(255, 0, 255, 0.15)';
    ctx.fillRect(120, 560, canvas.width - 240, 320);
    ctx.strokeStyle = '#ff00ff';
    ctx.lineWidth = 5;
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 20;
    ctx.strokeRect(120, 560, canvas.width - 240, 320);
    ctx.shadowBlur = 0;
    
    // Texto "EL UNIVERSO DICE:"
    ctx.fillStyle = '#00f5ff';
    ctx.font = 'bold 32px Arial, sans-serif';
    ctx.fillText('✨ EL UNIVERSO DICE ✨', canvas.width / 2, 610);
    
    // Línea divisoria respuesta
    ctx.strokeStyle = '#00f5ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(200, 630);
    ctx.lineTo(canvas.width - 200, 630);
    ctx.stroke();
    
    // Texto respuesta (más grande y destacado)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial, sans-serif';
    
    // Word wrap para respuesta
    const palabrasRespuesta = respuesta.split(' ');
    linea = '';
    y = 690;
    for (let i = 0; i < palabrasRespuesta.length; i++) {
        const testLine = linea + palabrasRespuesta[i] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > canvas.width - 300 && i > 0) {
            ctx.fillText(linea, canvas.width / 2, y);
            linea = palabrasRespuesta[i] + ' ';
            y += 55;
        } else {
            linea = testLine;
        }
    }
    ctx.fillText(linea, canvas.width / 2, y);
    
    // Footer con emojis
    ctx.fillStyle = '#ffffff';
    ctx.font = '40px Arial';
    ctx.fillText(emojisSeleccionados[6] + ' ¿Querés que el Oráculo decida por vos? ' + emojisSeleccionados[7], canvas.width / 2, 960);
    
    // URL
    ctx.fillStyle = '#ff00ff';
    ctx.font = 'bold 28px Arial, sans-serif';
    ctx.fillText('🔮 oraculo-absurdo.github.io', canvas.width / 2, 1020);
    
    return canvas;
}

function dibujarHexagono(ctx, x, y, radius) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (i * 60) * Math.PI / 180;
        const px = x + radius * Math.cos(angle);
        const py = y + radius * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
}

// ========================================
// MODALES DE COMPARTIR
// ========================================

let preguntaCompartir = '';
let respuestaCompartir = '';

function abrirModalCompartir() {
    preguntaCompartir = document.getElementById('dado-pregunta').textContent;
    respuestaCompartir = document.getElementById('dado-respuesta').textContent;
    const modal = document.getElementById('modal-compartir');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function cerrarModalCompartir() {
    const modal = document.getElementById('modal-compartir');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function compartirOpcion(tipo) {
    cerrarModalCompartir();
    
    if (tipo === 'texto') {
        // Copiar solo texto
        const urlActual = window.location.href;
        const text = `🔮 El Oráculo respondió:\n"${respuestaCompartir}"\n\na "${preguntaCompartir}"\n\nProbá el Oráculo: ${urlActual}`;
        navigator.clipboard.writeText(text);
        mostrarToast('📋 ¡Texto copiado al portapapeles!');
    } else {
        // Generar imagen
        const categoria = document.getElementById('dado-categoria').textContent;
        const canvas = generarImagenInstagram(preguntaCompartir, respuestaCompartir, categoria);
        
        canvas.toBlob(function(blob) {
            const file = new File([blob], 'oraculo-decision.png', { type: 'image/png' });
            
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                navigator.share({
                    files: [file],
                    title: 'Mi decisión del Oráculo',
                    text: '🔮 El Oráculo decidió por mí'
                }).catch(() => {
                    descargarImagen(canvas);
                });
            } else {
                descargarImagen(canvas);
            }
        }, 'image/png');
        
        mostrarToast('📸 ¡Imagen generada para Instagram!');
    }
}

function abrirModalCompartirApp() {
    const modal = document.getElementById('modal-compartir-app');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function cerrarModalCompartirApp() {
    const modal = document.getElementById('modal-compartir-app');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
}

function compartirAppOpcion(tipo) {
    cerrarModalCompartirApp();
    localStorage.setItem('oraculo_compartio', 'true');
    ganarXP(50);
    
    const urlActual = window.location.href;
    
    if (tipo === 'texto') {
        // Copiar solo el link
        const text = `🔮 Oráculo de Decisiones Absurdas\n¿No sabés qué hacer? El universo tiene respuestas para tus dilemas más argentos.\n\nProbá acá: ${urlActual}`;
        navigator.clipboard.writeText(text);
        mostrarToast('📋 ¡+50 XP! Link copiado al portapapeles');
    } else {
        // Generar imagen promocional
        const canvas = generarImagenCompartirApp();
        
        canvas.toBlob(function(blob) {
            const file = new File([blob], 'oraculo-app.png', { type: 'image/png' });
            
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                navigator.share({
                    files: [file],
                    title: 'Oráculo de Decisiones Absurdas',
                    text: '🔮 ¿No sabés qué hacer? Dejá que el universo decida por vos.'
                }).catch(() => {
                    descargarImagen(canvas);
                });
            } else {
                descargarImagen(canvas);
            }
        }, 'image/png');
        
        mostrarToast('📸 ¡+50 XP! Imagen promocional generada');
    }
    
    checkLogros();
}

// Override compartirDecision para abrir modal
compartirDecision = function() {
    abrirModalCompartir();
};

// Override compartirApp para abrir modal
compartirApp = function() {
    abrirModalCompartirApp();
};

// Cerrar modales al hacer click fuera
document.addEventListener('click', function(e) {
    const modalCompartir = document.getElementById('modal-compartir');
    const modalCompartirApp = document.getElementById('modal-compartir-app');
    
    if (e.target === modalCompartir) {
        cerrarModalCompartir();
    }
    if (e.target === modalCompartirApp) {
        cerrarModalCompartirApp();
    }
});
