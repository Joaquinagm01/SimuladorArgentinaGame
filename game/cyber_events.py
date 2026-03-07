#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Eventos de Ciberseguridad basados en MITRE ATT&CK
Ataques reales que puede enfrentar el SOC
"""

import random

class CyberEventManager:
    def __init__(self):
        self.events = [
            # ============ INITIAL ACCESS - REDUCIDA SEVERIDAD============
            {
                "name": "📧 Phishing Campaign Detected",
                "description": "50+ emails sospechosos detectados. Phishing es un ataque donde el atacante finge ser una entidad confiable para robar credenciales. Estos emails intentan que empleados revelen sus contraseñas.",
                "mitre": {"tactic": "Initial Access", "technique": "T1566 - Phishing"},
                "severity": "medium",
                "effects": {
                    "alerts_queue": 8,  # Reducido de 15
                    "active_threats": 1,
                    "security_score": -3  # Reducido de -5
                },
                "probability": 0.25
            },
            {
                "name": "🌐 SQL Injection Attack",
                "description": "Intentos de SQL Injection contra el portal web. Este ataque manipula consultas SQL para acceder a la base de datos. El atacante inyecta código SQL malicioso en campos de entrada para extraer información.",
                "mitre": {"tactic": "Initial Access", "technique": "T1190 - Exploit Public-Facing Application"},
                "severity": "high",
                "effects": {
                    "alerts_queue": 12,  # Reducido de 25
                    "active_threats": 1,  # Reducido de 2
                    "security_score": -5  # Reducido de -10
                },
                "probability": 0.15
            },
            {
                "name": "🔐 Brute Force Login Attempts",
                "description": "1,500+ intentos de login fallidos desde IP 185.220.101.34. Ataque de fuerza bruta: el atacante prueba miles de contraseñas automáticamente hasta encontrar la correcta. Común contra servicios SSH, RDP y paneles web.",
                "mitre": {"tactic": "Initial Access", "technique": "T1110 - Brute Force"},
                "severity": "medium",
                "effects": {
                    "alerts_queue": 5,  # Reducido de 10
                    "active_threats": 1,
                    "security_score": -2  # Reducido de -3
                },
                "probability": 0.30
            },
            
            # ============ EXECUTION ============
            {
                "name": "💀 Malware Execution Detected",
                "description": "Proceso sospechoso 'svchost32.exe' en endpoint WS-FIN-042. Los atacantes disfrazan malware con nombres similares a procesos legítimos de Windows. El proceso real es 'svchost.exe', no 'svchost32.exe'.",
                "mitre": {"tactic": "Execution", "technique": "T1204 - User Execution"},
                "severity": "high",
                "effects": {
                    "alerts_queue": 20,
                    "active_threats": 2,
                    "servers_infected": 1,
                    "security_score": -12
                },
                "probability": 0.18
            },
            {
                "name": "📜 PowerShell Obfuscated Script",
                "description": "Script PowerShell ofuscado detectado. PowerShell es una herramienta legítima de Windows, pero los atacantes la usan para ejecutar comandos maliciosos. La ofuscación esconde el código real para evitar detección.",
                "mitre": {"tactic": "Execution", "technique": "T1059.001 - PowerShell"},
                "severity": "high",
                "effects": {
                    "alerts_queue": 30,
                    "active_threats": 2,
                    "security_score": -10
                },
                "probability": 0.12
            },
            
            # ============ PERSISTENCE ============
            {
                "name": "🔧 Registry Modification Detected",
                "description": "Clave de registro modificada en HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run. Esta ubicación permite que programas se ejecuten automáticamente al iniciar Windows. Los atacantes la usan para mantener persistencia.",
                "mitre": {"tactic": "Persistence", "technique": "T1547 - Boot or Logon Autostart"},
                "severity": "medium",
                "effects": {
                    "alerts_queue": 15,
                    "active_threats": 1,
                    "security_score": -7
                },
                "probability": 0.14
            },
            {
                "name": "👤 Suspicious Account Created",
                "description": "Nueva cuenta de administrador 'sysadmin01' creada en servidor SRV-DB-03. Los atacantes crean cuentas para mantener acceso permanente. Esta técnica de persistencia les permite volver incluso si se les expulsa.",
                "mitre": {"tactic": "Persistence", "technique": "T1136 - Create Account"},
                "severity": "high",
                "effects": {
                    "alerts_queue": 25,
                    "active_threats": 2,
                    "security_score": -15
                },
                "probability": 0.10
            },
            
            # ============ CREDENTIAL ACCESS ============
            {
                "name": "🔑 Credential Dumping Attempt",
                "description": "Intento de extraer contraseñas del proceso LSASS en DC-01. LSASS almacena credenciales en memoria. Herramientas como Mimikatz pueden extraerlas. Esto es MUY grave: el atacante podría robar todas las contraseñas.",
                "mitre": {"tactic": "Credential Access", "technique": "T1003 - OS Credential Dumping"},
                "severity": "critical",
                "effects": {
                    "alerts_queue": 50,
                    "active_threats": 3,
                    "security_score": -20,
                    "reputation": -10
                },
                "probability": 0.08
            },
            {
                "name": "🎣 Credentials in Traffic",
                "description": "Credenciales en texto plano detectadas en tráfico de red. Significa que contraseñas viajan sin cifrar. Cualquiera que monitoree la red puede verlas. Siempre usar HTTPS, SSH, o VPN.",
                "mitre": {"tactic": "Credential Access", "technique": "T1040 - Network Sniffing"},
                "severity": "high",
                "effects": {
                    "alerts_queue": 20,
                    "active_threats": 2,
                    "security_score": -10
                },
                "probability": 0.11
            },
            
            # ============ DISCOVERY ============
            {
                "name": "🔍 Network Scanning Detected",
                "description": "Escaneo de puertos desde IP interna 192.168.1.157. El atacante mapea la red buscando sistemas vulnerables. Como un ladrón revisando qué puertas y ventanas están abiertas antes de robar.",
                "mitre": {"tactic": "Discovery", "technique": "T1046 - Network Service Discovery"},
                "severity": "medium",
                "effects": {
                    "alerts_queue": 15,
                    "active_threats": 1,
                    "security_score": -5
                },
                "probability": 0.20
            },
            
            # ============ LATERAL MOVEMENT ============
            {
                "name": "↔️ Pass-the-Hash Attack",
                "description": "Ataque Pass-the-Hash detectado. El atacante usa hashes NTLM robados para autenticarse sin conocer la contraseña real. Esto permite moverse entre servidores. Muy peligroso - indica compromiso profundo.",
                "mitre": {"tactic": "Lateral Movement", "technique": "T1550.002 - Pass the Hash"},
                "severity": "critical",
                "effects": {
                    "alerts_queue": 40,
                    "active_threats": 3,
                    "servers_infected": 3,
                    "security_score": -18,
                    "reputation": -5
                },
                "probability": 0.07
            },
            {
                "name": "🪟 RDP Brute Force Success",
                "description": "Successful RDP login after 200 attempts. Server WEB-01 compromised.",
                "mitre": {"tactic": "Lateral Movement", "technique": "T1021.001 - Remote Desktop Protocol"},
                "severity": "critical",
                "effects": {
                    "alerts_queue": 35,
                    "active_threats": 2,
                    "servers_infected": 1,
                    "security_score": -15
                },
                "probability": 0.09
            },
            
            # ============ COMMAND & CONTROL ============
            {
                "name": "📡 C2 Beacon Detected",
                "description": "Periodic HTTPS beacons to suspicious domain: update-cdn[.]tk",
                "mitre": {"tactic": "Command and Control", "technique": "T1071 - Application Layer Protocol"},
                "severity": "critical",
                "effects": {
                    "alerts_queue": 45,
                    "active_threats": 3,
                    "servers_infected": 2,
                    "security_score": -20,
                    "reputation": -8
                },
                "probability": 0.06
            },
            {
                "name": "🌐 DNS Tunneling Activity",
                "description": "Consultas DNS anormales detectadas. DNS Tunneling usa peticiones DNS para comunicarse o extraer datos. Como enviar mensajes secretos dentro de solicitudes DNS normales. Difícil de detectar sin herramientas especializadas.",
                "mitre": {"tactic": "Command and Control", "technique": "T1071.004 - DNS"},
                "severity": "high",
                "effects": {
                    "alerts_queue": 30,
                    "active_threats": 2,
                    "security_score": -12
                },
                "probability": 0.10
            },
            
            # ============ EXFILTRATION ============
            {
                "name": "📤 Data Exfiltration Detected",
                "description": "2.5 GB transferidos a IP externa. Posible base de datos de clientes robada. Exfiltración = robo de datos. Esto puede resultar en multas regulatorias, demandas, y pérdida de reputación. EMERGENCIA.",
                "mitre": {"tactic": "Exfiltration", "technique": "T1041 - Exfiltration Over C2 Channel"},
                "severity": "critical",
                "effects": {
                    "alerts_queue": 50,
                    "active_threats": 3,
                    "security_score": -25,
                    "reputation": -20,
                    "successful_breaches": 1,
                    "budget": -15000
                },
                "probability": 0.05
            },
            
            # ============ IMPACT ============
            {
                "name": "🔐 Ransomware Detected",
                "description": "¡RANSOMWARE ACTIVO! 150 archivos encriptados con extensión .locked. Ransomware cifra archivos y pide pago para desbloquearlos. Es la amenaza más cara - puede paralizar una empresa completa. Backups y respuesta rápida son cruciales.",
                "mitre": {"tactic": "Impact", "technique": "T1486 - Data Encrypted for Impact"},
                "severity": "critical",
                "effects": {
                    "alerts_queue": 60,
                    "active_threats": 4,
                    "servers_infected": 5,
                    "security_score": -30,
                    "reputation": -25,
                    "successful_breaches": 1,
                    "budget": -25000
                },
                "probability": 0.04
            },
            {
                "name": "💥 DDoS Attack",
                "description": "Ataque DDoS contra sitio web público - 50Gbps de tráfico. DDoS (Distributed Denial of Service) satura servidores con tráfico falso para que usuarios legítimos no puedan acceder. Miles de computadoras zombies atacan simultáneamente.",
                "mitre": {"tactic": "Impact", "technique": "T1498 - Network Denial of Service"},
                "severity": "high",
                "effects": {
                    "alerts_queue": 40,
                    "active_threats": 2,
                    "security_score": -15,
                    "reputation": -10,
                    "budget": -5000
                },
                "probability": 0.08
            },
            
            # ============ POSITIVE EVENTS ============
            {
                "name": "✅ Security Audit Complete",
                "description": "Quarterly security audit finished. No critical findings.",
                "mitre": {"tactic": "None", "technique": "N/A"},
                "severity": "positive",
                "effects": {
                    "security_score": 10,
                    "reputation": 5,
                    "mitre_techniques_known": 5
                },
                "probability": 0.08
            },
            {
                "name": "🎓 Team Training Complete",
                "description": "SOC team completed training on latest threats.",
                "mitre": {"tactic": "None", "technique": "N/A"},
                "severity": "positive",
                "effects": {
                    "security_score": 5,
                    "mean_time_to_detect": -5,
                    "mean_time_to_respond": -10,
                    "mitre_techniques_known": 3
                },
                "probability": 0.10
            },
            {
                "name": "💰 Budget Increase Approved",
                "description": "Board approved additional security budget.",
                "mitre": {"tactic": "None", "technique": "N/A"},
                "severity": "positive",
                "effects": {
                    "budget": 30000,
                    "reputation": 3
                },
                "probability": 0.07
            },
            {
                "name": "🏆 Threat Hunt Success",
                "description": "Proactive threat hunt discovered hidden backdoor before activation!",
                "mitre": {"tactic": "None", "technique": "N/A"},
                "severity": "positive",
                "effects": {
                    "security_score": 15,
                    "reputation": 10,
                    "blocked_attacks": 1,
                    "ioc_database": 10
                },
                "probability": 0.05
            }
        ]
    
    def get_random_event(self):
        """Devuelve un evento aleatorio basado en probabilidades"""
        roll = random.random()
        cumulative_prob = 0
        
        for event in self.events:
            cumulative_prob += event["probability"]
            if roll <= cumulative_prob:
                return event
        
        # Si no hay evento, devolver None
        return None
    
    def get_severity_emoji(self, severity):
        """Devuelve emoji según severidad"""
        emojis = {
            "positive": "✅",
            "low": "🟢",
            "medium": "🟡",
            "high": "🟠",
            "critical": "🔴"
        }
        return emojis.get(severity, "⚪")
