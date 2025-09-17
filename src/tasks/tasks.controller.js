const { validationResult } = require("express-validator");
const tasksService = require("./tasks.service");

async function createTask(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const task = req.body;
    task.user_id = req.user.id; // assuming authMiddleware sets req.user
    const newTask = await tasksService.createTask(task);
    console.log(newTask);
    return res.status(201).json(newTask);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createTask,
};
