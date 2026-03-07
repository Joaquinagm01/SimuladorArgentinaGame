/**
 * Educational Content System - Frameworks, Quiz, Flashcards, Careers
 */

class EducationalContentSystem {
    constructor() {
        this.frameworks = null;
        this.quiz = null;
        this.flashcards = null;
        this.careers = null;
        this.currentQuiz = {
            questions: [],
            currentIndex: 0,
            score: 0,
            answered: 0
        };
        this.currentFlashcard = {
            deckId: null,
            cardIndex: 0,
            mastered: []
        };
    }
    
    async loadAllData() {
        try {
            const [frameworks, quiz, flashcards, careers] = await Promise.all([
                fetch('/data/frameworks.json').then(r => r.json()),
                fetch('/data/quiz.json').then(r => r.json()),
                fetch('/data/flashcards.json').then(r => r.json()),
                fetch('/data/careers.json').then(r => r.json())
            ]);
            
            this.frameworks = frameworks;
            this.quiz = quiz;
            this.flashcards = flashcards;
            this.careers = careers;
            
            console.log('✅ Educational content loaded');
        } catch (error) {
            console.error('❌ Error loading educational content:', error);
        }
    }
    
    // ==================== FRAMEWORKS ====================
    
    showFrameworksPanel() {
        const overlay = document.createElement('div');
        overlay.className = 'edu-overlay';
        overlay.innerHTML = `
            <div class="edu-panel frameworks-panel">
                <div class="edu-header">
                    <h2>📚 Security Frameworks & Resources</h2>
                    <button class="edu-close" onclick="this.closest('.edu-overlay').remove()">✕</button>
                </div>
                <div class="edu-tabs">
                    <button class="edu-tab active" data-tab="mitre">MITRE ATT&CK</button>
                    <button class="edu-tab" data-tab="cis">CIS Controls</button>
                    <button class="edu-tab" data-tab="nist">NIST CSF</button>
                    <button class="edu-tab" data-tab="iso">ISO 27001</button>
                    <button class="edu-tab" data-tab="killchain">Kill Chain</button>
                    <button class="edu-tab" data-tab="owasp">OWASP Top 10</button>
                    <button class="edu-tab" data-tab="certs">Certifications</button>
                </div>
                <div class="edu-content">
                    ${this.renderFrameworkTab('mitre')}
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        this.setupFrameworkTabs(overlay);
    }
    
    setupFrameworkTabs(overlay) {
        const tabs = overlay.querySelectorAll('.edu-tab');
        const content = overlay.querySelector('.edu-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const tabName = tab.dataset.tab;
                content.innerHTML = this.renderFrameworkTab(tabName);
            });
        });
    }
    
    renderFrameworkTab(tabName) {
        if (tabName === 'mitre') {
            return this.renderMITRE();
        } else if (tabName === 'cis') {
            return this.renderCIS();
        } else if (tabName === 'nist') {
            return this.renderNIST();
        } else if (tabName === 'iso') {
            return this.renderISO();
        } else if (tabName === 'killchain') {
            return this.renderKillChain();
        } else if (tabName === 'owasp') {
            return this.renderOWASP();
        } else if (tabName === 'certs') {
            return this.renderCertifications();
        }
    }
    
    renderMITRE() {
        const mitre = this.frameworks.frameworks.mitre;
        let html = `
            <div class="framework-info">
                <h3>${mitre.name}</h3>
                <p>${mitre.description}</p>
                <a href="${mitre.url}" target="_blank" class="framework-link">View Full Matrix →</a>
            </div>
            <h4>Common Techniques</h4>
            <div class="techniques-grid">
        `;
        
        Object.entries(mitre.techniques).forEach(([id, tech]) => {
            html += `
                <div class="technique-card">
                    <div class="technique-id">${id}</div>
                    <h5>${tech.name}</h5>
                    <div class="technique-tactic">${tech.tactic}</div>
                    <p>${tech.description}</p>
                </div>
            `;
        });
        
        html += `</div>`;
        return html;
    }
    
    renderCIS() {
        const cis = this.frameworks.frameworks.cis;
        let html = `
            <div class="framework-info">
                <h3>${cis.name}</h3>
                <p>${cis.description}</p>
                <a href="${cis.url}" target="_blank" class="framework-link">Learn More →</a>
            </div>
            <h4>Key Controls</h4>
            <div class="controls-list">
        `;
        
        Object.entries(cis.controls).forEach(([num, control]) => {
            html += `
                <div class="control-card">
                    <div class="control-num">Control ${num}</div>
                    <h5>${control.name}</h5>
                    <p>${control.description}</p>
                </div>
            `;
        });
        
        html += `</div>`;
        return html;
    }
    
    renderNIST() {
        const nist = this.frameworks.frameworks.nist;
        let html = `
            <div class="framework-info">
                <h3>${nist.name}</h3>
                <p>${nist.description}</p>
                <a href="${nist.url}" target="_blank" class="framework-link">Learn More →</a>
            </div>
            <h4>Five Functions</h4>
            <div class="functions-grid">
        `;
        
        Object.entries(nist.functions).forEach(([id, func]) => {
            html += `
                <div class="function-card">
                    <h5>${func.name}</h5>
                    <p>${func.description}</p>
                    <div class="categories">
                        ${func.categories.map(c => `<span class="category-tag">${c}</span>`).join('')}
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
        return html;
    }
    
