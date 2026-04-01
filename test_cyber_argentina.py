#!/usr/bin/env python3
"""
Tests para Cyber Argentina Simulator
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from cyber_argentina import ArgentinaCyberGame
import unittest
import tempfile
import shutil
import json

class TestCyberArgentina(unittest.TestCase):
    def setUp(self):
        self.game = ArgentinaCyberGame()
        self.data_dir = self.game.data_dir
        # Backup data
        self.backup_files = []
        for f in ['game_log.csv', 'save.json']:
            p = os.path.join(self.data_dir, f)
            if os.path.exists(p):
                self.backup_files.append(p)
    
    def tearDown(self):
        # Restore backups if needed
        pass
        # Clean generated files
        for f in ['game_log.csv', 'save.json']:
            p = os.path.join(self.data_dir, f)
            if os.path.exists(p) and p not in self.backup_files:
                os.remove(p)
    
    def test_init_state(self):
        """Estado inicial correcto"""
        self.assertEqual(self.game.turn, 0)
        self.assertEqual(self.game.reservas, 50000)
        self.assertEqual(self.game.cyber_score, 80)
        self.assertFalse(self.game.game_over)
        self.assertTrue(os.path.exists(self.game.log_file))
    
    def test_events_and_decisions(self):
        """Eventos y decisiones existen"""
        events = self.game.cyber_events()
        self.assertGreater(len(events), 5)
        decisions = self.game.decisions()
        self.assertGreater(len(decisions), 4)
        self.assertIn('PHISHING', events[0]['name'])
        self.assertIn('Capacitar', decisions[0]['name'])
    
    def test_save_load(self):
        """Save/load funciona"""
        self.game.turn = 5
        self.game.reservas = 40000
        self.game.save_game()
        
        new_game = ArgentinaCyberGame()
        self.assertTrue(new_game.load_game())
        self.assertEqual(new_game.turn, 5)
        self.assertEqual(new_game.reservas, 40000)
    
    def test_logging(self):
        """Logging funciona"""
        initial_size = os.path.getsize(self.game.log_file)
        self.game.log_turn('TEST_EVENT', 'TEST_DEC', True, False)
        self.assertGreater(os.path.getsize(self.game.log_file), initial_size)
    
    def test_play_turn_simulation(self):
        """Simular turno básico"""
        initial_reservas = self.game.reservas
        self.game.play_turn()
        self.assertLess(self.game.reservas, initial_reservas)
        self.assertGreater(self.game.turn, 0)
        self.assertGreaterEqual(self.game.cyber_score, 0)
    
    def test_game_over_condition(self):
        """Game over por reservas"""
        self.game.reservas = -1
        self.assertTrue(self.game.check_end())
        self.game.reservas = 50000
        self.game.turn = 31
        self.assertTrue(self.game.check_end())
    
    def test_stats(self):
        """Stats básico"""
        # Simular history
        self.game.history = [
            {'reservas': 50000, 'turn': 1},
            {'reservas': 45000, 'turn': 2}
        ]
        self.game.stats['attacks_blocked'] = 1
        self.game.get_stats()  # No crash
    
    def test_data_dir_creation(self):
        """Directorio data creado"""
        self.assertTrue(os.path.exists('data'))

if __name__ == '__main__':
    unittest.main(verbosity=2)

