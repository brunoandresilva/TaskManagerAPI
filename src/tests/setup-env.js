process.env.NODE_ENV = "test";
process.env.PORT = "0"; // evita colisão de portas
require("dotenv").config({ path: ".env.test" });
