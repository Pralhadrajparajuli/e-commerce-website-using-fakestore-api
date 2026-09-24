import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "./AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const { login, register } = useAuth();

  // "login" or "register"
  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    // LOGIN
    if (mode === "login") {
      const result = login(email, password);

      if (result.success) {
        navigate("/");
      } else {
        setError(result.message);
      }

      return;
    }

    // REGISTER
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const result = register(name, email, password);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
  };

  return (
    <section className="flex min-h-[80vh] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-gray-900">
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </h1>

        <p className="mt-2 text-gray-500">
          {mode === "login"
            ? "Sign in to your account"
            : "Create your account to get started"}
        </p>

        {/* LOGIN / REGISTER TABS */}
        <div className="mt-6 flex rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError("");
            }}
            className={`w-1/2 rounded-md py-2 font-medium transition ${
              mode === "login"
                ? "bg-white shadow"
                : "text-gray-500"
            }`}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError("");
            }}
            className={`w-1/2 rounded-md py-2 font-medium transition ${
              mode === "register"
                ? "bg-white shadow"
                : "text-gray-500"
            }`}
          >
            Register
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          {/* NAME - ONLY FOR REGISTER */}
          {mode === "register" && (
            <div>
              <label className="mb-2 block text-sm font-medium">
                Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>
          )}

          {/* EMAIL */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={
                mode === "login"
                  ? "Enter your password"
                  : "Create a password"
              }
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
            />
          </div>

          {/* CONFIRM PASSWORD - ONLY FOR REGISTER */}
          {mode === "register" && (
            <div>
              <label className="mb-2 block text-sm font-medium">
                Confirm Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm your password"
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-black"
              />
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        {/* SWITCH TEXT */}
        <p className="mt-6 text-center text-sm text-gray-600">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
                className="font-semibold text-blue-600 hover:underline"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
                className="font-semibold text-blue-600 hover:underline"
              >
                Sign In
              </button>
            </>
          )}
        </p>
      </div>
    </section>
  );
};

export default Login;