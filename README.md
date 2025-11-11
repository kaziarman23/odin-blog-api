# Odin Blog API

A simple Express + Prisma + JWT backend for a blog with posts, comments, and user authentication.

## 🚀 Features

- **Users** — Registration, login, and JWT authentication.
- **Posts** — CRUD operations, published/unpublished state, author relationship.
- **Comments** — Add, approve, or delete comments.
- **Roles** — ADMIN, AUTHOR, READER.
- **JWT-based authentication** — Protected routes for authors/admins.
- **SQLite by default** — Easy local setup, switchable to PostgreSQL or MySQL.

---

## 🧩 Project Structure

```
my-blog-api/
├─ prisma/
│  ├─ schema.prisma      # Database schema
│  └─ seed.js            # Seed admin user
├─ src/
│  ├─ server.js          # Express app entry
│  ├─ routes/            # RESTful route handlers
│  └─ middleware/        # Auth middleware
├─ .env.example
├─ package.json
└─ README.md
```

---

## 🛠️ Setup

### 1️⃣ Clone and Install

```bash
git clone https://github.com/kaziarman23/odin-blog-api.git
cd odin-blog-api
npm install
```

### 2️⃣ Environment Setup

Copy `.env.example` → `.env` and edit values:

```bash
DATABASE_URL="file:./dev.db"
JWT_SECRET="change_this_to_a_long_secret"
PORT=4000
```

### 3️⃣ Prisma Setup

```bash
npx prisma generate
npx prisma migrate dev --name init
node prisma/seed.js
```

This seeds an admin user: **[admin@example.com](mailto:admin@example.com) / password123**.

### 4️⃣ Run the server

```bash
npm run dev
```

App runs at **[http://localhost:4000](http://localhost:4000)**.

---

## 🔐 Authentication

- Register → `POST /api/auth/register`
- Login → `POST /api/auth/login` (returns JWT)
- Attach token to protected routes:

  ```http
  Authorization: Bearer <token>
  ```

---

## 🧠 API Overview

### Auth

| Method | Endpoint             | Description                 |
| ------ | -------------------- | --------------------------- |
| POST   | `/api/auth/register` | Create new user             |
| POST   | `/api/auth/login`    | Log in user and receive JWT |

### Posts

| Method | Endpoint                 | Description                          |
| ------ | ------------------------ | ------------------------------------ |
| GET    | `/api/posts`             | Get all published posts              |
| GET    | `/api/posts/:slug`       | Get single post                      |
| POST   | `/api/posts`             | Create new post _(protected)_        |
| PUT    | `/api/posts/:id`         | Update post _(protected)_            |
| POST   | `/api/posts/:id/publish` | Toggle published state _(protected)_ |
| DELETE | `/api/posts/:id`         | Delete post _(admin only)_           |

### Comments

| Method | Endpoint                    | Description                   |
| ------ | --------------------------- | ----------------------------- |
| POST   | `/api/comments`             | Create new comment            |
| POST   | `/api/comments/:id/approve` | Approve comment _(protected)_ |
| DELETE | `/api/comments/:id`         | Delete comment _(protected)_  |

---

## 🧪 Example Commands

```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"123456"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"123456"}'

# Create post
curl -X POST http://localhost:4000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Hello","content":"My first post"}'
```

---

## ⚙️ Deployment

- **Backend** — Render, Railway, Fly.io, or Heroku.
- **Database** — Postgres recommended.
- **Environment** — Add env vars `DATABASE_URL`, `JWT_SECRET`, `PORT`.
- **Prisma migration** — Run: `npx prisma migrate deploy`.

---

## 📘 License

MIT — free to use, modify, and share.


