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

async function deleteGroup(group_id, user_id) {
  if (group_id === null || user_id === null) {
    const error = new Error("Group id and user_id need to be non null values.");
    error.status(400);
    throw error;
  }

  try {
    const query = `DELETE FROM groups WHERE id = $1 and user_id = $2 RETURNING id;`;
    const result = await pool.query(query, [group_id, user_id]);
    if (result.rowCount === 0) {
      const error = new Error(
        "Group matching that group_id and user_id not found."
      );
      error.status = 404;
      throw error;
    }
    return;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createGroup,
  deleteGroup,
};