    renderISO() {
        const iso = this.frameworks.frameworks.iso27001;
        let html = `
            <div class="framework-info">
                <h3>${iso.name}</h3>
                <p>${iso.description}</p>
                <a href="${iso.url}" target="_blank" class="framework-link">Learn More →</a>
            </div>
            <h4>Control Domains</h4>
            <div class="controls-list">
        `;
        
        Object.entries(iso.controls).forEach(([annex, name]) => {
            html += `
                <div class="iso-control">
                    <strong>${annex}:</strong> ${name}
                </div>
            `;
        });
        
        html += `</div>`;
        return html;
    }
    
    renderKillChain() {
        const killchain = this.frameworks.frameworks.killchain;
        let html = `
            <div class="framework-info">
                <h3>${killchain.name}</h3>
                <p>${killchain.description}</p>
                <a href="${killchain.url}" target="_blank" class="framework-link">Learn More →</a>
            </div>
            <div class="killchain-phases">
        `;
        
        killchain.phases.forEach((phase, index) => {
            html += `
                <div class="phase-card">
                    <div class="phase-number">${index + 1}</div>
                    <h5>${phase.phase}</h5>
                    <p>${phase.description}</p>
                    <div class="phase-example"><strong>Example:</strong> ${phase.example}</div>
                </div>
            `;
        });
        
        html += `</div>`;
        return html;
    }
    
    renderOWASP() {
        const owasp = this.frameworks.frameworks.owasp;
        let html = `
            <div class="framework-info">
                <h3>${owasp.name}</h3>
                <p>${owasp.description}</p>
                <a href="${owasp.url}" target="_blank" class="framework-link">Learn More →</a>
            </div>
            <div class="owasp-risks">
        `;
        
        owasp.risks.forEach(risk => {
            html += `
                <div class="risk-card">
                    <div class="risk-rank">${risk.rank}</div>
                    <h5>${risk.name}</h5>
                    <p>${risk.description}</p>
                    <div class="risk-example"><strong>Example:</strong> ${risk.example}</div>
                </div>
            `;
        });
        
        html += `</div>`;
        return html;
    }
    
    renderCertifications() {
        const certs = this.frameworks.certifications;
        let html = `
            <div class="framework-info">
                <h3>🎓 Industry Certifications</h3>
                <p>Professional certifications recognized in cybersecurity</p>
            </div>
            <div class="certs-grid">
        `;
        
        certs.forEach(cert => {
            html += `
                <div class="cert-card">
                    <h4>${cert.name}</h4>
                    <div class="cert-fullname">${cert.fullName}</div>
                    <div class="cert-meta">
                        <span class="cert-level">${cert.level}</span>
                        <span class="cert-cost">${cert.cost}</span>
                    </div>
                    <p>${cert.description}</p>
                    <div class="cert-details">
                        <div><strong>Provider:</strong> ${cert.provider}</div>
                        <div><strong>Experience:</strong> ${cert.experience}</div>
                    </div>
                    <a href="${cert.url}" target="_blank" class="cert-link">Learn More →</a>
                </div>
            `;
        });
        
        html += `</div>`;
        return html;
    }
    
