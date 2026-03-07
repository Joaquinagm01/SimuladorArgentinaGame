#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🛡️ CYBER DEFENSE SIMULATOR 🛡️
You are the SOC Manager. Defend your infrastructure from cyber threats.
Can you survive the attacks? (Based on real MITRE ATT&CK techniques)
"""

import os
import sys
from security import SecuritySystem
from soc_decisions import SOCDecisionManager
from cyber_events import CyberEventManager
import csv
from datetime import datetime
import random

class CyberDefenseSimulator:
    def __init__(self):
        self.security = SecuritySystem()
        self.decision_manager = SOCDecisionManager()
        self.event_manager = CyberEventManager()
        self.turn = 1
        self.max_turns = 30
        self.game_over = False
        self.victory = False
        self.data_file = "../data/soc_data.csv"
        
    def setup_data_file(self):
        """Create CSV file if it doesn't exist"""
        os.makedirs("../data", exist_ok=True)
        if not os.path.exists(self.data_file):
            with open(self.data_file, "w", newline="", encoding="utf-8") as f:
                writer = csv.writer(f)
                writer.writerow([
                    "timestamp", "turn", "decision", "decision_category", "decision_cost",
                    "security_score", "budget", "reputation", "servers_infected",
                    "alerts_queue", "active_threats", "incidents_resolved",
                    "blocked_attacks", "successful_breaches", "mttd", "mttr",
                    "event_name", "event_severity", "mitre_tactic", "mitre_technique"
                ])
    
    def show_banner(self):
        """Show game banner"""
        print("\n" + "="*70)
        print("🛡️  CYBER DEFENSE SIMULATOR  🛡️")
        print("="*70)
        print("You are the SOC Manager. Defend against cyber threats.")
        print("All attacks based on real MITRE ATT&CK techniques.")
        print("="*70 + "\n")
    
    def show_status(self):
        """Show current SOC status"""
        print("\n" + "="*70)
        print(f"🕐 TURN {self.turn}/{self.max_turns} - SOC OPERATIONS CENTER")
        print("="*70)
        self.security.display()
        print("="*70)
    
    def save_turn_data(self, decision, event=None):
        """Save turn data for analysis"""
        with open(self.data_file, "a", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            
            event_name = event["name"] if event else ""
            event_severity = event["severity"] if event else ""
            mitre_tactic = event["mitre"]["tactic"] if event else ""
            mitre_technique = event["mitre"]["technique"] if event else ""
            
            writer.writerow([
                datetime.now().isoformat(),
                self.turn,
                decision.get("name", "Unknown"),
                decision.get("category", "unknown"),
                decision.get("cost", 0),
                self.security.security_score,
                self.security.budget,
                self.security.reputation,
                self.security.servers_infected,
                self.security.alerts_queue,
                self.security.active_threats,
                self.security.incidents_resolved,
                self.security.blocked_attacks,
                self.security.successful_breaches,
                self.security.mean_time_to_detect,
                self.security.mean_time_to_respond,
                event_name,
                event_severity,
                mitre_tactic,
                mitre_technique
            ])
    
    def check_game_over(self):
        """Check if game is over"""
        conditions = self.security.check_game_over()
        
        if conditions:
            print("\n" + "="*70)
            print("💥 GAME OVER - SOC OVERWHELMED 💥")
            print("="*70)
            print("\nFailure reasons:")
            for condition in conditions:
                print(f"  ❌ {condition}")
            print("\nYour infrastructure has been compromised.")
            print("The board has decided to replace you.")
            print("="*70 + "\n")
            self.game_over = True
            return True
        
        return False
    
    def check_victory(self):
        """Check if player won"""
        if self.turn > self.max_turns:
            print("\n" + "="*70)
            
            if self.security.security_score > 70 and self.security.successful_breaches == 0:
                print("🏆 VICTORY - EXCELLENT SOC DEFENSE! 🏆")
                print("="*70)
                print(f"\nFinal Security Score: {self.security.security_score}/100")
                print(f"Incidents Resolved: {self.security.incidents_resolved}")
                print(f"Attacks Blocked: {self.security.blocked_attacks}")
                print(f"Zero Successful Breaches!")
                print("\nYou are an elite SOC manager!")
            elif self.security.security_score > 50:
                print("✅ VICTORY - GOOD SOC DEFENSE ✅")
                print("="*70)
                print(f"\nFinal Security Score: {self.security.security_score}/100")
                print(f"Incidents Resolved: {self.security.incidents_resolved}")
                print(f"Successful Breaches: {self.security.successful_breaches}")
                print("\nYou maintained security despite challenges.")
            else:
                print("😐 SURVIVED... BARELY")
                print("="*70)
                print(f"\nFinal Security Score: {self.security.security_score}/100")
                print(f"Successful Breaches: {self.security.successful_breaches}")
                print("\nYour SOC survived, but improvements are needed.")
            
            print("="*70 + "\n")
            self.victory = True
            return True
        
        return False
    
    def show_decisions_menu(self):
        """Show decisions menu by category"""
        print("\n🎯 AVAILABLE ACTIONS - Choose wisely:\n")
        
        categories = {
            "1": ("🔍 Investigation", "investigate"),
            "2": ("🚨 Response", "respond"),
            "3": ("⬆️  Upgrade Tools", "upgrade"),
            "4": ("👥 Team Management", "team"),
            "5": ("🎯 Proactive Actions", "proactive")
        }
        
        print("CATEGORIES:")
        for key, (name, _) in categories.items():
            print(f"  {key}. {name}")
        
        # Get category choice
        while True:
            try:
                cat_choice = input("\n>>> Choose category (1-5): ").strip()
                if cat_choice in categories:
                    break
                print("❌ Invalid choice. Try again.")
            except (ValueError, KeyboardInterrupt):
                print("\n❌ Invalid input.")
        
        category_name, category_id = categories[cat_choice]
        decisions = self.decision_manager.get_decisions_by_category(category_id)
        
        print(f"\n{category_name}:")
        print("-" * 70)
        
        for i, decision in enumerate(decisions, 1):
            can_execute, msg = self.decision_manager.can_execute_decision(decision, self.security)
            status = "✅" if can_execute else "❌"
            
            print(f"\n{i}. {status} {decision['name']}")
            print(f"   💰 Cost: ${decision['cost']:,}")
            print(f"   📝 {decision['description']}")
            
            if not can_execute:
                print(f"   ⚠️  {msg}")
        
        # Get decision choice
        while True:
            try:
                choice = input(f"\n>>> Your decision (1-{len(decisions)}): ").strip()
                choice_idx = int(choice) - 1
                if 0 <= choice_idx < len(decisions):
                    return decisions[choice_idx]
                print("❌ Invalid number. Try again.")
            except ValueError:
                print("❌ Please enter a number.")
            except KeyboardInterrupt:
                print("\n⚠️  Cannot interrupt decision making!")
    
    def apply_event(self):
        """Trigger and apply random event"""
        # 70% chance of event occurring
        if random.random() > 0.3:
            event = self.event_manager.get_random_event()
            
            if event:
                severity_emoji = self.event_manager.get_severity_emoji(event["severity"])
                
                print("\n" + "="*70)
                print(f"🎲 SECURITY EVENT {severity_emoji}")
                print("="*70)
                print(f"\n{event['name']}")
                print(f"📝 {event['description']}")
                print(f"\n🏷️  MITRE ATT&CK:")
                print(f"   Tactic: {event['mitre']['tactic']}")
                print(f"   Technique: {event['mitre']['technique']}")
                
                # Apply effects
                if "effects" in event:
                    self.security.update_metrics(**event["effects"])
                
                print("="*70)
                
                return event
        
        return None
    
    def play_turn(self):
        """Execute one turn of the game"""
        # Show status
        self.show_status()
        
        # Process alerts with current team
        processed = self.security.process_alerts()
        if processed > 0:
            print(f"\n⚙️  Team processed {processed} alerts from queue")
        
        # Player decision
        decision = self.show_decisions_menu()
        
        # Execute decision
        print(f"\n⚙️  Executing: {decision['name']}...")
        success, message = self.decision_manager.execute_decision(decision, self.security)
        
        if success:
            print(message)
        else:
            print(f"❌ Cannot execute: {message}")
            print("⏭️  Taking no action this turn...")
        
        # Random event
        event = self.apply_event()
        
        # Save data
        self.save_turn_data(decision, event)
        
        # Advance turn
        self.turn += 1
        
        # Pause
        input("\n⏸️  Press ENTER to continue...")
    
    def run(self):
        """Main game loop"""
        self.show_banner()
        self.setup_data_file()
        
        print("🎮 Starting SOC operations...\n")
        input("Press ENTER to begin...")
        
        # Main loop
        while not self.game_over and not self.victory:
            self.play_turn()
            
            # Check conditions
            if self.check_game_over():
                break
            
            if self.check_victory():
                break
        
        # Show final stats
        print("\n" + "="*70)
        print("📊 FINAL STATISTICS")
        print("="*70)
        print(f"Turns Survived: {self.turn - 1}")
        print(f"Security Score: {self.security.security_score}/100")
        print(f"Incidents Resolved: {self.security.incidents_resolved}")
        print(f"Attacks Blocked: {self.security.blocked_attacks}")
        print(f"Successful Breaches: {self.security.successful_breaches}")
        print(f"MTTD: {self.security.mean_time_to_detect} min")
        print(f"MTTR: {self.security.mean_time_to_respond} min")
        print(f"Budget Remaining: ${self.security.budget:,}")
        print(f"Reputation: {self.security.reputation}/100")
        print("="*70)
        
        print(f"\n💾 Game data saved to: {self.data_file}")
        print("📊 Use analysis tools to review your performance!\n")

def main():
    """Entry point"""
    try:
        game = CyberDefenseSimulator()
        game.run()
    except KeyboardInterrupt:
        print("\n\n⚠️  Game interrupted by user. SOC shutdown.\n")
        sys.exit(0)

if __name__ == "__main__":
    main()
