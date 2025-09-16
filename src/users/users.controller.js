const { validationResult } = require("express-validator");
const usersService = require("./users.service");

async function register(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const user = await usersService.registerUser({ username, password });
    return res.status(201).json({ user });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const user = await usersService.loginUser({ username, password });
    return res.status(200).json({ user });
  } catch (err) {
    return next(err);
  }
}

async function getProfile(req, res, next) {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }
    const user = await usersService.getUserProfile(req.user.username);
    return res.status(200).json({ user });
  } catch (err) {
    return next(err);
  }
}

module.exports = { register, login, getProfile };
