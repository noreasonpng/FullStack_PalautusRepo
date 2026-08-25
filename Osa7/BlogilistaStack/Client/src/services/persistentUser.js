const getUser = () => {
  const loggedUserJSON = window.localStorage.getItem("loggedAppUser");
  return loggedUserJSON ? JSON.parse(loggedUserJSON) : null;
};

const saveUser = (user) => {
  window.localStorage.setItem("loggedAppUser", JSON.stringify(user));
};

const removeUser = () => {
  window.localStorage.removeItem("loggedAppUser");
};

export default { getUser, saveUser, removeUser };
