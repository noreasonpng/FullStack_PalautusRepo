import { create } from "zustand";

const useNotificationStore = create((set) => ({
  message: null,
  type: "success",

  setNotification: (message, type = "success", timeout = 5000) => {
    set({ message, type });
    setTimeout(() => {
      set({ message: null });
    }, timeout);
  },

  clearNotification: () => set({ message: null, type: "success" }),
}));

export default useNotificationStore;
