// Configuración de la API
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : '/api';

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
startBtn.addEventListener('click', startNewGame);
eventOkBtn.addEventListener('click', hideEvent);
restartBtn.addEventListener('click', startNewGame);

// Iniciar nuevo juego
async function startNewGame() {
    try {
        const response = await fetch(`${API_URL}/api/new-game`, {
            method: 'POST'
        });
        const data = await response.json();
        
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
        console.error('Error starting game:', error);
        alert('Error al iniciar el juego. Asegurate de que la API esté corriendo.');
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
function renderDecisions() {
    decisionsList.innerHTML = '';
    
    // Mostrar 3 decisiones random
    const shuffled = [...gameState.decisions].sort(() => Math.random() - 0.5);
    const selectedDecisions = shuffled.slice(0, 3);
    
    selectedDecisions.forEach(decision => {
        const card = document.createElement('div');
        card.className = 'decision-card';
        card.innerHTML = `
            <div class="decision-card-title">${decision.title}</div>
            <div class="decision-card-desc">${decision.description}</div>
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
    
    // Header stats
    turnEl.textContent = gameState.turn;
    pbiEl.textContent = Math.round(state.pbi);
    reservasEl.textContent = Math.round(state.reservas);
    
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

// Inicialización
console.log('🇦🇷 Simulador Argentina 2001 cargado');
console.log('API URL:', API_URL);

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
