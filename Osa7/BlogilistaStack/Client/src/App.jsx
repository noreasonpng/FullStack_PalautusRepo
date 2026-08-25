import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { Container, AppBar, Toolbar, Button } from "@mui/material";
import BlogList from "./components/BlogList";
import LoginForm from "./components/LoginForm";
import BlogView from "./components/BlogView.jsx";
import BlogCreationForm from "./components/BlogCreationForm.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import NotFound from "./components/NotFound.jsx";
import useNotificationStore from "./Store/NotificationStore.js";
import useBlogStore from "./Store/BlogStore.js";
import useUserStore from "./Store/UserStore.js";
import UserList from "./components/UserList.jsx";
import useUserListStore from "./Store/userListStore.js";
import UserView from "./components/UserView.jsx";
import Notification from "./components/Notification.jsx";

const AppContent = () => {
  const blogs = useBlogStore((state) => state.blogs);
  const fetchBlogs = useBlogStore((state) => state.fetchBlogs);
  const createBlog = useBlogStore((state) => state.createBlog);
  const likeBlog = useBlogStore((state) => state.likeBlog);
  const removeBlog = useBlogStore((state) => state.removeBlog);
  const addComment = useBlogStore((state) => state.addComment);

  const user = useUserStore((state) => state.user);
  const initializeUser = useUserStore((state) => state.initializeUser);
  const login = useUserStore((state) => state.login);
  const logout = useUserStore((state) => state.logout);

  const location = useLocation();

  const navigate = useNavigate();

  const setNotification = useNotificationStore(
    (state) => state.setNotification,
  );

  const users = useUserListStore((state) => state.users);
  const fetchUsers = useUserListStore((state) => state.fetchUsers);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    initializeUser();
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      navigate("/");
    } catch {
      setNotification("Wrong credentials", "error");
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleBlogCreate = async (blogObject) => {
    const createdBlog = await createBlog(blogObject);
    setNotification(
      `A new blog: ${createdBlog.title} by ${createdBlog.author}, was added successfully`,
      "success",
    );
    fetchUsers();
    navigate("/");
  };

  const handleBlogLike = async (blog) => {
    if (!user) return;
    await likeBlog(blog);
  };

  const handleComment = async (blogId, comment) => {
    await addComment(blogId, comment);
  };

  const handleBlogDelete = async (blog) => {
    const blogId = blog.id || blog._id;
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) return;

    try {
      await removeBlog(blogId);
      setNotification(`Blog '${blog.title}' was deleted!`);
      navigate("/");
    } catch {
      setNotification("Failed to delete blog", "error");
    }
  };

  const padding = { padding: 5 };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            home
          </Button>

          <Button color="inherit" component={Link} to="/users">
            users
          </Button>

          {user === null ? (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/create">
                new blog
              </Button>

              <Button color="inherit" onClick={handleLogout}>
                logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Notification />
      <Container>
        <Routes>
          <Route
            path="/"
            element={
              <ErrorBoundary key={location.pathname}>
                <BlogList blogs={blogs} />
              </ErrorBoundary>
            }
          />
          <Route
            path="/create"
            element={
              <ErrorBoundary key={location.pathname}>
                {user ? (
                  <BlogCreationForm handleSubmit={handleBlogCreate} />
                ) : (
                  <Navigate replace to="/login" />
                )}
              </ErrorBoundary>
            }
          />
          <Route
            path="/blogs/:id"
            element={
              <ErrorBoundary key={location.pathname}>
                <BlogView
                  blogs={blogs}
                  user={user}
                  handleLike={handleBlogLike}
                  handleDelete={handleBlogDelete}
                  handleComment={handleComment}
                />
              </ErrorBoundary>
            }
          />
          <Route
            path="/login"
            element={
              <ErrorBoundary key={location.pathname}>
                <LoginForm handleLogin={handleLogin} />
              </ErrorBoundary>
            }
          />
          <Route
            path="/users"
            element={
              <ErrorBoundary key={location.pathname}>
                <UserList users={users} />
              </ErrorBoundary>
            }
          />
          <Route
            path="/users/:id"
            element={
              <ErrorBoundary key={location.pathname}>
                <UserView users={users} />
              </ErrorBoundary>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
