import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";
import useToastStore from "../store/toastStore";

const Payment = () => {
  const navigate = useNavigate();

  // Zustand stores
  const cart = useCartStore((state) => state.cart);
  const cartTotal = useCartStore((state) => state.cartTotal);
  const removeSelectedItems = useCartStore(
    (state) => state.removeSelectedItems
  );

  const user = useAuthStore((state) => state.user);
  const showToast = useToastStore((state) => state.showToast);

  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Only process selected cart items when the store supports selection.
  const selectedItems = cart.filter((item) => item.selected);

  const itemsToPay = selectedItems.length > 0 ? selectedItems : cart;

  const subtotal = itemsToPay.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handlePayment = () => {
    if (!user) {
      showToast("Please log in before making a payment.", "error");
      navigate("/login");
      return;
    }

    if (itemsToPay.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    if (!paymentMethod) {
      setMessage("Please select a payment method.");
      return;
    }

    setLoading(true);
    setMessage("");

    // Simulate payment processing
    setTimeout(() => {
      const newOrder = {
        id: Date.now(),
        userName: user.name,
        userEmail: user.email,
        items: itemsToPay.map((item) => ({
          ...item,
        })),
        subtotal,
        deliveryCharge: subtotal >= 100 ? 0 : 10,
        total: subtotal + (subtotal >= 100 ? 0 : 10),
        paymentMethod,
        paymentStatus: "Paid",
        orderStatus: "Processing",
        address: user.address || "",
        transactionUuid: `TXN-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      // Save the order
      const existingOrders = JSON.parse(
        localStorage.getItem("orders") || "[]"
      );

      localStorage.setItem(
        "orders",
        JSON.stringify([...existingOrders, newOrder])
      );

      // Remove purchased items from the cart.
      // The cart store should remove selected items when selection is used.
      removeSelectedItems();

      setLoading(false);
      setMessage(`Payment successful using ${paymentMethod}!`);

      showToast("Payment successful! Your order has been placed.");

      // Navigate to the Account page after a short delay.
      setTimeout(() => {
        navigate("/account");
      }, 1500);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-3xl font-bold">Payment</h1>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Payment Methods */}
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-5 text-xl font-semibold">
              Select Payment Method
            </h2>

            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setPaymentMethod("eSewa")}
                className={`w-full rounded-lg border p-4 text-left transition ${
                  paymentMethod === "eSewa"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <p className="font-semibold text-green-600">eSewa</p>
                <p className="text-sm text-gray-500">
                  Pay using eSewa wallet
                </p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("Khalti")}
                className={`w-full rounded-lg border p-4 text-left transition ${
                  paymentMethod === "Khalti"
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-gray-400"
                }`}
              >
                <p className="font-semibold text-purple-600">Khalti</p>
                <p className="text-sm text-gray-500">
                  Pay using Khalti wallet
                </p>
              </button>
            </div>

            {message && (
              <div
                className={`mt-5 rounded-lg p-3 text-sm ${
                  message.includes("successful")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="button"
              onClick={handlePayment}
              disabled={loading || cart.length === 0}
              className="mt-6 w-full rounded-lg bg-black py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Processing Payment..." : "Pay Now"}
            </button>
          </div>

          {/* Order Summary */}
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-5 text-xl font-semibold">Order Summary</h2>

            <div className="space-y-4">
              {itemsToPay.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-between text-lg font-bold">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="mt-3 flex justify-between text-sm text-gray-600">
              <span>Delivery</span>
              <span>{subtotal >= 100 ? "Free" : "$10.00"}</span>
            </div>

            <div className="mt-4 flex justify-between border-t pt-4 text-lg font-bold">
              <span>Total</span>
              <span>
                ${(subtotal + (subtotal >= 100 ? 0 : 10)).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;