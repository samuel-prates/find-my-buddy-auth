# Makefile for Find My Buddy Auth API Docker operations

# Variables
DOCKER_COMPOSE_FILE = docker/docker-compose.yml
SERVICE_NAME = auth-api
DB_SERVICE_NAME = postgres

# Colors for terminal output
GREEN = \033[0;32m
YELLOW = \033[0;33m
RED = \033[0;31m
NC = \033[0m # No Color

# Help command
.PHONY: help
help:
	@echo "${YELLOW}Find My Buddy Auth API Docker Commands${NC}"
	@echo "${GREEN}make up${NC}              - Start all containers in detached mode"
	@echo "${GREEN}make down${NC}            - Stop and remove containers, networks"
	@echo "${GREEN}make restart${NC}         - Restart all containers"
	@echo "${GREEN}make logs${NC}            - View logs from all containers"
	@echo "${GREEN}make logs-api${NC}        - View logs from API container only"
	@echo "${GREEN}make logs-db${NC}         - View logs from database container only"
	@echo "${GREEN}make ps${NC}              - List running containers"
	@echo "${GREEN}make build${NC}           - Rebuild all containers"
	@echo "${GREEN}make clean${NC}           - Remove containers, networks, images, and volumes"
	@echo "${GREEN}make prune${NC}           - Remove all unused containers, networks, images (system-wide)"
	@echo "${GREEN}make seed-admin${NC}      - Create default admin user"

# Start containers
.PHONY: up
up:
	@echo "${GREEN}Starting containers...${NC}"
	docker-compose -f $(DOCKER_COMPOSE_FILE) up -d

# Stop containers
.PHONY: down
down:
	@echo "${YELLOW}Stopping containers...${NC}"
	docker-compose -f $(DOCKER_COMPOSE_FILE) down

# Restart containers
.PHONY: restart
restart:
	@echo "${YELLOW}Restarting containers...${NC}"
	docker-compose -f $(DOCKER_COMPOSE_FILE) restart

# View logs
.PHONY: logs
logs:
	@echo "${GREEN}Showing logs...${NC}"
	docker-compose -f $(DOCKER_COMPOSE_FILE) logs -f

# View API logs
.PHONY: logs-api
logs-api:
	@echo "${GREEN}Showing API logs...${NC}"
	docker-compose -f $(DOCKER_COMPOSE_FILE) logs -f $(SERVICE_NAME)

# View DB logs
.PHONY: logs-db
logs-db:
	@echo "${GREEN}Showing database logs...${NC}"
	docker-compose -f $(DOCKER_COMPOSE_FILE) logs -f $(DB_SERVICE_NAME)

# List running containers
.PHONY: ps
ps:
	@echo "${GREEN}Listing containers...${NC}"
	docker-compose -f $(DOCKER_COMPOSE_FILE) ps

# Rebuild containers
.PHONY: build
build:
	@echo "${GREEN}Building containers...${NC}"
	docker-compose -f $(DOCKER_COMPOSE_FILE) build

# Remove containers, networks, images, and volumes
.PHONY: clean
clean:
	@echo "${RED}Removing containers, networks, images, and volumes...${NC}"
	docker-compose -f $(DOCKER_COMPOSE_FILE) down --rmi all -v

# Prune system
.PHONY: prune
prune:
	@echo "${RED}Pruning unused Docker resources...${NC}"
	docker system prune -a

# Create default admin user
.PHONY: seed-admin
seed-admin:
	@echo "${GREEN}Creating default admin user...${NC}"
	npm run seed:admin
