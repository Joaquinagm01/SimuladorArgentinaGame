#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sistema de Seguridad del SOC
Variables y métricas del Security Operations Center
"""

class SecuritySystem:
    def __init__(self):
        # Métricas principales del SOC - MODO FÁCIL
        self.security_score = 85  # Puntuación general de seguridad (0-100) - MUY alto para aprender
        self.budget = 250000  # Presupuesto en USD - MUCHO dinero para experimentar
        self.reputation = 75  # Reputación de la organización (0-100) - Buenos comienzos
        self.income_per_turn = 15000  # NUEVO: Ingresos pasivos por turno - para que siempre pueda mejorar
        
        # Infraestructura
        self.servers_infected = 0  # Servidores comprometidos
        self.total_servers = 100  # Total de servidores
        self.endpoints_protected = 95  # Endpoints con protección (%) - Casi todos protegidos
        
        # Herramientas de Seguridad Activas
        self.tools = {
            "SIEM": True,  # Sistema de correlación de logs
            "EDR": True,   # Endpoint Detection & Response
            "XDR": False,  # Extended Detection & Response
            "IDS": True,   # Intrusion Detection System
            "IPS": False,  # Intrusion Prevention System
            "WAF": False,  # Web Application Firewall
            "DLP": False,  # Data Loss Prevention
        }
        
        # Equipo SOC - Equipo GRANDE para modo fácil
        self.analysts_l1 = 6  # Analistas nivel 1 (1 alerta/turno cada uno)
        self.analysts_l2 = 5  # Analistas nivel 2 (2 alertas/turno cada uno)
        self.threat_hunters = 2  # Threat hunters (3 alertas/turno)
        # Capacidad total: 6 + 10 + 6 = 22 alertas por turno!
        
        # Métricas de respuesta
        self.alerts_queue = 0  # Alertas pendientes
        self.incidents_resolved = 0  # Incidentes resueltos
        self.mean_time_to_detect = 25  # MTTD en minutos - Detección RÁPIDA
        self.mean_time_to_respond = 60  # MTTR en minutos - Respuesta RÁPIDA
        
        # Amenazas activas
        self.active_threats = 0  # Amenazas en curso
        self.blocked_attacks = 0  # Ataques bloqueados
        self.successful_breaches = 0  # Brechas exitosas
        
        # Base de conocimiento
        self.ioc_database = 150  # Indicadores de compromiso conocidos
        self.mitre_techniques_known = 20  # Técnicas MITRE conocidas
        
    def display(self):
        """Muestra el estado del SOC con emojis"""
        
        # Emojis según el estado
        security_emoji = "🛡️" if self.security_score > 70 else "⚠️" if self.security_score > 40 else "🚨"
        budget_emoji = "💰" if self.budget > 75000 else "💸" if self.budget > 30000 else "🪙"
        reputation_emoji = "⭐" if self.reputation > 70 else "😐" if self.reputation > 40 else "💀"
        
        infected_pct = (self.servers_infected / self.total_servers) * 100
        health_emoji = "✅" if infected_pct < 5 else "⚠️" if infected_pct < 20 else "🔥"
        
        alerts_emoji = "📋" if self.alerts_queue < 10 else "📊" if self.alerts_queue < 30 else "🚨"
        threats_emoji = "🟢" if self.active_threats == 0 else "🟡" if self.active_threats < 3 else "🔴"
        
        # Calcular capacidad del equipo
        team_capacity = self.analysts_l1 + (self.analysts_l2 * 2) + (self.threat_hunters * 3)
        
        print(f"""
{security_emoji}  Security Score: {self.security_score}/100 ({self.get_security_level()})
{budget_emoji}  Budget: ${self.budget:,.0f} USD
{reputation_emoji}  Reputation: {self.reputation}/100

📊 INFRASTRUCTURE
{health_emoji}  Servers: {self.total_servers - self.servers_infected}/{self.total_servers} healthy ({infected_pct:.0f}% infected)
🖥️   Endpoints Protected: {self.endpoints_protected}%

