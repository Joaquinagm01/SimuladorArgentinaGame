// ============================================
// CYBER DEFENSE SIMULATOR - SOC Dashboard JS
// ============================================

// API Configuration
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:8080'
    : '';

let sessionId = null;
let gameState = null;
let currentCategory = null;
let currentDecisions = [];
let totalSpent = 0; // NUEVO: Rastrear gastos totales

// Matrix Background Effect (Optimized)
function initMatrix() {
    try {
        const canvas = document.getElementById('matrix-bg');
        if (!canvas) {
            console.warn('⚠️ Matrix canvas not found, skipping animation');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.warn('⚠️ Could not get canvas context');
            return;
        }
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);
        
        let lastTime = 0;
        const fps = 20; // Reduced from 30 to 20 FPS for better performance
        const interval = 1000 / fps;
        
        function draw(currentTime) {
            const elapsed = currentTime - lastTime;
            
            if (elapsed > interval) {
                ctx.fillStyle = 'rgba(10, 14, 26, 0.05)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                ctx.fillStyle = '#00ff41';
                ctx.font = fontSize + 'px monospace';
                
                for (let i = 0; i < drops.length; i++) {
                    const text = chars[Math.floor(Math.random() * chars.length)];
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                    
                    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                        drops[i] = 0;
                    }
                    drops[i]++;
                }
                
                lastTime = currentTime;
            }
            
            requestAnimationFrame(draw);
        }
        
        requestAnimationFrame(draw);
        
        // Throttled resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }, 250);
        });
        
        console.log('✅ Matrix background initialized');
    } catch (error) {
        console.error('❌ Error initializing matrix:', error);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM Content Loaded');
    
    try {
        console.log('1️⃣ Initializing Matrix...');
        initMatrix();
        
        console.log('2️⃣ Setting up button listeners...');
        const startBtn = document.getElementById('start-btn');
        const restartBtn = document.getElementById('restart-btn');
        const victoryRestartBtn = document.getElementById('victory-restart-btn');
        const clearLogBtn = document.getElementById('clear-log-btn');
        
        if (!startBtn) console.error('❌ Start button not found!');
        if (!restartBtn) console.error('❌ Restart button not found!');
        if (!victoryRestartBtn) console.error('❌ Victory restart button not found!');
        if (!clearLogBtn) console.error('❌ Clear log button not found!');
        
        if (startBtn) startBtn.addEventListener('click', startGame);
        if (restartBtn) restartBtn.addEventListener('click', restartGame);
        if (victoryRestartBtn) victoryRestartBtn.addEventListener('click', restartGame);
        if (clearLogBtn) clearLogBtn.addEventListener('click', clearEventLog);
        
        console.log('3️⃣ Initializing Tab System...');
        initTabSystem();
        
        console.log('4️⃣ Initializing Help System...');
        initHelpSystem();
        
        console.log('✅ All initialization complete!');
    } catch (error) {
        console.error('❌ INITIALIZATION ERROR:', error);
        alert('Error al inicializar el juego. Por favor recarga la página. Error: ' + error.message);
    }
});

