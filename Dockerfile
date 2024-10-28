# Use official Python image
FROM python:3.9-slim

# Set work directory
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

# Create 'teacher' group and add the default user (e.g., root)
RUN groupadd teacher && usermod -aG teacher root

# Copy project files
COPY . /app

# Expose port for the web app
EXPOSE 8501

# Entry point for Streamlit
CMD ["streamlit", "run", "web/App.py"]
