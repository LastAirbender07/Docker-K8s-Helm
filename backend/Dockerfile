# Use official Python slim image
FROM python:3.13-alpine

# Set working directory
WORKDIR /app

# Copy requirements first (caching layer)
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy all app files
COPY ./app ./app

# Expose the port FastAPI will run on
EXPOSE 5001

# Run FastAPI using uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "5001"]
