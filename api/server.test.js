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
  expect(true).toBe(false);
});
