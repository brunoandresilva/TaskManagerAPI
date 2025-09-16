// src/utils/hash.js
const bcrypt = require("bcrypt");
const { security } = require("../config");

async function hashPassword(password) {
  return bcrypt.hash(password, security.bcryptRounds);
}
async function comparePassword(password, hashed) {
  return bcrypt.compare(password, hashed);
}
module.exports = { hashPassword, comparePassword };
