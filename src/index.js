const express = require("express");
require("dotenv").config();

const usersRouter = require("./users/users.routes");
const { errorMiddleware } = require("./middlewares/error");

const app = express();
app.use(express.json());

// healthcheck
app.get("/health", (_req, res) => res.json({ ok: true }));

// routes
app.use("/api/users", usersRouter);

// error handler final
app.use(errorMiddleware);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API a correr em http://localhost:${port}`);
});
