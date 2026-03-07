/**
 * Save System UI - Visual interface for save management
 */

class SaveUI {
  constructor(saveSystem) {
    this.saveSystem = saveSystem;
    this.modalOpen = false;
    
    this.init();
  }
  
  init() {
    // Create UI elements
    // this.createSaveButton(); // Botón flotante deshabilitado
    this.createSaveModal();
    
    // Setup event listeners
    this.setupEventListeners();
    
    console.log('✅ Save UI initialized');
  }
  
  /**
   * Create floating save button
   */
  createSaveButton() {
    const button = document.createElement('button');
    button.className = 'floating-save-btn';
    button.innerHTML = '💾';
    button.title = 'Save & Load Game';
    button.onclick = () => this.openSaveModal();
    
    document.body.appendChild(button);
  }
  
  /**
   * Create save/load modal
   */
  createSaveModal() {
    const modal = document.createElement('div');
    modal.className = 'save-modal';
    modal.id = 'saveModal';
    modal.innerHTML = `
      <div class="save-modal-content">
        <div class="save-modal-header">
          <h2>💾 Save & Load Game</h2>
          <button class="close-btn" onclick="saveUI.closeSaveModal()">&times;</button>
        </div>
        
        <div class="save-modal-tabs">
          <button class="tab-btn active" data-tab="saves">Save Slots</button>
          <button class="tab-btn" data-tab="history">Time Travel</button>
          <button class="tab-btn" data-tab="import">Import/Export</button>
          <button class="tab-btn" data-tab="settings">Settings</button>
        </div>
        
        <!-- Save Slots Tab -->
        <div class="tab-content active" id="tab-saves">
          <div class="save-slots-container" id="saveSlotsContainer">
            <!-- Slots will be populated dynamically -->
          </div>
          
          <div class="save-actions">
            <button class="btn btn-danger" onclick="saveUI.clearAllSaves()">
              🗑️ Clear All Saves
            </button>
          </div>
        </div>
        
        <!-- Time Travel Tab -->
        <div class="tab-content" id="tab-history">
          <div class="time-travel-info">
            <p>📜 Travel back to any previous turn in your current game.</p>
            <p>⚠️ This will overwrite your current progress!</p>
          </div>
          
          <div class="history-list" id="historyList">
            <!-- History will be populated dynamically -->
          </div>
        </div>
        
        <!-- Import/Export Tab -->
        <div class="tab-content" id="tab-import">
          <div class="import-export-section">
            <h3>📥 Export Save</h3>
            <p>Download your save as a JSON file for backup or sharing.</p>
            <div class="export-slots">
              <button class="btn btn-primary" onclick="saveUI.exportSlot(1)">Export Slot 1</button>
              <button class="btn btn-primary" onclick="saveUI.exportSlot(2)">Export Slot 2</button>
              <button class="btn btn-primary" onclick="saveUI.exportSlot(3)">Export Slot 3</button>
            </div>
            
            <hr>
            
            <h3>📤 Import Save</h3>
            <p>Load a save file from your computer.</p>
            <div class="import-section">
              <input type="file" id="importFile" accept=".json" />
              <label>Import to slot:</label>
              <select id="importSlot">
                <option value="1">Slot 1</option>
                <option value="2">Slot 2</option>
                <option value="3">Slot 3</option>
              </select>
              <button class="btn btn-primary" onclick="saveUI.importSave()">Import</button>
            </div>
          </div>
        </div>
        
        <!-- Settings Tab -->
        <div class="tab-content" id="tab-settings">
          <div class="settings-section">
            <h3>⚙️ Save Settings</h3>
            
            <div class="setting-item">
              <label>
                <input type="checkbox" id="autoSaveEnabled" checked />
                Enable Auto-Save
              </label>
              <p class="setting-description">Automatically save every 5 turns</p>
            </div>
            
            <div class="setting-item">
              <label>
                <input type="checkbox" id="cloudSyncEnabled" checked />
                Enable Cloud Sync
              </label>
              <p class="setting-description">Sync saves to server (requires backend)</p>
            </div>
            
            <div class="setting-item">
              <label>
                Auto-Save Interval:
                <input type="number" id="autoSaveInterval" value="5" min="1" max="10" />
                turns
              </label>
            </div>
            
            <div class="setting-item">
              <label>
                Max History States:
                <input type="number" id="maxHistory" value="50" min="10" max="100" />
                states
              </label>
            </div>
            
            <hr>
            
            <h3>📊 Storage Info</h3>
            <div id="storageInfo" class="storage-info">
              <!-- Will be populated dynamically -->
            </div>
            
            <button class="btn btn-primary" onclick="saveUI.updateStorageInfo()">
              Refresh Storage Info
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }
  
  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
    });
    
    // Settings changes
    document.getElementById('autoSaveEnabled')?.addEventListener('change', (e) => {
      this.saveSystem.autoSaveEnabled = e.target.checked;
      this.showToast(e.target.checked ? '✅ Auto-save enabled' : '⏸️ Auto-save disabled');
    });
    
    document.getElementById('cloudSyncEnabled')?.addEventListener('change', (e) => {
      this.saveSystem.options.cloudSyncEnabled = e.target.checked;
      this.showToast(e.target.checked ? '☁️ Cloud sync enabled' : '📴 Cloud sync disabled');
    });
    
    document.getElementById('autoSaveInterval')?.addEventListener('change', (e) => {
      this.saveSystem.options.autoSaveInterval = parseInt(e.target.value);
      this.showToast(`Auto-save interval: ${e.target.value} turns`);
    });
    
    document.getElementById('maxHistory')?.addEventListener('change', (e) => {
      this.saveSystem.options.maxHistoryStates = parseInt(e.target.value);
      this.showToast(`Max history: ${e.target.value} states`);
    });
    
    // Close modal on outside click
    document.getElementById('saveModal')?.addEventListener('click', (e) => {
      if (e.target.id === 'saveModal') {
        this.closeSaveModal();
      }
    });
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modalOpen) {
        this.closeSaveModal();
      }
    });
  }
  
  /**
   * Open save modal
   */
  openSaveModal() {
    const modal = document.getElementById('saveModal');
    if (!modal) return;
    
    modal.style.display = 'block';
    this.modalOpen = true;
    
    // Refresh content
    this.refreshSaveSlots();
    this.updateStorageInfo();
  }
  
  /**
   * Close save modal
   */
  closeSaveModal() {
    const modal = document.getElementById('saveModal');
    if (!modal) return;
    
    modal.style.display = 'none';
    this.modalOpen = false;
  }
  
  /**
   * Switch between tabs
   */
  switchTab(tabName) {
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.tab === tabName) {
        btn.classList.add('active');
      }
    });
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`tab-${tabName}`)?.classList.add('active');
    
    // Refresh content based on tab
    if (tabName === 'saves') {
      this.refreshSaveSlots();
    } else if (tabName === 'history') {
      this.refreshHistory();
    } else if (tabName === 'settings') {
      this.updateStorageInfo();
    }
  }
  
  /**
   * Refresh save slots display
   */
  refreshSaveSlots() {
    const container = document.getElementById('saveSlotsContainer');
    if (!container) return;
    
    const saves = this.saveSystem.getAllSaves();
    
    container.innerHTML = saves.map(save => {
      if (save.empty) {
        return `
          <div class="save-slot empty" data-slot="${save.slot}">
            <div class="slot-header">
              <span class="slot-number">Slot ${save.slot}</span>
              <span class="slot-status">Empty</span>
            </div>
            <div class="slot-body">
              <p class="empty-message">No save data</p>
            </div>
            <div class="slot-actions">
              <button class="btn btn-primary" onclick="saveUI.saveToSlot(${save.slot})">
                💾 Save Here
              </button>
            </div>
          </div>
        `;
      } else {
        const isCurrent = save.slot === this.saveSystem.currentSlot;
        return `
          <div class="save-slot ${isCurrent ? 'current' : ''}" data-slot="${save.slot}">
            <div class="slot-header">
              <span class="slot-number">Slot ${save.slot}</span>
              ${isCurrent ? '<span class="slot-badge">Current</span>' : ''}
            </div>
            <div class="slot-body">
              <div class="save-info">
                <div class="info-row">
                  <span class="info-label">Turn:</span>
                  <span class="info-value">${save.turn || 0}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Score:</span>
                  <span class="info-value">${save.score || 0}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Budget:</span>
                  <span class="info-value">$${(save.budget || 0).toLocaleString()}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Saved:</span>
                  <span class="info-value">${save.date}</span>
                </div>
              </div>
            </div>
            <div class="slot-actions">
              <button class="btn btn-success" onclick="saveUI.loadSlot(${save.slot})">
                📂 Load
              </button>
              <button class="btn btn-primary" onclick="saveUI.saveToSlot(${save.slot})">
                💾 Overwrite
              </button>
              <button class="btn btn-danger" onclick="saveUI.deleteSlot(${save.slot})">
                🗑️ Delete
              </button>
            </div>
          </div>
        `;
      }
    }).join('');
  }
  
  /**
   * Refresh time travel history
   */
  refreshHistory() {
    const container = document.getElementById('historyList');
    if (!container) return;
    
    const turns = this.saveSystem.getAvailableTurns();
    
    if (turns.length === 0) {
      container.innerHTML = `
        <div class="no-history">
          <p>📭 No history available</p>
          <p>History is saved as you play. Start a game to build history!</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = turns.reverse().map(turn => `
      <div class="history-item">
        <div class="history-info">
          <span class="history-turn">Turn ${turn.turn}</span>
          <span class="history-date">${turn.date}</span>
        </div>
        <button class="btn btn-primary" onclick="saveUI.travelToTurn(${turn.turn})">
          ⏰ Travel Here
        </button>
      </div>
    `).join('');
  }
  
