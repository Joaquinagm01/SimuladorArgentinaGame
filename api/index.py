"""Vercel entrypoint for the Flask app."""

from soc_api import app

# Expose both names for compatibility with Vercel Python runtime.
handler = app
