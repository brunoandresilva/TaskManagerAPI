const express = require("express");
const { body, param } = require("express-validator");
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

router.delete(
  "/:id",
  [
    authMiddleware,
    param("id")
      .notEmpty()
      .withMessage("Id is required.")
      .isInt({ min: 1 })
      .withMessage("id must be a positive integer"),
    validate,
  ],
  groupsController.deleteGroup
);

module.exports = router;
