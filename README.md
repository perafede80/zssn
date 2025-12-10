# Survivor Inventory System (ZSSN)

This repository contains a full-stack application for the **Zombie Survival Social Network (ZSSN)** coding challenge. It demonstrates a production-ready architecture for managing inventory and resources in a distributed network.

## 🚀 Tech Stack

* **Backend:** Python 3.11, Django 5, Django REST Framework
* **Frontend:** React 19, TypeScript, Material UI, Vite (Rsbuild)
* **Database:** PostgreSQL 16
* ** Infrastructure:** Docker, Docker Compose
* **Testing:** Pytest (Backend), Vitest (Frontend), Cypress (E2E)
* **Code Quality:** Ruff, Biome, Pre-commit hooks

## 🛠️ Prerequisites

* Docker and Docker Compose installed on your machine.
* Git

## 🏁 Getting Started

1.  **Clone the repository:**
   ```bash
   git clone git@github.com:perafede80/zssn.git
   cd zssn
    ```

2.  **Configuration (Optional):**
    The project comes with safe defaults for local development. For custom settings, copy the example environment file:
    ```bash
    cp ops/.env.example ops/.env
    ```

3.  **Start the Application:**
    Run the application stack using Docker Compose:
    ```bash
    docker-compose -f ops/docker-compose.yml up --build -d
    ```

4.  **Access the Services:**
    * **Frontend:** [http://localhost:3000](http://localhost:3000)
    * **Backend API:** [http://localhost:8000/api/](http://localhost:8000/api/)
    * **Database Admin (Adminer):** [http://localhost:8080](http://localhost:8080) (Server: `db`, User: `zssn_user`, Pass: `zssn_password`)

## 🏗️ Architecture

The project follows a modular **Model-View-Template (MVT)** pattern on the backend and a component-based architecture on the frontend.

* **Backend:** Exposes a RESTful API for managing Survivors, Inventory, and Trade transactions. It enforces strict validation rules (e.g., ensuring trades are balanced).
* **Frontend:** A responsive React application that consumes the API. It allows users to view survivors, update locations, and perform trades.
* **Database:** PostgreSQL is used for persistent storage, with a normalized schema for Survivors and Inventory.

### Database Seeding
To populate the database with random test data (Survivors and Inventory items), run:
```bash
docker exec zssn_backend python manage.py seed_db
```
Understood. Here is the **complete, finalized `README.md`** file.

You can copy and paste this entire block directly into your file. It includes the **Quality Assurance** section you need, the corrected git clone command, and the Credits section.

## ✅ Quality Assurance & Testing

The project employs a comprehensive testing strategy isolated in a separate Docker ecosystem.

**Note:** Ensure the main application is running (`docker-compose up`) before running tests, as the test containers attach to the `zssn_network`.

### 1\. Run All Tests

Execute the full suite (Backend, Frontend Unit, and End-to-End):

```bash
docker-compose -f ops/docker-compose.tests.yml up --build --abort-on-container-exit
```

### 2\. Run Specific Suites

  * **Backend Tests (Pytest + Coverage):**

    ```bash
    docker-compose -f ops/docker-compose.tests.yml up --build backend-tests
    ```

    *Checks model integrity, trade logic validation, and API response codes.*

  * **Frontend Unit Tests (Vitest):**

    ```bash
    docker-compose -f ops/docker-compose.tests.yml up --build frontend-tests
    ```

    *Tests React components, hooks, and utility functions.*

  * **End-to-End Tests (Cypress):**

    ```bash
    docker-compose -f ops/docker-compose.tests.yml up --build cypress
    ```

    *Simulates real user interactions like navigating pages and verifying content.*

## 🤝 Credits

  * **Icons:** Zombie/Biohazard icons designed by [brgfx / Freepik](http://www.freepik.com).
