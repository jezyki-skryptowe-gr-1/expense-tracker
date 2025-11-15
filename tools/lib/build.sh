#!/bin/bash
set -euo pipefail

PROJECT_ROOT=$(dirname "$0" | xargs -I {} realpath {}/../ )
BACKEND_DIR=${PROJECT_ROOT}/backend
FRONTEND_DIR=${PROJECT_ROOT}/frontend

function build-backend() {
    pip install --upgrade pip
    pip install -r ${BACKEND_DIR}/requirements.txt
}

function start-backend() {
    GUNICORN_WORKERS="${1:-2}"
    BACKEND_HOST="${2:-0.0.0.0}"
    BACKEND_PORT="${3:-5000}"
    exec gunicorn -w "${GUNICORN_WORKERS}" \
        -b "${BACKEND_HOST}:${BACKEND_PORT}" \
        backend.app:app
}

function build-frontend() {
    npm install ${FRONTEND_DIR}
	npm run --prefix ${FRONTEND_DIR} build
	trap "rm ${PWD}/package.json ${PWD}/package-lock.json" 1 2 3 6
}

function start-frontend() {
    npm run --prefix ${FRONTEND_DIR} dev
}

function test-backend() {
    pytest ${BACKEND_DIR}/tests/users_repository_test.py
}

`basename $0` $@