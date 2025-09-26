const express = require("express");
const { body } = require("express-validator");
const { authMiddleware } = require("../middlewares/auth");
const { validate } = require("../middlewares/validate");
const groupsController = require("./groups.controller");

const router = express.Router();

router.post(
  "/",
  [
    authMiddleware,
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Title is required.")
      .isString()
      .withMessage("Title is required and should be a non-empty string."),
    validate,
  ],
  groupsController.createGroup
);

module.exports = router;
