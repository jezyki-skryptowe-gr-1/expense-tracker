import sys
import os

# /backend
BACKEND_DIR = os.path.dirname(os.path.dirname(__file__))

# Dodaj backend do sys.path
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)
