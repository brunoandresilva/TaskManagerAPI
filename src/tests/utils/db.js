const { pool } = require("../../db/pool");

async function migrateIfNeeded() {
  // Enum + tabelas mínimas (idempotente)
  await pool.query(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
        CREATE TYPE task_status AS ENUM ('todo','in_progress','done');
      END IF;
    END$$;

    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      hashed_password TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id BIGSERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      status task_status NOT NULL DEFAULT 'todo',
      priority SMALLINT NOT NULL DEFAULT 0 CHECK (priority BETWEEN 0 AND 3),
      due_at TIMESTAMPTZ,
      completed_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

async function cleanDb() {
  // Limpa em ordem segura e reinicia IDs
  await pool.query(
    `TRUNCATE tasks RESTART IDENTITY CASCADE; TRUNCATE users RESTART IDENTITY CASCADE;`
  );
}

async function closePool() {
  await pool.end();
}

module.exports = { migrateIfNeeded, cleanDb, closePool };
