
PROJECT_ROOT=$(PWD)
BACKEND_DIR=$(PROJECT_ROOT)/backend
FRONTEND_DIR=$(PROJECT_ROOT)/frontend

# Configuration for backend 
# Defaults below, can be overriden by ENV vars
GUNICORN_WORKERS ?= "2"
BACKEND_HOST ?= "0.0.0.0"
BACKEND_PORT ?= "5000"

# Checks if commands exist
EXECUTABLES = pip npm
K := $(foreach exec,$(EXECUTABLES),\
        $(if $(shell which $(exec)),some string,$(error "No $(exec) in PATH")))

all: backend frontend

# Backend goals
build-backend:
	pip install --upgrade pip
	pip install -r $(BACKEND_DIR)/requirements.txt

start-backend: build-backend
	export PYTHONPATH="$(PROJECT_ROOT)" && exec gunicorn -w "$(GUNICORN_WORKERS)" -b "$(BACKEND_HOST):$(BACKEND_PORT)" backend.app:app

backend: start-backend

# Frontend goals
build-frontend:
	npm install $(FRONTEND_DIR)
	npm run --prefix $(FRONTEND_DIR) build
	rm $(PROJECT_ROOT)/package.json $(PROJECT_ROOT)/package-lock.json 

start-frontend:
	npm run --prefix $(FRONTEND_DIR) dev

frontend: start-frontend

# Dev goals
dev: start-backend 
	npm run --prefix $(FRONTEND_DIR) dev

build: build-frontend build-backend