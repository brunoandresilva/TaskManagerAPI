const express = require("express");
const { body } = require("express-validator");
const { authMiddleware } = require("../middlewares/auth");
const tasksController = require("./tasks.controller");

const router = express.Router();

router.post(
  "/create",
  [
    authMiddleware,
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required.")
      .isString()
      .withMessage("Title is required and should be a non-empty string."),
    body("description")
      .optional()
      .isString()
      .withMessage("Description should be a string."),
    body("status")
      .optional()
      .isIn(["todo", "in_progress", "done"])
      .withMessage("Status should be one of: todo, in_progress, done."),
    body("priority")
      .optional()
      .isIn([0, 1, 2, 3])
      .withMessage("Priority should be one of: 0, 1, 2, 3."),
    body("due_at")
      .optional()
      .isISO8601()
      .withMessage("Due date should be a valid date."),
    body("completed_at")
      .optional()
      .isISO8601()
      .withMessage("Completed date should be a valid date."),
  ],
  tasksController.createTask
);

module.exports = router;
