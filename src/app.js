const express = require("express");
const cors = require("cors");
const usersRouter = require("./users/users.routes");
const tasksRouter = require("./tasks/tasks.routes");
const groupsRouter = require("./groups/groups.routes");
const { errorMiddleware } = require("./middlewares/error");

const app = express();
app.use(express.json());

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
app.use("/api/groups", groupsRouter);

// error handler final
app.use(errorMiddleware);

module.exports = { app };
