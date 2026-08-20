import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material'
import { Link } from 'react-router-dom'
import Notification from './Notification'

const BlogList = ({ blogs, alert, errorMessage }) => {
  return (
    <div>
      <Notification message={alert} className="message" />
      <Notification message={errorMessage} className="error" />
      <h2>blogs</h2>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>title</TableCell>
              <TableCell>author</TableCell>
              <TableCell>likes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs
              .slice()
              .sort((a, b) => b.likes - a.likes)
              .map(blog => (
                <TableRow key={blog.id || blog._id}>
                  <TableCell>
                    <Link to={`/blogs/${blog.id || blog._id}`}>
                      {blog.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {blog.author}
                  </TableCell>
                  <TableCell>
                    {blog.likes}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default BlogList