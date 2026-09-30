import { createContext, useContext, useState } from "react";
import { useToast } from "./ToastContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const { showToast } = useToast();

  // Add or remove from wishlist
  const toggleWishlist = (product) => {
    setWishlist((currentWishlist) => {
      const alreadyLiked = currentWishlist.some(
        (item) => item.id === product.id,
      );

      // Remove from wishlist
      if (alreadyLiked) {
        showToast("Removed from wishlist", "error");

        return currentWishlist.filter((item) => item.id !== product.id);
      }

      // Add to wishlist
      showToast("Added to wishlist ");

      return [...currentWishlist, product];
    });
  };

  // Check if product is in wishlist
  const isInWishlist = (id) => {
    return wishlist.some((item) => item.id === id);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
