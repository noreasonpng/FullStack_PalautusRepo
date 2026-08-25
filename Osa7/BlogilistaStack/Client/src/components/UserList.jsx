import { Link } from "react-router-dom";
import {
  Typography,
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

const UserList = ({ users }) => {
  return (
    <Box>
      <Typography variant="h5" component="h2" gutterBottom>
        users
      </Typography>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>blogs created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id || user._id}>
              <TableCell>
                <Link to={`/users/${user.id || user._id}`}>
                  {user.username}
                </Link>
              </TableCell>
              <TableCell>
                {user.createdBlogs ? user.createdBlogs.length : 0}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default UserList;
