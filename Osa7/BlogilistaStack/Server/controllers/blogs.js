const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const user = request.user;
  const blog = new Blog({
    ...request.body,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.createdBlogs = user.createdBlogs.concat(savedBlog._id);
  await user.save();

  const populatedBlog = await savedBlog.populate("user", {
    username: 1,
    name: 1,
  });
  response.status(201).json(populatedBlog);
});

blogsRouter.post("/:id/comments", async (request, response) => {
  const { content } = request.body;

  if (!content || content.trim() === "") {
    return response.status(400).json({ error: "comment content is required" });
  }

  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).end();
  }

  blog.comments = blog.comments.concat({ content });
  const updatedBlog = await blog.save();

  const populatedBlog = await updatedBlog.populate("user", {
    username: 1,
    name: 1,
  });
  response.status(201).json(populatedBlog);
});

blogsRouter.put("/:id", async (request, response) => {
  const updatedBlog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
  };

  const blog = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {
    returnDocument: "after",
    runValidators: true,
    context: "query",
  });

  response.json(blog);
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user;
    const blog = await Blog.findById(request.params.id);

    if (!blog) {
      return response.status(404).end();
    }
    if (!blog.user || blog.user.toString() !== user._id.toString()) {
      return response
        .status(403)
        .json({ error: "only the creator can delete blogs" });
    }

    await Blog.findByIdAndDelete(request.params.id);

    user.createdBlogs = user.createdBlogs.filter(
      (blogId) => blogId.toString() !== request.params.id,
    );
    await user.save();

    response.status(204).end();
  },
);

module.exports = blogsRouter;
