import Notification from './Notification'

const LoginForm = ({ username, password, handleUsernameChange, handlePasswordChange, handleLogin, errorMessage }) => {
  return (
    <div>
      <h1>Login</h1>
      <Notification message={errorMessage} className="error" />
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username:
            <input type="text" value={username} onChange={handleUsernameChange} />
          </label>
        </div>
        <div>
          <label>
            password:
            <input type="password" value={password} onChange={handlePasswordChange} />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm

