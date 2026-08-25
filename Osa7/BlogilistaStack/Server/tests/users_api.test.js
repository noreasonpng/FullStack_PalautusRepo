const { test, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");

const api = supertest(app);

const initialUsers = [
  {
    username: "mluukkai",
    name: "Matti Luukkainen",
    passwordHash: "hash1",
  },
  {
    username: "adoe",
    name: "Ada Doe",
    passwordHash: "hash2",
  },
];

beforeEach(async () => {
  await User.deleteMany({});
  await User.insertMany(initialUsers);
});

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

test("users are returned as json", async () => {
  await api
    .get("/api/users")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all users are returned", async () => {
  const response = await api.get("/api/users");

  assert.strictEqual(response.body.length, initialUsers.length);
});

test("users do not expose passwordHash", async () => {
  const response = await api.get("/api/users");

  assert.ok(response.body[0].id);
  assert.strictEqual(response.body[0].passwordHash, undefined);
});

test("user creation fails if username is missing", async () => {
  const newUser = {
    name: "No Username",
    password: "secret123",
  };

  const response = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  assert.match(response.body.error, /username/i);

  const usersAtEnd = await usersInDb();
  assert.strictEqual(usersAtEnd.length, initialUsers.length);
});

test("user creation fails if password is too short", async () => {
  const newUser = {
    username: "validname",
    name: "Short Password",
    password: "pw",
  };

  const response = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  assert.match(response.body.error, /password/i);

  const usersAtEnd = await usersInDb();
  assert.strictEqual(usersAtEnd.length, initialUsers.length);
});

test("user creation fails if username is too short", async () => {
  const newUser = {
    username: "ab",
    name: "Too Short",
    password: "secret123",
  };

  const response = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  assert.match(response.body.error, /username/i);

  const usersAtEnd = await usersInDb();
  assert.strictEqual(usersAtEnd.length, initialUsers.length);
});

test("user creation fails if username already exists", async () => {
  const newUser = {
    username: initialUsers[0].username,
    name: "Duplicate User",
    password: "secret123",
  };

  const response = await api
    .post("/api/users")
    .send(newUser)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  assert.match(response.body.error, /unique/i);

  const usersAtEnd = await usersInDb();
  assert.strictEqual(usersAtEnd.length, initialUsers.length);
});

after(async () => {
  await mongoose.connection.close();
});
