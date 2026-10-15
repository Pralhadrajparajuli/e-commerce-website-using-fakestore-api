import { create } from "zustand";

const useCartStore = create((set) => ({
  cart: [],

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
            selected: false,
          },
        ],
      };
    });
  },

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

  removeFromCart: (id) => {
    set((state) => ({
      cart: state.cart.filter(
        (item) => item.id !== id
      ),
    }));
  },

  toggleSelection: (id) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id
          ? {
              ...item,
              selected: !item.selected,
            }
          : item
      ),
    }));
  },

  selectAll: () => {
    set((state) => ({
      cart: state.cart.map((item) => ({
        ...item,
        selected: true,
      })),
    }));
  },

  deselectAll: () => {
    set((state) => ({
      cart: state.cart.map((item) => ({
        ...item,
        selected: false,
      })),
    }));
  },

  removeSelectedItems: () => {
    set((state) => ({
      cart: state.cart.filter(
        (item) => !item.selected
      ),
    }));
  },

  clearCart: () => {
    set({ cart: [] });
  },
}));

export default useCartStore;