    // ==================== QUIZ ====================
    
    startQuiz(category = 'all', difficulty = 'all') {
        let questions = this.quiz.questions.filter(q => {
            const categoryMatch = category === 'all' || q.category === category;
            const difficultyMatch = difficulty === 'all' || q.difficulty === difficulty;
            return categoryMatch && difficultyMatch;
        });
        
        // Shuffle questions
        questions = questions.sort(() => Math.random() - 0.5);
        
        this.currentQuiz = {
            questions: questions.slice(0, 10), // Max 10 questions
            currentIndex: 0,
            score: 0,
            answered: 0
        };
        
        this.showQuizInterface();
    }
    
    showQuizInterface() {
        const overlay = document.createElement('div');
        overlay.className = 'edu-overlay quiz-overlay';
        overlay.innerHTML = `
            <div class="edu-panel quiz-panel">
                <div class="edu-header">
                    <h2>🎯 Cybersecurity Quiz</h2>
                    <div class="quiz-progress">
                        Question ${this.currentQuiz.currentIndex + 1}/${this.currentQuiz.questions.length}
                        | Score: ${this.currentQuiz.score}
                    </div>
                    <button class="edu-close" onclick="this.closest('.edu-overlay').remove()">✕</button>
                </div>
                <div class="quiz-content" id="quiz-content">
                    ${this.renderQuizQuestion()}
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }
    
    renderQuizQuestion() {
        if (this.currentQuiz.currentIndex >= this.currentQuiz.questions.length) {
            return this.renderQuizResults();
        }
        
        const q = this.currentQuiz.questions[this.currentQuiz.currentIndex];
        
        return `
            <div class="quiz-question">
                <div class="quiz-meta">
                    <span class="quiz-category">${q.category}</span>
                    <span class="quiz-difficulty difficulty-${q.difficulty}">${q.difficulty}</span>
                </div>
                <h3>${q.question}</h3>
                <div class="quiz-options">
                    ${q.options.map((opt, i) => `
                        <button class="quiz-option" data-index="${i}">
                            ${String.fromCharCode(65 + i)}. ${opt}
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    answerQuestion(selectedIndex) {
        const q = this.currentQuiz.questions[this.currentQuiz.currentIndex];
        const correct = selectedIndex === q.correct;
        
        if (correct) {
            this.currentQuiz.score++;
        }
        this.currentQuiz.answered++;
        
        // Show feedback
        this.showQuizFeedback(correct, q);
    }
    
    showQuizFeedback(correct, question) {
        const content = document.getElementById('quiz-content');
        content.innerHTML = `
            <div class="quiz-feedback ${correct ? 'correct' : 'incorrect'}">
                <h3>${correct ? '✅ Correct!' : '❌ Incorrect'}</h3>
                <p><strong>Correct Answer:</strong> ${question.options[question.correct]}</p>
                <p class="quiz-explanation">${question.explanation}</p>
                <button class="btn-next-question" onclick="eduContentSystem.nextQuestion()">
                    ${this.currentQuiz.currentIndex < this.currentQuiz.questions.length - 1 ? 'Next Question →' : 'See Results'}
                </button>
            </div>
        `;
    }
    
    nextQuestion() {
        this.currentQuiz.currentIndex++;
        const content = document.getElementById('quiz-content');
        content.innerHTML = this.renderQuizQuestion();
        
        // Update progress
        const progress = document.querySelector('.quiz-progress');
        if (progress) {
            progress.textContent = `Question ${this.currentQuiz.currentIndex + 1}/${this.currentQuiz.questions.length} | Score: ${this.currentQuiz.score}`;
        }
        
        // Add event listeners to new options
        this.attachQuizListeners();
    }
    
    attachQuizListeners() {
        const options = document.querySelectorAll('.quiz-option');
        options.forEach(opt => {
            opt.addEventListener('click', () => {
                const index = parseInt(opt.dataset.index);
                this.answerQuestion(index);
            });
        });
    }
    
    renderQuizResults() {
        const percentage = (this.currentQuiz.score / this.currentQuiz.questions.length * 100).toFixed(0);
        let grade, message;
        
        if (percentage >= 90) {
            grade = 'A+';
            message = '🏆 Excellent! You have expert-level knowledge!';
        } else if (percentage >= 80) {
            grade = 'A';
            message = '✨ Great job! You know your cybersecurity!';
        } else if (percentage >= 70) {
            grade = 'B';
            message = '👍 Good work! Keep learning!';
        } else if (percentage >= 60) {
            grade = 'C';
            message = '📚 Not bad! Review the material and try again!';
        } else {
            grade = 'F';
            message = '📖 Keep studying! Practice makes perfect!';
        }
        
        return `
            <div class="quiz-results">
                <h2>Quiz Complete!</h2>
                <div class="quiz-score-display">
                    <div class="quiz-grade">${grade}</div>
                    <div class="quiz-percentage">${percentage}%</div>
                </div>
                <div class="quiz-stats">
                    <div>Correct: ${this.currentQuiz.score}/${this.currentQuiz.questions.length}</div>
                    <div>Score: ${this.currentQuiz.score} points</div>
                </div>
                <p class="quiz-message">${message}</p>
                <div class="quiz-actions">
                    <button class="btn-primary" onclick="eduContentSystem.startQuiz()">Try Again</button>
                    <button class="btn-secondary" onclick="this.closest('.edu-overlay').remove()">Close</button>
                </div>
            </div>
        `;
    }
    
    // ==================== FLASHCARDS ====================
    
    showFlashcards(deckId = null) {
        if (!deckId && this.flashcards.decks.length > 0) {
            deckId = this.flashcards.decks[0].id;
        }
        
        this.currentFlashcard = {
            deckId: deckId,
            cardIndex: 0,
            mastered: []
        };
        
        const overlay = document.createElement('div');
        overlay.className = 'edu-overlay flashcard-overlay';
        overlay.innerHTML = `
            <div class="edu-panel flashcard-panel">
                <div class="edu-header">
                    <h2>🗂️ Flashcards</h2>
                    <select id="deck-selector" class="deck-selector">
                        ${this.flashcards.decks.map(d => 
                            `<option value="${d.id}" ${d.id === deckId ? 'selected' : ''}>${d.name}</option>`
                        ).join('')}
                    </select>
                    <button class="edu-close" onclick="this.closest('.edu-overlay').remove()">✕</button>
                </div>
                <div class="flashcard-content">
                    ${this.renderFlashcard()}
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        this.setupFlashcardControls(overlay);
    }
    
    setupFlashcardControls(overlay) {
        const selector = overlay.querySelector('#deck-selector');
        selector.addEventListener('change', () => {
            this.showFlashcards(selector.value);
        });
    }
    
    renderFlashcard() {
        const deck = this.flashcards.decks.find(d => d.id === this.currentFlashcard.deckId);
        if (!deck || deck.cards.length === 0) {
            return '<p>No cards available</p>';
        }
        
        const card = deck.cards[this.currentFlashcard.cardIndex];
        
        return `
            <div class="flashcard-container">
                <div class="flashcard-progress">
                    Card ${this.currentFlashcard.cardIndex + 1} / ${deck.cards.length}
                    | Mastered: ${this.currentFlashcard.mastered.length}
                </div>
                <div class="flashcard" id="flashcard" onclick="this.classList.toggle('flipped')">
                    <div class="flashcard-front">
                        <div class="flashcard-label">Question</div>
                        <div class="flashcard-text">${card.front}</div>
                        <div class="flashcard-hint">Click to flip</div>
                    </div>
                    <div class="flashcard-back">
                        <div class="flashcard-label">Answer</div>
                        <div class="flashcard-text">${card.back}</div>
                    </div>
                </div>
                <div class="flashcard-controls">
                    <button class="btn-flashcard" onclick="eduContentSystem.prevCard()" ${this.currentFlashcard.cardIndex === 0 ? 'disabled' : ''}>
                        ← Previous
                    </button>
                    <button class="btn-flashcard btn-master" onclick="eduContentSystem.masterCard()">
                        ⭐ Master
                    </button>
                    <button class="btn-flashcard" onclick="eduContentSystem.nextCard()" ${this.currentFlashcard.cardIndex >= deck.cards.length - 1 ? 'disabled' : ''}>
                        Next →
                    </button>
                </div>
            </div>
        `;
    }
    
    nextCard() {
        const deck = this.flashcards.decks.find(d => d.id === this.currentFlashcard.deckId);
        if (this.currentFlashcard.cardIndex < deck.cards.length - 1) {
            this.currentFlashcard.cardIndex++;
            this.updateFlashcard();
        }
    }
    
    prevCard() {
        if (this.currentFlashcard.cardIndex > 0) {
            this.currentFlashcard.cardIndex--;
            this.updateFlashcard();
        }
    }
    
    masterCard() {
        const cardId = this.currentFlashcard.cardIndex;
        if (!this.currentFlashcard.mastered.includes(cardId)) {
            this.currentFlashcard.mastered.push(cardId);
        }
        this.nextCard();
    }
    
    updateFlashcard() {
        const content = document.querySelector('.flashcard-content');
        content.innerHTML = this.renderFlashcard();
    }
    
    // ==================== CAREER PATH ====================
    
    showCareerPath() {
        const overlay = document.createElement('div');
        overlay.className = 'edu-overlay career-overlay';
        overlay.innerHTML = `
            <div class="edu-panel career-panel">
                <div class="edu-header">
                    <h2>🎯 Career Paths in SOC</h2>
                    <button class="edu-close" onclick="this.closest('.edu-overlay').remove()">✕</button>
                </div>
                <div class="edu-tabs">
                    <button class="edu-tab active" data-tab="roles">Roles</button>
                    <button class="edu-tab" data-tab="paths">Career Paths</button>
                    <button class="edu-tab" data-tab="skills">Skill Development</button>
                    <button class="edu-tab" data-tab="stats">Industry Stats</button>
                </div>
                <div class="edu-content" id="career-content">
                    ${this.renderRoles()}
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        this.setupCareerTabs(overlay);
    }
    
    setupCareerTabs(overlay) {
        const tabs = overlay.querySelectorAll('.edu-tab');
        const content = overlay.querySelector('#career-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const tabName = tab.dataset.tab;
                
                if (tabName === 'roles') {
                    content.innerHTML = this.renderRoles();
                } else if (tabName === 'paths') {
                    content.innerHTML = this.renderCareerPaths();
                } else if (tabName === 'skills') {
                    content.innerHTML = this.renderSkillDevelopment();
                } else if (tabName === 'stats') {
                    content.innerHTML = this.renderIndustryStats();
                }
            });
        });
    }
    
    renderRoles() {
        let html = '<div class="roles-grid">';
        
        this.careers.roles.forEach(role => {
            html += `
                <div class="role-card">
                    <h3>${role.name}</h3>
                    <div class="role-meta">
                        <span class="role-level">${role.level}</span>
                        <span class="role-exp">${role.experience}</span>
                    </div>
                    <div class="role-salary">
                        <div><strong>💰 Salary (US):</strong> ${role.salary.us}</div>
                        <div><strong>💰 LATAM:</strong> ${role.salary.latam}</div>
                        <div><strong>💰 Europe:</strong> ${role.salary.europe}</div>
                    </div>
                    <h5>Responsibilities:</h5>
                    <ul>
                        ${role.responsibilities.slice(0, 3).map(r => `<li>${r}</li>`).join('')}
                    </ul>
                    <h5>Key Skills:</h5>
                    <div class="role-skills">
                        ${role.skills.required.slice(0, 4).map(s => `<span class="skill-tag">${s}</span>`).join('')}
                    </div>
                    <h5>Certifications:</h5>
                    <div class="role-certs">
                        ${role.certifications.map(c => `<span class="cert-badge">${c}</span>`).join('')}
                    </div>
                    <div class="role-next">
                        <strong>Next Step:</strong> ${role.nextStep}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }
    
    renderCareerPaths() {
        let html = '<div class="career-paths">';
        
        this.careers.careerPaths.forEach(path => {
            html += `
                <div class="path-card">
                    <h3>${path.path}</h3>
                    <div class="path-stages">
                        ${path.stages.map((stage, i) => `
                            <div class="path-stage">
                                <div class="stage-number">${i + 1}</div>
                                <div class="stage-name">${stage}</div>
                            </div>
                            ${i < path.stages.length - 1 ? '<div class="stage-arrow">↓</div>' : ''}
                        `).join('')}
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }
    
    renderSkillDevelopment() {
        const skills = this.careers.skillDevelopment;
        
        return `
            <div class="skill-development">
                ${['beginner', 'intermediate', 'advanced'].map(level => `
                    <div class="skill-level-card">
                        <h3>${level.charAt(0).toUpperCase() + level.slice(1)} Level</h3>
                        <h4>Technical Skills:</h4>
                        <div class="skills-list">
                            ${skills[level].technical.map(s => `<span class="skill-tag">${s}</span>`).join('')}
                        </div>
                        <h4>Recommended Certifications:</h4>
                        <div class="certs-list">
                            ${skills[level].certifications.map(c => `<span class="cert-badge">${c}</span>`).join('')}
                        </div>
                        <h4>Learning Resources:</h4>
                        <ul>
                            ${skills[level].resources.map(r => `<li>${r}</li>`).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    renderIndustryStats() {
        const stats = this.careers.industryStats;
        
        return `
            <div class="industry-stats">
                <div class="stat-card">
                    <h3>📈 Job Growth</h3>
                    <div class="stat-value">${stats.jobGrowth}</div>
                </div>
                <div class="stat-card">
                    <h3>🌍 Global Shortage</h3>
                    <div class="stat-value">${stats.globalShortage}</div>
                </div>
                <div class="stat-card">
                    <h3>😰 Stress Level</h3>
                    <div class="stat-value">${stats.averageStress}</div>
                </div>
                <div class="stat-card">
                    <h3>⚖️ Work-Life Balance</h3>
                    <div class="stat-value">${stats.workLifeBalance}</div>
                </div>
                <div class="stat-card stat-full">
                    <h3>🏠 Remote Work</h3>
                    <div class="stat-value">${stats.remoteWork}</div>
                </div>
                <div class="stat-card stat-full">
                    <h3>🔥 Most Demanding Skills</h3>
                    <div class="demanding-skills">
                        ${stats.demandingSkills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }
}

// Global instance
let eduContentSystem;

document.addEventListener('DOMContentLoaded', async () => {
    eduContentSystem = new EducationalContentSystem();
    await eduContentSystem.loadAllData();
    
    // Create floating buttons once quiz/flashcards/careers are loaded
    createEducationalButtons();
});

function createEducationalButtons() {
    // Add buttons to help panel or create floating menu
    const container = document.createElement('div');
    container.className = 'edu-floating-menu';
    container.innerHTML = `
        <button class="edu-menu-btn" onclick="eduContentSystem.showFrameworksPanel()" title="Frameworks">📚</button>
        <button class="edu-menu-btn" onclick="eduContentSystem.startQuiz()" title="Quiz">🎯</button>
        <button class="edu-menu-btn" onclick="eduContentSystem.showFlashcards()" title="Flashcards">🗂️</button>
        <button class="edu-menu-btn" onclick="eduContentSystem.showCareerPath()" title="Careers">🎓</button>
    `;
    
    document.body.appendChild(container);
}
