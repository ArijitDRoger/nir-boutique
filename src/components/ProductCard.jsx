// import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext.jsx";
import { useCart } from "../services/CartContext";
import { useWishlist } from "../services/WishlistContext";
// import AuthModal from "./AuthModal";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function ProductCard({
  id,
  image,
  name,
  price,
  originalPrice,
  tag,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  // const [showModal, setShowModal] = useState(false);
  // const [pendingAction, setPendingAction] = useState(null);

  const wishlisted = isWishlisted(id);
  const discountPct = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  function requireLogin(action) {
    if (!user) {
      navigate("/login");
      return;
    }

    if (action === "cart") {
      addToCart({ id, image, name, price });
      toast.success("Added to cart 🛒");
    } else {
      toggleWishlist({ id, image, name, price });
    }
  }

  // function handleLoginSuccess() {
  //   setShowModal(false);
  //   pendingAction === "cart"
  //     ? addToCart({ id, image, name, price })
  //     : toggleWishlist({ id, image, name, price });
  //   setPendingAction(null);
  // }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{
          y: -10,
          scale: 1.03,
          rotateX: 2,
        }}
        viewport={{ once: true }}
        transition={{ duration: 0.3 }}
        className="group bg-white rounded-2xl shadow-md overflow-hidden border border-purple-100 hover:shadow-2xl"
      >
        <div
          className="relative cursor-pointer"
          onClick={() => navigate(`/product/${id}`)}
        >
          <motion.img
            src={image}
            alt={name}
            className="w-full h-40 sm:h-64 object-cover"
            whileHover={{
              scale: 1.12,
            }}
            transition={{ duration: 0.4 }}
          />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="
      absolute
      top-0
      -left-[150%]
      w-[60%]
      h-full
      bg-gradient-to-r
      from-transparent
      via-white/40
      to-transparent
      skew-x-12
      group-hover:left-[150%]
      transition-all
      duration-1000
    "
            />
          </div>
          {tag && (
            <span className="absolute top-3 left-3 bg-purple-600 text-white text-xs px-2.5 py-0.5 rounded-full font-medium">
              {tag}
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              requireLogin("wishlist");
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow hover:scale-110 transition-transform"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill={wishlisted ? "#9333ea" : "none"}
              stroke="#9333ea"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>
        </div>
        <div
          className="p-4 cursor-pointer"
          onClick={() => navigate(`/product/${id}`)}
        >
          <h3 className="text-gray-800 font-semibold text-lg">{name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-purple-600 font-bold">
              ₹{price.toLocaleString()}
            </p>
            {originalPrice && (
              <p className="text-gray-400 line-through text-sm">
                ₹{originalPrice.toLocaleString()}
              </p>
            )}
            {discountPct && (
              <p className="text-green-600 text-sm font-semibold">
                {discountPct}% off
              </p>
            )}
          </div>
        </div>
        <div className="px-4 pb-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              window.scrollTo(0, 0);
              navigate(`/product/${id}`);
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
          >
            <span>View Product</span>
            <span>→</span>
          </motion.button>
        </div>
      </motion.div>

      {/* {showModal && (
        <AuthModal
          onSuccess={handleLoginSuccess}
          onClose={() => setShowModal(false)}
        />
      )} */}
    </>
  );
}
