import { create } from "zustand";

let toastTimer;

const useToastStore = create((set) => ({
  message: "",
  type: "success",

  showToast: (text, toastType = "success") => {
    clearTimeout(toastTimer);

    set({
      message: text,
      type: toastType,
    });

    toastTimer = setTimeout(() => {
      set({ message: "" });
    }, 2000);
  },

  hideToast: () => {
    clearTimeout(toastTimer);
    set({ message: "" });
  },
}));

export default useToastStore;