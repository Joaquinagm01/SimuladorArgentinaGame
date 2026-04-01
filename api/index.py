"""Vercel entrypoint for the Flask app."""

import os
import sys

# Ensure the api directory is importable in serverless/module contexts.
CURRENT_DIR = os.path.dirname(__file__)
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

try:
    from soc_api import app
except ModuleNotFoundError:
    # Fallback when imported as package module (api.index)
    from api.soc_api import app

# Expose both names for compatibility with Vercel Python runtime.
handler = app
