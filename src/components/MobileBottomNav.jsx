import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../services/CartContext";
import { useWishlist } from "../services/WishlistContext";
import { useAuth } from "../services/AuthContext";

export default function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const { user } = useAuth();

  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  const tabs = [
    {
      label: "Home",
      icon: "🏠",
      path: "/",
    },
    {
      label: "Wishlist",
      icon: "❤️",
      path: "/account",
      state: { tab: "favourites" },
      badge: wishlist.length,
    },
    {
      label: "Cart",
      icon: "🛒",
      path: "/cart",
      badge: totalItems,
    },
    {
      label: "Account",
      icon: "👤",
      path: "/account",
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-purple-100 shadow-lg z-50">
      <div className="grid grid-cols-4">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => {
              if (
                (tab.label === "Account" || tab.label === "Wishlist") &&
                !user
              ) {
                navigate("/login", {
                  state: { from: "/" },
                });
                return;
              }

              navigate(tab.path, { state: tab.state });
            }}
            className={`relative py-3 flex flex-col items-center text-xs ${
              location.pathname === tab.path
                ? "text-purple-700"
                : "text-gray-500"
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span>{tab.label}</span>

            {tab.badge > 0 && (
              <span className="absolute top-1 right-6 bg-purple-600 text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
