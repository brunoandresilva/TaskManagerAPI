# TaskManagerAPI

TaskManagerAPI is a RESTful API developed to be the backend of what **will be** a simple Task Manager web application

---

## Tech Stack

This project is built with the following technologies:

- [Node.js](https://nodejs.org/) – JavaScript runtime environment
- [Express](https://expressjs.com/) – Web framework for building the REST API
- [PostgreSQL](https://www.postgresql.org/) – Relational database
- [pg](https://node-postgres.com/) – PostgreSQL client for Node.js
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) – Password hashing
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) – JSON Web Tokens for authentication
- [express-validator](https://express-validator.github.io/) – Request validation middleware
- [nodemon](https://nodemon.io/) – Development tool for automatic restarts

---

## Prerequisites

Make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (recommended v18 or higher)
- [PostgreSQL](https://www.postgresql.org/) (recommended v14 or higher)
- npm (comes bundled with Node.js)

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/TaskManagerAPI.git
   cd TaskManagerAPI
   npm install
   cp .env.example .env //create the .env file based on the .env.example

   ```

2. Setup database:

   ```sql
   -- Create database
   CREATE DATABASE my_db;

   -- Switch to the new database
   \c my_db;

   -- Create users table
   CREATE TABLE IF NOT EXISTS users (
   id SERIAL PRIMARY KEY,
   username VARCHAR(50) UNIQUE NOT NULL,
   password TEXT NOT NULL,
   created_at TIMESTAMPTZ DEFAULT NOW(),
   updated_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

3. Run the program:
   ```bash
   npm run dev // to test
   npm start // production
   ```
