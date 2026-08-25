import { create } from "zustand";
import loginService from "../services/login";
import blogService from "../services/blogs";
import persistentUser from "../services/persistentUser";

const useUserStore = create((set) => ({
  user: null,

  initializeUser: () => {
    const loggedUser = persistentUser.getUser();
    if (loggedUser) {
      blogService.setToken(loggedUser.token);
      set({ user: loggedUser });
    }
  },

  login: async (credentials) => {
    const loggedUser = await loginService.login(credentials);
    persistentUser.saveUser(loggedUser);
    blogService.setToken(loggedUser.token);
    set({ user: loggedUser });
  },

  logout: () => {
    persistentUser.removeUser();
    blogService.setToken(null);
    set({ user: null });
  },
}));

export default useUserStore;
