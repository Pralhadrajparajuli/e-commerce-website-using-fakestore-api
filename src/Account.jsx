import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [address, setAddress] = useState(user?.address || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleEdit = () => {
    setName(user?.name || "");
    setAddress(user?.address || "");
    setPassword("");
    setConfirmPassword("");
    setMessage("");
    setError("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setName(user?.name || "");
    setAddress(user?.address || "");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setMessage("");
    setIsEditing(false);
  };

  const handleSave = () => {
    setError("");
    setMessage("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!address.trim()) {
      setError("Address is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const savedUser = localStorage.getItem("registeredUser");

    if (!savedUser) {
      setError("User information not found.");
      return;
    }

    const userData = JSON.parse(savedUser);

    const updatedUser = {
      ...userData,
      name: name.trim(),
      address: address.trim(),
      password: password,
    };

    localStorage.setItem(
      "registeredUser",
      JSON.stringify(updatedUser)
    );

    const loggedInUser = {
      name: name.trim(),
      email: userData.email,
      address: address.trim(),
    };

    localStorage.setItem(
      "user",
      JSON.stringify(loggedInUser)
    );

    setMessage("Profile updated successfully.");
    setIsEditing(false);

    window.location.reload();
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <section className="min-h-[80vh] bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">

        <h1 className="mb-8 text-3xl font-bold">
          My Account
        </h1>

        <div className="rounded-2xl bg-white p-8 shadow-sm">

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              Account Information
            </h2>

            {!isEditing && (
              <button
                onClick={handleEdit}
                className="rounded-lg bg-blue-500 px-5 py-2 font-semibold text-white hover:bg-blue-600"
              >
                Edit Profile
              </button>
            )}
          </div>

          {error && (
            <div className="mb-5 rounded-lg bg-red-100 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-5 rounded-lg bg-green-100 px-4 py-3 text-green-700">
              {message}
            </div>
          )}

          {isEditing ? (
            <div>

              {/* Name */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium">
                  Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* Email */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium">
                  Email
                </label>

                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
                />
              </div>

              {/* Address */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium">
                  Address
                </label>

                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows="3"
                  placeholder="Enter your delivery address"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              {/* New Password */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-medium">
                  New Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="Enter new password"
                />
              </div>

              {/* Confirm Password */}
              <div className="mb-8">
                <label className="mb-2 block text-sm font-medium">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="Confirm new password"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="rounded-lg bg-green-500 px-6 py-3 font-semibold text-white hover:bg-green-600"
                >
                  Save Changes
                </button>

                <button
                  onClick={handleCancel}
                  className="rounded-lg bg-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>

            </div>
          ) : (
            <div>

              {/* Name */}
              <div className="mb-5">
                <p className="text-sm text-gray-500">
                  Name
                </p>

                <p className="mt-1 text-lg font-semibold">
                  {user?.name || "No name available"}
                </p>
              </div>

              {/* Email */}
              <div className="mb-5">
                <p className="text-sm text-gray-500">
                  Email
                </p>

                <p className="mt-1 text-lg font-semibold">
                  {user?.email || "No email available"}
                </p>
              </div>

              {/* Address */}
              <div className="mb-8">
                <p className="text-sm text-gray-500">
                  Address
                </p>

                <p className="mt-1 text-lg font-semibold">
                  {user?.address || "No address available"}
                </p>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-500 px-6 py-3 font-semibold text-white hover:bg-red-600"
              >
                Logout
              </button>

            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default Account;