const { pool } = require("../db/pool");

async function createTask(task) {
  const fields = [];
  const values = [];
  const indexes = [];
  let idx = 1;

  if (!task.title || task.title.trim() === "" || !task.user_id) {
    const err = new Error("Title and user_id are required to create a task.");
    err.status = 400;
    throw err;
  }

  // user_id and title don't need more checking because they are required
  fields.push(`user_id`);
  values.push(task.user_id);
  indexes.push(`$${idx++}`);
  fields.push(`title`);
  values.push(task.title);
  indexes.push(`$${idx++}`);

  if (task.description) {
    fields.push(`description`);
    values.push(task.description);
    indexes.push(`$${idx++}`);
  }
  if (task.status) {
    fields.push(`status`);
    values.push(task.status);
    indexes.push(`$${idx++}`);
  }
  if (task.priority) {
    fields.push(`priority`);
    values.push(task.priority);
    indexes.push(`$${idx++}`);
  }
  if (task.due_at) {
    fields.push(`due_at`);
    values.push(task.due_at);
    indexes.push(`$${idx++}`);
  }
  if (task.completed_at) {
    fields.push(`completed_at`);
    values.push(task.completed_at);
    indexes.push(`$${idx++}`);
  }
  const query = `INSERT INTO tasks (${fields.join(
    ", "
  )}) VALUES (${indexes.join(", ")}) RETURNING *`;

  try {
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      const err = new Error("Failed to create task.");
      err.status = 500;
      throw err;
    }
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

async function getTasks(user_id) {
  const query = `SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC`;
  const result = await pool.query(query, [user_id]);
  if (result.rowCount === 0) {
    return [];
  }
  return result.rows;
}

module.exports = {
  createTask,
  getTasks,
};
