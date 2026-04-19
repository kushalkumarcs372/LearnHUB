# 🚀 LearnHUB – Full Stack Learning Platform

LearnHUB is a full-stack web application for structured online learning, supporting course management, assessments, and instructor–student interaction. The system follows a modular architecture with a React frontend and a Spring Boot backend communicating via REST APIs.

---

## 🧩 Tech Stack

**Frontend**
- React (Create React App)
- Context API
- Axios

**Backend**
- Spring Boot
- Spring Security (JWT)
- RESTful APIs

**Database**
- MySQL (primary)
- H2 (development/demo)

---

## 📁 Project Structure


```
LearnHUB/
├── LearnHUB-Backend/     # Spring Boot backend
├── src/                  # React source code
├── public/               # Static assets
├── README.md
└── .gitignore
```

---

## 🚀 Getting Started

### Clone

```bash
git clone https://github.com/kushalkumarcs372/LearnHUB.git
cd LearnHUB

---

## ⚙️ Backend Setup

The backend requires database and authentication configuration at runtime.

### Run the Backend

```bash
cd LearnHUB-Backend
mvn spring-boot:run
```

---

### Configuration

Provide the following environment variables:

```
SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/learnhub
SPRING_DATASOURCE_USERNAME=your_db_user
SPRING_DATASOURCE_PASSWORD=your_db_password

JWT_SECRET=your_secure_secret_key
JWT_EXPIRATION_MS=86400000
```

---

### Alternative Modes

**Local Profile (development)**

```
Copy:
src/main/resources/application-local.properties.example
→ application-local.properties
```

Run:

```bash
mvn spring-boot:run "-Dspring-boot.run.profiles=local"
```

**H2 Mode (quick testing, no MySQL)**

```bash
mvn spring-boot:run "-Dspring-boot.run.profiles=h2"
```

---

## 🎨 Frontend Setup

```bash
npm install
npm start
```

Application runs at:

```
http://localhost:3000
```

---

## 🔗 API Integration

* Development: `/api` requests are proxied to `http://localhost:8080`
* Production requires:

```
REACT_APP_API_BASE_URL=https://your-backend-domain/api
```

---

## 🔐 Security & Configuration

* Authentication handled using JWT tokens
* Sensitive configuration managed via environment variables
* `.env` files are excluded from version control
* Recommended to use a dedicated database user instead of root

---

## 📊 Core Features

**Authentication**

* User registration and login
* Token-based session management
* Password reset support

**Student Features**

* Course browsing and enrollment
* Learning progress tracking
* Quiz participation
* Certificate access

**Instructor Features**

* Course creation and management
* Lecture and material upload
* Quiz and evaluation management
* Handling student requests

**System Features**

* Payment simulation for guided sessions
* Certificate generation and verification
* Basic analytics and statistics

---

## ⚠️ Database Configuration Note

The backend depends on valid datasource configuration at startup.
If initialization fails, verify that database credentials are correctly supplied via environment variables or local configuration.

For maintainability and security:

* Use a dedicated database user
* Avoid embedding credentials in source code
* Keep environment-specific configurations outside version control

---

## 🧠 Summary

LearnHUB represents a modular full-stack system integrating frontend and backend components through well-defined APIs, implementing authentication, course workflows, and evaluation mechanisms typical of real-world learning platforms.
