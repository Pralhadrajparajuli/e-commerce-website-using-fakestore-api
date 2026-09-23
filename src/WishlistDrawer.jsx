import { X, Trash2 } from "lucide-react";
import { useWishlist } from "./WishlistContext";

const WishlistDrawer = ({ isOpen, onClose }) => {
  const { wishlist, toggleWishlist } = useWishlist();

  if (!isOpen) return null;

  return (
    <>
      {/* Background overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
      />

      {/* Wishlist drawer */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-[400px] flex-col bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="text-xl font-bold">
            My Wishlist
          </h2>

          <button onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Wishlist items */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {wishlist.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">
                Your wishlist is empty.
              </p>
            </div>
          ) : (
            <div className="space-y-5">

              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border-b pb-5"
                >

                  {/* Product image */}
                  <div className="h-24 w-24 rounded-xl bg-gray-100 p-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  {/* Product information */}
                  <div className="flex flex-1 justify-between">

                    <div>
                      <h3 className="line-clamp-2 text-sm font-semibold">
                        {item.title}
                      </h3>

                      <p className="mt-2 font-bold">
                        ${item.price}
                      </p>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => toggleWishlist(item)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default WishlistDrawer;