import { useParams } from "react-router-dom";
import { Typography, Box } from "@mui/material";

const UserView = ({ users }) => {
  const { id } = useParams();
  const user = users.find((u) => (u.id || u._id) === id);

  if (!user) {
    return <Typography>user not found</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        {user.name}
      </Typography>

      <Typography color="text.secondary" gutterBottom>
        {user.username}
      </Typography>

      <Typography variant="h6" component="h3" sx={{ mt: 2 }}>
        added blogs
      </Typography>

      <Box component="ul" sx={{ pl: 3 }}>
        {user.createdBlogs &&
          user.createdBlogs
            .filter((blog) => blog !== null)
            .map((blog) => (
              <Typography component="li" key={blog.id || blog._id}>
                {blog.title}
              </Typography>
            ))}
      </Box>
    </Box>
  );
};

export default UserView;
