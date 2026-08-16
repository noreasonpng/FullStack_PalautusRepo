import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import BlogView from './components/BlogView.jsx'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogCreationForm from './components/BlogCreationForm.jsx'

const AppContent = () => {
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const [blogs, setBlogs] = useState([])
  const [alert, setAlert] = useState(null)
  const [blogErrorMessage, setBlogErrorMessage] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedAppUser')
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const loggedUser = await loginService.login({ username, password })
      window.localStorage.setItem('loggedAppUser', JSON.stringify(loggedUser))
      blogService.setToken(loggedUser.token)
      setUser(loggedUser)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch {
      setErrorMessage('Wrong credentials')
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedAppUser')
    blogService.setToken(null)
    setUser(null)
  }

  const handleBlogCreate = async blogObject => {
    const createdBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(createdBlog))
    setAlert(`A new blog: ${blogObject.title} by ${blogObject.author}, was added successfully`)
    setTimeout(() => setAlert(null), 5000)
    navigate('/')
  }

  const handleBlogLike = async blog => {
    if (!user) {
      return
    }

    const blogId = blog.id || blog._id
    const blogUser = blog.user?.id || blog.user?._id || blog.user

    const updatedBlog = {
      user: blogUser,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    const returnedBlog = await blogService.update(blogId, updatedBlog)
    setBlogs(prevBlogs => prevBlogs.map(b =>
      (b.id || b._id) !== blogId ? b : { ...returnedBlog, user: b.user }
    ))
  }

  const handleBlogDelete = async blog => {
    const blogId = blog.id || blog._id
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) return

    try {
      await blogService.remove(blogId)
      setBlogs(prevBlogs => prevBlogs.filter(b => (b.id || b._id) !== blogId))
      navigate('/')
    } catch {
      setBlogErrorMessage('Failed to delete blog')
      setTimeout(() => setBlogErrorMessage(null), 5000)
    }
  }

  const padding = { padding: 5 }

  return (
    <div>
      <div>
        <Link style={padding} to="/">home</Link>
        {user === null
          ? <Link style={padding} to="/login">Login</Link>
          : (
            <>
              <Link style={padding} to="/create">new blog</Link>
              <button onClick={handleLogout}>logout</button>
            </>
          )
        }
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <BlogList
              blogs={blogs}
              alert={alert}
              errorMessage={blogErrorMessage}
            />
          }
        />
        <Route
          path="/create"
          element={
            user
              ? <BlogCreationForm handleSubmit={handleBlogCreate} />
              : <Navigate replace to="/login" />
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <BlogView
              blogs={blogs}
              user={user}
              handleLike={handleBlogLike}
              handleDelete={handleBlogDelete}
            />
          }
        />
        <Route
          path="/login"
          element={
            <LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleLogin={handleLogin}
              errorMessage={errorMessage}
            />
          }
        />
      </Routes>
    </div>
  )
}

const App = () => (
  <Router>
    <AppContent />
  </Router>
)

export default App