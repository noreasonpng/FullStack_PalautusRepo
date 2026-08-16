import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
  const blogId = blog.id || blog._id

  return (
    <li data-testid="blog">
      <Link to={`/blogs/${blogId}`}>{blog.title} by {blog.author}</Link>
    </li>
  )
}

export default Blog