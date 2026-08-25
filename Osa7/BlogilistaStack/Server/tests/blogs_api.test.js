const { test, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");

const api = supertest(app);
let authToken;

const initialUser = {
  username: "testuser",
  name: "Test User",
  passwordHash: "hashedpassword",
};

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});
  await User.insertMany([initialUser]);

  const user = await User.findOne({ username: initialUser.username });
  authToken = jwt.sign(
    { username: user.username, id: user.id },
    process.env.SECRET,
  );

  let blogObject = new Blog({ ...initialBlogs[0], user: user._id });
  await blogObject.save();
  blogObject = new Blog({ ...initialBlogs[1], user: user._id });
  await blogObject.save();
});

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, initialBlogs.length);
});

test("blogs use id instead of _id", async () => {
  const response = await api.get("/api/blogs");

  assert.ok(response.body[0].id);
  assert.strictEqual(response.body[0]._id, undefined);
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "Async Adventures",
    author: "Ada Lovelace",
    url: "https://example.com/async-adventures",
    likes: 12,
  };

  const createdResponse = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${authToken}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/blogs");

  assert.strictEqual(response.body.length, initialBlogs.length + 1);

  const titles = response.body.map((blog) => blog.title);
  assert.ok(titles.includes(newBlog.title));
  assert.ok(createdResponse.body.user);
  assert.strictEqual(createdResponse.body.user.username, initialUser.username);
});

test("if likes is missing, it defaults to 0", async () => {
  const newBlog = {
    title: "No Likes Yet",
    author: "Ada Lovelace",
    url: "https://example.com/no-likes-yet",
  };

  const response = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${authToken}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.likes, 0);
  assert.ok(response.body.user);
});

test("blog creation without token is rejected with 401", async () => {
  const newBlog = {
    title: "No Token Blog",
    author: "Ada Lovelace",
    url: "https://example.com/no-token-blog",
    likes: 1,
  };

  await api.post("/api/blogs").send(newBlog).expect(401);
});

test("blog without title is rejected with 400", async () => {
  const newBlog = {
    author: "Ada Lovelace",
    url: "https://example.com/no-title",
    likes: 1,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${authToken}`)
    .send(newBlog)
    .expect(400);
});

test("blog without url is rejected with 400", async () => {
  const newBlog = {
    title: "No URL Yet",
    author: "Ada Lovelace",
    likes: 1,
  };

  await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${authToken}`)
    .send(newBlog)
    .expect(400);
});

test("a blog can be deleted", async () => {
  const blogsAtStart = await Blog.find({});
  const blogToDelete = blogsAtStart[0];

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set("Authorization", `Bearer ${authToken}`)
    .expect(204);

  const blogsAtEnd = await Blog.find({});

  assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1);

  const titles = blogsAtEnd.map((blog) => blog.title);
  assert.ok(!titles.includes(blogToDelete.title));
});

test("a blog can be updated", async () => {
  const blogsAtStart = await Blog.find({});
  const blogToUpdate = blogsAtStart[0];

  const updatedBlog = {
    title: blogToUpdate.title,
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: blogToUpdate.likes + 1,
  };

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  assert.strictEqual(response.body.likes, blogToUpdate.likes + 1);

  const blogAfterUpdate = await Blog.findById(blogToUpdate.id);
  assert.strictEqual(blogAfterUpdate.likes, blogToUpdate.likes + 1);
});

after(async () => {
  await mongoose.connection.close();
});