  /**
   * Save to specific slot
   */
  saveToSlot(slot) {
    // Get current game state
    const gameState = window.gameState || this.saveSystem.currentGameState;
    
    if (!gameState) {
      alert('⚠️ No active game to save!');
      return;
    }
    
    const result = this.saveSystem.saveGame(slot, gameState);
    
    if (result.success) {
      this.showToast(`💾 Saved to Slot ${slot}`);
      this.refreshSaveSlots();
    } else {
      alert(`❌ Save failed: ${result.error}`);
    }
  }
  
  /**
   * Load from specific slot
   */
  loadSlot(slot) {
    if (!confirm(`Load game from Slot ${slot}? Current progress will be lost.`)) {
      return;
    }
    
    const result = this.saveSystem.loadGame(slot);
    
    if (result.success) {
      this.showToast(`📂 Loaded from Slot ${slot}`);
      this.closeSaveModal();
      
      // Dispatch event to game
      window.dispatchEvent(new CustomEvent('loadGame', {
        detail: result.gameState
      }));
      
      // Reload page to apply loaded state
      setTimeout(() => {
        location.reload();
      }, 500);
    } else {
      alert(`❌ Load failed: ${result.error}`);
    }
  }
  
  /**
   * Delete specific slot
   */
  deleteSlot(slot) {
    if (!confirm(`⚠️ Delete save in Slot ${slot}? This cannot be undone!`)) {
      return;
    }
    
    const result = this.saveSystem.deleteSave(slot);
    
    if (result.success) {
      this.showToast(`🗑️ Slot ${slot} deleted`);
      this.refreshSaveSlots();
    } else {
      alert(`❌ Delete failed: ${result.error}`);
    }
  }
  
