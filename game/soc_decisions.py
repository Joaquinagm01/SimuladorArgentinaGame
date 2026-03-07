#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sistema de decisiones del SOC
Acciones y herramientas que puede usar el jefe del SOC
"""

class SOCDecisionManager:
    def __init__(self):
        self.decision_categories = {
            "investigate": self.get_investigation_decisions(),
            "respond": self.get_response_decisions(),
            "upgrade": self.get_upgrade_decisions(),
            "team": self.get_team_decisions(),
            "proactive": self.get_proactive_decisions()
        }
    
    def get_investigation_decisions(self):
        """Decisiones de investigación - COSTOS REDUCIDOS MODO FÁCIL"""
        return [
            {
                "id": "siem_analyze",
                "name": "🔍 Analyze SIEM Logs",
                "description": "Deep dive into SIEM logs to correlate events",
                "cost": 2000,  # Reducido de 5000
                "requirements": {"tools": ["SIEM"]},
                "effects": {
                    "alerts_queue": -10,  # Procesa más alertas
                    "active_threats": -1,
                    "ioc_database": 3,
                    "incidents_resolved": 1
                },
                "time_impact": {"mean_time_to_detect": -5}
            },
            {
                "id": "forensic_analysis",
                "name": "🔬 Forensic Analysis",
                "description": "Perform deep forensic analysis on compromised systems",
                "cost": 3000,  # Reducido de 8000
                "requirements": {},
                "effects": {
                    "active_threats": -2,
                    "ioc_database": 5,
                    "mitre_techniques_known": 2,
                    "incidents_resolved": 1
                },
                "time_impact": {"mean_time_to_respond": -10}
            },
            {
                "id": "threat_intel",
                "name": "🌐 Query Threat Intelligence",
                "description": "Check external threat intel feeds for IOCs",
                "cost": 1000,  # Reducido de 3000
                "requirements": {},
                "effects": {
                    "ioc_database": 10,
                    "mitre_techniques_known": 1,
                    "security_score": 3
                },
                "time_impact": {}
            }
        ]
    
    def get_response_decisions(self):
        """Decisiones de respuesta a incidentes - COSTOS REDUCIDOS"""
        return [
            {
                "id": "block_ip",
                "name": "🚫 Block Malicious IPs",
                "description": "Block suspicious IPs at firewall level",
                "cost": 500,  # Reducido de 1000
                "requirements": {},
                "effects": {
                    "active_threats": -1,
                    "blocked_attacks": 1,
                    "security_score": 5
                },
                "time_impact": {}
            },
            {
                "id": "isolate_endpoint",
                "name": "🔒 Isolate Infected Endpoints",
                "description": "Quarantine compromised systems from network",
                "cost": 1000,  # Reducido de 2000
                "requirements": {"tools": ["EDR"]},
                "effects": {
                    "active_threats": -2,
                    "servers_infected": -1,
                    "security_score": 8
                },
                "time_impact": {"mean_time_to_respond": -5}
            },
            {
                "id": "kill_process",
                "name": "💀 Kill Malicious Processes",
                "description": "Terminate suspicious processes remotely",
                "cost": 750,  # Reducido de 1500
                "requirements": {"tools": ["EDR"]},
                "effects": {
                    "active_threats": -1,
                    "security_score": 5,
                    "incidents_resolved": 1
                },
                "time_impact": {}
            },
            {
                "id": "reset_passwords",
                "name": "🔑 Force Password Reset",
                "description": "Force password reset for compromised accounts",
                "cost": 1500,  # Reducido de 3000
                "requirements": {},
                "effects": {
                    "active_threats": -1,
                    "security_score": 7,
                    "reputation": -2  # Users get angry
                },
                "time_impact": {}
            },
            {
                "id": "restore_backup",
                "name": "💾 Restore from Backup",
                "description": "Restore encrypted/damaged systems from backup",
                "cost": 4000,  # Reducido de 10000
                "requirements": {},
                "effects": {
                    "servers_infected": -3,
                    "security_score": 10,
                    "reputation": 5
                },
                "time_impact": {}
            },
            {
                "id": "patch_systems",
                "name": "🔧 Emergency Patching",
                "description": "Deploy critical security patches immediately",
                "cost": 3000,  # Reducido de 7000
                "requirements": {},
                "effects": {
                    "security_score": 12,
                    "endpoints_protected": 5,
                    "active_threats": -1
                },
                "time_impact": {}
            }
        ]
    
    def get_upgrade_decisions(self):
        """Decisiones de mejora de herramientas - COSTOS REDUCIDOS"""
        return [
            {
                "id": "activate_xdr",
                "name": "🚀 Deploy XDR Solution",
                "description": "Extended Detection & Response across all endpoints",
                "cost": 15000,  # Reducido de 50000
                "requirements": {},
                "effects": {
                    "security_score": 20,
                    "ioc_database": 50,
                    "mitre_techniques_known": 10
                },
                "tool_activation": "XDR",
                "time_impact": {"mean_time_to_detect": -15, "mean_time_to_respond": -20}
            },
            {
                "id": "activate_ips",
                "name": "🛡️ Enable IPS (Intrusion Prevention)",
                "description": "Auto-block attacks in real-time",
                "cost": 10000,  # Reducido de 30000
                "requirements": {"tools": ["IDS"]},
                "effects": {
                    "security_score": 15,
                    "blocked_attacks": 2
                },
                "tool_activation": "IPS",
                "time_impact": {}
            },
            {
                "id": "activate_waf",
                "name": "🌐 Deploy Web Application Firewall",
                "description": "Protect web apps from OWASP Top 10",
                "cost": 8000,  # Reducido de 25000
                "requirements": {},
                "effects": {
                    "security_score": 12,
                    "blocked_attacks": 1
                },
                "tool_activation": "WAF",
                "time_impact": {}
            },
            {
                "id": "activate_dlp",
                "name": "🔒 Enable Data Loss Prevention",
                "description": "Prevent sensitive data exfiltration",
                "cost": 12000,  # Reducido de 40000
                "requirements": {},
                "effects": {
                    "security_score": 15
                },
                "tool_activation": "DLP",
                "time_impact": {}
            },
            {
                "id": "upgrade_siem",
                "name": "📊 Upgrade SIEM Rules",
                "description": "Add custom detection rules and correlation logic",
                "cost": 5000,  # Reducido de 15000
                "requirements": {"tools": ["SIEM"]},
                "effects": {
                    "security_score": 10,
                    "ioc_database": 20,
                    "mitre_techniques_known": 5
                },
                "time_impact": {"mean_time_to_detect": -10}
            }
        ]
    
    def get_team_decisions(self):
        """Decisiones sobre el equipo SOC - COSTOS REDUCIDOS"""
        return [
            {
                "id": "hire_l1",
                "name": "👤 Hire L1 Analyst",
                "description": "Hire junior security analyst (1 alert/turn)",
                "cost": 5000,  # Reducido de 15000
                "requirements": {},
                "effects": {
                    "security_score": 3
                },
                "team_change": {"level": 1},
                "time_impact": {}
            },
            {
                "id": "hire_l2",
                "name": "👨‍💼 Hire L2 Analyst",
                "description": "Hire senior security analyst (2 alerts/turn)",
                "cost": 8000,  # Reducido de 30000
                "requirements": {},
                "effects": {
                    "security_score": 5
                },
                "team_change": {"level": 2},
                "time_impact": {"mean_time_to_respond": -5}
            },
            {
                "id": "hire_hunter",
                "name": "🎯 Hire Threat Hunter",
                "description": "Elite analyst for proactive hunting (3 alerts/turn)",
                "cost": 12000,  # Reducido de 50000
                "requirements": {},
                "effects": {
                    "security_score": 10,
                    "mitre_techniques_known": 5
                },
                "team_change": {"level": 3},
                "time_impact": {"mean_time_to_detect": -10}
            },
            {
                "id": "team_training",
                "name": "🎓 Security Training",
                "description": "Train team on latest threats and techniques",
                "cost": 6000,  # Reducido de 20000
                "requirements": {},
                "effects": {
                    "security_score": 8,
                    "mitre_techniques_known": 8,
                    "ioc_database": 15
                },
                "time_impact": {"mean_time_to_detect": -5, "mean_time_to_respond": -10}
            }
        ]
    
    def get_proactive_decisions(self):
        """Decisiones proactivas - COSTOS REDUCIDOS"""
        return [
            {
                "id": "threat_hunt",
                "name": "🎯 Threat Hunting Campaign",
                "description": "Proactively search for hidden threats",
                "cost": 4000,  # Reducido de 12000
                "requirements": {"team": {"threat_hunters": 1}},
                "effects": {
                    "active_threats": -2,
                    "ioc_database": 10,
                    "mitre_techniques_known": 3,
                    "security_score": 10,
                    "reputation": 5
                },
                "time_impact": {}
            },
            {
                "id": "pentest",
                "name": "🔴 Red Team Exercise",
                "description": "Simulate attack to find weaknesses",
                "cost": 8000,  # Reducido de 25000
                "requirements": {},
                "effects": {
                    "security_score": 15,
                    "mitre_techniques_known": 10,
                    "reputation": 8
                },
                "time_impact": {"mean_time_to_detect": -10, "mean_time_to_respond": -15}
            },
            {
                "id": "vuln_scan",
                "name": "🔍 Vulnerability Assessment",
                "description": "Scan infrastructure for vulnerabilities",
                "cost": 3000,  # Reducido de 8000
                "requirements": {},
                "effects": {
                    "security_score": 8,
                    "ioc_database": 5
                },
                "time_impact": {}
            },
            {
                "id": "update_iocs",
                "name": "📋 Update IOC Database",
                "description": "Import latest indicators from threat feeds",
                "cost": 2000,  # Reducido de 5000
                "requirements": {},
                "effects": {
                    "ioc_database": 25,
                    "mitre_techniques_known": 3,
                    "security_score": 5
                },
                "time_impact": {}
            },
            {
                "id": "ignore",
                "name": "⏭️ Do Nothing",
                "description": "Process alerts with current team and wait",
                "cost": 0,
                "requirements": {},
                "effects": {},
                "time_impact": {}
            }
        ]
    
    def get_all_decisions(self):
        """Devuelve todas las decisiones disponibles"""
        all_decisions = []
        for category, decisions in self.decision_categories.items():
            for decision in decisions:
                decision["category"] = category
                all_decisions.append(decision)
        return all_decisions
    
    def get_decisions_by_category(self, category):
        """Devuelve decisiones de una categoría específica"""
        return self.decision_categories.get(category, [])
    
    def can_execute_decision(self, decision, security_system):
        """Verifica si se puede ejecutar una decisión"""
        # Check budget
        if decision["cost"] > security_system.budget:
            return False, "Insufficient budget"
        
        # Check tool requirements
        if "requirements" in decision and "tools" in decision["requirements"]:
            for tool in decision["requirements"]["tools"]:
                if not security_system.tools.get(tool, False):
                    return False, f"Requires {tool} to be active"
        
        # Check team requirements
        if "requirements" in decision and "team" in decision["requirements"]:
            team_reqs = decision["requirements"]["team"]
            if "threat_hunters" in team_reqs:
                if security_system.threat_hunters < team_reqs["threat_hunters"]:
                    return False, "Requires at least 1 Threat Hunter"
        
        return True, "OK"
    
    def execute_decision(self, decision, security_system):
        """Ejecuta una decisión y aplica sus efectos"""
        can_execute, message = self.can_execute_decision(decision, security_system)
        
        if not can_execute:
            return False, message
        
        # Apply cost
        security_system.budget -= decision["cost"]
        
        # Apply effects
        if "effects" in decision:
            security_system.update_metrics(**decision["effects"])
        
        # Apply time impacts
        if "time_impact" in decision:
            for metric, change in decision["time_impact"].items():
                current = getattr(security_system, metric)
                setattr(security_system, metric, max(1, current + change))
        
        # Activate tools
        if "tool_activation" in decision:
            security_system.tools[decision["tool_activation"]] = True
        
        # Team changes
        if "team_change" in decision:
            level = decision["team_change"]["level"]
            security_system.hire_analyst(level, 0)  # Already paid in cost
        
        return True, f"✅ {decision['name']} executed successfully!"
