const express = require("express");
const { body } = require("express-validator");
const usersController = require("./users.controller");
const { authMiddleware } = require("../middlewares/auth");
const { validate } = require("../middlewares/validate");

const router = express.Router();

router.post(
  "/register",
  [
    body("username")
      .isString()
      .withMessage("username deve ser string")
      .isLength({ min: 3, max: 50 })
      .withMessage("username 3-50 chars"),
    body("password")
      .isString()
      .withMessage("password deve ser string")
      .isLength({ min: 8 })
      .withMessage("password mínimo 8 chars"),
    validate,
  ],
  usersController.register
);

router.post(
  "/login",
  [
    body("username").isString().withMessage("Username should be a string"),
    body("password").isString().withMessage("Password should be a string"),
    validate,
  ],
  usersController.login
);

router.get("/profile", [authMiddleware, validate], usersController.getProfile);

router.get("/users", [authMiddleware, validate], usersController.getUsers);

router.patch(
  "/me",
  [
    authMiddleware,
    body("username")
      .optional()
      .isString()
      .withMessage("Username should be a string."),
    body("password")
      .optional()
      .isString()
      .withMessage("Password should be a string.")
      .isLength({ min: 8 })
      .withMessage("Password should be at least 8 characters long."),
    validate,
  ],
  usersController.updateMe
);

router.delete(
  "/delete/:id",
  [authMiddleware, validate],
  usersController.deleteUser
);

module.exports = router;