// API Functions
async function apiCall(endpoint, method = 'GET', body = null) {
    const url = `${API_URL}${endpoint}`;
    console.log(`🌐 API Call: ${method} ${url}`);
    
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    if (body) {
        options.body = JSON.stringify(body);
        console.log('📦 Request body:', body);
    }
    
    try {
        const response = await fetch(url, options);
        console.log(`📡 Response status: ${response.status}`);
        
        const data = await response.json();
        console.log('📥 Response data:', data);
        
        if (!response.ok) {
            throw new Error(data.error || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('❌ API Error:', error);
        console.error('URL was:', url);
        addLogEntry('critical', `❌ Error: ${error.message}`);
        throw error;
    }
}

async function startGame() {
    console.log('🎮 ========== STARTING NEW GAME ==========');
    addLogEntry('info', '🔄 Initializing new SOC session...');
    
    try {
        const response = await apiCall('/api/game/new', 'POST');
        console.log('✅ Game created successfully!');
        console.log('Session ID:', response.sessionId);
        console.log('Initial state:', response.state);
        
        sessionId = response.sessionId;
        gameState = response.state;
        
        console.log('Switching to game screen...');
        switchScreen('start-screen', 'game-screen');
        
        console.log('Updating dashboard...');
        updateDashboard();
        
        // NUEVO: Initialize tab system and load first tab
        initTabSystem();
        loadTabDecisions('investigate');
        
        addLogEntry('success', '🛡️ SOC Operations initiated. All systems online.');
        addLogEntry('info', '');
        addLogEntry('info', '📖 TUTORIAL: Bienvenido al Centro de Operaciones de Seguridad');
        addLogEntry('info', '   • Objetivo: Sobrevivir 30 turnos manteniendo Security Score > 20');
        addLogEntry('info', '   • Gestiona alertas, presupuesto y reputación');
        addLogEntry('info', '   • 🔍 INVESTIGATE: Analiza alertas y busca amenazas');
        addLogEntry('info', '   • 🚨 RESPOND: Responde a incidentes activos');
        addLogEntry('info', '   • 🔧 UPGRADE: Mejora herramientas y sistemas');
        addLogEntry('info', '   • 👥 TEAM: Contrata y gestiona tu equipo SOC');
        addLogEntry('info', '   • 🎯 PROACTIVE: Acciones preventivas y mejoras');
        addLogEntry('info', '   • 💡 Usa los botones de AYUDA (?) para más información');
        addLogEntry('info', `   • 💰 Recibirás $${gameState.incomePerTurn || 15000} cada turno`);
        addLogEntry('info', '   • Consulta el panel GLOSSARY & HELP para términos');
        addLogEntry('info', '');
        addLogEntry('warning', '⚠️ Si las alertas superan 100 o Security Score cae a 0, ¡GAME OVER!');
        addLogEntry('info', '');
        console.log('✅ Game initialization complete!');
    } catch (error) {
        console.error('❌ FAILED TO START GAME:', error);
        addLogEntry('critical', '❌ Failed to start game. Please refresh and try again.');
    }
}

async function restartGame() {
    sessionId = null;
    gameState = null;
    clearEventLog();
    switchScreen('gameover-screen', 'start-screen');
    switchScreen('victory-screen', 'start-screen');
}

function switchScreen(fromId, toId) {
    const from = document.getElementById(fromId);
    const to = document.getElementById(toId);
    if (from) from.classList.remove('active');
    if (to) to.classList.add('active');
}

function updateDashboard() {
    if (!gameState) return;
    
    // Header Compacto
    document.getElementById('turn').textContent = gameState.turn;
    document.getElementById('security-score').textContent = gameState.securityScore;
    document.getElementById('budget').textContent = `$${(gameState.budget / 1000).toFixed(0)}K`;
    document.getElementById('reputation').textContent = gameState.reputation;
    
    // NUEVO: Actualizar barras de progreso
    updateProgressBars();
    
    // NUEVO: Métricas Económicas
    const budgetFull = document.getElementById('budget-full');
    const incomeDisplay = document.getElementById('income-display');
    const totalSpentEl = document.getElementById('total-spent');
    const toolsROI = document.getElementById('tools-roi');
    
    if (budgetFull) budgetFull.textContent = `$${gameState.budget.toLocaleString()}`;
    if (incomeDisplay) incomeDisplay.textContent = `+$${(gameState.incomePerTurn || 15000).toLocaleString()}`;
    if (totalSpentEl) totalSpentEl.textContent = `$${totalSpent.toLocaleString()}`;
    
    // Calcular ROI de herramientas (basado en security score)
    const toolsActive = Object.values(gameState.tools || {}).filter(t => t).length;
    const roiPercent = toolsActive * 5; // Cada herramienta da +5% ROI
    if (toolsROI) toolsROI.textContent = `+${roiPercent}%`;
    
    // Generate and display AI suggestion
    updateSuggestion();
    
    // Panel de Estado
    const threatsEl = document.getElementById('active-threats');
    const alertsEl = document.getElementById('alerts-queue');
    threatsEl.textContent = gameState.activeThreats;
    alertsEl.textContent = gameState.alertsQueue;
    document.getElementById('incidents-resolved').textContent = gameState.incidentsResolved;
    
    // NUEVO: Animaciones de pulso para amenazas críticas
    if (gameState.activeThreats >= 5) {
        threatsEl.classList.add('pulse-critical');
    } else {
        threatsEl.classList.remove('pulse-critical');
    }
    
    if (gameState.alertsQueue >= 8) {
        alertsEl.classList.add('pulse-warning');
    } else {
        alertsEl.classList.remove('pulse-warning');
    }
    
    // Actualizar capacidad del equipo
    const teamCapacity = document.getElementById('team-capacity');
    if (teamCapacity) teamCapacity.textContent = gameState.teamCapacity;
    
    // Notify save system of state update (for auto-save)
    if (gameState && gameState.turn) {
        window.dispatchEvent(new CustomEvent('gameStateUpdate', {
            detail: gameState
        }));
    }
}

// NUEVO: Actualizar barras de progreso
function updateProgressBars() {
    if (!gameState) return;
    
    // Budget bar (% del presupuesto inicial: 250000)
    const initialBudget = 250000;
    const budgetPercent = Math.max(0, Math.min(100, (gameState.budget / initialBudget) * 100));
    const budgetBar = document.getElementById('budget-bar');
    if (budgetBar) {
        budgetBar.style.width = `${budgetPercent}%`;
        budgetBar.className = 'progress-bar';
        if (budgetPercent < 30) budgetBar.classList.add('critical');
        else if (budgetPercent < 60) budgetBar.classList.add('warning');
    }
    
    // Security Score bar (0-100)
    const securityBar = document.getElementById('security-bar');
    if (securityBar) {
        securityBar.style.width = `${gameState.securityScore}%`;
        securityBar.className = 'progress-bar';
        if (gameState.securityScore < 30) securityBar.classList.add('critical');
        else if (gameState.securityScore < 60) securityBar.classList.add('warning');
    }
    
    // Reputation bar (0-100)
    const reputationBar = document.getElementById('reputation-bar');
    if (reputationBar) {
        reputationBar.style.width = `${gameState.reputation}%`;
        reputationBar.className = 'progress-bar';
        if (gameState.reputation < 30) reputationBar.classList.add('critical');
        else if (gameState.reputation < 60) reputationBar.classList.add('warning');
    }
}

function addLogEntry(type, message) {
    const log = document.getElementById('event-log');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    
    // Mensaje compacto sin timestamp
    entry.innerHTML = `<span class="message">${message}</span>`;
    
    log.insertBefore(entry, log.firstChild);
    
    // Keep only last 30 entries (reducido para móviles)
    while (log.children.length > 30) {
        log.removeChild(log.lastChild);
    }
}

function clearEventLog() {
    const log = document.getElementById('event-log');
    log.innerHTML = '<div class="log-entry info"><span class="message">🛡️ Sistema listo</span></div>';
}

async function showActions(category) {
    if (!sessionId) {
        addLogEntry('critical', '❌ No active session');
        return;
    }
    
    const categoryNames = {
        investigate: '🔍 Investigation Actions',
        respond: '🚨 Response Actions',
        upgrade: '⬆️ Upgrade Tools',
        team: '👥 Team Management',
        proactive: '🎯 Proactive Actions'
    };
    
    addLogEntry('info', `Opening ${categoryNames[category]}...`);
    currentCategory = category;
    console.log(`📋 Fetching decisions for category: ${category}`);
    
    try {
        const response = await apiCall(`/api/game/${sessionId}/decisions?category=${category}`);
        console.log('✅ Decisions received:', response);
        currentDecisions = response.decisions;
        
        // Show modal with decisions
        showDecisionModal(categoryNames[category], currentDecisions);
        
    } catch (error) {
        addLogEntry('critical', `❌ Failed to load decisions: ${error.message}`);
    }
}

function showDecisionModal(title, decisions) {
    // Create modal overlay
    const existingModal = document.getElementById('decision-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'decision-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="modal-close" id="modal-close-btn">✕</button>
            </div>
            <div class="modal-body" id="modal-decisions">
                ${decisions.map((d, i) => `
                    <div class="decision-card ${!d.canExecute ? 'disabled' : ''}" 
                         data-decision-id="${d.id}" data-can-execute="${d.canExecute}">
                        <div class="decision-header">
                            <span class="decision-status">${d.canExecute ? '✅' : '❌'}</span>
                            <h3>${d.name}</h3>
                            <span class="decision-cost">💰 $${d.cost.toLocaleString()}</span>
                        </div>
                        <p class="decision-description">${d.description}</p>
                        ${!d.canExecute ? `<p class="decision-error">⚠️ ${d.reason}</p>` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    document.getElementById('modal-close-btn').addEventListener('click', closeDecisionModal);
    
    // Click on background to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeDecisionModal();
        }
    });
    
    // Add click listeners to decision cards
    const cards = modal.querySelectorAll('.decision-card');
    cards.forEach(card => {
        if (card.dataset.canExecute === 'true') {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                const decisionId = card.dataset.decisionId;
                executeDecisionById(decisionId);
            });
        }
    });
}

function closeDecisionModal() {
    const modal = document.getElementById('decision-modal');
    if (modal) {
        modal.remove();
    }
}

async function executeDecisionById(decisionId) {
    if (!sessionId) return;
    
    // Close old modal if it exists
    const oldModal = document.getElementById('decision-modal');
    if (oldModal) {
        closeDecisionModal();
    }
    
    addLogEntry('info', '⚙️ Ejecutando decisión...');
    console.log(`⚙️ Executing decision: ${decisionId}`);
    
    try {
        const response = await apiCall(`/api/game/${sessionId}/execute`, 'POST', { decisionId });
        console.log('✅ Decision executed:', response);
        
        // NUEVO: Rastrear gasto (buscar el costo de la decisión ejecutada)
        const executedDecision = currentDecisions.find(d => d.id === decisionId);
        if (executedDecision && executedDecision.cost > 0) {
            totalSpent += executedDecision.cost;
        }
        
        // Track decision in stats dashboard
        if (window.statsDashboard && executedDecision) {
            statsDashboard.logDecision(executedDecision, gameState.turn);
        }
        
        // Update state
        gameState = response.state;
        updateDashboard();
        
        // Track metrics update
        if (window.statsDashboard) {
            statsDashboard.updateMetrics(gameState);
        }
        
        // Show messages
        if (response.processedAlerts > 0) {
            addLogEntry('info', `⚙️ Tu equipo procesó ${response.processedAlerts} alertas`);
        }
        
        addLogEntry('success', response.message);
        
        // NUEVO: Mostrar ingresos recibidos
        if (response.income > 0) {
            addLogEntry('success', response.incomeMessage);
        }
        
        // Show event if any
        if (response.event) {
            const severityMap = {
                'positive': 'success',
                'low': 'info',
                'medium': 'warning',
                'high': 'warning',
                'critical': 'critical'
            };
            
            const severity = severityMap[response.event.severity] || 'info';
            addLogEntry(severity, `🎲 ${response.event.name}`);
            addLogEntry(severity, `   ${response.event.description}`);
            addLogEntry('info', `   MITRE: ${response.event.mitre.tactic} - ${response.event.mitre.technique}`);
            
            // Track event in stats dashboard
            if (window.statsDashboard) {
                statsDashboard.logEvent(response.event, gameState.turn);
            }
        }
        
        // NUEVO: Recargar decisiones en la pestaña activa
        if (currentCategory) {
            loadTabDecisions(currentCategory);
        }
        
        // Check game over
        if (response.gameOver) {
            setTimeout(() => showGameOver(response.gameOverReasons), 1000);
            return;
        }
        
        // Check victory
        if (response.victory) {
            setTimeout(() => showVictory(), 1000);
            return;
        }
        
    } catch (error) {
        addLogEntry('critical', `❌ Error al ejecutar decisión: ${error.message}`);
    }
}

function showGameOver(reasons) {
    // Show stats dashboard first
    if (window.statsDashboard) {
        statsDashboard.endGame(gameState, false); // false = not victory
    }
    
    switchScreen('game-screen', 'gameover-screen');
    
    const message = document.getElementById('gameover-message');
    message.innerHTML = `
        <p>Your infrastructure has been compromised.</p>
        <p>The board has decided to replace you.</p>
        <div class="failure-reasons">
            ${reasons.map(r => `<p>❌ ${r}</p>`).join('')}
        </div>
    `;
    
    const stats = document.getElementById('final-stats');
    stats.innerHTML = `
        <div>Turns Survived: <strong>${gameState.turn - 1}</strong></div>
        <div>Final Security Score: <strong>${gameState.securityScore}/100</strong></div>
        <div>Incidents Resolved: <strong>${gameState.incidentsResolved}</strong></div>
        <div>Attacks Blocked: <strong>${gameState.attacksBlocked}</strong></div>
        <div>Successful Breaches: <strong>${gameState.successfulBreaches}</strong></div>
        <div>Final Budget: <strong>$${gameState.budget.toLocaleString()}</strong></div>
    `;
}

function showVictory() {
    // Show stats dashboard first
    if (window.statsDashboard) {
        statsDashboard.endGame(gameState, true); // true = victory
    }
    
    switchScreen('game-screen', 'victory-screen');
    
    const message = document.getElementById('victory-message');
    
    let level = 'Good';
    if (gameState.securityScore > 70 && gameState.successfulBreaches === 0) {
        level = 'Excellent';
        message.innerHTML = `
            <p>🏆 You successfully defended your infrastructure!</p>
            <p>Zero breaches! You are an elite SOC manager.</p>
        `;
    } else if (gameState.securityScore > 50) {
        message.innerHTML = `
            <p>✅ You defended your infrastructure!</p>
            <p>You maintained security despite challenges.</p>
        `;
    } else {
        level = 'Survived';
        message.innerHTML = `
            <p>😐 You survived...</p>
            <p>Your SOC needs improvement, but you made it.</p>
        `;
    }
    
    const stats = document.getElementById('victory-stats');
    stats.innerHTML = `
        <div>Performance: <strong>${level}</strong></div>
        <div>Final Security Score: <strong>${gameState.securityScore}/100</strong></div>
        <div>Incidents Resolved: <strong>${gameState.incidentsResolved}</strong></div>
        <div>Attacks Blocked: <strong>${gameState.attacksBlocked}</strong></div>
        <div>Successful Breaches: <strong>${gameState.successfulBreaches}</strong></div>
        <div>MTTD: <strong>${gameState.mttd} min</strong></div>
        <div>MTTR: <strong>${gameState.mttr} min</strong></div>
        <div>Final Budget: <strong>$${gameState.budget.toLocaleString()}</strong></div>
        <div>Reputation: <strong>${gameState.reputation}/100</strong></div>
    `;
}

// ============================================
// AI SUGGESTION SYSTEM - MODO FÁCIL
// ============================================

function updateSuggestion() {
    if (!gameState) return;
    
    const panel = document.getElementById('suggestion-panel');
    const text = document.getElementById('suggestion-text');
    
    if (!panel || !text) return;
    
    let suggestion = '';
    let isUrgent = false;
    
    // CRITICAL: Game Over inminent
    if (gameState.alertsQueue > 80) {
        suggestion = '🚨 <strong>¡CRÍTICO!</strong> Tienes demasiadas alertas. Contrata más analistas URGENTE en TEAM → Hire L2 Analyst';
        isUrgent = true;
    }
    else if (gameState.securityScore < 30) {
        suggestion = '⚠️ <strong>ALERTA:</strong> Security Score muy bajo. Usa PROACTIVE → Vulnerability Assessment para mejorar';
        isUrgent = true;
    }
    else if (gameState.activeThreats >= 3) {
        suggestion = '🚨 <strong>¡AMENAZAS ACTIVAS!</strong> Usa RESPOND → Block Malicious IPs o Isolate Infected Endpoints';
        isUrgent = true;
    }
    // High priority
    else if (gameState.alertsQueue > 40) {
        suggestion = '📊 Tienes muchas alertas ('+gameState.alertsQueue+'). Considera contratar más analistas en TEAM o usar INVESTIGATE → Analyze SIEM Logs';
    }
    else if (gameState.budget < 50000) {
        suggestion = '💰 Presupuesto bajo. Evita compras caras. Prioriza acciones baratas como Update IOC Database ($2k)';
    }
    else if (gameState.securityScore < 50) {
        suggestion = '🛡️ Security Score bajo. Usa PROACTIVE → Vulnerability Assessment ($3k) o Red Team Exercise ($8k)';
    }
    else if (gameState.serversInfected > 0) {
        suggestion = '💻 Tienes '+gameState.serversInfected+' servidor(es) infectado(s). Usa RESPOND → Restore from Backup ($4k)';
    }
    // Recommendations
    else if (!gameState.tools.XDR && gameState.budget > 20000) {
        suggestion = '🚀 Recomendación: Compra XDR ($15k) en UPGRADE para mejorar detección y respuesta';
    }
    else if (!gameState.tools.IPS && gameState.budget > 15000) {
        suggestion = '🛡️ Recomendación: Activa IPS ($10k) en UPGRADE para bloquear ataques automáticamente';
    }
    else if (gameState.alertsQueue > 20) {
        suggestion = '🔍 Tienes ' + gameState.alertsQueue + ' alertas. Usa INVESTIGATE → Analyze SIEM Logs ($2k) para procesarlas';
    }
    else if (gameState.turn % 5 === 0 && gameState.budget > 10000) {
        suggestion = '📚 Cada 5 turnos considera PROACTIVE → Security Training ($6k) para mejorar a tu equipo';
    }
    // Good status
    else {
        const suggestions = [
            '✅ Todo bien. Considera acciones preventivas en PROACTIVE',
            '👍 Situación estable. Hora de invertir en UPGRADE para mejorar defensas',
            '💡 Buen momento para TEAM → Security Training ($6k) para mejorar capacidades',
            '🎯 Si quieres ser proactivo, usa PROACTIVE → Threat Hunting Campaign ($4k)'
        ];
        suggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    }
    
    text.innerHTML = suggestion;
    
    // Apply urgent class if needed
    if (isUrgent) {
        panel.classList.add('suggestion-urgent');
    } else {
        panel.classList.remove('suggestion-urgent');
    }
}

// ============================================
// TAB SYSTEM
// ============================================

function initTabSystem() {
    console.log('🔹 initTabSystem() called');
    try {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');
        
        console.log(`  Found ${tabButtons.length} tab buttons`);
        console.log(`  Found ${tabPanels.length} tab panels`);
        
        if (tabButtons.length === 0) {
            console.warn('⚠️ No tab buttons found!');
            return;
        }
        
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                console.log(`  Tab clicked: ${tabName}`);
                switchTab(tabName);
            });
        });
        
        console.log('✅ Tab system initialized');
        
        // Load decisions for the initial active tab (only if game started)
        if (sessionId) {
            console.log('  Session exists, loading initial tab');
            loadTabDecisions('investigate');
        }
    } catch (error) {
        console.error('❌ Error in initTabSystem:', error);
    }
}

function switchTab(tabName) {
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update active panel
    document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    document.getElementById(`tab-${tabName}`).classList.add('active');
    
    // Log tab change
    const categoryNames = {
        investigate: '🔍 INVESTIGATE',
        respond: '🚨 RESPOND',
        upgrade: '🔧 UPGRADE',
        team: '👥 TEAM',
        proactive: '🎯 PROACTIVE'
    };
    addLogEntry('info', `Cambiando a categoría: ${categoryNames[tabName]}`);
    
    // Load decisions for this tab
    loadTabDecisions(tabName);
}

async function loadTabDecisions(category) {
    if (!sessionId) {
        console.log('⚠️ No session ID, cannot load decisions');
        return;
    }
    
    currentCategory = category;
    console.log(`📋 Loading decisions for tab: ${category}`);
    
    const container = document.getElementById(`decisions-${category}`);
    container.innerHTML = '<p class="loading-text">⏳ Cargando opciones...</p>';
    
    try {
        const response = await apiCall(`/api/game/${sessionId}/decisions?category=${category}`);
        console.log('✅ Decisions loaded:', response);
        currentDecisions = response.decisions;
        
        // Render decisions in tab
        renderDecisionsInTab(category, currentDecisions);
        
    } catch (error) {
        container.innerHTML = '<p class="error-text">❌ Error al cargar decisiones</p>';
        addLogEntry('critical', `❌ Failed to load decisions: ${error.message}`);
    }
}

function renderDecisionsInTab(category, decisions) {
    const container = document.getElementById(`decisions-${category}`);
    
    if (decisions.length === 0) {
        container.innerHTML = '<p class="empty-text">No hay acciones disponibles en esta categoría.</p>';
        return;
    }
    
    container.innerHTML = decisions.map(d => `
        <div class="decision-card ${!d.canExecute ? 'disabled' : ''}" 
             data-decision-id="${d.id}" 
             data-can-execute="${d.canExecute}">
            <div class="decision-header">
                <h5 class="decision-title">${d.name}</h5>
                <span class="decision-cost">💰 $${d.cost.toLocaleString()}</span>
            </div>
            <p class="decision-description">${d.description}</p>
            ${!d.canExecute ? `<p style="color: #ff4136; font-size: 0.85em; margin-top: 8px;">\⚠️ ${d.reason}</p>` : ''}
        </div>
    `).join('');
    
    // Add click listeners
    const cards = container.querySelectorAll('.decision-card');
    cards.forEach(card => {
        if (card.dataset.canExecute === 'true') {
            card.addEventListener('click', () => {
                const decisionId = card.dataset.decisionId;
                executeDecisionById(decisionId);
            });
        }
    });
}

// ============================================
// HELP MODAL SYSTEM
// ============================================

function initHelpSystem() {
    console.log('🔹 initHelpSystem() called');
    try {
        const helpButtons = document.querySelectorAll('.help-btn');
        const modal = document.getElementById('help-modal');
        const closeBtn = document.getElementById('help-modal-close');
        
        console.log(`  Found ${helpButtons.length} help buttons`);
        console.log(`  Modal found: ${modal ? 'yes' : 'no'}`);
        console.log(`  Close button found: ${closeBtn ? 'yes' : 'no'}`);
        
        if (!modal) {
            console.warn('⚠️ Help modal not found!');
            return;
        }
        
        if (!closeBtn) {
            console.warn('⚠️ Help modal close button not found!');
            return;
        }
        
        helpButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const helpTopic = btn.dataset.help;
                console.log(`  Help button clicked: ${helpTopic}`);
                showHelpModal(helpTopic);
            });
        });
        
        closeBtn.addEventListener('click', closeHelpModal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeHelpModal();
            }
        });
        
        // Close with ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeHelpModal();
            }
        });
        
        console.log('✅ Help system initialized');
    } catch (error) {
        console.error('❌ Error in initHelpSystem:', error);
    }
}

function showHelpModal(topic) {
    const modal = document.getElementById('help-modal');
    const title = document.getElementById('help-modal-title');
    const body = document.getElementById('help-modal-body');
    
    const helpContent = {
        investigate: {
            title: '🔍 Guía: Investigar Alertas',
            content: `
                <h4>¿Qué hace esta categoría?</h4>
                <p>Las acciones de <strong>INVESTIGATE</strong> te permiten analizar alertas de seguridad y buscar amenazas ocultas en tu infraestructura.</p>
                
                <h4>¿Cuándo usarlo?</h4>
                <ul>
                    <li>Cuando tengas <strong>más de 20 alertas</strong> acumuladas</li>
                    <li>Para reducir el tiempo de detección (MTTD)</li>
                    <li>Antes de que las alertas se conviertan en incidentes graves</li>
                </ul>
                
                <h4>Acciones recomendadas:</h4>
                <ul>
                    <li><strong>Analyze SIEM Logs ($2k):</strong> Procesa 10 alertas rápidamente</li>
                    <li><strong>Forensic Analysis ($3k):</strong> Investigación profunda de incidentes</li>
                    <li><strong>Threat Intel ($1k):</strong> Actualiza base de datos de amenazas</li>
                </ul>
                
                <h4>💡 Consejo:</h4>
                <p>Si tienes muchas alertas, combina esta acción con contratar más analistas en TEAM.</p>
            `
        },
        respond: {
            title: '🚨 Guía: Responder a Incidentes',
            content: `
                <h4>¿Qué hace esta categoría?</h4>
                <p><strong>RESPOND</strong> contiene acciones de respuesta rápida para contener y remediar amenazas activas.</p>
                
                <h4>¿Cuándo usarlo?</h4>
                <ul>
                    <li>Cuando tengas <strong>amenazas activas</strong> (Active Threats > 0)</li>
                    <li>Si hay servidores infectados</li>
                    <li>Durante ataques en curso (eventos críticos en el log)</li>
                </ul>
                
                <h4>Acciones recomendadas:</h4>
                <ul>
                    <li><strong>Block IPs ($500):</strong> Bloquea IPs maliciosas identificadas</li>
                    <li><strong>Isolate Endpoints ($1k):</strong> Aisla dispositivos comprometidos</li>
                    <li><strong>Restore Backup ($4k):</strong> Recupera servidores infectados</li>
                    <li><strong>Emergency Patching ($3k):</strong> Parchea vulnerabilidades críticas</li>
                </ul>
                
                <h4>💡 Consejo:</h4>
                <p>La velocidad es crucial. Responde inmediatamente cuando veas eventos críticos.</p>
            `
        },
        upgrade: {
            title: '🔧 Guía: Mejorar Herramientas',
            content: `
                <h4>¿Qué hace esta categoría?</h4>
                <p><strong>UPGRADE</strong> te permite invertir en tecnología avanzada para fortalecer tus defensas.</p>
                
                <h4>¿Cuándo usarlo?</h4>
                <ul>
                    <li>Al inicio del juego para establecer defensas sólidas</li>
                    <li>Cuando tengas presupuesto disponible (+$50k)</li>
                    <li>Para prevenir tipos específicos de ataques</li>
                </ul>
                
                <h4>Herramientas disponibles:</h4>
                <ul>
                    <li><strong>XDR ($15k):</strong> Visibilidad total (endpoints + red + cloud)</li>
                    <li><strong>IPS ($10k):</strong> Bloquea intrusiones automáticamente</li>
                    <li><strong>WAF ($8k):</strong> Protege aplicaciones web</li>
                    <li><strong>DLP ($12k):</strong> Previene fuga de datos</li>
                    <li><strong>SIEM Upgrade ($5k):</strong> Mejora correlación de alertas</li>
                </ul>
                
                <h4>💡 Consejo:</h4>
                <p>Prioriza XDR e IPS primero para máxima protección. Las herramientas que compras son permanentes.</p>
            `
        },
        team: {
            title: '👥 Guía: Gestionar Equipo',
            content: `
                <h4>¿Qué hace esta categoría?</h4>
                <p><strong>TEAM</strong> te permite contratar y entrenar analistas para aumentar la capacidad del SOC.</p>
                
                <h4>¿Cuándo usarlo?</h4>
                <ul>
                    <li>Cuando las alertas superen tu <strong>capacidad de equipo</strong></li>
                    <li>Si tienes más de 30-40 alertas constantemente</li>
                    <li>Para mejorar MTTD y MTTR (tiempos de respuesta)</li>
                </ul>
                
                <h4>Tipos de analistas:</h4>
                <ul>
                    <li><strong>L1 Analyst ($5k):</strong> Procesa 1 alerta/turno - Bueno para empezar</li>
                    <li><strong>L2 Analyst ($8k):</strong> Procesa 2 alertas/turno - Mejor relación costo/beneficio</li>
                    <li><strong>Threat Hunter ($12k):</strong> Procesa 3 alertas/turno - Elite, pero caro</li>
                </ul>
                
                <h4>Entrenamiento:</h4>
                <ul>
                    <li><strong>Security Training ($6k):</strong> Mejora eficiencia del equipo completo</li>
                </ul>
                
                <h4>💡 Consejo:</h4>
                <p>Contrata L2 Analysts para mejor valor. Tu capacidad actual se muestra en el panel "SOC TEAM".</p>
            `
        },
        proactive: {
            title: '🎯 Guía: Acciones Preventivas',
            content: `
                <h4>¿Qué hace esta categoría?</h4>
                <p><strong>PROACTIVE</strong> incluye medidas preventivas para evitar futuros ataques antes de que ocurran.</p>
                
                <h4>¿Cuándo usarlo?</h4>
                <ul>
                    <li>Cuando la situación esté <strong>bajo control</strong> (pocas alertas/amenazas)</li>
                    <li>Para mejorar tu Security Score</li>
                    <li>Cada 5-10 turnos como mantenimiento preventivo</li>
                </ul>
                
                <h4>Acciones disponibles:</h4>
                <ul>
                    <li><strong>Threat Hunting ($4k):</strong> Busca amenazas ocultas proactivamente</li>
                    <li><strong>Red Team Exercise ($8k):</strong> Simula ataques para encontrar debilidades</li>
                    <li><strong>Vulnerability Assessment ($3k):</strong> Escanea y parchea vulnerabilidades</li>
                    <li><strong>Security Awareness ($4k):</strong> Reduce ataques de phishing/social engineering</li>
                    <li><strong>Update IOCs ($2k):</strong> Actualiza indicadores de compromiso</li>
                </ul>
                
                <h4>💡 Consejo:</h4>
                <p><strong>"Prevenir es mejor que curar"</strong> - Las acciones proactivas son tu mejor inversión a largo plazo.</p>
            `
        }
    };
    
    const content = helpContent[topic];
    title.textContent = content.title;
    body.innerHTML = content.content;
    
    modal.classList.add('active');
    
    addLogEntry('info', `📖 Ayuda abierta: ${content.title}`);
}

function closeHelpModal() {
    const modal = document.getElementById('help-modal');
    modal.classList.remove('active');
}

// ========================================
// SAVE SYSTEM INTEGRATION
// ========================================

/**
 * Listen for load game event from save system
 */
window.addEventListener('loadGame', (event) => {
    const savedState = event.detail;
    console.log('📂 Loading game from save:', savedState);
    
    // Restore game state
    gameState = savedState;
    sessionId = savedState.sessionId || `session-${Date.now()}`;
    
    // Restore UI
    switchScreen('start-screen', 'game-screen');
    updateDashboard();
    
    // Restore tab system
    if (window.initTabSystem) {
        initTabSystem();
        loadTabDecisions('investigate');
    }
    
    addLogEntry('success', '📂 Game loaded successfully!');
    addLogEntry('info', `Turn ${gameState.turn} - Continuing from save...`);
});

/**
 * Listen for resume game event (from quick save)
 */
window.addEventListener('resumeGame', (event) => {
    const savedState = event.detail;
    console.log('🎮 Resuming game from quick save:', savedState);
    
    // Restore game state
    gameState = savedState;
    sessionId = savedState.sessionId || `session-${Date.now()}`;
    
    // Restore UI
    switchScreen('start-screen', 'game-screen');
    updateDashboard();
    
    // Restore tab system
    if (window.initTabSystem) {
        initTabSystem();
        loadTabDecisions('investigate');
    }
    
    addLogEntry('success', '🎮 Game resumed!');
    addLogEntry('info', `Turn ${gameState.turn} - Welcome back!`);
});

/**
 * Listen for time travel restore event
 */
window.addEventListener('timeTravelRestore', (event) => {
    const restoredState = event.detail;
    console.log('⏰ Time traveling to turn:', restoredState.turn);
    
    // Restore game state
    gameState = restoredState;
    
    // Update UI
    updateDashboard();
    
    addLogEntry('warning', `⏰ Time traveled to Turn ${restoredState.turn}`);
    addLogEntry('info', 'State restored from history.');
});

/**
 * Expose gameState to global scope for save system
 */
Object.defineProperty(window, 'gameState', {
    get: () => gameState,
    set: (value) => { gameState = value; }
});

