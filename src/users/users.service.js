const bcrypt = require("bcrypt");
const { pool } = require("../db/pool");

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

  const rounds = parseInt(process.env.BCRYPT_ROUNDS || "12", 10);
  const hashed = await bcrypt.hash(password, rounds);

  const insertRes = await pool.query(
    `INSERT INTO users (username, password)
     VALUES ($1, $2)
     RETURNING id, username, created_at`,
    [username, hashed]
  );

  return insertRes.rows[0];
}

module.exports = { registerUser };
