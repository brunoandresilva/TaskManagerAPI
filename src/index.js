const express = require("express");
const config = require("./config");
const usersRouter = require("./users/users.routes");
const tasksRouter = require("./tasks/tasks.routes");
const { errorMiddleware } = require("./middlewares/error");

const app = express();
app.use(express.json());

const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: false, // true se usar cookies
  })
);

// healthcheck
app.get("/health", (_req, res) => res.json({ ok: true }));

// routes
app.use("/api/users", usersRouter);
app.use("/api/tasks", tasksRouter);

// error handler final
app.use(errorMiddleware);

app.listen(config.port, () => {
  console.log(`API a correr em http://localhost:${config.port}`);
});
