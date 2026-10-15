import { create } from "zustand";

const useAuthStore = create((set) => ({
  // Check whether a user is already logged in
  user: (() => {
    const savedUser = localStorage.getItem("user");

    return savedUser ? JSON.parse(savedUser) : null;
  })(),

  // Register
  register: (name, email, password) => {
    const existingUser = localStorage.getItem("registeredUser");

    if (existingUser) {
      const userData = JSON.parse(existingUser);

      if (userData.email === email) {
        return {
          success: false,
          message: "An account with this email already exists.",
        };
      }
    }

    const newUser = {
      name,
      email,
      password,
      address: "",
    };

    // Save registered account
    localStorage.setItem(
      "registeredUser",
      JSON.stringify(newUser)
    );

    // Automatically log in after registration
    const loggedInUser = {
      name,
      email,
      address: "",
    };

    localStorage.setItem(
      "user",
      JSON.stringify(loggedInUser)
    );

    set({ user: loggedInUser });

    return {
      success: true,
    };
  },

  // Login
  login: (email, password) => {
    const savedUser = localStorage.getItem("registeredUser");

    if (!savedUser) {
      return {
        success: false,
        message: "No account found. Please register first.",
      };
    }

    const userData = JSON.parse(savedUser);

    if (
      userData.email === email &&
      userData.password === password
    ) {
      const loggedInUser = {
        name: userData.name,
        email: userData.email,
        address: userData.address || "",
      };

      localStorage.setItem(
        "user",
        JSON.stringify(loggedInUser)
      );

      set({ user: loggedInUser });

      return {
        success: true,
      };
    }

    return {
      success: false,
      message: "Invalid email or password.",
    };
  },

  // Logout
  logout: () => {
    // Remove only the current login session
    localStorage.removeItem("user");

    set({ user: null });
  },
}));

export default useAuthStore;