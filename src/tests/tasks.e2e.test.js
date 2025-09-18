const request = require("supertest");
const { app } = require("../app");
const { migrateIfNeeded, cleanDb, closePool } = require("./utils/db");
const { createUserAndLogin } = require("./utils/auth");

beforeAll(async () => {
  await migrateIfNeeded();
});
beforeEach(async () => {
  await cleanDb();
});
afterAll(async () => {
  await closePool();
});

describe("Tasks CRUD (protected)", () => {
  test("Create -> List -> Get -> Patch -> Delete", async () => {
    const { token, username } = await createUserAndLogin();

    // CREATE
    const createRes = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "First task", description: "hello", priority: 2 });
    expect(createRes.statusCode).toBeOneOf?.([200, 201]) ??
      expect([200, 201]).toContain(createRes.statusCode);
    const task = createRes.body.task ?? createRes.body;
    expect(task.title).toBe("First task");
    expect(task.status).toBeDefined();

    const taskId = task.id;

    // LIST (only own tasks)
    const listRes = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${token}`);
    expect(listRes.statusCode).toBe(200);
    const list = listRes.body.tasks ?? listRes.body;
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBe(1);
    expect(list[0].title).toBe("First task");

    // GET by id
    const getRes = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(getRes.statusCode).toBe(200);
    const fetched = getRes.body.task ?? getRes.body;
    expect(fetched.id).toBe(taskId);

    // PATCH: status -> done, priority -> 3
    const patchRes = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "done", priority: 3 });
    expect(patchRes.statusCode).toBe(200);
    const updated = patchRes.body.task ?? patchRes.body;
    expect(updated.status).toBe("done");
    expect(updated.priority).toBe(3);

    // DELETE
    const delRes = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);
    expect([200, 204]).toContain(delRes.statusCode);

    // GET again -> 404
    const get404 = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);
    expect([404, 403]).toContain(get404.statusCode); // 404 (not found) ou 403 (se esconderes existência)
  });

  test("Auth required: creating without token -> 401/403", async () => {
    const res = await request(app).post("/api/tasks").send({ title: "x" });
    expect([401, 403]).toContain(res.statusCode);
  });

  test("Cannot edit/delete task from another user (403 or 404)", async () => {
    const { token: tokenA } = await createUserAndLogin({
      username: "alice",
      password: "secret123",
    });
    const { token: tokenB } = await createUserAndLogin({
      username: "bob",
      password: "secret123",
    });

    // Alice cria
    const createRes = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${tokenA}`)
      .send({ title: "Alice task" });
    const taskId = (createRes.body.task ?? createRes.body).id;

    // Bob tenta editar/apagar
    const editRes = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${tokenB}`)
      .send({ title: "Hacked" });
    expect([403, 404]).toContain(editRes.statusCode);

    const delRes = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${tokenB}`);
    expect([403, 404]).toContain(delRes.statusCode);
  });
});
