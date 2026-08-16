import Blog from './Blog'
import Notification from './Notification'

const BlogList = ({ blogs, alert, errorMessage }) => {
  return (
    <div>
      <Notification message={alert} className="message" />
      <Notification message={errorMessage} className="error" />
      <h2>blogs</h2>
      <ul>
        {blogs
          .slice()
          .sort((a, b) => b.likes - a.likes)
          .map(blog =>
            <Blog key={blog.id || blog._id} blog={blog} />
          )}
      </ul>
    </div>
  )
}

export default BlogList