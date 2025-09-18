/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  verbose: true,
  setupFiles: ["<rootDir>/tests/setup-env.js"],
  testTimeout: 20000, // aumenta timeout se tiver queries lentas
};
