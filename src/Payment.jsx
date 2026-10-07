import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";

const Payment = () => {
  const navigate = useNavigate();
  const { cart, cartTotal } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePayment = () => {
    if (!paymentMethod) {
      setMessage("Please select a payment method.");
      return;
    }

    setLoading(true);
    setMessage("");

    // Fake payment processing
    setTimeout(() => {
      setLoading(false);
      setMessage(`Payment successful using ${paymentMethod}!`);
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
              onClick={handlePayment}
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-black py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Processing Payment..." : "Pay Now"}
            </button>
          </div>

          {/* Order Summary */}
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-5 text-xl font-semibold">Order Summary</h2>

            <div className="space-y-4">
              {cart.map((item) => (
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
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;