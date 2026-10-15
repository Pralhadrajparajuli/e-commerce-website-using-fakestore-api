import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuthStore from "../store/authStore";

const Account = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const updateProfile = useAuthStore(
    (state) => state.updateProfile
  );

  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user?.name || "");
  const [address, setAddress] = useState(user?.address || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Orders
  const [orders, setOrders] = useState([]);

  // Update form when user information changes
  useEffect(() => {
    setName(user?.name || "");
    setAddress(user?.address || "");
  }, [user]);

  // Load orders belonging to the logged-in user
  const loadOrders = () => {
    try {
      const savedOrders = JSON.parse(
        localStorage.getItem("orders") || "[]"
      );

      const userOrders = savedOrders
        .filter((order) => order.userEmail === user?.email)
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0) -
            new Date(a.createdAt || 0)
        );

      setOrders(userOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
      setOrders([]);
    }
  };

  useEffect(() => {
    loadOrders();

    // Listen for order updates from other browser tabs
    const handleStorageChange = (event) => {
      if (event.key === "orders") {
        loadOrders();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Also refresh orders when returning to this tab
    const handleFocus = () => {
      loadOrders();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );

      window.removeEventListener("focus", handleFocus);
    };
  }, [user?.email]);

  // Edit profile
  const handleEdit = () => {
    setName(user?.name || "");
    setAddress(user?.address || "");
    setPassword("");
    setConfirmPassword("");
    setMessage("");
    setError("");
    setIsEditing(true);
  };

  // Cancel editing
  const handleCancel = () => {
    setName(user?.name || "");
    setAddress(user?.address || "");
    setPassword("");
    setConfirmPassword("");
    setError("");
    setMessage("");
    setIsEditing(false);
  };

  // Save profile changes
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

    if (!user?.email) {
      setError("User information not found.");
      return;
    }

    // Update profile through Zustand
    const result = updateProfile({
      name: name.trim(),
      address: address.trim(),
      password,
    });

    if (!result?.success) {
      setError(result?.message || "Unable to update profile.");
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setMessage("Profile updated successfully.");
    setIsEditing(false);
  };

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Prevent account access when logged out
  if (!user) {
    return (
      <section className="min-h-[80vh] bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="mb-3 text-2xl font-bold">
            Please log in
          </h1>

          <p className="mb-6 text-gray-500">
            You need to log in to view your account and orders.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
          >
            Go to Login
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[80vh] bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold">
          My Account
        </h1>

        {/* ACCOUNT INFORMATION */}
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
                  value={user.email || ""}
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
                <p className="text-sm text-gray-500">Name</p>

                <p className="mt-1 text-lg font-semibold">
                  {user.name || "No name available"}
                </p>
              </div>

              {/* Email */}
              <div className="mb-5">
                <p className="text-sm text-gray-500">Email</p>

                <p className="mt-1 text-lg font-semibold">
                  {user.email || "No email available"}
                </p>
              </div>

              {/* Address */}
              <div className="mb-8">
                <p className="text-sm text-gray-500">Address</p>

                <p className="mt-1 text-lg font-semibold">
                  {user.address || "No address available"}
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

        {/* ORDERS SECTION */}
        <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-xl font-semibold">
            My Orders
          </h2>

          {orders.length === 0 ? (
            <p className="text-gray-500">
              You have no orders yet.
            </p>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl border p-5"
                >
                  {/* Order Header */}
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-bold">
                        Order #{order.id}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleDateString()
                          : ""}
                      </p>
                    </div>

                    {/* Status */}
                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        order.orderStatus === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : order.orderStatus === "Shipped"
                          ? "bg-blue-100 text-blue-700"
                          : order.orderStatus === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.orderStatus || "Processing"}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    {order.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 border-b pb-3 last:border-b-0"
                      >
                        <div className="h-14 w-14 rounded-lg bg-gray-100 p-2">
                          <img
                            src={
                              item.image ||
                              item.thumbnail ||
                              item.images?.[0]
                            }
                            alt={item.title}
                            className="h-full w-full object-contain"
                          />
                        </div>

                        <div className="flex-1">
                          <p className="font-medium">
                            {item.title}
                          </p>

                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity}
                          </p>
                        </div>

                        <p className="font-semibold">
                          $
                          {(
                            Number(item.price) *
                            Number(item.quantity)
                          ).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order Details */}
                  <div className="mt-5 border-t pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        Payment
                      </span>

                      <span className="font-medium">
                        {order.paymentMethod || "N/A"} -{" "}
                        {order.paymentStatus || "N/A"}
                      </span>
                    </div>

                    <div className="mt-2 flex justify-between text-sm">
                      <span className="text-gray-500">
                        Delivery
                      </span>

                      <span>
                        $
                        {Number(
                          order.deliveryCharge || 0
                        ).toFixed(2)}
                      </span>
                    </div>

                    <div className="mt-3 flex justify-between border-t pt-3 font-bold">
                      <span>Total</span>

                      <span>
                        $
                        {Number(order.total || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Order Status Message */}
                  <div className="mt-5 rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-500">
                      Order Status
                    </p>

                    <p className="mt-1 font-bold">
                      {order.orderStatus || "Processing"}
                    </p>

                    {order.orderStatus === "Processing" && (
                      <p className="mt-1 text-sm text-gray-500">
                        Your order is being processed.
                      </p>
                    )}

                    {order.orderStatus === "Shipped" && (
                      <p className="mt-1 text-sm text-gray-500">
                        Your order has been shipped.
                      </p>
                    )}

                    {order.orderStatus === "Delivered" && (
                      <p className="mt-1 text-sm text-green-600">
                        Your order has been delivered.
                      </p>
                    )}

                    {order.orderStatus === "Cancelled" && (
                      <p className="mt-1 text-sm text-red-600">
                        Your order has been cancelled.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Account;