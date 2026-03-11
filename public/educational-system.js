/**
 * Educational System - Tutorial, Tooltips, FAQ, Glossary
 */

class EducationalSystem {
    constructor() {
        this.glossary = [];
        this.faqs = [];
        this.caseStudies = [];
        this.bestPractices = [];
        this.tutorialSteps = [];
        this.currentTutorialStep = 0;
        this.tutorialActive = false;
        this.initialized = false;
        
        this.loadData();
    }
    
    async loadData() {
        try {
            // Load glossary
            const glossaryRes = await fetch('/data/glossary.json');
            const glossaryData = await glossaryRes.json();
            this.glossary = glossaryData.terms;
            
            // Load education data
            const eduRes = await fetch('/data/education.json');
            const eduData = await eduRes.json();
            this.faqs = eduData.faqs;
            this.caseStudies = eduData.caseStudies;
            this.bestPractices = eduData.bestPractices;
            
            // Load tutorial
            const tutorialRes = await fetch('/data/tutorial.json');
            const tutorialData = await tutorialRes.json();
            this.tutorialSteps = tutorialData.steps;
            
            this.initialized = true;
            this.initializeTooltips();
            // this.createEducationalUI(); // Disabled - user requested to remove help button
            this.checkFirstVisit();
            
        } catch (error) {
            console.error('Error loading educational data:', error);
        }
    }
    
    checkFirstVisit() {
        const hasVisited = localStorage.getItem('soc_has_visited');
        if (!hasVisited) {
            setTimeout(() => this.showTutorialPrompt(), 1000);
        }
    }
    
