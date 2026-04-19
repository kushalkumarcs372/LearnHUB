# 🚀 LearnHUB – Full Stack Learning Platform

LearnHUB is a full-stack e-learning platform designed to provide course management, student engagement, and instructor-driven content delivery.

---

## 🧩 Tech Stack

### Frontend

* React (Create React App)
* Context API (State Management)
* Axios (API calls)

### Backend

* Spring Boot
* Spring Security + JWT Authentication
* MySQL / H2 Database
* REST APIs

---

## ⚙️ Project Structure

```
LearnHUB/
├── Learnhub-Frontend/   # React frontend
├── LearnHUB-Backend/    # Spring Boot backend
├── docs/                # Project report & docs
└── README.md
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/kushalkumarcs372/LearnHUB.git
cd LearnHUB
```

---

### 2️⃣ Backend Setup

```bash
cd LearnHUB-Backend
cp .env.example .env
```

Run:

```bash
mvn spring-boot:run
```

---

### 3️⃣ Frontend Setup

```bash
cd Learnhub-Frontend
npm install
npm start
```

---

## 🌐 API Configuration

* Development: Proxy → `http://localhost:8080`
* Production: Use environment variable

```env
REACT_APP_API_BASE_URL=https://your-backend.com/api
```

---

## 🔐 Security

* Sensitive data is NOT stored in the repository
* `.env` files are ignored
* Example configs are provided via `.env.example`

---

## 📊 Features

* User Authentication (JWT)
* Course Management
* Enrollment System
* Quiz & Assessment
* Instructor Dashboard
* Student Dashboard
* Payment Integration
* Certificate Generation

---

## 📄 Documentation

See:

```
docs/LearnHub_Project_Report.pdf
```

---

## ⚠️ Notes

* Do NOT use root MySQL user in production
* Always configure environment variables securely

---

## 👨‍💻 Author

Kushal C S
