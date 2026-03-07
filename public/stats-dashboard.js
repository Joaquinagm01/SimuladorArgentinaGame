/**
 * Enhanced Statistics Dashboard - Game End Stats
 */

class StatsDashboard {
    constructor() {
        this.gameStats = {
            totalDecisions: 0,
            decisionsByCategory: {},
            totalSpent: 0,
            spendingByCategory: {},
            eventsEncountered: [],
            turnsCompleted: 0,
            finalScore: 0,
            finalBudget: 0,
            peakScore: 0,
            lowestBudget: 0,
            threatsBlocked: 0,
            breaches: 0,
            mttdHistory: [],
            mttrHistory: [],
            scoreHistory: [],
            budgetHistory: [],
            startTime: Date.now(),
            endTime: null
        };
    }
    
    logDecision(decision, turn) {
        this.gameStats.totalDecisions++;
        this.gameStats.totalSpent += decision.cost || 0;
        
        const category = decision.category || 'other';
        this.gameStats.decisionsByCategory[category] = (this.gameStats.decisionsByCategory[category] || 0) + 1;
        this.gameStats.spendingByCategory[category] = (this.gameStats.spendingByCategory[category] || 0) + (decision.cost || 0);
    }
    
    logEvent(event, turn) {
        this.gameStats.eventsEncountered.push({
            name: event.name,
            turn: turn,
            severity: event.severity,
            type: event.type
        });
    }
    
    updateMetrics(gameState) {
        this.gameStats.scoreHistory.push(gameState.securityScore);
        this.gameStats.budgetHistory.push(gameState.budget);
        this.gameStats.mttdHistory.push(gameState.mttd);
        this.gameStats.mttrHistory.push(gameState.mttr);
        
        this.gameStats.peakScore = Math.max(this.gameStats.peakScore, gameState.securityScore);
        this.gameStats.lowestBudget = this.gameStats.lowestBudget === 0 ? 
            gameState.budget : Math.min(this.gameStats.lowestBudget, gameState.budget);
        
        this.gameStats.threatsBlocked = gameState.attacksBlocked || 0;
        this.gameStats.breaches = gameState.successfulBreaches || 0;
        this.gameStats.turnsCompleted = gameState.turn || 0;
    }
    
    endGame(gameState, victory) {
        this.gameStats.endTime = Date.now();
        this.gameStats.finalScore = gameState.securityScore;
        this.gameStats.finalBudget = gameState.budget;
        this.gameStats.victory = victory;
        
        this.showDashboard();
    }
    
