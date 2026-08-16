import { useParams } from 'react-router-dom'

const BlogView = ({ blogs, user, handleLike, handleDelete }) => {
  const { id } = useParams()
  const blog = blogs.find(b => (b.id || b._id) === id)

  if (!blog) {
    return <div>blog not found</div>
  }

  const blogUserId = blog.user?.id || blog.user?._id || blog.user
  const loggedUserId = user?.id || user?._id
  const isOwner = blogUserId === loggedUserId || blog.user?.username === user?.username

  return (
    <div>
      <h2>{blog.author}: {blog.title}</h2>
      <div>{blog.url}</div>
      <div>
        likes {blog.likes}
        {user && <button onClick={() => handleLike(blog)}>like</button>}
      </div>
      <div>added by {blog.user?.username}</div>
      {isOwner && (
        <button onClick={() => handleDelete(blog)}>delete</button>
      )}
    </div>
  )
}

export default BlogView