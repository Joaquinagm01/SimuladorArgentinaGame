#!/bin/bash
# Script para hacer git push sin problemas en Codespaces

cd /home/codespace/SimuladorArgentinaGame

# Desactivar temporalmente GITHUB_TOKEN para usar gh auth
unset GITHUB_TOKEN

# Hacer push
git push "$@"
