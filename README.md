# Soby Engineers – AI-Driven Smart Vehicle Intelligence and Predictive Maintenance Platform

A web-based vehicle intelligence platform designed to monitor vehicle health, manage maintenance records, and predict potential maintenance requirements using machine learning.

## Project Overview

Soby Engineers is an academic full-stack web application that helps users manage vehicle information, monitor vehicle health, track maintenance activities, and identify potential maintenance requirements.

The platform integrates web technologies, database management, and machine learning to support data-driven vehicle maintenance decisions.

## Key Features

- **User Management:** User registration and authentication.
- **Vehicle Management:** Add, view, and manage vehicle information.
- **Maintenance Management:** Maintain vehicle service and maintenance records.
- **Predictive Maintenance:** Use a Random Forest machine learning model to predict potential maintenance requirements.
- **Vehicle Health Analysis:** Analyze vehicle health and display health status.
- **Maintenance Priority:** Identify maintenance priorities.
- **Cost Estimation:** Provide estimated maintenance costs.
- **Recommendations:** Display maintenance suggestions.
- **Dashboard Analytics:** Present vehicle and maintenance information.
- **AI-Based Image Analysis:** Analyze vehicle images to identify potential issues.

## Screenshots

### Dashboard

![Soby Engineers Dashboard](./dashboard-hero.jpg)

### Vehicle Management

![Vehicle Management](./vehicle-preview.png)

### Maintenance Management

![Maintenance Management](./maintenance-preview.png)

## Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, TypeScript |
| UI Framework | Material UI (MUI) |
| Backend | Node.js, Express.js |
| Database | MySQL |
| Machine Learning | Python, Scikit-learn |
| Data Processing | Pandas, NumPy |
| ML Algorithm | Random Forest |
| Development Tools | VS Code, Git, GitHub, Postman, DBeaver, Jupyter Notebook |

## System Architecture

The application is organized into three main technical areas:

1. **Frontend:** React.js and TypeScript provide the user interface and application interactions.
2. **Backend:** Node.js and Express.js handle server-side operations and API requests.
3. **AI and Machine Learning:** Python and Scikit-learn support predictive maintenance and image-analysis functionality.

MySQL is used for application data storage.

## Project Structure

```text
soby-engineers-ai-vehicle-platform/
│
├── ai/
│   └── Machine learning components
│
├── backend/
│   └── Server-side application
│
├── public/
│   └── Public assets
│
├── src/
│   └── Frontend source code
│
├── dashboard-hero.jpg
├── vehicle-preview.png
├── maintenance-preview.png
├── package.json
├── package-lock.json
└── README.md
```

## Getting Started

### Prerequisites

Install the following software before running the application:

- Node.js and npm
- Python 3
- MySQL Server
- Git

### Clone the Repository

```bash
git clone https://github.com/merleenmirshaa-blip/soby-engineers-ai-vehicle-platform.git
```

Navigate to the project directory:

```bash
cd soby-engineers-ai-vehicle-platform
```

### Install Frontend Dependencies

```bash
npm install
```

### Run the Frontend

```bash
npm run dev
```

Open the local URL displayed in your terminal to access the application.

**Backend and AI setup:** Refer to their respective configuration and dependency files in the `backend/` and `ai/` directories. Configure the database connection and environment variables locally before starting those services.

## Project Objectives

- Develop an intelligent vehicle management platform.
- Apply machine learning to predictive maintenance.
- Support vehicle health monitoring.
- Improve maintenance planning through data-driven recommendations.
- Integrate frontend, backend, database, and AI technologies in one application.

## Project Information

- **Project Name:** Soby Engineers
- **Project Type:** Academic Final-Year Project
- **Application Type:** Full-Stack Web Application
- **Domain:** Artificial Intelligence and Predictive Maintenance

## Future Enhancements

- Improve predictive model accuracy through additional validated training data.
- Expand vehicle issue detection capabilities.
- Enhance reporting and analytics.
- Improve application deployment and scalability.

---

**Developed as a Final-Year BCA Academic Project.**
