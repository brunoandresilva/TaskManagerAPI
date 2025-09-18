const request = require("supertest");
const { app } = require("../../app");

async function createUserAndLogin({
  username = "bruno",
  password = "secret123",
} = {}) {
  // regista
  const reg = await request(app)
    .post("/api/users/register")
    .send({ username, password });
  if (![200, 201].includes(reg.statusCode)) {
    throw new Error(
      `Register failed: ${reg.statusCode} ${JSON.stringify(reg.body)}`
    );
  }
  // login
  const login = await request(app)
    .post("/api/users/login")
    .send({ username, password });
  if (login.statusCode !== 200) {
    throw new Error(
      `Login failed: ${login.statusCode} ${JSON.stringify(login.body)}`
    );
  }
  // aceita ambos formatos { token } ou { user: { token, id, username } }
  const token = login.body?.user?.token || login.body?.token;
  const userId = login.body?.user?.id || login.body?.id; // se a tua API devolver o id
  return { token, userId, username };
}

module.exports = { createUserAndLogin };
