import { X, Plus, Minus, Trash2 } from "lucide-react";

import { useNavigate } from "react-router-dom";
import useCartStore from "../store/cartStore";
import useToastStore from "../store/toastStore";

const CartDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const cart = useCartStore((state) => state.cart);

  const increaseQuantity = useCartStore((state) => state.increaseQuantity);

  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);

  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const toggleSelection = useCartStore((state) => state.toggleSelection);

  const selectAll = useCartStore((state) => state.selectAll);

  const deselectAll = useCartStore((state) => state.deselectAll);

 const showToast = useToastStore((state) => state.showToast);

  // Only selected products
  const selectedItems = cart.filter((item) => item.selected);

  // Total of selected products
  const selectedTotal = selectedItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const allSelected = cart.length > 0 && cart.every((item) => item.selected);

  if (!isOpen) {
    return null;
  }

  const handleRemove = (id) => {
    removeFromCart(id);

    showToast("Product removed from cart", "error");
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      showToast("Please select at least one product", "error");

      return;
    }

    onClose();
    navigate("/checkout");
  };

  return (
    <>
      {/* Background overlay */}
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />

      {/* Cart drawer */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-[400px] flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="text-xl font-bold">Shopping Cart</h2>

          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Select All */}
        {cart.length > 0 && (
          <div className="flex items-center justify-between border-b px-6 py-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => {
                  if (allSelected) {
                    deselectAll();
                  } else {
                    selectAll();
                  }
                }}
                className="h-4 w-4"
              />
              Select All
            </label>

            <span className="text-sm text-gray-500">
              {selectedItems.length} selected
            </span>
          </div>
        )}

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {cart.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">Your cart is empty.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 border-b pb-5">
                  {/* Checkbox */}
                  <div className="pt-2">
                    <input
                      type="checkbox"
                      checked={item.selected || false}
                      onChange={() => toggleSelection(item.id)}
                      className="h-4 w-4"
                    />
                  </div>

                  {/* Product image */}
                  <div className="h-24 w-24 flex-shrink-0 rounded-xl bg-gray-100 p-3">
                    <img
                      src={item.thumbnail || item.images?.[0]}
                      alt={item.title}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  {/* Product information */}
                  <div className="flex flex-1 flex-col">
                    <h3 className="line-clamp-2 text-sm font-semibold">
                      {item.title}
                    </h3>

                    <p className="mt-1 font-bold">${item.price}</p>

                    {/* Quantity */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center rounded-lg border">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="px-3 text-sm">{item.quantity}</span>

                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => handleRemove(item.id)}
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

        {/* Bottom section */}
        {cart.length > 0 && (
          <div className="border-t bg-white px-6 py-5">
            {/* Selected total */}
            <div className="mb-2 flex justify-between text-lg font-bold">
              <span>Selected Total</span>

              <span>${selectedTotal.toFixed(2)}</span>
            </div>

            <p className="mb-5 text-sm text-gray-500">
              {selectedItems.length === 0
                ? "Select products to checkout"
                : `${selectedItems.length} product(s) selected`}
            </p>

            {/* Continue shopping */}
            <button
              onClick={onClose}
              className="mb-3 w-full rounded-xl border border-gray-300 py-3 font-semibold hover:bg-gray-100"
            >
              Continue Shopping
            </button>

            {/* Checkout */}
            <button
              onClick={handleCheckout}
              disabled={selectedItems.length === 0}
              className="w-full rounded-xl bg-black py-3 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
