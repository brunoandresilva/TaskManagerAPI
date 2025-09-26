const { pool } = require("../db/pool");

async function createGroup(user_id, name) {
  if (user_id === null || name.trim() === "" || name === null) {
    const error = new Error(
      "user_id and group name need to be not null nor empty strings."
    );
    error.status(400);
    throw error;
  }

  try {
    const query = `INSERT INTO groups (user_id, name) VALUES ($1, $2) RETURNING *;`;
    const result = await pool.query(query, [user_id, name]);
    if (result.rowCount === 0) {
      const error = new Error("Failed to create group.");
      error.status = 500;
      throw error;
    }
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createGroup,
};
