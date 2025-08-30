# Technical Documentation: Circular Transformation in Digital Twin Deployment (CTDT-D)

## 1. Project Overview

This document provides a technical overview of the Circular Transformation in Digital Twin Deployment (CTDT-D) project. The project is a web application designed to evaluate the ecological sustainability of digital twin systems. It consists of a React frontend and a Flask (Python) backend.

The application allows users to define the components of their digital twin, and then it calculates a sustainability score based on various factors like energy consumption, component lifespan, and reusability. The goal is to provide users with insights into the environmental impact of their digital twin setups and offer suggestions for improvement.

### Key Features:
- **Sustainability Evaluation**: Calculates an ecological score for digital twin systems.
- **Detailed Feedback**: Provides a classification (e.g., "Ecologic", "Moderate") and a detailed breakdown of the score.
- **Component-based Analysis**: Allows users to define and analyze individual components of their system.
- **Web-based Interface**: An intuitive React-based frontend for easy interaction.

### Technologies Used:
- **Backend**: Python, Flask, PyTorch, Pandas
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Database**: (Not explicitly defined, but SQLAlchemy is a dependency, suggesting a relational database could be used).
- **Machine Learning**: A logistic regression model is used, likely for classification tasks related to the evaluation.

---

## 2. Backend

The backend is a Python web server built with Flask. It exposes a RESTful API for evaluating digital twin systems.

### 2.1. Architecture

The backend code is organized into several modules:

- **`main.py`**: The main entry point of the Flask application. It defines the API endpoints and handles incoming requests.
- **`models/`**: Contains the data models for the application, such as `Component` and `DigitalTwin`.
- **`evaluator/`**: Includes the logic for evaluating the digital twin systems. The `EcologicalEvaluator` class is the core of this module.
- **`utils.py`**: Contains utility functions, such as fetching energy data from external APIs.
- **`train.py`**, **`predict.py`**, **`model.py`**, **`data_preparation.py`**: These files are related to the machine learning model.
  - `model.py` defines the `LogisticRegressionModel`.
  - `train.py` contains the logic for training the model.
  - `data_preparation.py` is used to prepare data for the model.
  - `predict.py` uses the trained model to make predictions.

### 2.2. API Endpoints

#### `POST /evaluate`

This is the main endpoint for evaluating a digital twin.

-   **Request Body**: A JSON object containing the application name and a list of components.
    ```json
    {
      "application": "custom",
      "components": [
        {
          "name": "Component 1",
          "type": "Type A",
          "consumption": 100.5,
          "lifespan": 10
        },
        {
          "name": "Component 2",
          "type": "Type B",
          "consumption": 75.2,
          "lifespan": 8
        }
      ]
    }
    ```

-   **Response**: A JSON object with the evaluation results.
    ```json
    {
      "final_score": 85.5,
      "classification": "Ecologic",
      "detailed_scores": {
        "component_efficiency": 90.0,
        "energy_source": 80.0,
        "reusability": 85.0,
        "waste": 87.0
      }
    }
    ```

#### `POST /predict`

This endpoint is used for making predictions with the machine learning model.

-   **Request Body**: The format depends on the `prepare_data` function, but it's expected to be a JSON object with features for the model.
-   **Response**: A JSON object containing the model's predictions.

### 2.3. Setup and Running

1.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```

2.  **Create a virtual environment**:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install the dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4.  **Run the Flask application**:
    ```bash
    python main.py
    ```
    The server will start on `http://0.0.0.0:5001`.

---

## 3. Frontend

The frontend is a single-page application (SPA) built with React and TypeScript. It uses Vite for the build tooling, providing a fast development experience.

### 3.1. Architecture

The frontend source code is located in the `frontend/src/` directory.

- **`main.tsx`**: The entry point of the React application. It renders the main `App` component.
- **`App.tsx`**: The main component that contains the entire UI and logic for the application. It manages the state of the components, handles user input, and communicates with the backend API.
- **`components/`**: Although not present in the current structure, it's a good practice to organize reusable components into a `components` directory. Currently, components like `AuthModal` and `Dropdown` are at the root of `src/`.
- **`types.ts`**: Defines the TypeScript types and interfaces used throughout the application, such as `ComponentData` and `EvaluationResults`.
- **Styling**: The application is styled with Tailwind CSS. The configuration can be found in `tailwind.config.js`. It also uses `shadcn/ui` for some UI components.

### 3.2. Core Components

- **`App`**: The root component that orchestrates the entire application. It fetches the evaluation results from the backend and displays them.
- **`AuthModal`**: A modal component for user authentication.
- **`Dropdown`**: A reusable dropdown component used in the form for selecting component properties.
- **`Tooltip`**: A component to show tooltips on hover or click.

### 3.3. State Management

The application uses React's built-in hooks (`useState`, `useEffect`) for state management. The main state, including the list of components and the evaluation results, is managed within the `App` component.

### 3.4. Setup and Running

1.  **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```

2.  **Install the dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```
    The development server will start on `http://localhost:5173` (or another port if 5173 is busy).

---

## 4. Additional Tips and Explanations

### 4.1. Machine Learning Model

- The project includes a `model.pkl` file, which is a serialized (pickled) Python object. This is likely the pre-trained machine learning model.
- To retrain the model, you would need to run the `train.py` script. This script will likely require a specific dataset, which is not included in the repository. You would need to refer to the project's original authors or documentation for information on the training data.
- The `predict.py` script shows how to load and use the model for predictions.

### 4.2. Environment Variables

- The backend code, specifically in `utils.py`, might contain hardcoded API keys (e.g., `api_key = "pnu0oRE4gsIMK"`). For a production environment, it is strongly recommended to use environment variables to manage sensitive information like API keys.

### 4.3. Frontend and Backend Integration

- The frontend makes API calls to a hardcoded URL (`https://ctdt-d.onrender.com/evaluate`). When running the backend locally, you will need to change this URL in `frontend/src/App.tsx` to `http://localhost:5001/evaluate` to connect to your local backend instance.
- It's a good practice to use an environment variable for the API endpoint, so it can be easily configured for different environments (development, staging, production).

### 4.4. Database

- The project has `SQLAlchemy` as a dependency, but there is no explicit database configuration or usage in the provided `main.py`. If a database is needed, you will have to:
    1.  Configure the database connection in a file like `database.py`.
    2.  Define the database models (tables) in `models.py`.
    3.  Initialize the database and create the tables.
    4.  Update the API endpoints to interact with the database.