    showTutorialPrompt() {
        const overlay = document.createElement('div');
        overlay.className = 'tutorial-prompt-overlay';
        overlay.innerHTML = `
            <div class="tutorial-prompt">
                <h2>🎓 Bienvenido al Cyber Defense Simulator</h2>
                <p>¿Es tu primera vez? Te recomendamos hacer el tutorial interactivo de 5 minutos.</p>
                <div class="tutorial-prompt-buttons">
                    <button class="btn-primary" onclick="educationalSystem.startTutorial()">Iniciar Tutorial</button>
                    <button class="btn-secondary" onclick="educationalSystem.skipTutorial()">Saltar</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    
    startTutorial() {
        document.querySelector('.tutorial-prompt-overlay')?.remove();
        this.tutorialActive = true;
        this.currentTutorialStep = 0;
        this.showTutorialStep(0);
        localStorage.setItem('soc_has_visited', 'true');
    }
    
    skipTutorial() {
        document.querySelector('.tutorial-prompt-overlay')?.remove();
        localStorage.setItem('soc_has_visited', 'true');
    }
    
    showTutorialStep(stepIndex) {
        if (stepIndex >= this.tutorialSteps.length) {
            this.completeTutorial();
            return;
        }
        
        const step = this.tutorialSteps[stepIndex];
        this.currentTutorialStep = stepIndex;
        
        // Remove previous highlight
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });
        
        // Highlight target element
        if (step.highlight !== 'body') {
            const target = document.querySelector(step.highlight);
            if (target) {
                target.classList.add('tutorial-highlight');
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        // Show tutorial box
        this.showTutorialBox(step);
    }
    
    showTutorialBox(step) {
        let existingBox = document.querySelector('.tutorial-box');
        if (!existingBox) {
            existingBox = document.createElement('div');
            existingBox.className = 'tutorial-box';
            document.body.appendChild(existingBox);
        }
        
        const totalSteps = this.tutorialSteps.length;
        const progress = ((step.step) / totalSteps) * 100;
        
        existingBox.innerHTML = `
            <div class="tutorial-header">
                <span class="tutorial-step">Paso ${step.step}/${totalSteps}</span>
                <button class="tutorial-close" onclick="educationalSystem.closeTutorial()">✕</button>
            </div>
            <div class="tutorial-progress">
                <div class="tutorial-progress-bar" style="width: ${progress}%"></div>
            </div>
            <h3>${step.title}</h3>
            <p>${step.message}</p>
            ${step.tip ? `<div class="tutorial-tip">💡 <strong>Tip:</strong> ${step.tip}</div>` : ''}
            <div class="tutorial-buttons">
                ${step.step > 1 ? `<button class="btn-secondary" onclick="educationalSystem.previousStep()">Anterior</button>` : ''}
                <button class="btn-primary" onclick="educationalSystem.nextStep()">
                    ${step.step === totalSteps ? 'Finalizar' : 'Siguiente'}
                </button>
            </div>
        `;
        
        existingBox.style.display = 'block';
    }
    
    nextStep() {
        this.showTutorialStep(this.currentTutorialStep + 1);
    }
    
    previousStep() {
        if (this.currentTutorialStep > 0) {
            this.showTutorialStep(this.currentTutorialStep - 1);
        }
    }
    
    closeTutorial() {
        this.tutorialActive = false;
        document.querySelector('.tutorial-box')?.remove();
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });
    }
    
    completeTutorial() {
        this.tutorialActive = false;
        document.querySelector('.tutorial-box')?.remove();
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });
        
        // Show completion message
        this.showNotification('¡Tutorial completado! 🎉', 'success');
        localStorage.setItem('soc_tutorial_completed', 'true');
    }
    
    initializeTooltips() {
        // Add tooltip data attributes to elements
        const tooltipConfig = {
            '[data-metric="security-score"]': {
                title: 'Security Score',
                text: 'Postura general de seguridad (0-100). Afectado por amenazas, servidores infectados y efect ividad del equipo.'
            },
            '[data-metric="budget"]': {
                title: 'Presupuesto',
                text: 'Fondos disponibles para decisiones. Recibes $15,000/turno. Tu reputación afecta los ingresos.'
            },
            '[data-metric="reputation"]': {
                title: 'Reputación',
                text: 'Confianza del board (0-100). Incidentes graves reducen reputación. Alta reputación = más presupuesto.'
            }
        };
        
        Object.entries(tooltipConfig).forEach(([selector, config]) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.setAttribute('data-tooltip', config.text);
                el.setAttribute('data-tooltip-title', config.title);
            });
        });
        
        // Add tooltip event listeners
        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest('[data-tooltip]');
            if (target) {
                this.showTooltip(target, target.dataset.tooltip, target.dataset.tooltipTitle);
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            const target = e.target.closest('[data-tooltip]');
            if (target) {
                this.hideTooltip();
            }
        });
    }
    
    showTooltip(element, text, title) {
        let tooltip = document.querySelector('.custom-tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            document.body.appendChild(tooltip);
        }
        
        tooltip.innerHTML = title ? `<strong>${title}</strong><br>${text}` : text;
        tooltip.style.display = 'block';
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width/2) - (tooltip.offsetWidth/2) + 'px';
        tooltip.style.top = rect.bottom + 10 + 'px';
    }
    
    hideTooltip() {
        const tooltip = document.querySelector('.custom-tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
    }
    
    createEducationalUI() {
        // Disabled - user requested to remove help button
        /*
        const helpButton = document.createElement('button');
        helpButton.className = 'help-button';
        helpButton.innerHTML = '?';
        helpButton.title = 'Ayuda y Recursos';
        helpButton.onclick = () => this.toggleHelpPanel();
        document.body.appendChild(helpButton);
        */
    }
    
    toggleHelpPanel() {
        let panel = document.querySelector('.help-panel');
        if (panel) {
            panel.remove();
            return;
        }
        
        panel = document.createElement('div');
        panel.className = 'help-panel';
        panel.innerHTML = `
            <div class="help-panel-header">
                <h2>📚 Centro de Ayuda</h2>
                <button onclick="this.closest('.help-panel').remove()">✕</button>
            </div>
            <div class="help-panel-tabs">
                <button class="active" data-tab="faq">FAQ</button>
                <button data-tab="glossary">Glosario</button>
                <button data-tab="cases">Casos de Estudio</button>
                <button data-tab="practices">Best Practices</button>
                <button data-tab="links">Links Útiles</button>
            </div>
            <div class="help-panel-content">
                ${this.renderFAQ()}
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // Tab switching
        panel.querySelectorAll('[data-tab]').forEach(tab => {
            tab.addEventListener('click', (e) => {
                panel.querySelectorAll('[data-tab]').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                const content = panel.querySelector('.help-panel-content');
                const tabName = e.target.dataset.tab;
                
                switch(tabName) {
                    case 'faq':
                        content.innerHTML = this.renderFAQ();
                        break;
                    case 'glossary':
                        content.innerHTML = this.renderGlossary();
                        break;
                    case 'cases':
                        content.innerHTML = this.renderCaseStudies();
                        break;
                    case 'practices':
                        content.innerHTML = this.renderBestPractices();
                        break;
                    case 'links':
                        content.innerHTML = this.renderUsefulLinks();
                        break;
                }
            });
        });
    }
    
