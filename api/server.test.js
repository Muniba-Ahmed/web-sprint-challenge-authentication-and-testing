const server = require("./server");
const request = require("supertest");
const bcrypt = require("bcryptjs");
const db = require("../data/dbConfig");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/secrets");

beforeAll(async () => {
  await db.migrate.rollback();
  await db.migrate.latest();
});

beforeEach(async () => {
  await db("users").truncate();
  await db("users").insert([
    {
      username: "johndoe",
      password: "$2y$10$9860d8e2e5871210786b9ueYMuxOLbd6HST6fxrh6RCDH1h6knItG",
    },
    {
      username: "peggysue",
      password: "$2y$10$9860d8e2e5871210786b9ueYMuxOLbd6HST6fxrh6RCDH1h6knIta",
    },
    {
      username: "darthvader",
      password: "$2y$10$9860d8e2e5871210786b9ueYMuxOLbd6HST6fxrh6RCDH1h6knItz",
    },
  ]);
});

afterAll(async () => {
  await db.destroy();
});
// Write your tests here

test("sanity", () => {
  expect(true).toBe(true);
});

describe("POST /register", () => {
  test('response body includes "username and password required" and user is not created', async () => {
    let res = await request(server)
      .post("/api/auth/register")
      .send({ password: "plaintextbadpass" });
    expect(res.body.message).toBe("username and password required");
    res = await request(server)
      .post("/api/auth/register")
      .send({ username: "dondraper" });
    expect(res.body.message).toBe("username and password required");
    const users = await db("users");
    expect(users).toHaveLength(3);
  });
  test('If username is already taken, response body includes string "username taken" and user is not created', async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send({ username: "johndoe", password: "plaintextbadpass" });
    expect(res.body.message).toMatch(/username taken/i);
    const users = await db("users");
    expect(users).toHaveLength(3);
  });
  test("Hashed (bcrypted) password is saved to database, not plaintext", async () => {
    const password = "plaintextbadpass";
    await request(server)
      .post("/api/auth/register")
      .send({ username: "teddanson", password });
    const user = await db("users").where("id", 4).first();
    const validCreds = bcrypt.compareSync(password, user.password);
    expect(validCreds).toBe(true);
  });
  test("Creates a new username in the database", async () => {
    await request(server)
      .post("/api/auth/register")
      .send({ username: "teddanson", password: "plaintextbadpass" });
    const users = await db("users");
    const user = await db("users").where("id", 4).first();
    expect(user).toMatchObject({ username: "teddanson", id: 4 });
    expect(users).toHaveLength(4);
  });
  test("Responds with proper 201 status on success", async () => {
    let res = await request(server)
      .post("/api/auth/register")
      .send({ username: "teddanson", password: "plaintextbadpass" });
    expect(res.status).toBe(201);
  });
});

describe("POST /login", () => {
  test('username not existing in database, return "invalid credentials"', async () => {
    const res = await request(server)
      .post("/api/auth/login")
      .send({ username: "madeupuser", password: "plaintextbadpass" });
    expect(res.body.message).toBe("invalid credentials");
  });
  test('password being incorrect, returns "invalid credentials"', async () => {
    await request(server)
      .post("/api/auth/register")
      .send({ username: "validuser", password: "RIGHTPASSWORD" });
    const res = await request(server)
      .post("/api/auth/login")
      .send({ username: "validuser", password: "WRONGPASSWORD" });
    expect(res.body.message).toBe("invalid credentials");
  });
});

describe("GET /jokes", () => {
  test('if token missing, response body includes "token required"', async () => {
    const res = await request(server).get("/api/jokes");
    expect(res.body.message).toBe("token required");
  });
  test('if token invalid, response body includes "token invalid"', async () => {
    const jokesRes = await request(server)
      .get("/api/jokes")
      .set("Authorization", "totallybogustoken");
    expect(jokesRes.body.message).toBe("token invalid");
  });
  test("returns an array of jokes", async () => {
    await request(server)
      .post("/api/auth/register")
      .send({ username: "validuser", password: "RIGHTPASSWORD" });
    const res = await request(server)
      .post("/api/auth/login")
      .send({ username: "validuser", password: "RIGHTPASSWORD" });
    const { token } = res.body;
    const jokesRes = await request(server)
      .get("/api/jokes")
      .set("Authorization", token);
    expect(jokesRes.body).toBeInstanceOf(Array);
    expect(jokesRes.body).toHaveLength(3);
  });
});
