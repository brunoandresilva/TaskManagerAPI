const { Pool } = require("pg");
require("dotenv").config();

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
    console.log("✅ Ligação a PostgreSQL OK");
  } catch (err) {
    console.error("❌ Falha na ligação a PostgreSQL:", err.message);
    // dicas comuns:
    // - "password authentication failed": user/password errados
    // - "no pg_hba.conf entry": host/porta errados (ou connecting via IPv6/IPv4 diferente)
    // - "server does not support SSL": remove PGSSLMODE=require em local
    process.exit(1);
  }
}
assertDbConnection();

module.exports = { pool };
