// Configuración de la API
// Detectar automáticamente la URL correcta
function getApiUrl() {
    const hostname = window.location.hostname;
    
    // Desarrollo local
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5000';
    }
    
    // GitHub Codespaces
    if (hostname.includes('.github.dev') || hostname.includes('.preview.app.github.dev')) {
        // Reemplazar el puerto 8000 por 5000 en la URL
        return window.location.origin.replace('-8000', '-5000');
    }
    
    // Producción (Vercel)
    return '/api';
}

const API_URL = getApiUrl();
console.log('🔗 API URL:', API_URL);

// Esperar a que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM cargado, inicializando juego...');
    
    // Estado del juego
    let gameState = {
        gameId: null,
        turn: 1,
        economy: null,
        decisions: [],
        gameOver: false
    };

// Elementos del DOM
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const startBtn = document.getElementById('start-btn');
const eventPanel = document.getElementById('event-panel');
const eventText = document.getElementById('event-text');
const eventOkBtn = document.getElementById('event-ok-btn');
const decisionPanel = document.getElementById('decision-panel');
const decisionsList = document.getElementById('decisions-list');
const gameoverPanel = document.getElementById('gameover-panel');
const gameoverReason = document.getElementById('gameover-reason');
const finalTurns = document.getElementById('final-turns');
const restartBtn = document.getElementById('restart-btn');

// Stats del header
const turnEl = document.getElementById('turn');
const pbiEl = document.getElementById('pbi');
const reservasEl = document.getElementById('reservas');

// HUD animation helper
function animateHudUpdate() {
    [turnEl, pbiEl, reservasEl].forEach(el => {
        el.style.transform = 'scale(1.2)';
        setTimeout(() => el.style.transform = 'scale(1)', 200);
    });
}

// Barras de progreso
const barDeuda = document.getElementById('bar-deuda');
const valDeuda = document.getElementById('val-deuda');
const barDesempleo = document.getElementById('bar-desempleo');
const valDesempleo = document.getElementById('val-desempleo');
const barInflacion = document.getElementById('bar-inflacion');
const valInflacion = document.getElementById('val-inflacion');
const barDescontento = document.getElementById('bar-descontento');
const valDescontento = document.getElementById('val-descontento');

// Event Listeners
console.log('🎮 Configurando event listeners...');
console.log('Start button:', startBtn);
console.log('Event OK button:', eventOkBtn);
console.log('Restart button:', restartBtn);

startBtn.addEventListener('click', () => {
    console.log('🖱️ Click en START detectado!');
    startNewGame();
});
eventOkBtn.addEventListener('click', hideEvent);
restartBtn.addEventListener('click', startNewGame);

// Iniciar nuevo juego
async function startNewGame() {
    console.log('🎮 Iniciando nuevo juego...');
    try {
        console.log('📡 Conectando a:', `${API_URL}/api/new-game`);
        const response = await fetch(`${API_URL}/api/new-game`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Juego creado:', data);
        
        gameState.gameId = data.game_id;
        gameState.turn = data.turn;
        gameState.economy = data.state;
        gameState.gameOver = false;
        
        // Cargar decisiones
        await loadDecisions();
        
        // Cambiar a pantalla de juego
        startScreen.classList.remove('active');
        gameScreen.classList.add('active');
        
        // Actualizar UI
        updateUI();
        
    } catch (error) {
        console.error('❌ Error starting game:', error);
        alert(`Error al iniciar el juego:\n${error.message}\n\nVerificá que el backend esté corriendo en el puerto 5000.\nAPI URL: ${API_URL}`);
    }
}

// Cargar decisiones disponibles
async function loadDecisions() {
    try {
        const response = await fetch(`${API_URL}/api/decisions`);
        const data = await response.json();
        gameState.decisions = data.decisions;
        renderDecisions();
    } catch (error) {
        console.error('Error loading decisions:', error);
    }
}

// Renderizar decisiones
function getDecisionIcon(title) {
    const iconMap = {
        deuda: '💰',
        'devalu': '💸',
        empleo: '👷',
        desempleo: '📉',
        inflacion: '🔥',
        fmi: '🏦',
        imprimir: '🖨️',
        default: '🤔'
    };
    const lowerTitle = title.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
        if (lowerTitle.includes(key)) return icon;
    }
    return iconMap.default;
}

