const tasksService = require("./tasks.service");

async function createTask(req, res, next) {
  try {
    const task = req.body;
    task.user_id = req.user.id; // assuming authMiddleware sets req.user
    const newTask = await tasksService.createTask(task);
    console.log(newTask);
    return res.status(201).json(newTask);
  } catch (error) {
    return next(error);
  }
}

async function getTasks(req, res, next) {
  try {
    const tasks = await tasksService.getTasks(req.user.id);
    console.log(tasks);
    return res.status(200).json(tasks);
  } catch (error) {
    return next(error);
  }
}

async function getTaskById(req, res, next) {
  try {
    const task = await tasksService.getTaskById(req.params.id);
    console.log(task);
    return res.status(200).json(task);
  } catch (error) {
    return next(error);
  }
}

async function partialEdit(req, res, next) {
  try {
    const updatedTask = await tasksService.partialEdit(
      req.user.id,
      req.params.id,
      req.body
    );
    console.log(updatedTask);
    return res.status(200).json(updatedTask);
  } catch (error) {
    return next(error);
  }
}

async function deleteTask(req, res, next) {
  try {
    await tasksService.deleteTask(req.user.id, req.params.id);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  partialEdit,
  deleteTask,
};
