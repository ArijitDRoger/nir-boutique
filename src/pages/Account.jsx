import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../services/AuthContext.jsx";
import { useCart } from "../services/CartContext";
import { useWishlist } from "../services/WishlistContext";
import { api } from "../services/api";
import Navbar from "../components/Navbar";
// import AuthModal from "../components/AuthModal";
import { useProducts } from "../services/ProductContext";
// import {
//   onSnapshot,
//   collection,
//   query,
//   where,
//   orderBy,
// } from "firebase/firestore";
// import { db } from "../firebase";
import Footer from "../components/Footer.jsx";

const menuItems = [
  { key: "orders", label: "My Orders", icon: "📦" },
  { key: "favourites", label: "Favourites", icon: "❤️" },
  { key: "logout", label: "Logout", icon: "🚪" },
];

const STATUS_COLORS = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-600",
};

export default function AccountPage() {
  // const { user, logout } = useAuth();
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || "orders");
  const [showAuth, setShowAuth] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const { products } = useProducts();
  const { user, logout, loading } = useAuth();
  const [animating, setAnimating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const ORDERS_PER_PAGE = 3;

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [orders.length]);

  async function handleWishlist(item) {
    setAnimating(true);
    await toggleWishlist(item);
    setTimeout(() => setAnimating(false), 300);
  }

  useEffect(() => {
    if (loading) return; // ⛔ wait for firebase

    if (!user) {
      setShowAuth(true);
    } else {
      setShowAuth(false);
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const sortedOrders = [...orders].sort(
    (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0),
  );

  const totalPages = Math.ceil(sortedOrders.length / ORDERS_PER_PAGE);

  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE,
  );

  const recommendedProducts = products
    .filter((p) => p.tag === "Trending" || p.tag === "Bestseller")
    .slice(0, 4);

  useEffect(() => {
    if (!user || activeTab !== "orders") return;

    let isMounted = true;
    setOrdersLoading(true);

    api
      .getOrdersByUid(user.uid)
      .then((data) => {
        if (isMounted) setOrders(data);
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) setOrdersLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user?.uid, activeTab]);

  const handleMenu = async (key) => {
    setDrawerOpen(false);

    if (key === "logout") {
      try {
        await logout();
        navigate("/");
      } catch (err) {
        console.error(err);
      }
    } else {
      setActiveTab(key);
    }
  };

  const SidebarContent = () => (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-5 mb-4 text-center">
        <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-3">
          <span className="text-white text-2xl font-bold">👤</span>
        </div>
        <p className="font-semibold text-gray-800">
          {user?.displayName || user?.email?.split("@")[0] || "Guest"}
        </p>

        <p className="text-purple-500 text-xs mt-1">{user?.email || ""}</p>
        <p className="text-purple-400 text-xs">Nir Boutique Member</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => handleMenu(item.key)}
            className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors border-b border-purple-50 last:border-0
              ${
                activeTab === item.key && item.key !== "logout"
                  ? "bg-purple-50 text-purple-700 font-semibold"
                  : item.key === "logout"
                    ? "text-red-500 hover:bg-red-50"
                    : "text-gray-700 hover:bg-purple-50"
              }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-purple-50">
      <Navbar />
      {/* {showAuth && (
        <AuthModal
          onSuccess={() => setShowAuth(false)}
          onClose={() => navigate("/")}
        />
      )} */}

      {/* Mobile top bar */}
      <div className="md:hidden mt-10 fixed top-10 left-0 w-full z-40 bg-white border-b border-purple-100 px-4 py-6 flex align-baseline items-center gap-3 shadow-sm">
        <button
          onClick={() => setDrawerOpen(true)}
          className="w-9 h-9 flex flex-col justify-center items-center gap-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors"
        >
          <span className="w-5 h-0.5 bg-purple-700 rounded" />
          <span className="w-5 h-0.5 bg-purple-700 rounded" />
          <span className="w-5 h-0.5 bg-purple-700 rounded" />
        </button>
        <span className="text-purple-700 font-semibold capitalize">
          {activeTab === "orders" ? "My Orders" : "Favourites"}
        </span>
      </div>

      {/* Mobile Drawer */}
      {drawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="w-72 bg-purple-50 h-full p-5 shadow-2xl overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <span className="text-purple-700 font-bold text-lg">
                My Account
              </span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ✕
              </button>
            </div>
            <SidebarContent />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setDrawerOpen(false)}
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 md:px-6 pt-32 md:pt-28 pb-16 flex gap-8">
        <aside className="hidden md:block w-64 shrink-0">
          <SidebarContent />
        </aside>

        <main className="flex-1 min-w-0">
          {/* Tab Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-purple-100 p-6 mb-8">
            {/* Orders Tab */}
            <div>
              {activeTab === "orders" && (
                <div className="mt-9">
                  {/* <h2 className="text-xl font-bold text-purple-800 mt-6 mb-4">
                  My Orders
                </h2> */}
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border border-purple-200 disabled:opacity-50"
                      >
                        Previous
                      </button>

                      {getPageNumbers().map((page, index) =>
                        page === "..." ? (
                          <span
                            key={index}
                            className="px-2 text-gray-500 font-semibold"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-lg border ${
                              currentPage === page
                                ? "bg-purple-600 text-white border-purple-600"
                                : "border-purple-200 hover:bg-purple-50"
                            }`}
                          >
                            {page}
                          </button>
                        ),
                      )}

                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border border-purple-200 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                  {!user ? (
                    <div className="text-center py-12 text-gray-400">
                      <p className="text-4xl mb-3">🔒</p>
                      <p>Please login to view your orders</p>
                      <button
                        onClick={() => setShowAuth(true)}
                        className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl text-sm transition-colors"
                      >
                        Login
                      </button>
                    </div>
                  ) : ordersLoading ? (
                    <div className="text-center py-12 text-gray-400">
                      Loading orders...
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <p className="text-4xl mb-3">📦</p>
                      <p>No orders yet. Start shopping!</p>
                      <button
                        onClick={() => navigate("/")}
                        className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl text-sm transition-colors"
                      >
                        Browse Collection
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {paginatedOrders.map((order) => {
                        const items = Array.isArray(order.items)
                          ? order.items
                          : JSON.parse(order.items || "[]");
                        const orderDate = order.createdAt?.toDate
                          ? order.createdAt.toDate()
                          : null;
                        return (
                          <div
                            key={order.id}
                            className="border border-purple-100 rounded-2xl p-4"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <p className="font-semibold text-gray-800 text-sm">
                                  Order #{order.orderNumber || order.id}
                                </p>
                                <p className="text-gray-400 text-xs mt-0.5">
                                  {orderDate
                                    ? orderDate.toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      })
                                    : "Date unavailable"}
                                </p>
                              </div>
                              <span
                                className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}
                              >
                                {order.status}
                              </span>
                            </div>
                            <div className="space-y-2">
                              {items.map((item, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-3 py-2 border-b border-purple-50 last:border-0"
                                >
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-14 h-14 rounded-lg object-cover"
                                    onError={(e) => {
                                      e.target.src =
                                        "https://via.placeholder.com/80x80?text=Product";
                                    }}
                                  />

                                  <div className="flex-1">
                                    <p className="font-medium text-gray-800">
                                      {item.name}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                      Size: {item.size || "-"} • Qty: {item.qty}
                                    </p>
                                  </div>

                                  <span className="font-semibold text-purple-700">
                                    ₹{item.price * item.qty}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-purple-50">
                              <span className="text-sm text-gray-500">
                                Total
                              </span>
                              <span className="font-bold text-purple-700">
                                ₹{order.totalAmount}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg border border-purple-200 disabled:opacity-50"
                      >
                        Previous
                      </button>

                      {getPageNumbers().map((page, index) =>
                        page === "..." ? (
                          <span
                            key={index}
                            className="px-2 text-gray-500 font-semibold"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-lg border ${
                              currentPage === page
                                ? "bg-purple-600 text-white border-purple-600"
                                : "border-purple-200 hover:bg-purple-50"
                            }`}
                          >
                            {page}
                          </button>
                        ),
                      )}

                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg border border-purple-200 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Favourites Tab */}
            {activeTab === "favourites" && (
              <div className="mt-9">
                {wishlist.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <div className="text-5xl mb-4">💔</div>
                    <h2 className="text-lg font-semibold text-gray-600">
                      Your wishlist is empty
                    </h2>
                    <p className="text-sm mt-1">
                      Save items you like to buy them later
                    </p>

                    <button
                      onClick={() => navigate("/")}
                      className="mt-5 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl text-sm transition-all"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {wishlist.map((item) => (
                      <div
                        key={item.id}
                        className="group bg-white border border-purple-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                      >
                        {/* Image */}
                        <div
                          onClick={() => navigate(`/product/${item.id}`)}
                          className="relative"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                          />

                          {/* Remove button */}
                          <button
                            onClick={() => toggleWishlist(item)}
                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow hover:scale-110 transition"
                          >
                            ❤️
                          </button>
                        </div>

                        {/* Content */}
                        <div className="p-3">
                          <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">
                            {item.name}
                          </h3>

                          <p className="text-purple-600 font-bold text-sm mt-1">
                            ₹{item.price}
                          </p>

                          {/* Actions */}
                          <div className="flex gap-2 mt-3">
                            {/* Move to Cart */}
                            <button
                              onClick={() => navigate(`/product/${item.id}`)}
                              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-1.5 rounded-xl text-xs transition"
                            >
                              View Product
                            </button>

                            {/* Remove */}
                            <button
                              onClick={() => toggleWishlist(item)}
                              className="px-3 text-red-500 hover:text-red-600 text-xs font-semibold"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Recommended */}
          <div>
            <h2 className="text-xl font-bold text-purple-800 mb-4">
              Recommended For You
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {recommendedProducts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/product/${item.id}`)}
                  className="bg-white rounded-2xl shadow-sm border border-purple-100 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={item.images?.[0]}
                      alt={item.name}
                      className="w-full h-40 object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.tag}
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800 text-sm">
                      {item.name}
                    </h3>
                    <p className="text-purple-500 font-bold text-sm mt-0.5">
                      ₹{item.price}
                    </p>
                    <button
                      onClick={() => navigate(`/product/${item.id}`)}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-1.5 rounded-xl text-xs transition"
                    >
                      View Product
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
