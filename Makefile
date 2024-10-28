.PHONY: web run clean simulate summary reset help build docker-run

CONFIG_PATH = config/student_management.cfg
DATA_DIR = data/
SRC_DIR = src/
LOG_DIR = logs/
SUMMARY_DIR = $(DATA_DIR)summary/
LOG_FILE = $(LOG_DIR)/project.log

DOCKER_IMAGE = student_info_management
DOCKER_CONTAINER = student_info_management_container

# Targets

# Run the project inside Docker: Generate basic info, simulate academic data, merge info, and generate summary
run:
	@echo "Generating basic_info.txt..."
	docker exec $(DOCKER_CONTAINER) python3 $(SRC_DIR)student_info_manager.py --generate-basic-info --config $(CONFIG_PATH)
	@echo "Simulating academic data..."
	docker exec $(DOCKER_CONTAINER) python3 $(SRC_DIR)simulation.py --simulate --config $(CONFIG_PATH)
	@echo "Merging basic_info.txt and academic_info.txt into student_info.txt..."
	docker exec $(DOCKER_CONTAINER) python3 $(SRC_DIR)student_info_manager.py --merge-info --config $(CONFIG_PATH)
	@echo "Process completed!"

clean:
	@echo "Cleaning generated files..."
	docker exec $(DOCKER_CONTAINER) rm -f $(DATA_DIR)basic_info.txt
	docker exec $(DOCKER_CONTAINER) rm -f $(DATA_DIR)academic_info.txt
	docker exec $(DOCKER_CONTAINER) rm -f $(DATA_DIR)student_info.txt
	docker exec $(DOCKER_CONTAINER) rm -f $(DATA_DIR)student_summary.txt
	docker exec $(DOCKER_CONTAINER) rm -rf $(SUMMARY_DIR)
	@echo "Cleanup complete. All generated files have been removed."

simulate:
	@echo "Simulating academic data..."
	docker exec $(DOCKER_CONTAINER) python3 $(SRC_DIR)simulation.py --simulate --config $(CONFIG_PATH)

summary:
	@echo "Generating student summary..."
	docker exec $(DOCKER_CONTAINER) python3 $(SRC_DIR)generate_summary.py --config $(CONFIG_PATH)

# Reset the entire project environment
reset: clean
	@echo "Resetting the project environment..."

# Web target to run Next.js
web:
	@echo "Checking and killing any process running on port 3000..."
	-lsof -ti tcp:3000 | xargs kill -9 || true
	@echo "Starting Next.js app..."
	(cd web && bun run start &) # Run Next.js in the background
	@trap 'echo "Stopping Next.js..."; lsof -ti tcp:3000 | xargs kill -9' INT
	@echo "Next.js app is running at http://localhost:3000"

help:
	@echo "Usage:"
	@echo "  make run          - Run the project"
	@echo "  make clean        - Clean all generated files"
	@echo "  make simulate     - Run the academic data simulation"
	@echo "  make summary      - Generate a student summary"
	@echo "  make reset        - Reset the project (clean and prepare)"
	@echo "  make help         - Show this help message"
	@echo "  make web          - Start the Next.js web app"

# Build Docker image (Next.js app is built during Docker build)
build:
	@echo "Building Docker image..."
	docker build -t $(DOCKER_IMAGE) .

# Run Docker container
docker-run: build
	@echo "Running Docker container..."
	docker run -d --name $(DOCKER_CONTAINER) -p 3000:3000 -v $(PWD):/app $(DOCKER_IMAGE)
	@echo "Container $(DOCKER_CONTAINER) is running!"

# Stop and remove Docker container
docker-stop:
	@echo "Stopping and removing Docker container..."
	docker stop $(DOCKER_CONTAINER) && docker rm $(DOCKER_CONTAINER)
	@echo "Container $(DOCKER_CONTAINER) has been stopped and removed."

# Clean Docker image, container, and other resources
clean-docker:
	@echo "Cleaning Docker resources..."
	docker stop $(DOCKER_CONTAINER) || true
	docker rm $(DOCKER_CONTAINER) || true
	docker rmi $(DOCKER_IMAGE) || true
	docker volume prune -f
	docker network prune -f
	@echo "Docker resources have been cleaned."