    renderFAQ() {
        const categories = [...new Set(this.faqs.map(f => f.category))];
        
        let html = '<div class="faq-section"><h3>❓ Preguntas Frecuentes</h3>';
        
        categories.forEach(category => {
            html += `<h4>${category}</h4><div class="faq-list">`;
            const categoryFAQs = this.faqs.filter(f => f.category === category);
            
            categoryFAQs.forEach((faq, idx) => {
                html += `
                    <details class="faq-item">
                        <summary>${faq.question}</summary>
                        <p>${faq.answer}</p>
                    </details>
                `;
            });
            
            html += '</div>';
        });
        
        html += '</div>';
        return html;
    }
    
    renderGlossary() {
        const categories = [...new Set(this.glossary.map(t => t.category))];
        
        let html = '<div class="glossary-section"><h3>📖 Glosario de Términos</h3>';
        html += '<input type="text" class="glossary-search" placeholder="Buscar término..." onkeyup="educationalSystem.filterGlossary(this.value)">';
        
        categories.forEach(category => {
            html += `<h4>${category}</h4><div class="glossary-list" data-category="${category}">`;
            const categoryTerms = this.glossary.filter(t => t.category === category);
            
            categoryTerms.forEach(term => {
                html += `
                    <div class="glossary-term" data-term="${term.term.toLowerCase()}">
                        <strong>${term.term}</strong>: ${term.definition}
                        <div class="glossary-example">Ejemplo: ${term.example}</div>
                    </div>
                `;
            });
            
            html += '</div>';
        });
        
        html += '</div>';
        return html;
    }
    
    filterGlossary(searchTerm) {
        const terms = document.querySelectorAll('.glossary-term');
        const lowerSearch = searchTerm.toLowerCase();
        
        terms.forEach(term => {
            const termText = term.dataset.term;
            if (termText.includes(lowerSearch)) {
                term.style.display = 'block';
            } else {
                term.style.display = 'none';
            }
        });
    }
    
    renderCaseStudies() {
        let html = '<div class="cases-section"><h3>🔍 Casos de Estudio Reales</h3>';
        
        this.caseStudies.forEach(study => {
            html += `
                <div class="case-study">
                    <h4>${study.title}</h4>
                    <p>${study.description}</p>
                    <div class="case-lessons"><strong>Lecciones aprendidas:</strong>
                        <ul>
                            ${study.lessons.map(l => `<li>${l}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="case-mitre"><strong>MITRE ATT&CK:</strong> ${study.mitreTechniques.join(', ')}</div>
                    <div class="case-impact">
                        <span><strong>Costo:</strong> ${study.cost}</span>
                        <span><strong>Impacto:</strong> ${study.impact}</span>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }
    
    renderBestPractices() {
        let html = '<div class="practices-section"><h3>✅ Mejores Prácticas SOC</h3><div class="practices-grid">';
        
        this.bestPractices.forEach(practice => {
            html += `
                <div class="practice-card">
                    <div class="practice-icon">${practice.icon}</div>
                    <h4>${practice.title}</h4>
                    <p>${practice.description}</p>
                </div>
            `;
        });
        
        html += '</div></div>';
        return html;
    }
    
    renderUsefulLinks() {
        const links = [
            { title: 'MITRE ATT&CK Navigator', url: 'https://mitre-attack.github.io/attack-navigator/', desc: 'Framework de tácticas y técnicas de adversarios' },
            { title: 'NIST Cybersecurity Framework', url: 'https://www.nist.gov/cyberframework', desc: 'Marco de referencia para gestión de riesgos' },
            { title: 'CIS Controls', url: 'https://www.cisecurity.org/controls', desc: 'Controles de seguridad prioritizados' },
            { title: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/', desc: 'Top 10 vulnerabilidades web' },
            { title: 'CVE - Common Vulnerabilities', url: 'https://cve.mitre.org/', desc: 'Base de datos de vulnerabilidades' },
            { title: 'SANS Reading Room', url: 'https://www.sans.org/white-papers/', desc: 'Papers y recursos de seguridad' },
            { title: 'Krebs on Security', url: 'https://krebsonsecurity.com/', desc: 'Blog de Brian Krebs sobre seguridad' },
            { title: 'r/netsec', url: 'https://reddit.com/r/netsec', desc: 'Comunidad de seguridad en Reddit' }
        ];
        
        let html = '<div class="links-section"><h3>🔗 Enlaces Útiles</h3><div class="links-grid">';
        
        links.forEach(link => {
            html += `
                <a href="${link.url}" target="_blank" class="link-card">
                    <h4>${link.title}</h4>
                    <p>${link.desc}</p>
                    <span class="link-arrow">→</span>
                </a>
            `;
        });
        
        html += '</div></div>';
        return html;
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('notification-show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('notification-show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize global instance
let educationalSystem;
document.addEventListener('DOMContentLoaded', () => {
    educationalSystem = new EducationalSystem();
});
