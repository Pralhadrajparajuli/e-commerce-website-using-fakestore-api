import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Account = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

          <h2 className="mb-6 text-xl font-semibold">
            Account Information
          </h2>

          {/* Name */}
          <div className="mb-5">
            <p className="text-sm text-gray-500">
              Name
            </p>

            <p className="mt-1 text-lg font-semibold text-gray-900">
              {user?.name || "No name available"}
            </p>
          </div>

          {/* Email */}
          <div className="mb-8">
            <p className="text-sm text-gray-500">
              Email
            </p>

            <p className="mt-1 text-lg font-semibold text-gray-900">
              {user?.email || "No email available"}
            </p>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-600"
          >
            Logout
          </button>

        </div>
      </div>
    </section>
  );
};

export default Account;