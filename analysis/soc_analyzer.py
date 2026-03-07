#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
📊 SOC Performance Analysis Tool
Analyze game data and generate security metrics dashboard
"""

import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime
import os

class SOCAnalyzer:
    def __init__(self, data_file="../data/soc_data.csv"):
        self.data_file = data_file
        self.df = None
        
        # Set style
        plt.style.use('dark_background')
        sns.set_palette("husl")
        
    def load_data(self):
        """Load game data from CSV"""
        if not os.path.exists(self.data_file):
            print(f"❌ Data file not found: {self.data_file}")
            print("⚠️  Play the game first to generate data!")
            return False
        
        self.df = pd.read_csv(self.data_file)
        self.df['timestamp'] = pd.to_datetime(self.df['timestamp'])
        
        print(f"✅ Loaded {len(self.df)} turns of SOC data")
        return True
    
    def summary_stats(self):
        """Display summary statistics"""
        if self.df is None:
            return
        
        print("\n" + "="*60)
        print("📊 SOC PERFORMANCE SUMMARY")
        print("="*60)
        
        total_games = len(self.df['timestamp'].dt.date.unique())
        print(f"\n🎮 Total Simulations: {total_games}")
        print(f"📅 Total Turns: {len(self.df)}")
        
        print(f"\n🛡️  SECURITY METRICS:")
        print(f"   Average Security Score: {self.df['security_score'].mean():.1f}/100")
        print(f"   Final Security Score: {self.df['security_score'].iloc[-1]:.1f}/100")
        print(f"   Min Security Score: {self.df['security_score'].min():.1f}")
        print(f"   Max Security Score: {self.df['security_score'].max():.1f}")
        
        print(f"\n🚨 THREAT RESPONSE:")
        print(f"   Total Incidents Resolved: {self.df['incidents_resolved'].max()}")
        print(f"   Total Attacks Blocked: {self.df['blocked_attacks'].max()}")
        print(f"   Successful Breaches: {self.df['successful_breaches'].max()}")
        print(f"   Max Active Threats (peak): {self.df['active_threats'].max()}")
        
        print(f"\n💰 BUDGET:")
        print(f"   Starting Budget: ${self.df['budget'].iloc[0]:,.0f}")
        print(f"   Final Budget: ${self.df['budget'].iloc[-1]:,.0f}")
        print(f"   Total Spent: ${self.df['budget'].iloc[0] - self.df['budget'].iloc[-1]:,.0f}")
        
        print(f"\n⏱️  RESPONSE TIMES:")
        print(f"   Average MTTD: {self.df['mttd'].mean():.1f} min")
        print(f"   Average MTTR: {self.df['mttr'].mean():.1f} min")
        print(f"   Best MTTD: {self.df['mttd'].min():.1f} min")
        print(f"   Best MTTR: {self.df['mttr'].min():.1f} min")
        
        print(f"\n⭐ REPUTATION:")
        print(f"   Starting Reputation: {self.df['reputation'].iloc[0]}")
        print(f"   Final Reputation: {self.df['reputation'].iloc[-1]}")
        print(f"   Change: {self.df['reputation'].iloc[-1] - self.df['reputation'].iloc[0]:+.0f}")
        
        print("\n" + "="*60)
    
    def mitre_analysis(self):
        """Analyze MITRE ATT&CK techniques encountered"""
        if self.df is None:
            return
        
        print("\n" + "="*60)
        print("🏷️  MITRE ATT&CK ANALYSIS")
        print("="*60)
        
        # Filter events
        events = self.df[self.df['event_name'].notna()]
        
        if len(events) == 0:
            print("No events recorded.")
            return
        
        print(f"\n📊 Total Security Events: {len(events)}")
        
        # Tactics
        print(f"\n🎯 TACTICS ENCOUNTERED:")
        tactics = events['mitre_tactic'].value_counts()
        for tactic, count in tactics.items():
            if pd.notna(tactic):
                print(f"   {tactic}: {count}")
        
        # Techniques
        print(f"\n🔧 TOP TECHNIQUES:")
        techniques = events['mitre_technique'].value_counts().head(10)
        for technique, count in techniques.items():
            if pd.notna(technique):
                print(f"   {technique}: {count}")
        
        # Severity
        print(f"\n⚠️  SEVERITY DISTRIBUTION:")
        severity = events['event_severity'].value_counts()
        for sev, count in severity.items():
            if pd.notna(sev):
                emoji = {"positive": "✅", "low": "🟢", "medium": "🟡", 
                        "high": "🟠", "critical": "🔴"}.get(sev, "⚪")
                print(f"   {emoji} {sev.upper()}: {count}")
        
        print("\n" + "="*60)
    
    def decision_analysis(self):
        """Analyze decision patterns"""
        if self.df is None:
            return
        
        print("\n" + "="*60)
        print("💡 DECISION ANALYSIS")
        print("="*60)
        
        print(f"\n📋 DECISION CATEGORIES:")
        categories = self.df['decision_category'].value_counts()
        for cat, count in categories.items():
            if pd.notna(cat):
                print(f"   {cat.title()}: {count} times")
        
        print(f"\n💰 TOP 5 MOST EXPENSIVE DECISIONS:")
        expensive = self.df.nlargest(5, 'decision_cost')[['decision', 'decision_cost', 'turn']]
        for idx, row in expensive.iterrows():
            print(f"   Turn {row['turn']}: {row['decision']} (${row['decision_cost']:,.0f})")
        
        print(f"\n💸 TOTAL INVESTMENT BY CATEGORY:")
        category_spending = self.df.groupby('decision_category')['decision_cost'].sum().sort_values(ascending=False)
        for cat, total in category_spending.items():
            if pd.notna(cat) and total > 0:
                print(f"   {cat.title()}: ${total:,.0f}")
        
        print("\n" + "="*60)
    
    def plot_security_timeline(self):
        """Plot security score over time"""
        if self.df is None:
            return
        
        plt.figure(figsize=(12, 6))
        plt.plot(self.df['turn'], self.df['security_score'], 
                linewidth=2, color='#00ff41', marker='o', markersize=4)
        plt.axhline(y=70, color='yellow', linestyle='--', alpha=0.5, label='Target')
        plt.axhline(y=40, color='red', linestyle='--', alpha=0.5, label='Critical')
        
        plt.xlabel('Turn', fontsize=12)
        plt.ylabel('Security Score', fontsize=12)
        plt.title('🛡️ Security Score Timeline', fontsize=14, fontweight='bold')
        plt.grid(True, alpha=0.3)
        plt.legend()
        plt.tight_layout()
        plt.savefig('../analysis/security_timeline.png', dpi=150, facecolor='#0a0e1a')
        print("✅ Saved: security_timeline.png")
        plt.show()
    
    def plot_threat_landscape(self):
        """Plot active threats and alerts over time"""
        if self.df is None:
            return
        
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
        
        # Active threats
        ax1.plot(self.df['turn'], self.df['active_threats'], 
                color='#ff3366', linewidth=2, marker='o', markersize=4)
        ax1.set_xlabel('Turn', fontsize=11)
        ax1.set_ylabel('Active Threats', fontsize=11)
        ax1.set_title('🚨 Active Threats Over Time', fontsize=12, fontweight='bold')
        ax1.grid(True, alpha=0.3)
        
        # Alerts queue
        ax2.plot(self.df['turn'], self.df['alerts_queue'], 
                color='#ffaa00', linewidth=2, marker='o', markersize=4)
        ax2.set_xlabel('Turn', fontsize=11)
        ax2.set_ylabel('Alerts in Queue', fontsize=11)
        ax2.set_title('📋 Alerts Queue Over Time', fontsize=12, fontweight='bold')
        ax2.grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.savefig('../analysis/threat_landscape.png', dpi=150, facecolor='#0a0e1a')
        print("✅ Saved: threat_landscape.png")
        plt.show()
    
    def plot_mitre_heatmap(self):
        """Plot MITRE ATT&CK heatmap"""
        if self.df is None:
            return
        
        events = self.df[self.df['event_name'].notna()]
        
        if len(events) == 0:
            print("❌ No events to plot")
            return
        
        # Create pivot table
        pivot = events.groupby(['mitre_tactic', 'event_severity']).size().unstack(fill_value=0)
        
        if pivot.empty:
            print("❌ Not enough data for heatmap")
            return
        
        plt.figure(figsize=(10, 6))
        sns.heatmap(pivot, annot=True, fmt='d', cmap='YlOrRd', 
                   cbar_kws={'label': 'Count'})
        plt.title('🏷️ MITRE ATT&CK Tactics by Severity', fontsize=14, fontweight='bold')
        plt.xlabel('Severity', fontsize=12)
        plt.ylabel('Tactic', fontsize=12)
        plt.tight_layout()
        plt.savefig('../analysis/mitre_heatmap.png', dpi=150, facecolor='#0a0e1a')
        print("✅ Saved: mitre_heatmap.png")
        plt.show()
    
    def plot_response_metrics(self):
        """Plot MTTD and MTTR improvement"""
        if self.df is None:
            return
        
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))
        
        # MTTD
        ax1.plot(self.df['turn'], self.df['mttd'], 
                color='#00ccff', linewidth=2, marker='o', markersize=4)
        ax1.set_xlabel('Turn', fontsize=11)
        ax1.set_ylabel('Minutes', fontsize=11)
        ax1.set_title('⏱️ Mean Time To Detect (MTTD)', fontsize=12, fontweight='bold')
        ax1.grid(True, alpha=0.3)
        
        # MTTR
        ax2.plot(self.df['turn'], self.df['mttr'], 
                color='#ff00ff', linewidth=2, marker='o', markersize=4)
        ax2.set_xlabel('Turn', fontsize=11)
        ax2.set_ylabel('Minutes', fontsize=11)
        ax2.set_title('⏱️ Mean Time To Respond (MTTR)', fontsize=12, fontweight='bold')
        ax2.grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.savefig('../analysis/response_metrics.png', dpi=150, facecolor='#0a0e1a')
        print("✅ Saved: response_metrics.png")
        plt.show()
    
    def generate_report(self):
        """Generate complete analysis report"""
        print("\n" + "="*60)
        print("🔍 GENERATING SOC PERFORMANCE REPORT")
        print("="*60)
        
        if not self.load_data():
            return
        
        # Create analysis directory
        os.makedirs("../analysis", exist_ok=True)
        
        # Text analysis
        self.summary_stats()
        self.mitre_analysis()
        self.decision_analysis()
        
        # Visual analysis
        print("\n📊 Generating visualizations...")
        self.plot_security_timeline()
        self.plot_threat_landscape()
        self.plot_mitre_heatmap()
        self.plot_response_metrics()
        
        print("\n✅ Report generation complete!")
        print("📁 All charts saved to: ../analysis/")
        print("="*60 + "\n")

def main():
    """Main entry point"""
    analyzer = SOCAnalyzer()
    analyzer.generate_report()

if __name__ == "__main__":
    main()
