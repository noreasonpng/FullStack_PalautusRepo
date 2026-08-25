import { useField } from "../hooks/index.js";
import { TextField, Button } from "@mui/material";

const LoginForm = ({ handleLogin }) => {
  const username = useField("text");
  const password = useField("password");

  const onSubmit = (event) => {
    event.preventDefault();
    handleLogin({ username: username.value, password: password.value });
    username.reset();
    password.reset();
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={onSubmit}>
        <TextField
          label="username"
          type={username.type}
          value={username.value}
          onChange={username.onChange}
        />
        <TextField
          label="password"
          type={password.type}
          value={password.value}
          onChange={password.onChange}
        />
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          login
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
