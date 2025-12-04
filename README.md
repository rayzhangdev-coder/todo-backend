# BACK END - Task Management Application

## Project Status

| Item | Status |
| :--- | :--- |
| **Frontend App** | [https://todo-frontend-eight-cyan.vercel.app/](https://todo-frontend-eight-cyan.vercel.app/) |
| **API Live Demo** | https://ray-todo-api.onrender.com/todos |

-----

## 1\. Overview

A RESTful API server for the Task Management Application. It handles data persistence, business logic, and provides endpoints for the React frontend to perform CRUD operations.

## 2\. Features

  * **RESTful Endpoints:** Standardized routes for Todos.
  * **CRUD Operations:** Create, Read, Update, and Delete tasks.
  * **CORS Enabled:** Configured to allow requests from the frontend application.
  * **Database Integration:** Persists task data securely.

## 3\. Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Server** | Node.js, Express.js |
| **Database** | MongoDB (or your specific DB) |
| **Deployment** | Render (connected via GitHub) |

-----

## 4\. Setup and Run Locally

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/rayzhangdev-coder/todo-backend.git
    cd todo-backend
    ```

2.  **Install Dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory and add:

    ```env
    MONGODB_URI=your_database_connection_string
    ```

4.  **Run the Server:**

    ```bash
    npm run dev
    ```

    The server should now be running at `http://localhost:5000`.

-----

### 5\. Deploying the Backend on Render

1.  **Create a New Web Service on Render:**

      * Visit: [https://dashboard.render.com/](https://dashboard.render.com/)
      * Click **"New +" → "Web Service"**
      * Connect your GitHub repository: `todo-backend`

2.  **Configure Build Settings:**
    Render usually detects Node.js automatically. Ensure the settings are:

    **Build Command:**

    ```bash
    npm install
    ```

    **Start Command:**

    ```bash
    node index.js
    ```

    *(Note: Replace `index.js` with your entry file name, e.g., `server.js` or `app.js`)*

3.  **Add Environment Variables:**
    In the Render dashboard → *Environment*, add:

    ```env
    MONGODB_URI=your_production_database_string
    ```

4.  **Deploy:**
    Click **"Create Web Service"**. Render will build and deploy your API.

5.  **Get Your Live URL:**
    Once deployed, copy the provided URL (e.g., `https://your-backend.onrender.com`) and update your **Frontend** environment variable (`VITE_API_URL`) to point to this address.
