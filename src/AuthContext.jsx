import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Check if user is already logged in
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Register
  const register = (name, email, password) => {
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
    };

    // Save registered user
    localStorage.setItem(
      "registeredUser",
      JSON.stringify(newUser)
    );

    // Automatically log in after registration
    const loggedInUser = {
      name,
      email,
    };

    localStorage.setItem(
      "user",
      JSON.stringify(loggedInUser)
    );

    setUser(loggedInUser);

    return {
      success: true,
    };
  };

  // Login
  const login = (email, password) => {
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
      };

      localStorage.setItem(
        "user",
        JSON.stringify(loggedInUser)
      );

      setUser(loggedInUser);

      return {
        success: true,
      };
    }

    return {
      success: false,
      message: "Invalid email or password.",
    };
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};