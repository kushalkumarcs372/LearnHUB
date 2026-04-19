# 🚀 LearnHUB – Full Stack Learning Platform

LearnHUB is a full-stack web application for structured online learning, supporting course management, assessments, and instructor–student interaction. The system follows a modular architecture with a React frontend and a Spring Boot backend communicating via REST APIs.

---

## 🧩 Tech Stack

**Frontend**

* React (Create React App)
* Context API
* Axios

**Backend**

* Spring Boot
* Spring Security (JWT)
* RESTful APIs

**Database**

* MySQL (primary)
* H2 (development/demo)

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
```

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

* Development: `/api` → `http://localhost:8080`
* Production:

```
REACT_APP_API_BASE_URL=https://your-backend-domain/api
```

---

## 🔐 Security & Configuration

* JWT-based authentication
* Environment-driven configuration
* `.env` excluded from version control
* Use a dedicated database user (avoid root)

---

## 📊 Core Features

**Authentication**

* User registration and login
* Token-based session handling
* Password reset support

**Student**

* Course browsing and enrollment
* Learning progress tracking
* Quiz participation
* Certificate access

**Instructor**

* Course creation and management
* Lecture and material upload
* Quiz and evaluation management
* Handling student requests

**System**

* Payment simulation for guided sessions
* Certificate generation and verification
* Basic analytics

---

## ⚠️ Database Configuration

The backend requires valid datasource configuration at startup.
If initialization fails, verify credentials and environment variables.

Best practices:

* Use a dedicated DB user
* Avoid hardcoding secrets
* Keep configs environment-specific

---

## 🧠 Summary

LearnHUB demonstrates a modular full-stack architecture with clear separation of concerns, secure authentication, and scalable API-driven communication between frontend and backend systems.