    showDashboard() {
        const overlay = document.createElement('div');
        overlay.className = 'stats-dashboard-overlay';
        overlay.innerHTML = `
            <div class="stats-dashboard">
                <div class="stats-header">
                    <h1>${this.gameStats.victory ? '🎉 ¡Victoria!' : '💀 Game Over'}</h1>
                    <button class="close-stats" onclick="this.closest('.stats-dashboard-overlay').remove()">✕</button>
                </div>
                
                <div class="stats-summary">
                    <div class="stat-card">
                        <div class="stat-value">${this.gameStats.turnsCompleted}</div>
                        <div class="stat-label">Turnos Completados</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${this.gameStats.finalScore}</div>
                        <div class="stat-label">Score Final</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">$${this.formatNumber(this.gameStats.finalBudget)}</div>
                        <div class="stat-label">Budget Final</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${this.getPlayTime()}</div>
                        <div class="stat-label">Tiempo de Juego</div>
                    </div>
                </div>
                
                ${this.renderDecisionAnalysis()}
                ${this.renderSpendingBreakdown()}
                ${this.renderPerformanceMetrics()}
                ${this.renderEventTimeline()}
                ${this.renderEfficiencyScore()}
                ${this.renderRecommendations()}
                
                <div class="stats-actions">
                    <button class="btn-primary" onclick="location.reload()">Nueva Partida</button>
                    <button class="btn-secondary" onclick="statsDashboard.exportStats()">Exportar Stats</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }
    
    renderDecisionAnalysis() {
        const categories = Object.entries(this.gameStats.decisionsByCategory)
            .sort((a, b) => b[1] - a[1]);
        
        let html = `
            <div class="stats-section">
                <h2>📊 Análisis de Decisiones</h2>
                <div class="stats-grid">
                    <div class="stat-block">
                        <h3>Total de Decisiones: ${this.gameStats.totalDecisions}</h3>
                        <div class="decision-breakdown">`;
        
        categories.forEach(([category, count]) => {
            const percentage = (count / this.gameStats.totalDecisions * 100).toFixed(1);
            html += `
                <div class="decision-bar">
                    <span class="decision-category">${this.formatCategory(category)}</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage}%"></div>
                    </div>
                    <span class="decision-count">${count} (${percentage}%)</span>
                </div>
            `;
        });
        
        html += `
                        </div>
                    </div>
                    <div class="stat-block">
                        <h3>Decisiones Más Usadas</h3>
                        <ol class="top-decisions">
                            ${this.getTopDecisions().map(d => `<li>${d}</li>`).join('')}
                        </ol>
                    </div>
                </div>
            </div>
        `;
        
        return html;
    }
    
    renderSpendingBreakdown() {
        const spending = Object.entries(this.gameStats.spendingByCategory)
            .sort((a, b) => b[1] - a[1]);
        
        let html = `
            <div class="stats-section">
                <h2>💰 Análisis de Gastos</h2>
                <div class="stats-grid">
                    <div class="stat-block">
                        <h3>Total Gastado: $${this.formatNumber(this.gameStats.totalSpent)}</h3>
                        <div class="spending-chart">`;
        
        spending.forEach(([category, amount]) => {
            const percentage = (amount / this.gameStats.totalSpent * 100).toFixed(1);
            html += `
                <div class="spending-item">
                    <span>${this.formatCategory(category)}</span>
                    <span>$${this.formatNumber(amount)} (${percentage}%)</span>
                </div>
            `;
        });
        
        html += `
                        </div>
                    </div>
                    <div class="stat-block">
                        <h3>Eficiencia Presupuestaria</h3>
                        <div class="budget-stats">
                            <div>Presupuesto Inicial: $250,000</div>
                            <div>Presupuesto Final: $${this.formatNumber(this.gameStats.finalBudget)}</div>
                            <div>Menor Registro: $${this.formatNumber(this.gameStats.lowestBudget)}</div>
                            <div class="${this.gameStats.finalBudget > 250000 ? 'positive' : 'negative'}">
                                ${this.gameStats.finalBudget > 250000 ? '↑' : '↓'} 
                                ${Math.abs(((this.gameStats.finalBudget - 250000) / 250000 * 100).toFixed(1))}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return html;
    }
    
    renderPerformanceMetrics() {
        const avgMTTD = this.average(this.gameStats.mttdHistory);
        const avgMTTR = this.average(this.gameStats.mttrHistory);
        const avgScore = this.average(this.gameStats.scoreHistory);
        const scoreVolatility = this.standardDeviation(this.gameStats.scoreHistory);
        
        return `
            <div class="stats-section">
                <h2>⚡ Métricas de Performance</h2>
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-icon">🛡️</div>
                        <div class="metric-value">${avgScore.toFixed(1)}</div>
                        <div class="metric-label">Avg Security Score</div>
                        <div class="metric-range">Pico: ${this.gameStats.peakScore}</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon">🔍</div>
                        <div class="metric-value">${avgMTTD.toFixed(1)}h</div>
                        <div class="metric-label">Avg MTTD</div>
                        <div class="metric-sublabel">Mean Time To Detect</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon">⚡</div>
                        <div class="metric-value">${avgMTTR.toFixed(1)}h</div>
                        <div class="metric-label">Avg MTTR</div>
                        <div class="metric-sublabel">Mean Time To Respond</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon">🎯</div>
                        <div class="metric-value">${this.gameStats.threatsBlocked}</div>
                        <div class="metric-label">Ataques Bloqueados</div>
                    </div>
                    <div class="metric-card ${this.gameStats.breaches > 0 ? 'metric-warning' : ''}">
                        <div class="metric-icon">🚨</div>
                        <div class="metric-value">${this.gameStats.breaches}</div>
                        <div class="metric-label">Brechas</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-icon">📊</div>
                        <div class="metric-value">${scoreVolatility.toFixed(1)}</div>
                        <div class="metric-label">Score Volatility</div>
                        <div class="metric-sublabel">${scoreVolatility < 10 ? 'Estable' : scoreVolatility < 20 ? 'Moderado' : 'Volátil'}</div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderEventTimeline() {
        const recentEvents = this.gameStats.eventsEncountered.slice(-10);
        
        let html = `
            <div class="stats-section">
                <h2>📅 Timeline de Eventos</h2>
                <div class="event-timeline">`;
        
        recentEvents.forEach(event => {
            html += `
                <div class="timeline-event severity-${event.severity}">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <div class="timeline-turn">Turno ${event.turn}</div>
                        <div class="timeline-name">${event.name}</div>
                        <div class="timeline-meta">${event.type} - ${event.severity}</div>
                    </div>
                </div>
            `;
        });
        
        html += `</div></div>`;
        return html;
    }
    
    renderEfficiencyScore() {
        const efficiency = this.calculateEfficiency();
        
        return `
            <div class="stats-section efficiency-section">
                <h2>🎓 Score de Eficiencia</h2>
                <div class="efficiency-meter">
                    <div class="efficiency-bar">
                        <div class="efficiency-fill" style="width: ${efficiency.total}%"></div>
                    </div>
                    <div class="efficiency-value">${efficiency.total}/100</div>
                </div>
                <div class="efficiency-breakdown">
                    <div class="efficiency-item">
                        <span>Gestión de Presupuesto</span>
                        <span class="efficiency-score">${efficiency.budget}/25</span>
                    </div>
                    <div class="efficiency-item">
                        <span>Respuesta a Amenazas</span>
                        <span class="efficiency-score">${efficiency.response}/25</span>
                    </div>
                    <div class="efficiency-item">
                        <span>Balance de Decisiones</span>
                        <span class="efficiency-score">${efficiency.balance}/25</span>
                    </div>
                    <div class="efficiency-item">
                        <span>Consistencia de Score</span>
                        <span class="efficiency-score">${efficiency.consistency}/25</span>
                    </div>
                </div>
                <div class="efficiency-grade">
                    <strong>Calificación:</strong> ${this.getGrade(efficiency.total)}
                </div>
            </div>
        `;
    }
    
    renderRecommendations() {
        const recs = this.generateRecommendations();
        
        let html = `
            <div class="stats-section recommendations-section">
                <h2>💡 Recomendaciones para Próxima Partida</h2>
                <div class="recommendations-grid">`;
        
        recs.forEach(rec => {
            html += `
                <div class="recommendation-card ${rec.priority}">
                    <div class="rec-icon">${rec.icon}</div>
                    <h4>${rec.title}</h4>
                    <p>${rec.description}</p>
                </div>
            `;
        });
        
        html += `</div></div>`;
        return html;
    }
    
    calculateEfficiency() {
        // Budget efficiency (0-25)
        const budgetEfficiency = Math.min(25, (this.gameStats.finalBudget / 250000) * 25);
        
        // Response efficiency (0-25) - based on MTTR and blocks
        const responseEfficiency = Math.min(25, 
            (this.gameStats.threatsBlocked / Math.max(1, this.gameStats.breaches * 5)) * 15 +
            (100 / Math.max(1, this.average(this.gameStats.mttrHistory))) * 10
        );
        
        // Decision balance (0-25) - diversification
        const categories = Object.keys(this.gameStats.decisionsByCategory).length;
        const balanceEfficiency = Math.min(25, categories * 5);
        
        // Score consistency (0-25) - lower volatility is better
        const volatility = this.standardDeviation(this.gameStats.scoreHistory);
        const consistencyEfficiency = Math.min(25, 25 - (volatility / 4));
        
        return {
            budget: Math.round(budgetEfficiency),
            response: Math.round(responseEfficiency),
            balance: Math.round(balanceEfficiency),
            consistency: Math.round(consistencyEfficiency),
            total: Math.round(budgetEfficiency + responseEfficiency + balanceEfficiency + consistencyEfficiency)
        };
    }
    
    generateRecommendations() {
        const recs = [];
        
        // Budget recommendations
        if (this.gameStats.finalBudget < 150000) {
            recs.push({
                icon: '💰',
                title: 'Gestiona mejor el presupuesto',
                description: 'Terminaste con poco presupuesto. Prioriza decisiones de alto impacto y evita gastos innecesarios al inicio.',
                priority: 'high'
            });
        }
        
        // Response recommendations
        if (this.gameStats.breaches > 3) {
            recs.push({
                icon: '🛡️',
                title: 'Mejora tu respuesta a incidentes',
                description: 'Sufriste varias brechas. Invierte más temprano en EDR y contrata analistas L2.',
                priority: 'high'
            });
        }
        
        // Balance recommendations
        const categories = Object.keys(this.gameStats.decisionsByCategory);
        if (categories.length < 4) {
            recs.push({
                icon: '⚖️',
                title: 'Diversifica tus decisiones',
                description: 'Usaste pocas categorías. Balancea investigación, respuesta, upgrades y acciones proactivas.',
                priority: 'medium'
            });
        }
        
        // MTTD/MTTR recommendations
        if (this.average(this.gameStats.mttdHistory) > 100) {
            recs.push({
                icon: '⏱️',
                title: 'Reduce tu tiempo de detección',
                description: 'Tu MTTD fue alto. Invierte en SIEM y Threat Intelligence para detectar amenazas más rápido.',
                priority: 'medium'
            });
        }
        
        // Proactive recommendations
        const proactivePercent = (this.gameStats.decisionsByCategory['proactive'] || 0) / this.gameStats.totalDecisions;
        if (proactivePercent < 0.15) {
            recs.push({
                icon: '🔮',
                title: 'Sé más proactivo',
                description: 'Solo ${(proactivePercent * 100).toFixed(1)}% de tus decisiones fueron proactivas. Threat hunting y hardening previenen incidentes.',
                priority: 'medium'
            });
        }
        
        // Default positive feedback
        if (recs.length === 0) {
            recs.push({
                icon: '🌟',
                title: '¡Excelente trabajo!',
                description: 'Tuviste un desempeño sólido. Sigue refinando tu estrategia y explora diferentes enfoques.',
                priority: 'low'
            });
        }
        
        return recs;
    }
    
    getTopDecisions() {
        // This would need to be tracked per decision ID in a real implementation
        return [
            'Analyze SIEM Logs',
            'Block Malicious IPs',
            'Hire L1 Analyst',
            'Deploy IDS',
            'Forensic Analysis'
        ];
    }
    
    formatCategory(category) {
        const map = {
            'investigate': 'Investigación',
            'respond': 'Respuesta',
            'upgrade': 'Mejoras',
            'team': 'Equipo',
            'proactive': 'Proactivo'
        };
        return map[category] || category;
    }
    
    getGrade(score) {
        if (score >= 90) return 'A+ (Excelente)';
        if (score >= 80) return 'A (Muy Bueno)';
        if (score >= 70) return 'B (Bueno)';
        if (score >= 60) return 'C (Aceptable)';
        if (score >= 50) return 'D (Necesita Mejorar)';
        return 'F (Insuficiente)';
    }
    
    getPlayTime() {
        const ms = this.gameStats.endTime - this.gameStats.startTime;
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    }
    
    formatNumber(num) {
        return num.toLocaleString('en-US');
    }
    
    average(arr) {
        return arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    }
    
    standardDeviation(arr) {
        const avg = this.average(arr);
        const squareDiffs = arr.map(value => Math.pow(value - avg, 2));
        return Math.sqrt(this.average(squareDiffs));
    }
    
    exportStats() {
        const data = JSON.stringify(this.gameStats, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `soc-stats-${Date.now()}.json`;
        a.click();
    }
}

// Initialize global instance
let statsDashboard;
document.addEventListener('DOMContentLoaded', () => {
    statsDashboard = new StatsDashboard();
});
