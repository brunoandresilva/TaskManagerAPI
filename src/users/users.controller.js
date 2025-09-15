const { validationResult } = require("express-validator");
const { registerUser } = require("./users.service");

async function register(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const user = await registerUser({ username, password });
    return res.status(201).json({ user });
  } catch (err) {
    return next(err);
  }
}

module.exports = { register };
