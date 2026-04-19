# 🚀 LearnHUB – Full Stack Learning Platform

LearnHUB is a full-stack web application designed to facilitate structured online learning through course management, instructor-led content delivery, and student engagement features. The system is built with a clear separation between frontend and backend services, following standard web architecture practices.

---

## 🧩 Tech Stack

**Frontend**

* React (Create React App)
* Context API for state management
* Axios for API communication

**Backend**

* Spring Boot
* Spring Security with JWT-based authentication
* RESTful API design

**Database**

* MySQL (primary)
* H2 (for development and testing)

---

## 📁 Project Structure

```
LearnHUB/
├── LearnHUB-Backend/     # Spring Boot backend service
├── src/                  # React application source
├── public/               # Static assets
├── docs/                 # Project documentation
├── tools/                # Utility scripts
├── README.md
└── .gitignore
```

---

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/kushalkumarcs372/LearnHUB.git
cd LearnHUB
```

---

## ⚙️ Backend Setup

The backend service requires database and authentication configuration through environment variables or local configuration profiles.

### Run the Backend

```bash
cd LearnHUB-Backend
mvn spring-boot:run
```

### Configuration Options

**Environment Variables (recommended)**

```
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/learnhub
SPRING_DATASOURCE_USERNAME=your_db_user
SPRING_DATASOURCE_PASSWORD=your_db_password

JWT_SECRET=your_secure_secret_key
JWT_EXPIRATION_MS=86400000
```

**Local Profile (not committed to version control)**

1. Copy:

```
src/main/resources/application-local.properties.example
→ application-local.properties
```

2. Run with profile:

```bash
mvn spring-boot:run "-Dspring-boot.run.profiles=local"
```

**In-Memory Mode (H2 for quick testing)**

```bash
mvn spring-boot:run "-Dspring-boot.run.profiles=h2"
```

---

## 🎨 Frontend Setup

```bash
npm install
npm start
```

The application will be available at:

```
http://localhost:3000
```

---

## 🔗 API Integration

* Development mode uses a proxy to forward `/api` requests to the backend (`http://localhost:8080`)
* In production, configure:

```
REACT_APP_API_BASE_URL=https://your-backend-domain/api
```

---

## 🔐 Security & Configuration

* Sensitive configuration is externalized via environment variables
* `.env` files are excluded from version control
* JWT is used for authentication and session handling
* It is recommended to use a dedicated database user with restricted privileges

---

## 📊 Features Overview

**Authentication**

* User registration and login
* JWT-based session management
* Password reset support

**Student Module**

* Course browsing and enrollment
* Progress tracking
* Quiz participation
* Certificate access

**Instructor Module**

* Course creation and management
* Content and material upload
* Quiz and assessment management
* Handling student requests

**System Features**

* Payment handling
* Certificate verification
* Analytics and statistics

---

## ⚠️ Database Configuration Note

The backend requires valid database credentials at runtime.
If the application fails to initialize, ensure that the datasource configuration is correctly provided through environment variables or local configuration files.

For maintainability and security:

* Use a dedicated database user instead of the root account
* Avoid embedding credentials directly in source files
* Keep environment-specific configurations outside version control

---

## 🧠 Summary

LearnHUB demonstrates a complete full-stack architecture integrating a modern frontend with a secure and scalable backend, designed to simulate real-world learning platform workflows.