🛠️  SOC TOOLS
{self.tool_status_display()}

👥 TEAM
   L1 Analysts: {self.analysts_l1}
   L2 Analysts: {self.analysts_l2}
   Threat Hunters: {self.threat_hunters}
   Team Capacity: {team_capacity} alerts/turn

📈 METRICS
{alerts_emoji}  Alerts in Queue: {self.alerts_queue}
{threats_emoji}  Active Threats: {self.active_threats}
✅  Incidents Resolved: {self.incidents_resolved}
🛡️   Attacks Blocked: {self.blocked_attacks}
💀  Successful Breaches: {self.successful_breaches}
⏱️   MTTD: {self.mean_time_to_detect} min | MTTR: {self.mean_time_to_respond} min

🧠 KNOWLEDGE BASE
   IOC Database: {self.ioc_database} indicators
   MITRE Techniques: {self.mitre_techniques_known}/578
        """)
    
    def tool_status_display(self):
        """Muestra el estado de las herramientas"""
        result = ""
        for tool, active in self.tools.items():
            status = "🟢 ON " if active else "🔴 OFF"
            result += f"   {status} {tool}\n"
        return result.rstrip()
    
    def get_security_level(self):
        """Devuelve el nivel de seguridad"""
        if self.security_score > 80:
            return "EXCELLENT"
        elif self.security_score > 60:
            return "GOOD"
        elif self.security_score > 40:
            return "FAIR"
        elif self.security_score > 20:
            return "POOR"
        else:
            return "CRITICAL"
    
    def update_metrics(self, **kwargs):
        """Actualiza métricas del sistema"""
        for key, value in kwargs.items():
            if hasattr(self, key):
                current = getattr(self, key)
                setattr(self, key, max(0, current + value))
        
        # Recalcular security score
        self.calculate_security_score()
    
    def calculate_security_score(self):
        """Calcula el score de seguridad basado en múltiples factores"""
        score = 50  # Base
        
        # Infraestructura sana
        infected_pct = (self.servers_infected / self.total_servers) * 100
        score += (100 - infected_pct) * 0.2
        
        # Herramientas activas
        active_tools = sum(1 for t in self.tools.values() if t)
        score += (active_tools / len(self.tools)) * 20
        
        # Sin amenazas activas
        if self.active_threats == 0:
            score += 10
        else:
            score -= self.active_threats * 3
        
        # Brechas exitosas penalizan
        score -= self.successful_breaches * 5
        
        # Alertas controladas
        if self.alerts_queue < 10:
            score += 5
        elif self.alerts_queue > 50:
            score -= 10
        
        self.security_score = max(0, min(100, score))
    
    def activate_tool(self, tool_name, cost):
        """Activa una herramienta de seguridad"""
        if tool_name in self.tools and self.budget >= cost:
            self.tools[tool_name] = True
            self.budget -= cost
            self.calculate_security_score()
            return True
        return False
    
    def hire_analyst(self, level, cost):
        """Contrata un analista"""
        if self.budget >= cost:
            if level == 1:
                self.analysts_l1 += 1
            elif level == 2:
                self.analysts_l2 += 1
            elif level == 3:
                self.threat_hunters += 1
            self.budget -= cost
            return True
        return False
    
    def process_alerts(self):
        """Procesa alertas con el equipo disponible"""
        team_capacity = self.analysts_l1 + (self.analysts_l2 * 2) + (self.threat_hunters * 3)
        processed = min(self.alerts_queue, team_capacity)
        self.alerts_queue = max(0, self.alerts_queue - processed)
        return processed
    
    def check_game_over(self):
        """Verifica condiciones de game over"""
        conditions = []
        
        if self.security_score <= 0:
            conditions.append("Security score reached 0")
        
        if self.successful_breaches >= 5:
            conditions.append("Too many successful breaches (5+)")
        
        if self.servers_infected >= self.total_servers * 0.8:
            conditions.append("80%+ of infrastructure compromised")
        
        if self.reputation <= 0:
            conditions.append("Reputation destroyed")
        
        return conditions
