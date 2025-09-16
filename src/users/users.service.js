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
    "SELECT id, username, password FROM users WHERE username = $1",
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
  user.token = jwt.sign(
    { username: user.username, id: user.id },
    config.jwt.secret,
    {
      expiresIn: "1h",
    }
  );
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

async function getUsers() {
  const usersRes = await pool.query(
    "SELECT id, username, created_at FROM users"
  );
  return usersRes.rows;
}

async function updateUser(id, patch) {
  const fields = [];
  const values = [];
  let idx = 1;

  if (patch.username) {
    fields.push(`username = $${idx++}`);
    values.push(patch.username);
  }
  if (patch.password) {
    const hashed = await hash.hashPassword(patch.password);
    fields.push(`password = $${idx++}`);
    values.push(hashed);
  }

  if (fields.length === 0) {
    const err = new Error("No fields to update");
    err.status = 400;
    throw err;
  }

  const query = `UPDATE users SET ${fields.join(
    ", "
  )} WHERE id = $${idx} RETURNING id, username, created_at`;
  values.push(id);

  try {
    const updateRes = await pool.query(query, values);
    if (updateRes.rowCount === 0) {
      const err = new Error("User not found.");
      err.status = 404;
      throw err;
    }
    return updateRes.rows[0];
  } catch (error) {
    if (error.code === "23505") {
      // postgres unique_violation
      const err = new Error("Username already exists.");
      err.status = 409;
      throw err;
    }
  }
}

async function deleteUser(id) {
  const deleteRes = await pool.query(
    `DELETE FROM users WHERE id = $1 RETURNING id, username, created_at, updated_at`,
    [id]
  );
  if (deleteRes.rowCount === 0) {
    const err = new Error("User not found.");
    err.status = 404;
    throw err;
  }
  return deleteRes.rows[0];
}

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getUsers,
  updateUser,
  deleteUser,
};
