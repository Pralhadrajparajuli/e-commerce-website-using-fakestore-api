import {
  X,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";

import { useCart } from "./CartContext";

const CartDrawer = ({ isOpen, onClose }) => {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    cartTotal,
  } = useCart();

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Background */}
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
      />

      {/* Cart */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-[400px] flex-col bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="text-xl font-bold">
            Shopping Cart
          </h2>

          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {cart.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">
                Your cart is empty.
              </p>
            </div>
          ) : (
            <div className="space-y-6">

              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border-b pb-5"
                >

                  {/* Image */}
                  <div className="h-24 w-24 flex-shrink-0 rounded-xl bg-gray-100 p-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  {/* Information */}
                  <div className="flex flex-1 flex-col">

                    <h3 className="line-clamp-2 text-sm font-semibold">
                      {item.title}
                    </h3>

                    <p className="mt-1 font-bold">
                      ${item.price}
                    </p>

                    {/* Quantity */}
                    <div className="mt-3 flex items-center justify-between">

                      <div className="flex items-center rounded-lg border">

                        <button
                          onClick={() =>
                            decreaseQuantity(item.id)
                          }
                          className="p-2"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="px-3 text-sm">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            increaseQuantity(item.id)
                          }
                          className="p-2"
                        >
                          <Plus size={14} />
                        </button>

                      </div>

                      {/* Delete */}
                      <button
                        onClick={() =>
                          removeFromCart(item.id)
                        }
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>

                    </div>

                  </div>
                </div>
              ))}

            </div>
          )}

        </div>

        {/* Bottom */}
        {cart.length > 0 && (
          <div className="border-t bg-white px-6 py-5">

            {/* Subtotal */}
            <div className="mb-5 flex justify-between text-lg font-bold">
              <span>Subtotal</span>

              <span>
                ${cartTotal.toFixed(2)}
              </span>
            </div>

            {/* Continue Shopping */}
            <button
              onClick={onClose}
              className="mb-3 w-full rounded-xl border border-gray-300 py-3 font-semibold"
            >
              Continue Shopping
            </button>

            {/* Checkout */}
            <button
              className="w-full rounded-xl bg-black py-3 font-semibold text-white hover:bg-gray-800"
            >
              Proceed to Pay
            </button>

          </div>
        )}

      </div>
    </>
  );
};

export default CartDrawer;