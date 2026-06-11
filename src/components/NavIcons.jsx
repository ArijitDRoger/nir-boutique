import { useState } from "react";
import { useCart } from "../services/CartContext";
import { useAuth } from "../services/AuthContext.jsx";
import { useWishlist } from "../services/WishlistContext";
import { useNavigate } from "react-router-dom";

export default function NavIcons() {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* desktop icons */}
      <div className="hidden md:flex items-center gap-6 text-purple-700">
        {/* Account */}
        <button
          onClick={() => {
            if (user) {
              navigate("/account");
            } else {
              navigate("/login", {
                state: { from: "/" },
              });
            }
          }}
          className="flex flex-col items-center gap-0.5 hover:text-purple-500 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
          <span className="text-xs">
            {user?.displayName
              ? user.displayName.split(" ")[0]
              : user?.email
                ? user.email.split("@")[0]
                : "Account"}
          </span>
        </button>

        {/* Wishlist */}
        <button
          onClick={() => navigate("/account", { state: { tab: "favourites" } })}
          className="relative flex flex-col items-center gap-0.5 hover:text-purple-500 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
          <span className="text-xs">Wishlist</span>
          {wishlist.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-purple-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </button>

        {/* Cart */}
        <button
          onClick={() => navigate("/cart")}
          className="relative flex flex-col items-center gap-0.5 hover:text-purple-500 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .955-.343 1.086-.835l1.401-5.25A1.125 1.125 0 0021.957 9H7.5m0 5.25L6.106 5.272"
            />
          </svg>
          <span className="text-xs">Cart</span>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-2 bg-purple-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMenuOpen(true)}
        className="md:hidden text-purple-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Drawer */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => setMenuOpen(false)}
          />

          <div className="fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 p-5">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg text-purple-700">Menu</h2>

              <button onClick={() => setMenuOpen(false)} className="text-2xl">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  if (user) {
                    navigate("/account");
                  } else {
                    navigate("/login", {
                      state: { from: "/" },
                    });
                  }

                  setMenuOpen(false);
                }}
                className="w-full text-left p-3 rounded-xl hover:bg-purple-50"
              >
                👤 Account
              </button>

              <button
                onClick={() => {
                  navigate("/account", {
                    state: { tab: "favourites" },
                  });
                  setMenuOpen(false);
                }}
                className="w-full text-left p-3 rounded-xl hover:bg-purple-50"
              >
                ❤️ Wishlist ({wishlist.length})
              </button>

              <button
                onClick={() => {
                  navigate("/cart");
                  setMenuOpen(false);
                }}
                className="w-full text-left p-3 rounded-xl hover:bg-purple-50"
              >
                🛒 Cart ({totalItems})
              </button>

              {user && (
                <div className="border-t pt-4 text-sm text-gray-500">
                  Logged in as:
                  <br />
                  {user.email}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
