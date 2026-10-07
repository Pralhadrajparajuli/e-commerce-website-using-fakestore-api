import { create } from "zustand";

const useCartStore = create((set) => ({
  // Cart data
  cart: [],

  // Add product
  addToCart: (product, quantity = 1) => {
    set((state) => {
      const existingProduct = state.cart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return {
          cart: state.cart.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                }
              : item
          ),
        };
      }

      return {
        cart: [
          ...state.cart,
          {
            ...product,
            quantity,
          },
        ],
      };
    });
  },

  // Increase quantity
  increaseQuantity: (id) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      ),
    }));
  },

  // Decrease quantity
  decreaseQuantity: (id) => {
    set((state) => ({
      cart: state.cart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0),
    }));
  },

  // Remove product
  removeFromCart: (id) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    }));
  },

  // Clear cart after successful payment
  clearCart: () => {
    set({ cart: [] });
  },
}));

export default useCartStore;