  /**
   * Travel to specific turn
   */
  travelToTurn(turn) {
    if (!confirm(`⚠️ Travel to Turn ${turn}? Current progress will be lost!`)) {
      return;
    }
    
    const result = this.saveSystem.travelToTurn(turn);
    
    if (result.success) {
      this.showToast(`⏰ Traveled to Turn ${turn}`);
      this.closeSaveModal();
      
      // Reload page to apply restored state
      setTimeout(() => {
        location.reload();
      }, 500);
    } else {
      alert(`❌ Time travel failed: ${result.error}`);
    }
  }
  
  /**
   * Export save from slot
   */
  exportSlot(slot) {
    const result = this.saveSystem.exportSave(slot);
    
    if (!result.success) {
      alert(`❌ Export failed: ${result.error || 'No save in this slot'}`);
    }
  }
  
  /**
   * Import save file
   */
  async importSave() {
    const fileInput = document.getElementById('importFile');
    const slotSelect = document.getElementById('importSlot');
    
    if (!fileInput.files || !fileInput.files[0]) {
      alert('⚠️ Please select a file to import');
      return;
    }
    
    const file = fileInput.files[0];
    const slot = parseInt(slotSelect.value);
    
    try {
      await this.saveSystem.importSave(file, slot);
      this.showToast(`📤 Imported to Slot ${slot}`);
      this.refreshSaveSlots();
      
      // Clear file input
      fileInput.value = '';
    } catch (error) {
      alert(`❌ Import failed: ${error.message}`);
    }
  }
  
  /**
   * Clear all saves
   */
  clearAllSaves() {
    const result = this.saveSystem.clearAllSaves();
    
    if (result.success) {
      this.refreshSaveSlots();
    }
  }
  
  /**
   * Update storage info display
   */
  updateStorageInfo() {
    const container = document.getElementById('storageInfo');
    if (!container) return;
    
    const info = this.saveSystem.getStorageInfo();
    
    const percentColor = info.percentUsed > 80 ? '#f56565' : 
                        info.percentUsed > 50 ? '#ed8936' : '#48bb78';
    
    container.innerHTML = `
      <div class="storage-stat">
        <span class="stat-label">Items Stored:</span>
        <span class="stat-value">${info.items}</span>
      </div>
      <div class="storage-stat">
        <span class="stat-label">Space Used:</span>
        <span class="stat-value">${info.usedMB} MB / ${info.limitMB} MB</span>
      </div>
      <div class="storage-bar">
        <div class="storage-bar-fill" style="width: ${info.percentUsed}%; background: ${percentColor}">
          ${info.percentUsed}%
        </div>
      </div>
      <p class="storage-note">
        ${info.percentUsed > 80 ? 
          '⚠️ Storage almost full! Consider deleting old saves or exporting them.' :
          '✅ Storage healthy'
        }
      </p>
    `;
  }
  
  /**
   * Show toast notification
   */
  showToast(message) {
    if (window.showToast) {
      window.showToast(message);
    } else {
      console.log(message);
    }
  }
}

// Global instance
window.saveUI = null;

/**
 * Initialize Save UI
 */
function initSaveUI() {
  if (!window.saveSystem) {
    console.error('Save system must be initialized first!');
    return;
  }
  
  window.saveUI = new SaveUI(window.saveSystem);
  return window.saveUI;
}

// Auto-initialize after save system
window.addEventListener('load', () => {
  if (window.saveSystem) {
    initSaveUI();
  } else {
    // Wait for save system
    setTimeout(() => {
      if (window.saveSystem) {
        initSaveUI();
      }
    }, 100);
  }
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SaveUI, initSaveUI };
}
