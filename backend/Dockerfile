# Use official Python image
FROM python:3.11

RUN adduser --disabled-password --gecos "" myuser
# Set working directory
WORKDIR /app

# Copy requirements.txt first for caching purposes
COPY requirements.txt .

# Install Python dependencies without cache to save space
RUN pip install --no-cache-dir -r requirements.txt

# Copy scripts and application code
COPY --chown=myuser:myuser /scripts /app/scripts
COPY --chown=myuser:myuser . .

# Ensure the entrypoint script is executable
RUN chmod +x /app/scripts/docker/entrypoint.sh

# Expose port 8000 for Django
EXPOSE 8000
# Set the user for the ENTRYPOINT
USER myuser

# Define the entrypoint and command
ENTRYPOINT ["/app/scripts/docker/entrypoint.sh"]