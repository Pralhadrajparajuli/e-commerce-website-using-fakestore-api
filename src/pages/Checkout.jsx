import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useCartStore from "../store/cartStore";
import useAuthStore from "../store/authStore";

const Checkout = () => {
  // Zustand cart store
  const cart = useCartStore((state) => state.cart);

  const removeSelectedItems = useCartStore(
    (state) => state.removeSelectedItems
  );

  // Zustand authentication store
  const user = useAuthStore((state) => state.user);

  const navigate = useNavigate();

  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");

  // Only selected cart items
  const selectedItems = cart.filter(
    (item) => item.selected
  );

  // Total of selected items
  const cartTotal = selectedItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const deliveryCharge = cartTotal >= 100 ? 0 : 10;

  const total = cartTotal + deliveryCharge;

  // No selected items
  if (selectedItems.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="mb-4 text-3xl font-bold">
          No Products Selected
        </h1>

        <p className="mb-6 text-gray-500">
          Please select at least one product from
          your cart before going to checkout.
        </p>

        <button
          onClick={() => navigate("/products")}
          className="rounded-xl bg-black px-6 py-3 font-semibold text-white"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  const handlePayment = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!user.address) {
      setPaymentMessage(
        "Please add a shipping address before payment."
      );
      return;
    }

    if (!paymentMethod) {
      setPaymentMessage(
        "Please select a payment method."
      );
      return;
    }

    setProcessing(true);
    setPaymentMessage("");

    // Frontend-only simulated payment
    setTimeout(() => {
      try {
        const transactionId = Date.now();

        // Create order after simulated successful payment
        const newOrder = {
          id: transactionId,

          userName: user.name || "Guest User",
          userEmail: user.email || "No email",

          // Save only the selected products
          items: selectedItems.map((item) => ({
            ...item,
          })),

          subtotal: cartTotal,
          deliveryCharge,
          total,

          paymentMethod,
          paymentStatus: "Paid",
          orderStatus: "Processing",

          address: user.address,

          transactionUuid: `TXN-${transactionId}`,

          createdAt: new Date().toISOString(),
        };

        // Get existing orders safely
        const existingOrders = JSON.parse(
          localStorage.getItem("orders") || "[]"
        );

        // Save the new order
        localStorage.setItem(
          "orders",
          JSON.stringify([newOrder, ...existingOrders])
        );

        // Remove only the selected items from Zustand cart
        removeSelectedItems();

        setPaymentMessage(
          `Payment successful using ${paymentMethod}!`
        );
      } catch (error) {
        console.error("Error saving order:", error);

        setPaymentMessage(
          "Payment could not be completed. Please try again."
        );
      } finally {
        setProcessing(false);
      }
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold">
        Checkout
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* LEFT SIDE */}
        <div className="space-y-6 lg:col-span-2">
          {/* User Details */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">
              User Details
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-500">
                  Name
                </p>

                <p className="mt-1 font-semibold">
                  {user?.name || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Email
                </p>

                <p className="mt-1 font-semibold">
                  {user?.email || "Not available"}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">
              Shipping Address
            </h2>

            {user?.address ? (
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="font-medium">
                  {user.address}
                </p>
              </div>
            ) : (
              <div>
                <p className="mb-4 text-gray-500">
                  No shipping address has been added.
                </p>

                <button
                  onClick={() => navigate("/account")}
                  className="rounded-lg border border-gray-300 px-4 py-2 font-semibold hover:bg-gray-100"
                >
                  Add Address
                </button>
              </div>
            )}
          </div>

          {/* Delivery Items */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold">
              Delivery Items
            </h2>

            <div className="space-y-5">
              {selectedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border-b pb-5 last:border-b-0 last:pb-0"
                >
                  {/* Product Image */}
                  <div className="h-24 w-24 flex-shrink-0 rounded-xl bg-gray-100 p-3">
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

                  {/* Product Details */}
                  <div className="flex flex-1 justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>

                      <p className="mt-2 font-semibold">
                        ${item.price} × {item.quantity}
                      </p>
                    </div>

                    <div>
                      <p className="font-bold">
                        $
                        {(
                          item.price * item.quantity
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-2xl border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-bold">
              Order Summary
            </h2>

            {/* Subtotal */}
            <div className="mb-4 flex justify-between">
              <span className="text-gray-600">
                Subtotal
              </span>

              <span className="font-semibold">
                ${cartTotal.toFixed(2)}
              </span>
            </div>

            {/* Delivery */}
            <div className="mb-4 flex justify-between">
              <span className="text-gray-600">
                Delivery Charge
              </span>

              <span className="font-semibold">
                {deliveryCharge === 0
                  ? "FREE"
                  : `$${deliveryCharge.toFixed(2)}`}
              </span>
            </div>

            <div className="my-5 border-t" />

            {/* Total */}
            <div className="mb-6 flex justify-between text-xl font-bold">
              <span>Total</span>

              <span>
                ${total.toFixed(2)}
              </span>
            </div>

            {/* Proceed to Payment */}
            {!showPayment && (
              <>
                <button
                  onClick={() => {
                    if (!user) {
                      navigate("/login");
                      return;
                    }

                    if (!user.address) {
                      setPaymentMessage(
                        "Please add a shipping address first."
                      );
                      return;
                    }

                    setPaymentMessage("");
                    setShowPayment(true);
                  }}
                  className={`w-full rounded-xl py-3 font-semibold text-white ${
                    user?.address
                      ? "bg-black hover:bg-gray-800"
                      : "cursor-not-allowed bg-gray-400"
                  }`}
                >
                  Proceed to Payment
                </button>

                {!user?.address && (
                  <p className="mt-3 text-center text-sm text-red-500">
                    Please add a shipping address first.
                  </p>
                )}

                {paymentMessage && (
                  <p className="mt-3 text-center text-sm text-red-500">
                    {paymentMessage}
                  </p>
                )}
              </>
            )}

            {/* Payment Options */}
            {showPayment && (
              <div className="mt-4">
                <h3 className="mb-4 font-bold">
                  Select Payment Method
                </h3>

                {/* eSewa */}
                <button
                  onClick={() => {
                    setPaymentMethod("eSewa");
                    setPaymentMessage("");
                  }}
                  className={`mb-3 w-full rounded-xl border p-4 text-left ${
                    paymentMethod === "eSewa"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <p className="font-bold text-green-600">
                    eSewa
                  </p>

                  <p className="text-sm text-gray-500">
                    Pay using eSewa wallet
                  </p>
                </button>

                {/* Khalti */}
                <button
                  onClick={() => {
                    setPaymentMethod("Khalti");
                    setPaymentMessage("");
                  }}
                  className={`mb-4 w-full rounded-xl border p-4 text-left ${
                    paymentMethod === "Khalti"
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <p className="font-bold text-purple-600">
                    Khalti
                  </p>

                  <p className="text-sm text-gray-500">
                    Pay using Khalti wallet
                  </p>
                </button>

                {/* Payment Message */}
                {paymentMessage && (
                  <div
                    className={`mb-4 rounded-lg p-3 text-center text-sm ${
                      paymentMessage.includes("successful")
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {paymentMessage}
                  </div>
                )}

                {/* Pay Button */}
                <button
                  onClick={handlePayment}
                  disabled={processing}
                  className="w-full rounded-xl bg-black py-3 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {processing
                    ? "Processing Payment..."
                    : `Pay $${total.toFixed(2)}`}
                </button>

                {/* Back Button */}
                <button
                  onClick={() => {
                    setShowPayment(false);
                    setPaymentMethod("");
                    setPaymentMessage("");
                  }}
                  disabled={processing}
                  className="mt-3 w-full rounded-xl border border-gray-300 py-3 font-semibold hover:bg-gray-100 disabled:opacity-50"
                >
                  Back
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;