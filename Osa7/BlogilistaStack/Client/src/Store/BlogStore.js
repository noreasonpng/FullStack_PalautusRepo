import { create } from "zustand";
import blogService from "../services/blogs";

const useBlogStore = create((set, get) => ({
  blogs: [],

  fetchBlogs: async () => {
    const blogs = await blogService.getAll();
    set({ blogs });
  },

  createBlog: async (blogObject) => {
    const createdBlog = await blogService.create(blogObject);
    set((state) => ({ blogs: state.blogs.concat(createdBlog) }));
    return createdBlog;
  },

  likeBlog: async (blog) => {
    const blogId = blog.id || blog._id;
    const blogUser = blog.user?.id || blog.user?._id || blog.user;

    const updatedBlog = {
      user: blogUser,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    };

    const returnedBlog = await blogService.update(blogId, updatedBlog);
    set((state) => ({
      blogs: state.blogs.map((b) =>
        (b.id || b._id) !== blogId ? b : { ...returnedBlog, user: b.user },
      ),
    }));
  },

  removeBlog: async (blogId) => {
    await blogService.remove(blogId);
    set((state) => ({
      blogs: state.blogs.filter((b) => (b.id || b._id) !== blogId),
    }));
  },

  addComment: async (blogId, comment) => {
    const updatedBlog = await blogService.addComment(blogId, comment);

    set((state) => ({
      blogs: state.blogs.map((blog) =>
        (blog.id || blog._id) === blogId ? updatedBlog : blog,
      ),
    }));
  },
}));

export default useBlogStore;
