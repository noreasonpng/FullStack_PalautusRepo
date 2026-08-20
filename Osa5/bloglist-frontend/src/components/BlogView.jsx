import { useParams } from 'react-router-dom'
import { Typography, Button, Box } from '@mui/material'

const BlogView = ({ blogs, user, handleLike, handleDelete }) => {
  const { id } = useParams()
  const blog = blogs.find(b => (b.id || b._id) === id)

  if (!blog) {
    return <Typography>blog not found</Typography>
  }

  const blogUserId = blog.user?.id || blog.user?._id || blog.user
  const loggedUserId = user?.id || user?._id
  const isOwner = blogUserId === loggedUserId || blog.user?.username === user?.username

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        {blog.author}: {blog.title}
      </Typography>

      <Typography>{blog.url}</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
        <Typography>likes {blog.likes}</Typography>
        {user && (
          <Button variant="outlined" size="small" onClick={() => handleLike(blog)}>
            like
          </Button>
        )}
      </Box>

      <Typography>added by {blog.user?.username}</Typography>

      {isOwner && (
        <Button
          variant="outlined"
          color="error"
          size="small"
          sx={{ mt: 1 }}
          onClick={() => handleDelete(blog)}
        >
          delete
        </Button>
      )}
    </Box>
  )
}

export default BlogView