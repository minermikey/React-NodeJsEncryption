# React-NodeJsEncryption

# Node.js JWT Authentication Example

This is a simple Node.js server demonstrating **user registration, login, and JWT-protected routes** using:

* **Express** for the server
* **bcrypt** for password hashing
* **crypto** for hashing emails
* **jsonwebtoken** for JWT authentication

> **Note:** This is a learning/demo project. Users are stored **in memory**, so data is lost when the server restarts. Do **not** use in production without a database.

---

## Features

* User registration with password & email hashing
* User login with JWT generation
* Protected route accessible only with a valid JWT token

---

## Installation

1. Clone the repository or copy the code.
2. Install dependencies:

```bash
npm install express bcrypt jsonwebtoken dotenv
```

3. Create a `.env` file in the root folder:

```
PORT=5001
JWT_SECRET=supersecretkey_1234567890_long_random_value
```

---

## Running the Server

```bash
node index.js
```

Server will start on `http://localhost:5001`.

---

## API Endpoints

### 1️⃣ Register a User

```http
POST /users
Content-Type: application/json

{
  "name": "Peanute Butter 1",
  "email": "peanut@example.com",
  "password": "password"
}
```

**Response:**

```json
{
  "name": "Peanute Butter 1",
  "password": "<hashed_password>",
  "email": "<hashed_email>"
}
```

---

### 2️⃣ Login

```http
POST /users/login
Content-Type: application/json

{
  "name": "Peanute Butter 1",
  "email": "peanut@example.com",
  "password": "password"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "token": "<JWT token>"
}
```

> The returned `token` is used to access protected routes.

---

### 3️⃣ Protected Route

```http
GET /protected
Authorization: Bearer <JWT token>
```

**Response:**

```
Welcome Peanute Butter 1
```

> Returns 401 if no token is provided, or 403 if the token is invalid/expired.

---

## Notes

* Passwords are hashed with **bcrypt** (salted and secure)
* Emails are hashed with **SHA-256**
* JWTs are **signed with the secret key** from `.env`
* Tokens expire in **10 hours** (`expiresIn: '10h'`)
* For production, replace in-memory storage with a **database**

