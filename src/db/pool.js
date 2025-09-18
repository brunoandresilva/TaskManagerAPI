const { Pool } = require("pg");

if (process.env.NODE_ENV === "test") {
  require("dotenv").config({ path: "src/.env.test" });
} else {
  require("dotenv").config(); // .env normal
}

const ssl =
  process.env.PGSSLMODE === "require" || process.env.DATABASE_SSL === "true"
    ? { rejectUnauthorized: false }
    : undefined;

const useConnStr = !!process.env.DATABASE_URL;

const pool = useConnStr
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl,
    })
  : new Pool({
      host: process.env.PGHOST || "localhost",
      port: Number(process.env.PGPORT) || 5432,
      user: process.env.PGUSER || "postgres",
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE || "postgres",
      ssl,
    });

// check rápido à partida (bom para apanhar erros de credenciais)
async function assertDbConnection() {
  try {
    await pool.query("SELECT 1");
    if (process.env.NODE_ENV !== "test") {
      console.log("✅ Ligação a PostgreSQL OK");
    }
  } catch (err) {
    console.error("❌ Falha na ligação a PostgreSQL:", err.message);
    process.exit(1);
  }
}
// Só corre o check fora de test
if (process.env.NODE_ENV !== "test") {
  assertDbConnection();
}

module.exports = { pool };
