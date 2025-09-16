// src/config/index.js
require("dotenv").config();

const toInt = (v, def) => {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? def : n;
};

const config = {
  env: process.env.NODE_ENV || "development",
  port: toInt(process.env.PORT, 3000),
  db: {
    url: process.env.DATABASE_URL || null,
    host: process.env.PGHOST || "localhost",
    port: toInt(process.env.PGPORT, 5432),
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || undefined,
    database: process.env.PGDATABASE || "postgres",
    ssl: process.env.PGSSLMODE === "require", // true/false
  },
  security: {
    bcryptRounds: toInt(process.env.BCRYPT_ROUNDS, 12),
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
};

module.exports = config;
