# LearnHub Backend (Spring Boot)

## Current issue: MySQL login error

If you see:
`Access denied for user 'root'@'localhost' (using password: NO)`

It means the backend is starting **without** a DB password.

## Option A (recommended): local profile file (not committed)

1. Copy `src/main/resources/application-local.properties.example` to `src/main/resources/application-local.properties`
2. Replace `YOUR_MYSQL_PASSWORD_HERE` with your MySQL password.
3. Start:
   - `mvn spring-boot:run "-Dspring-boot.run.profiles=local"`

`application-local.properties` is ignored by git (see repo `.gitignore`).

### Demo data (local/h2)

When running with `local` or `h2` profile (and `app.seed.enabled=true`), demo data is auto-seeded:
- Password for all demo accounts: `password123`
- Instructors:
  - `sarah.instructor@learnhub.com`
  - `michael.instructor@learnhub.com`
  - `emily.instructor@learnhub.com`
- Students:
  - `john.student@learnhub.com`
  - `alice.student@learnhub.com`
- Admin:
  - `admin@learnhub.com`

## Option B: set environment variables (PowerShell)

From `Learnhub-backend_CS320`:

- `$env:SPRING_DATASOURCE_USERNAME='root'`
- `$env:SPRING_DATASOURCE_PASSWORD='YOUR_MYSQL_PASSWORD'`
- `$env:JWT_SECRET='dev-only-insecure-secret-change-this-in-production-32bytes-min'`
- `mvn spring-boot:run`

## Recommended MySQL user (avoid root)

Use `db/mysql-user.sql.example` to create a dedicated MySQL user for the app, then set:
- `SPRING_DATASOURCE_USERNAME=learnhub_app`
- `SPRING_DATASOURCE_PASSWORD=...`

## Option C: quick demo mode (no MySQL)

If you just need a working demo fast, run with the in-memory H2 profile:
- `mvn spring-boot:run "-Dspring-boot.run.profiles=h2"`

## Frontend integration

The frontend calls `/api/*` and CRA proxies to `http://localhost:8080` in development.
