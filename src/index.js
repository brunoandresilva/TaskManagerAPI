const express = require("express");
const config = require("./config");
const { app } = require("./app");

app.listen(config.port, () => {
  console.log(`API a correr em http://localhost:${config.port}`);
});
