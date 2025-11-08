#!/bin/bash

source $(realpath `dirname $0`)/setup-vars.sh

if ! command -v pip >/dev/null 2>&1; then
  echo "pip not found. Please ensure Python is installed." >&2
  exit 1
fi

python --version || true
pip install --upgrade pip >/dev/null

REQ_FILE="$BACKEND_DIR/requirements.txt"
test -f $REQ_FILE || { echo "file not found $REQ_FILE"; exit 1; }
pip install -r $REQ_FILE