function renderDecisions() {
    decisionsList.innerHTML = '';
    
    const shuffled = [...gameState.decisions].sort(() => Math.random() - 0.5);
    const selectedDecisions = shuffled.slice(0, 3);
    
    selectedDecisions.forEach(decision => {
        const icon = getDecisionIcon(decision.title);
        const shortTitle = decision.title.length > 20 ? decision.title.substring(0, 20) + '...' : decision.title;
        
        const card = document.createElement('div');
        card.className = 'decision-card iconic';
        card.title = decision.description; // Tooltip completo
        card.innerHTML = `
            <div class="decision-icon">${icon}</div>
            <div class="decision-short-title">${shortTitle}</div>
        `;
        
        card.addEventListener('click', () => makeDecision(decision.id));
        decisionsList.appendChild(card);
    });
}

// Hacer una decisión
async function makeDecision(decisionId) {
    try {
        // Deshabilitar decisiones
        decisionPanel.style.pointerEvents = 'none';
        
        const response = await fetch(`${API_URL}/api/make-decision/${gameState.gameId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ decision_id: decisionId })
        });
        
        const data = await response.json();
        
        // Actualizar estado
        gameState.turn = data.turn;
        gameState.economy = data.state;
        gameState.gameOver = data.game_over;
        
        // Mostrar evento
        showEvent(data.event);
        
        // Actualizar UI
        updateUI();
        
        // Verificar game over
        if (gameState.gameOver) {
            showGameOver();
        } else {
            // Renderizar nuevas decisiones
            renderDecisions();
            decisionPanel.style.pointerEvents = 'auto';
        }
        
    } catch (error) {
        console.error('Error making decision:', error);
        decisionPanel.style.pointerEvents = 'auto';
    }
}

// Mostrar evento
function showEvent(event) {
    eventText.textContent = `${event.title}: ${event.description}`;
    eventPanel.classList.remove('hidden');
    decisionPanel.classList.add('hidden');
}

// Ocultar evento
function hideEvent() {
    eventPanel.classList.add('hidden');
    
    if (!gameState.gameOver) {
        decisionPanel.classList.remove('hidden');
    }
}

// Actualizar interfaz
function updateUI() {
    const state = gameState.economy;
    
    // Update HUD stats (always visible)
    turnEl.textContent = gameState.turn;
    pbiEl.textContent = Math.round(state.pbi);
    reservasEl.textContent = Math.round(state.reservas);
    
    animateHudUpdate();
    
    // Deuda
    const deudaPercent = Math.min((state.deuda / 200) * 100, 100);
    barDeuda.style.width = deudaPercent + '%';
    barDeuda.className = 'progress-fill' + (state.deuda > 150 ? ' danger' : '');
    valDeuda.textContent = Math.round(state.deuda);
    
    // Desempleo
    const desempleoPercent = Math.min((state.desempleo / 30) * 100, 100);
    barDesempleo.style.width = desempleoPercent + '%';
    barDesempleo.className = 'progress-fill' + (state.desempleo > 20 ? ' danger' : '');
    valDesempleo.textContent = Math.round(state.desempleo) + '%';
    
    // Inflación
    const inflacionPercent = Math.min(((state.inflacion + 10) / 30) * 100, 100);
    barInflacion.style.width = Math.max(inflacionPercent, 5) + '%';
    barInflacion.className = 'progress-fill' + (state.inflacion > 10 ? ' danger' : '');
    valInflacion.textContent = Math.round(state.inflacion) + '%';
    
    // Descontento
    const descontentoPercent = Math.min((state.descontento_social / 100) * 100, 100);
    barDescontento.style.width = descontentoPercent + '%';
    barDescontento.className = 'progress-fill' + (state.descontento_social > 70 ? ' danger' : '');
    valDescontento.textContent = Math.round(state.descontento_social);
}

// Mostrar game over
function showGameOver() {
    const state = gameState.economy;
    let reason = '';
    
    if (state.reservas <= 0) {
        reason = '💸 Las reservas se agotaron. El país entró en default total.';
    } else if (state.desempleo >= 30) {
        reason = '📉 El desempleo alcanzó niveles insostenibles. Crisis social total.';
    } else if (state.deuda >= 200) {
        reason = '💰 La deuda externa superó todos los límites. Default inevitable.';
    } else {
        reason = '🔥 La crisis se salió de control.';
    }
    
    gameoverReason.textContent = reason;
    finalTurns.textContent = gameState.turn;
    
    eventPanel.classList.add('hidden');
    decisionPanel.classList.add('hidden');
    gameoverPanel.classList.remove('hidden');
}

// Inicialización dentro del scope
console.log('🇦🇷 Simulador Argentina 2001 inicializado');

// Easter egg: Konami code
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            console.log('🎮 KONAMI CODE ACTIVATED!');
            document.body.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                document.body.style.transform = 'rotate(0deg)';
            }, 2000);
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

// Fin del DOMContentLoaded
});

console.log('📜 Script cargado, esperando DOM...');
