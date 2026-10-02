import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  Plus,
  Trash2,
  Edit,
  X,
} from "lucide-react";

const API_URL = "https://dummyjson.com/products";

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    title: "",
    price: "",
    category: "",
    image: "",
    description: "",
  });

  // Load products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const savedProducts = localStorage.getItem("products");

      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
        setLoading(false);
        return;
      }

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      const formattedProducts = data.products.map((product) => ({
        ...product,
        image: product.thumbnail || product.images?.[0] || "",
      }));

      setProducts(formattedProducts);

      localStorage.setItem(
        "products",
        JSON.stringify(formattedProducts)
      );
    } catch (error) {
      console.error(error);
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  // Load orders
  const loadOrders = () => {
    const savedOrders = localStorage.getItem("orders");

    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  };

  // Load registered users
  const loadUsers = () => {
    const savedUser = localStorage.getItem("registeredUser");

    if (savedUser) {
      setUsers([JSON.parse(savedUser)]);
    } else {
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    loadOrders();
    loadUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      title: "",
      price: "",
      category: "",
      image: "",
      description: "",
    });

    setEditingProduct(null);
    setShowForm(false);
  };

  // Add product
  const handleAddProduct = (e) => {
    e.preventDefault();

    if (!form.title || !form.price || !form.category) {
      setError("Please fill in title, price and category.");
      return;
    }

    const newProduct = {
      id: Date.now(),
      title: form.title,
      price: Number(form.price),
      category: form.category,
      description: form.description,
      thumbnail: form.image,
      images: form.image ? [form.image] : [],
      image: form.image,
    };

    const updatedProducts = [newProduct, ...products];

    setProducts(updatedProducts);

    localStorage.setItem(
      "products",
      JSON.stringify(updatedProducts)
    );

    resetForm();
    setError("");
  };

  // Start editing
  const handleEdit = (product) => {
    setEditingProduct(product);

    setForm({
      title: product.title || "",
      price: product.price || "",
      category: product.category || "",
      image:
        product.image ||
        product.thumbnail ||
        product.images?.[0] ||
        "",
      description: product.description || "",
    });

    setShowForm(true);
    setError("");
  };

  // Update product
  const handleUpdateProduct = (e) => {
    e.preventDefault();

    if (!form.title || !form.price || !form.category) {
      setError("Please fill in title, price and category.");
      return;
    }

    const updatedProducts = products.map((product) => {
      if (product.id === editingProduct.id) {
        return {
          ...product,
          title: form.title,
          price: Number(form.price),
          category: form.category,
          description: form.description,
          image: form.image,
          thumbnail: form.image,
          images: form.image ? [form.image] : [],
        };
      }

      return product;
    });

    setProducts(updatedProducts);

    localStorage.setItem(
      "products",
      JSON.stringify(updatedProducts)
    );

    resetForm();
    setError("");
  };

  // Delete product
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    const updatedProducts = products.filter(
      (product) => product.id !== id
    );

    setProducts(updatedProducts);

    localStorage.setItem(
      "products",
      JSON.stringify(updatedProducts)
    );
  };

  // Change order status
  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return {
          ...order,
          orderStatus: newStatus,
        };
      }

      return order;
    });

    setOrders(updatedOrders);

    localStorage.setItem(
      "orders",
      JSON.stringify(updatedOrders)
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>

          <p className="mt-1 text-gray-500">
            Manage your store products, users and orders.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="mb-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Products
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {products.length}
                </h2>
              </div>

              <div className="rounded-lg bg-blue-100 p-3">
                <Package className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Users
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {users.length}
                </h2>
              </div>

              <div className="rounded-lg bg-green-100 p-3">
                <Users className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Orders
                </p>

                <h2 className="mt-2 text-3xl font-bold">
                  {orders.length}
                </h2>
              </div>

              <div className="rounded-lg bg-purple-100 p-3">
                <ShoppingBag className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Product Section */}
        <div className="mb-10 rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutDashboard size={22} />

              <h2 className="text-xl font-bold">
                Product Management
              </h2>
            </div>

            <button
              onClick={() => {
                setEditingProduct(null);
                setForm({
                  title: "",
                  price: "",
                  category: "",
                  image: "",
                  description: "",
                });
                setShowForm(true);
                setError("");
              }}
              className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>

          {error && (
            <div className="mb-5 rounded-lg bg-red-100 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          {/* Add/Edit Form */}
          {showForm && (
            <div className="mb-8 rounded-xl border bg-gray-50 p-6">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-bold">
                  {editingProduct
                    ? "Edit Product"
                    : "Add New Product"}
                </h3>

                <button onClick={resetForm}>
                  <X size={22} />
                </button>
              </div>

              <form
                onSubmit={
                  editingProduct
                    ? handleUpdateProduct
                    : handleAddProduct
                }
                className="grid gap-4 md:grid-cols-2"
              >
                <input
                  type="text"
                  name="title"
                  placeholder="Product title"
                  value={form.title}
                  onChange={handleChange}
                  className="rounded-lg border px-4 py-3 outline-none focus:border-black"
                />

                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={form.price}
                  onChange={handleChange}
                  className="rounded-lg border px-4 py-3 outline-none focus:border-black"
                />

                <input
                  type="text"
                  name="category"
                  placeholder="Category"
                  value={form.category}
                  onChange={handleChange}
                  className="rounded-lg border px-4 py-3 outline-none focus:border-black"
                />

                <input
                  type="text"
                  name="image"
                  placeholder="Image URL"
                  value={form.image}
                  onChange={handleChange}
                  className="rounded-lg border px-4 py-3 outline-none focus:border-black"
                />

                <textarea
                  name="description"
                  placeholder="Product description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  className="rounded-lg border px-4 py-3 outline-none focus:border-black md:col-span-2"
                />

                <div className="flex gap-3 md:col-span-2">
                  <button
                    type="submit"
                    className="rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
                  >
                    {editingProduct
                      ? "Update Product"
                      : "Add Product"}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border px-6 py-3 font-semibold hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products Table */}
          {loading ? (
            <p className="py-10 text-center text-gray-500">
              Loading products...
            </p>
          ) : products.length === 0 ? (
            <p className="py-10 text-center text-gray-500">
              No products found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="px-4 py-4">Product</th>
                    <th className="px-4 py-4">Category</th>
                    <th className="px-4 py-4">Price</th>
                    <th className="px-4 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b last:border-b-0"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-16 w-16 rounded-lg bg-gray-100 p-2">
                            <img
                              src={
                                product.image ||
                                product.thumbnail ||
                                product.images?.[0]
                              }
                              alt={product.title}
                              className="h-full w-full object-contain"
                            />
                          </div>

                          <div>
                            <p className="max-w-xs font-semibold">
                              {product.title}
                            </p>

                            <p className="text-sm text-gray-500">
                              ID: {product.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 capitalize">
                        {product.category}
                      </td>

                      <td className="px-4 py-4 font-semibold">
                        ${product.price}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="rounded-lg bg-blue-100 p-2 text-blue-600 hover:bg-blue-200"
                          >
                            <Edit size={18} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(product.id)
                            }
                            className="rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Users Section */}
        <div className="mb-10 rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <Users size={22} />

            <h2 className="text-xl font-bold">
              Registered Users
            </h2>
          </div>

          {users.length === 0 ? (
            <p className="text-gray-500">
              No registered users found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="px-4 py-4">Name</th>
                    <th className="px-4 py-4">Email</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-4 font-semibold">
                        {user.name}
                      </td>

                      <td className="px-4 py-4">
                        {user.email}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Orders Section */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <ShoppingBag size={22} />

            <h2 className="text-xl font-bold">
              Orders
            </h2>
          </div>

          {orders.length === 0 ? (
            <p className="text-gray-500">
              No orders found.
            </p>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-xl border p-5"
                >
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold">
                        Order #{order.id}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {order.userName} · {order.userEmail}
                      </p>
                    </div>

                    <select
                      value={order.orderStatus || "Processing"}
                      onChange={(e) =>
                        updateOrderStatus(
                          order.id,
                          e.target.value
                        )
                      }
                      className="rounded-lg border px-4 py-2"
                    >
                      <option value="Processing">
                        Processing
                      </option>

                      <option value="Shipped">
                        Shipped
                      </option>

                      <option value="Delivered">
                        Delivered
                      </option>

                      <option value="Cancelled">
                        Cancelled
                      </option>
                    </select>
                  </div>

                  <div className="grid gap-4 text-sm md:grid-cols-2">
                    <div>
                      <p className="font-semibold">
                        Payment Method
                      </p>

                      <p className="text-gray-600">
                        {order.paymentMethod || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold">
                        Payment Status
                      </p>

                      <p className="text-gray-600">
                        {order.paymentStatus || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold">
                        Shipping Address
                      </p>

                      <p className="text-gray-600">
                        {order.address || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="font-semibold">
                        Total
                      </p>

                      <p className="text-gray-600">
                        ${Number(order.total || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 border-t pt-5">
                    <h4 className="mb-3 font-semibold">
                      Ordered Products
                    </h4>

                    <div className="space-y-3">
                      {order.items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4"
                        >
                          <div className="h-14 w-14 rounded-lg bg-gray-100 p-2">
                            <img
                              src={item.image}
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
                  </div>

                  <div className="mt-5 border-t pt-5 text-sm text-gray-600">
                    <p>
                      Subtotal: $
                      {Number(order.subtotal || 0).toFixed(2)}
                    </p>

                    <p>
                      Delivery: $
                      {Number(
                        order.deliveryCharge || 0
                      ).toFixed(2)}
                    </p>

                    {order.transactionUuid && (
                      <p className="mt-2">
                        Transaction: {order.transactionUuid}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;