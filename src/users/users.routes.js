const express = require("express");
const { body } = require("express-validator");
const usersController = require("./users.controller");

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
  ],
  usersController.register
);

module.exports = router;
