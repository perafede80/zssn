# ZSSN Application

This repository contains the full-stack application for the ZSSN (Zombie Survival Social Network) coding test.

## Project Structure

- `backend/`: Django backend API.
- `frontend/`: React frontend application.
- `ops/`: Docker configuration for deployment.

## Prerequisites

- Docker and Docker Compose installed on your machine.

## Getting Started

1. Clone the repository:
   ```bash
   git clone git@github.com:perafede80/zssn.git
   cd zssn
   ```

2. Start the application using Docker: 
   ```bash
   docker-compose up --build
   ```

3. Access the application at:
   ```bash
   http://localhost:3000
   ```
   Ensure the application renders properly on `localhost:3000`.

## Docker Compose Overview

The `docker-compose.yml` file orchestrates the multi-container application. Here's a brief overview of the services:

### Database (PostgreSQL)
- Runs PostgreSQL 16 with persistent storage.
- Executes initialization scripts from `backend/scripts`.
- Health checks ensure the database is ready before other services start.

### Adminer (Database UI)
- A lightweight web interface for managing the PostgreSQL database.
- Accessible at `http://localhost:8080` with the default server set to `db`.

### Backend (Django API)
- Builds the Django API, exposing it on port `8000`.
- Live code updates are enabled via volume mounting.
- Health checks confirm the API is responsive.

### Frontend (React App)
- Builds and serves the React app on port `3000`.
- Volume mounting allows live updates during development.
- Health checks ensure the UI is running properly.

## Backend Architecture

The project's architecture follows the **Model-View-Template (MVT)** pattern, typical of Django applications.

### Models
The `models.py` defines the essential data structures, including:
- **Survivor:** Stores information about each survivor (e.g., name, age, location, infection status).
- **Item:** Enum-based representation of possible inventory items (e.g., Water, Food, Medication, Ammunition).
- **Inventory:** Tracks the quantity of specific items in a survivor's possession.

### Views
Handles the logic for all survivor and inventory-related functionality. Survivors can be added, updated, and marked as infected. APIs and endpoints serve application requests.

### Templates
Used to render the frontend interface for any server-side rendered views, though the primary frontend is built with React.

### Management Commands (Custom Scripts)
Custom Django commands, such as the `seed_db` script, allow for easy population of the database with test data.

To seed the database, run:
```bash
docker exec zssn_backend python manage.py seed_db
```
This will:
- Add 10 survivors to the database, each with random attributes.
- Assign random inventory items (e.g., Food, Water) to each survivor, ensuring no duplicate items for the same survivor.

### Database
The app relies on **Django ORM** for database operations, using **PostgreSQL** as the database. Most database actions, such as adding, updating, and querying, are abstracted using ORM models.

## Frontend

The frontend is built using React, TypeScript, and Material-UI. It provides an intuitive interface for interacting with the backend APIs.

## Running Tests

To run the backend tests, use:
```bash
docker exec zssn_backend python manage.py test
```

### Frontend Tests
Apologies, but there are currently no frontend tests, as I wasn't able to make Jest work.

## Improvements

Future improvements for the project include:
1. **Testing:** Add Jest tests for the frontend.
2. **Linting:** Implement linters for both backend and frontend.
3. **Interactive Map:** Integrate Leaflet.js to display survivor locations and allow user interaction with the map.
4. **End-to-End Testing:** Add Cypress for comprehensive end-to-end testing.

