/**
 * Save System - Complete Persistence Management
 * Features: LocalStorage, Auto-Save, Multiple Slots, Time Travel, Cloud Sync, Export/Import
 */

class SaveSystem {
  constructor(options = {}) {
    this.options = {
      maxSlots: 3,
      autoSaveInterval: 5, // Save every 5 turns
      maxHistoryStates: 50, // Max states for time travel
      cloudSyncEnabled: true,
      storagePrefix: 'soc-sim',
      ...options
    };
    
    this.currentSlot = null;
    this.autoSaveEnabled = true;
    this.lastSavedTurn = 0;
    this.currentGameState = null;
    this.stateHistory = [];
    
    this.init();
  }
  
  /**
   * Initialize save system
   */
  init() {
    console.log('🎮 Initializing Save System...');
    
    // Check for auto-resume
    this.checkAutoResume();
    
    // Setup auto-save listener
    this.setupAutoSave();
    
    // Setup beforeunload to save state
    window.addEventListener('beforeunload', () => {
      if (this.currentGameState) {
        this.createQuickSave();
      }
    });
    
    // Setup visibility change for sync
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && this.cloudSyncEnabled) {
        this.syncFromCloud();
      }
    });
    
    console.log('✅ Save System initialized');
  }
  
  /**
   * Save game to specific slot
   */
  saveGame(slot, gameState) {
    if (slot < 1 || slot > this.options.maxSlots) {
      throw new Error(`Invalid slot: ${slot}. Must be 1-${this.options.maxSlots}`);
    }
    
    const saveData = {
      slot,
      timestamp: Date.now(),
      version: '1.0.0',
      gameState: this.serializeGameState(gameState),
      metadata: {
        turn: gameState.turn || 0,
        score: gameState.securityScore || 0,
        budget: gameState.budget || 0,
        duration: this.calculateDuration(gameState),
        difficulty: gameState.difficulty || 'normal'
      }
    };
    
    try {
      // Save to localStorage
      const key = this.getSlotKey(slot);
      localStorage.setItem(key, JSON.stringify(saveData));
      
      // Save to slot index
      this.updateSlotIndex(slot, saveData.metadata);
      
      // Add to history for time travel
      this.addToHistory(gameState);
      
      // Update current state
      this.currentGameState = gameState;
      this.currentSlot = slot;
      this.lastSavedTurn = gameState.turn || 0;
      
      console.log(`💾 Game saved to slot ${slot}`);
      
      // Sync to cloud if enabled
      if (this.options.cloudSyncEnabled) {
        this.syncToCloud(slot, saveData);
      }
      
      return {
        success: true,
        slot,
        timestamp: saveData.timestamp
      };
    } catch (error) {
      console.error('Save failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Load game from specific slot
   */
  loadGame(slot) {
    if (slot < 1 || slot > this.options.maxSlots) {
      throw new Error(`Invalid slot: ${slot}. Must be 1-${this.options.maxSlots}`);
    }
    
    try {
      const key = this.getSlotKey(slot);
      const data = localStorage.getItem(key);
      
      if (!data) {
        return {
          success: false,
          error: 'No save found in this slot'
        };
      }
      
      const saveData = JSON.parse(data);
      const gameState = this.deserializeGameState(saveData.gameState);
      
      this.currentGameState = gameState;
      this.currentSlot = slot;
      this.lastSavedTurn = gameState.turn || 0;
      
      // Load history
      this.loadHistory(slot);
      
      console.log(`📂 Game loaded from slot ${slot}`);
      
      return {
        success: true,
        gameState,
        metadata: saveData.metadata
      };
    } catch (error) {
      console.error('Load failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Delete save from slot
   */
  deleteSave(slot) {
    if (slot < 1 || slot > this.options.maxSlots) {
      throw new Error(`Invalid slot: ${slot}. Must be 1-${this.options.maxSlots}`);
    }
    
    try {
      const key = this.getSlotKey(slot);
      localStorage.removeItem(key);
      
      // Remove from index
      this.updateSlotIndex(slot, null);
      
      // Remove history
      const historyKey = this.getHistoryKey(slot);
      localStorage.removeItem(historyKey);
      
      console.log(`🗑️ Save deleted from slot ${slot}`);
      
      return { success: true };
    } catch (error) {
      console.error('Delete failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  /**
   * Get all save slots information
   */
  getAllSaves() {
    const saves = [];
    
    for (let slot = 1; slot <= this.options.maxSlots; slot++) {
      const key = this.getSlotKey(slot);
      const data = localStorage.getItem(key);
      
      if (data) {
        try {
          const saveData = JSON.parse(data);
          saves.push({
            slot,
            ...saveData.metadata,
            timestamp: saveData.timestamp,
            date: new Date(saveData.timestamp).toLocaleString()
          });
        } catch (error) {
          console.error(`Error reading slot ${slot}:`, error);
          saves.push({
            slot,
            error: 'Corrupted save'
          });
        }
      } else {
        saves.push({
          slot,
          empty: true
        });
      }
    }
    
    return saves;
  }
  
  /**
   * Auto-save functionality
   */
  setupAutoSave() {
    // Listen for game state updates
    window.addEventListener('gameStateUpdate', (event) => {
      const gameState = event.detail;
      this.currentGameState = gameState;
      
      // Check if should auto-save
      if (this.shouldAutoSave(gameState)) {
        this.autoSave(gameState);
      }
    });
  }
  
  shouldAutoSave(gameState) {
    if (!this.autoSaveEnabled) return false;
    if (!gameState || !gameState.turn) return false;
    
    const turn = gameState.turn;
    const turnsSinceLastSave = turn - this.lastSavedTurn;
    
    return turnsSinceLastSave >= this.options.autoSaveInterval;
  }
  
  autoSave(gameState) {
    // Use slot 1 for auto-save by default, or current slot if exists
    const slot = this.currentSlot || 1;
    
    const result = this.saveGame(slot, gameState);
    
    if (result.success) {
      this.showNotification('💾 Auto-saved', 'success');
    } else {
      console.error('Auto-save failed:', result.error);
    }
  }
  
  /**
   * Quick save (on page unload)
   */
  createQuickSave() {
    if (!this.currentGameState) return;
    
    const quickSaveKey = `${this.options.storagePrefix}-quicksave`;
    const quickSave = {
      timestamp: Date.now(),
      gameState: this.serializeGameState(this.currentGameState),
      slot: this.currentSlot
    };
    
    try {
      localStorage.setItem(quickSaveKey, JSON.stringify(quickSave));
      console.log('💾 Quick save created');
    } catch (error) {
      console.error('Quick save failed:', error);
    }
  }
  
  /**
   * Check for auto-resume on page load
   */
  checkAutoResume() {
    const quickSaveKey = `${this.options.storagePrefix}-quicksave`;
    const data = localStorage.getItem(quickSaveKey);
    
    if (!data) return;
    
    try {
      const quickSave = JSON.parse(data);
      const age = Date.now() - quickSave.timestamp;
      
      // Only auto-resume if less than 1 hour old
      if (age < 3600000) {
        this.showResumePrompt(quickSave);
      } else {
        // Clean up old quick save
        localStorage.removeItem(quickSaveKey);
      }
    } catch (error) {
      console.error('Resume check failed:', error);
    }
  }
  
  showResumePrompt(quickSave) {
    const age = Math.floor((Date.now() - quickSave.timestamp) / 1000 / 60);
    const message = `Resume your game from ${age} minutes ago?`;
    
    if (confirm(message)) {
      const gameState = this.deserializeGameState(quickSave.gameState);
      this.currentGameState = gameState;
      this.currentSlot = quickSave.slot;
      
      // Dispatch event to restore game
      window.dispatchEvent(new CustomEvent('resumeGame', {
        detail: gameState
      }));
      
      this.showNotification('🎮 Game resumed', 'success');
    }
  }
  
  /**
   * Time Travel - Save state history
   */
  addToHistory(gameState) {
    const stateSnapshot = {
      turn: gameState.turn,
      timestamp: Date.now(),
      state: this.serializeGameState(gameState)
    };
    
    this.stateHistory.push(stateSnapshot);
    
    // Limit history size
    if (this.stateHistory.length > this.options.maxHistoryStates) {
      this.stateHistory.shift();
    }
    
    // Save history to localStorage
    if (this.currentSlot) {
      this.saveHistory(this.currentSlot);
    }
  }
  
  saveHistory(slot) {
    const key = this.getHistoryKey(slot);
    try {
      localStorage.setItem(key, JSON.stringify(this.stateHistory));
    } catch (error) {
      console.error('History save failed:', error);
      // If storage full, clear old history
      this.stateHistory = this.stateHistory.slice(-20);
      localStorage.setItem(key, JSON.stringify(this.stateHistory));
    }
  }
  
  loadHistory(slot) {
    const key = this.getHistoryKey(slot);
    const data = localStorage.getItem(key);
    
    if (data) {
      try {
        this.stateHistory = JSON.parse(data);
        console.log(`📜 Loaded ${this.stateHistory.length} history states`);
      } catch (error) {
        console.error('History load failed:', error);
        this.stateHistory = [];
      }
    } else {
      this.stateHistory = [];
    }
  }
  
  /**
   * Time travel to previous turn
   */
  travelToTurn(turn) {
    const state = this.stateHistory.find(s => s.turn === turn);
    
    if (!state) {
      return {
        success: false,
        error: 'Turn not found in history'
      };
    }
    
    const gameState = this.deserializeGameState(state.state);
    
    // Dispatch event to restore game
    window.dispatchEvent(new CustomEvent('timeTravelRestore', {
      detail: gameState
    }));
    
    this.showNotification(`⏰ Traveled to turn ${turn}`, 'info');
    
    return {
      success: true,
      gameState
    };
  }
  
  getAvailableTurns() {
    return this.stateHistory.map(s => ({
      turn: s.turn,
      timestamp: s.timestamp,
      date: new Date(s.timestamp).toLocaleString()
    }));
  }
  
  /**
   * Export save to JSON file
   */
  exportSave(slot) {
    const result = this.loadGame(slot);
    
    if (!result.success) {
      return result;
    }
    
    const exportData = {
      version: '1.0.0',
      exported: Date.now(),
      slot,
      gameState: result.gameState,
      metadata: result.metadata,
      history: this.stateHistory
    };
    
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `soc-sim-save-slot${slot}-${Date.now()}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
    
    this.showNotification('📥 Save exported', 'success');
    
    return { success: true };
  }
  
  /**
   * Import save from JSON file
   */
  importSave(file, targetSlot) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const importData = JSON.parse(e.target.result);
          
          // Validate import data
          if (!importData.gameState || !importData.version) {
            throw new Error('Invalid save file format');
          }
          
          // Save to target slot
          const result = this.saveGame(targetSlot, importData.gameState);
          
          if (result.success) {
            // Restore history if available
            if (importData.history) {
              this.stateHistory = importData.history;
              this.saveHistory(targetSlot);
            }
            
            this.showNotification('📤 Save imported', 'success');
            resolve({ success: true });
          } else {
            reject(new Error('Failed to save imported data'));
          }
        } catch (error) {
          console.error('Import failed:', error);
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  }
  
  /**
   * Cloud Sync - Save to backend
   */
  async syncToCloud(slot, saveData) {
    if (!this.options.cloudSyncEnabled) return;
    
    try {
      const response = await fetch('http://localhost:8080/api/game/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          slot,
          data: saveData,
          session_id: this.getSessionId()
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('☁️ Synced to cloud:', result);
        
        // Store cloud save ID
        localStorage.setItem(`${this.options.storagePrefix}-cloud-id-${slot}`, result.save_id);
      } else {
        console.warn('Cloud sync failed:', response.statusText);
      }
    } catch (error) {
      console.warn('Cloud sync unavailable:', error.message);
      // Fail silently - local save still works
    }
  }
  
  /**
   * Cloud Sync - Load from backend
   */
  async syncFromCloud(slot) {
    if (!this.options.cloudSyncEnabled) return;
    
    const cloudId = localStorage.getItem(`${this.options.storagePrefix}-cloud-id-${slot}`);
    if (!cloudId) return;
    
    try {
      const response = await fetch(`http://localhost:8080/api/game/load/${cloudId}`);
      
      if (response.ok) {
        const result = await response.json();
        const cloudSave = result.save;
        
        // Check if cloud save is newer
        const localKey = this.getSlotKey(slot);
        const localData = localStorage.getItem(localKey);
        
        if (localData) {
          const local = JSON.parse(localData);
          if (cloudSave.timestamp > local.timestamp) {
            // Cloud is newer, update local
            localStorage.setItem(localKey, JSON.stringify(cloudSave));
            console.log('☁️ Updated from cloud');
            this.showNotification('☁️ Save synced from cloud', 'info');
          }
        } else {
          // No local save, use cloud
          localStorage.setItem(localKey, JSON.stringify(cloudSave));
          console.log('☁️ Downloaded from cloud');
        }
      }
    } catch (error) {
      console.warn('Cloud sync unavailable:', error.message);
    }
  }
  
  /**
   * Helper: Serialize game state
   */
  serializeGameState(gameState) {
    // Create a clean copy without circular references
    return {
      turn: gameState.turn,
      securityScore: gameState.securityScore,
      budget: gameState.budget,
      reputation: gameState.reputation,
      activeThreats: gameState.activeThreats,
      detectedThreats: gameState.detectedThreats,
      events: gameState.events,
      history: gameState.history,
      teamLevel: gameState.teamLevel,
      siemLevel: gameState.siemLevel,
      edrlevel: gameState.edrLevel,
      firewallLevel: gameState.firewallLevel,
      dlpLevel: gameState.dlpLevel,
      backupLevel: gameState.backupLevel,
      difficulty: gameState.difficulty,
      startTime: gameState.startTime,
      settings: gameState.settings
    };
  }
  
  /**
   * Helper: Deserialize game state
   */
  deserializeGameState(serialized) {
    // Restore game state from serialized data
    return {
      ...serialized,
      // Add any computed properties or defaults
      isLoaded: true
    };
  }
  
  /**
   * Helper: Get slot storage key
   */
  getSlotKey(slot) {
    return `${this.options.storagePrefix}-save-slot-${slot}`;
  }
  
  /**
   * Helper: Get history storage key
   */
  getHistoryKey(slot) {
    return `${this.options.storagePrefix}-history-slot-${slot}`;
  }
  
  /**
   * Helper: Update slot index
   */
  updateSlotIndex(slot, metadata) {
    const indexKey = `${this.options.storagePrefix}-slot-index`;
    let index = {};
    
    try {
      const data = localStorage.getItem(indexKey);
      if (data) index = JSON.parse(data);
    } catch (error) {
      console.error('Index read failed:', error);
    }
    
    if (metadata) {
      index[slot] = metadata;
    } else {
      delete index[slot];
    }
    
    localStorage.setItem(indexKey, JSON.stringify(index));
  }
  
  /**
   * Helper: Calculate game duration
   */
  calculateDuration(gameState) {
    if (!gameState.startTime) return 0;
    return Date.now() - gameState.startTime;
  }
  
  /**
   * Helper: Get or create session ID
   */
  getSessionId() {
    const key = `${this.options.storagePrefix}-session-id`;
    let sessionId = localStorage.getItem(key);
    
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(key, sessionId);
    }
    
    return sessionId;
  }
  
  /**
   * Helper: Show notification
   */
  showNotification(message, type = 'info') {
    // Use existing toast system if available
    if (window.showToast) {
      window.showToast(message);
    } else {
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }
  
  /**
   * Get storage usage
   */
  getStorageInfo() {
    let totalSize = 0;
    let itemCount = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(this.options.storagePrefix)) {
        const value = localStorage.getItem(key);
        totalSize += key.length + value.length;
        itemCount++;
      }
    }
    
    // LocalStorage limit is typically 5-10 MB
    const limitMB = 5;
    const usedMB = (totalSize / 1024 / 1024).toFixed(2);
    const percentUsed = ((totalSize / (limitMB * 1024 * 1024)) * 100).toFixed(1);
    
    return {
      items: itemCount,
      totalBytes: totalSize,
      usedMB,
      percentUsed,
      limitMB
    };
  }
  
  /**
   * Clear all saves
   */
  clearAllSaves() {
    if (!confirm('⚠️ Delete ALL saves? This cannot be undone!')) {
      return { success: false, cancelled: true };
    }
    
    try {
      // Remove all saves
      for (let slot = 1; slot <= this.options.maxSlots; slot++) {
        this.deleteSave(slot);
      }
      
      // Remove quick save
      localStorage.removeItem(`${this.options.storagePrefix}-quicksave`);
      
      // Remove index
      localStorage.removeItem(`${this.options.storagePrefix}-slot-index`);
      
      // Reset state
      this.currentSlot = null;
      this.currentGameState = null;
      this.stateHistory = [];
      
      this.showNotification('🗑️ All saves cleared', 'success');
      
      return { success: true };
    } catch (error) {
      console.error('Clear all failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Global instance
window.saveSystem = null;

/**
 * Initialize save system when DOM ready
 */
function initSaveSystem(options = {}) {
  if (window.saveSystem) {
    console.warn('Save system already initialized');
    return window.saveSystem;
  }
  
  window.saveSystem = new SaveSystem(options);
  
  // Expose to global scope for easy access
  window.saveGame = (slot, gameState) => window.saveSystem.saveGame(slot, gameState);
  window.loadGame = (slot) => window.saveSystem.loadGame(slot);
  window.exportSave = (slot) => window.saveSystem.exportSave(slot);
  
  return window.saveSystem;
}

// Auto-initialize when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => initSaveSystem());
} else {
  initSaveSystem();
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SaveSystem, initSaveSystem };
}
