import { create } from "zustand";
import useToastStore from "./toastStore";
const useWishlistStore = create((set, get) => ({
  wishlist: [],

  // Add or remove a product from the wishlist
  toggleWishlist: (product) => {
    const currentWishlist = get().wishlist;

    const alreadyLiked = currentWishlist.some(
      (item) => item.id === product.id
    );

    if (alreadyLiked) {
      set({
        wishlist: currentWishlist.filter(
          (item) => item.id !== product.id
        ),
      });

      useToastStore
        .getState()
        .showToast("Removed from wishlist", "error");

      return;
    }

    set({
      wishlist: [...currentWishlist, product],
    });

    useToastStore
      .getState()
      .showToast("Added to wishlist");
  },

  // Check whether a product is in the wishlist
  isInWishlist: (id) => {
    return get().wishlist.some(
      (item) => item.id === id
    );
  },

  // Remove all wishlist products
  clearWishlist: () => {
    set({ wishlist: [] });
  },
}));

export default useWishlistStore;