const request = require("supertest");
const { app } = require("../app");

describe("Healthcheck", () => {
  it("GET /health -> 200", async () => {
    const res = await request(app).get("/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true });
  });
});
