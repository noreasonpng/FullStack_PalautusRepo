import { useField } from "../hooks/index.js";
import { TextField, Button } from "@mui/material";

const BlogCreationForm = ({ handleSubmit }) => {
  const title = useField("text");
  const author = useField("text");
  const url = useField("text");

  const createBlog = (event) => {
    event.preventDefault();
    handleSubmit({ title: title.value, author: author.value, url: url.value });
    title.reset();
    author.reset();
    url.reset();
  };

  return (
    <div>
      <h2>create new blog</h2>
      <form
        onSubmit={createBlog}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          alignItems: "flex-start",
        }}
      >
        <TextField
          label="Title"
          type={title.type}
          value={title.value}
          onChange={title.onChange}
        />
        <TextField
          label="Author"
          type={author.type}
          value={author.value}
          onChange={author.onChange}
        />
        <TextField
          label="URL"
          type={url.type}
          value={url.value}
          onChange={url.onChange}
        />
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          create
        </Button>
      </form>
    </div>
  );
};

export default BlogCreationForm;
