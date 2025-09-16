const { pool } = require("../db/pool");
const hash = require("../utils/hash");
const jwt = require("jsonwebtoken");
const config = require("../config");

async function registerUser({ username, password }) {
  // verificar se username já existe
  const existsRes = await pool.query(
    "SELECT 1 FROM users WHERE username = $1",
    [username]
  );
  if (existsRes.rowCount > 0) {
    const err = new Error("Username já existe");
    err.status = 409;
    throw err;
  }

  const hashed = await hash.hashPassword(password);

  const insertRes = await pool.query(
    `INSERT INTO users (username, password)
     VALUES ($1, $2)
     RETURNING id, username, created_at`,
    [username, hashed]
  );

  return insertRes.rows[0];
}

async function loginUser({ username, password }) {
  const userRes = await pool.query(
    "SELECT username, password FROM users WHERE username = $1",
    [username]
  );

  if (userRes.rowCount === 0) {
    const err = new Error("User not found.");
    err.status = 404;
    throw err;
  }

  const user = userRes.rows[0];
  const match = await hash.comparePassword(password, user.password);
  if (!match) {
    const err = new Error("Invalid password.");
    err.status = 401;
    throw err;
  }

  // generate jwt token
  user.token = jwt.sign({ username: user.username }, config.jwt.secret, {
    expiresIn: "1h",
  });
  return { username: user.username, token: user.token };
}

// profile endpoint - a protected endpoint that returns user info
async function getUserProfile(username) {
  const userRes = await pool.query(
    "SELECT id, username, created_at FROM users WHERE username = $1",
    [username]
  );
  if (userRes.rowCount === 0) {
    const err = new Error("User not found.");
    err.status = 404;
    throw err;
  }
  return userRes.rows[0];
}

module.exports = { registerUser, loginUser, getUserProfile };
