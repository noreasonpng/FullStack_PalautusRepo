import Notification from './Notification'
import {TextField, Button} from '@mui/material'

const LoginForm = ({ username, password, handleUsernameChange, handlePasswordChange, handleLogin, errorMessage }) => {
  return (
    <div>
      <h1>Login</h1>
      <Notification message={errorMessage} className="error" />
      <form onSubmit={handleLogin}>
        <TextField label = "username"
        value={username}
        onChange={handleUsernameChange}
        />
        <TextField label = "password"
        type="password"
        value={password}
        onChange={handlePasswordChange}
        />
        <Button type="submit" variant="contained" style={{marginTop: 10}}>login</Button>
      </form>
    </div>
  )
}

export default LoginForm

