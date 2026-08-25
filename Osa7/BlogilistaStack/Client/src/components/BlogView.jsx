import { useParams } from "react-router-dom";
import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
} from "@mui/material";

const BlogView = ({ blogs, user, handleLike, handleDelete, handleComment }) => {
  const { id } = useParams();
  const blog = blogs.find((b) => (b.id || b._id) === id);

  const [comment, setComment] = useState("");

  const handleAddComment = async (event) => {
    event.preventDefault();
    if (!comment.trim()) return;
    await handleComment(blog.id || blog._id, comment);
    setComment("");
  };

  if (!blog) {
    return <Typography>blog not found</Typography>;
  }

  const blogUserId = blog.user?.id || blog.user?._id || blog.user;
  const loggedUserId = user?.id || user?._id;
  const isOwner =
    blogUserId === loggedUserId || blog.user?.username === user?.username;

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        {blog.author}: {blog.title}
      </Typography>

      <Typography>{blog.url}</Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, my: 1 }}>
        <Typography>likes {blog.likes}</Typography>
        {user && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleLike(blog)}
          >
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

      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" component="h3" gutterBottom>
          comments
        </Typography>

        <Box
          component="form"
          onSubmit={handleAddComment}
          sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
        >
          <TextField
            size="small"
            placeholder="add a comment"
            value={comment}
            onChange={({ target }) => setComment(target.value)}
          />
          <Button type="submit" variant="outlined" size="small">
            add comment
          </Button>
        </Box>

        <List dense>
          {blog.comments && blog.comments.length > 0 ? (
            blog.comments.map((c) => (
              <ListItem key={c._id || c.id} disablePadding sx={{ py: 0.5 }}>
                <Typography>{c.content}</Typography>
              </ListItem>
            ))
          ) : (
            <Typography color="text.secondary">no comments yet</Typography>
          )}
        </List>
      </Box>
    </Box>
  );
};

export default BlogView;
