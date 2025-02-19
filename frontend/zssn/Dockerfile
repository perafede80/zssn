# Use official Node.js image
FROM node:22

# Set working directory
WORKDIR /app

# Install necessary system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends nano iputils-ping && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the project files
COPY . .

# Expose port 3000
EXPOSE 3000

CMD ["npm", "start"]