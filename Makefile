.PHONY: web
CONFIG_PATH = config/student_management.cfg
DATA_DIR = data/
SRC_DIR = src/
LOG_DIR = logs/
SUMMARY_DIR = $(DATA_DIR)summary/
LOG_FILE = $(LOG_DIR)/project.log

# Targets

# Run the project: Generate basic info, simulate academic data, merge info, and generate summary
run:
	@echo "Generating basic_info.txt..."
	python3 $(SRC_DIR)student_info_manager.py --generate-basic-info --config $(CONFIG_PATH)
	@echo "Simulating academic data..."
	python3 $(SRC_DIR)simulation.py --simulate --config $(CONFIG_PATH)
	@echo "Merging basic_info.txt and academic_info.txt into student_info.txt..."
	python3 $(SRC_DIR)student_info_manager.py --merge-info --config $(CONFIG_PATH)
	@echo "Process completed!"

clean:
	@echo "Cleaning generated files..."
	rm -f $(DATA_DIR)basic_info.txt
	rm -f $(DATA_DIR)academic_info.txt
	rm -f $(DATA_DIR)student_info.txt
	rm -f $(DATA_DIR)student_summary.txt
	rm -rf $(SUMMARY_DIR)
	@echo "Cleanup complete. All generated files have been removed."

simulate:
	@echo "Simulating academic data..."
	python3 $(SRC_DIR)simulation.py --simulate --config $(CONFIG_PATH)

summary:
	@echo "Generating student summary..."
	python3 $(SRC_DIR)generate_summary.py --config $(CONFIG_PATH)

# Reset the entire project environment
reset: clean
	@echo "Resetting the project environment..."

web:
	@echo "Starting Streamlit web app..."
	streamlit run web/App.py

help:
	@echo "Usage:"
	@echo "  make run          - Run the project"
	@echo "  make clean        - Clean all generated files"
	@echo "  make simulate     - Run the academic data simulation"
	@echo "  make summary      - Generate a student summary"
	@echo "  make reset        - Reset the project (clean and prepare)"
	@echo "  make help         - Show this help message"
	@echo "  make web          - Start the Streamlit web app"
