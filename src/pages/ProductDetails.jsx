import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../services/CartContext";
import { useWishlist } from "../services/WishlistContext";
import { useAuth } from "../services/AuthContext.jsx";
import { useProducts } from "../services/ProductContext";
import Navbar from "../components/Navbar";
import Lenis from "lenis";
import FullScreenLoader from "../components/FullScreenLoader";
import Footer from "../components/Footer.jsx";
// import AuthModal from "../components/AuthModal";

const discount = (orig, price) => Math.round(((orig - price) / orig) * 100);

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { products, loading } = useProducts();

  const product = products.find((p) => String(p.id) === String(id));

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { user } = useAuth();

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedImg, setSelectedImg] = useState(0);
  const [sizeError, setSizeError] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    const lenis = new Lenis();
    lenis.scrollTo(0, {
      immediate: true,
    });
  }, [id]);

  useEffect(() => {
    setSelectedImg(0);
    setSelectedSize(null);
    setSizeError(false);
  }, [id]);

  if (loading) {
    return <FullScreenLoader />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">Product not found</p>
          <button
            onClick={() => navigate("/")}
            className="bg-purple-600 text-white px-6 py-2 rounded-xl"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);
  const similar = products.filter(
    (p) => p.category === product.category && p.id !== product.id,
  );

  function requireLogin(action) {
    if (!user) {
      navigate("/login", {
        state: {
          from: location.pathname,
        },
      });
      return;
    }

    action();
  }

  function handleAddToCart() {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }

    setSizeError(false);

    requireLogin(() => {
      addToCart({ ...product, selectedSize });
    });
  }

  function handleBuyNow() {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }

    setSizeError(false);

    requireLogin(() => {
      addToCart({ ...product, selectedSize });
      navigate("/cart");
    });
  }

  // function handleLoginSuccess() {
  //   setShowOtp(false);
  //   if (pendingAction) {
  //     pendingAction();
  //     setPendingAction(null);
  //   }
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-400 mb-4 flex items-center gap-1">
          <button
            onClick={() => navigate("/")}
            className="hover:text-purple-600"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-gray-500">{product.category}</span>
          <span>/</span>
          <span className="text-purple-700 font-medium">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── Left: Image Section ── */}
          <div className="lg:w-2/5">
            <div className="sticky top-24">
              {/* Main image */}
              <div className="relative bg-white rounded-2xl overflow-hidden border border-purple-100 shadow-sm">
                <img
                  src={product.images[selectedImg]}
                  alt={product.name}
                  className="w-full h-96 lg:h-[480px] object-cover"
                />
                {product.tag && (
                  <span className="absolute top-4 left-4 bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                    {product.tag}
                  </span>
                )}
                <button
                  onClick={() => requireLogin(() => toggleWishlist(product))}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-110 transition-transform"
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

              {/* Thumbnail strip */}
              {product.images.length > 1 && (
                <div className="flex gap-2 mt-3">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImg(i)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${i === selectedImg ? "border-purple-600" : "border-transparent"}`}
                    >
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Details Section ── */}
          <div className="lg:w-3/5 space-y-5">
            {/* Title & Rating */}
            <div>
              <p className="text-sm text-purple-500 font-medium uppercase tracking-wide">
                {product.category}
              </p>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1 bg-green-600 text-white text-sm px-2.5 py-0.5 rounded-full font-medium">
                  {product.rating} ★
                </span>
                <span className="text-gray-400 text-sm">
                  {product.reviews} ratings & reviews
                </span>
              </div>
            </div>
            {/* Price */}
            <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-sm">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-gray-400 line-through text-lg">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
                <span className="text-green-600 font-bold text-lg">
                  {discount(product.originalPrice, product.price)}% off
                </span>
              </div>
              <p className="text-green-600 text-sm mt-1 font-medium">
                You save ₹
                {(product.originalPrice - product.price).toLocaleString()}
              </p>
            </div>
            {/* Offers */}
            <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3">Available Offers</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold shrink-0">🏷</span>{" "}
                  10% off on first order with code{" "}
                  <span className="font-semibold text-purple-600">
                    NIRNEW10
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold shrink-0">🏷</span>{" "}
                  Free delivery on orders above ₹999
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 font-bold shrink-0">🏷</span>{" "}
                  Easy 7-day return & exchange
                </li>
              </ul>
            </div>
            {/* Colors */}
            <div>
              <p className="font-semibold text-gray-800 mb-2">
                Available Colors
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((c) => (
                  <span
                    key={c}
                    className="px-3 py-1 rounded-full border border-purple-200 text-sm text-gray-600 bg-white"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-gray-800">Select Size</p>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-purple-600 text-sm underline"
                >
                  Size Guide
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setSelectedSize(s);
                      setSizeError(false);
                    }}
                    className={`w-12 h-12 rounded-xl border-2 font-semibold text-sm transition-all
                      ${selectedSize === s ? "border-purple-600 bg-purple-600 text-white" : "border-gray-200 text-gray-700 hover:border-purple-400"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {sizeError && (
                <p className="text-red-500 text-sm mt-1">
                  Please select a size
                </p>
              )}
            </div>
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold py-3.5 rounded-2xl transition-colors text-sm"
              >
                🛒 Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-2xl transition-colors text-sm"
              >
                ⚡ Buy Now
              </button>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-2">
                Product Description
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>
            {/* Highlights */}
            <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3">
                Product Highlights
              </h3>
              <ul className="space-y-1.5">
                {product.highlights.map((h, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <span className="text-purple-500 mt-0.5">✓</span> {h}
                  </li>
                ))}
              </ul>
            </div>
            {/* Ratings Summary */}
            <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3">
                Ratings & Reviews
              </h3>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-5xl font-bold text-gray-900">
                    {product.rating}
                  </p>
                  <p className="text-yellow-400 text-lg">
                    {"★".repeat(Math.round(product.rating))}
                    {"☆".repeat(5 - Math.round(product.rating))}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    {product.reviews} reviews
                  </p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div
                      key={star}
                      className="flex items-center gap-2 text-xs text-gray-500"
                    >
                      <span className="w-3">{star}</span>
                      <span className="text-yellow-400">★</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${star === 5 ? 60 : star === 4 ? 25 : star === 3 ? 10 : 3}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similar.length > 0 && (
          <div className="mt-14">
            <h2 className="text-2xl font-bold text-purple-800 mb-6">
              Similar Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {similar.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-44 object-cover"
                  />
                  <div className="p-3">
                    <p className="font-semibold text-gray-800 text-sm truncate">
                      {p.name}
                    </p>
                    <p className="text-purple-600 font-bold text-sm mt-0.5">
                      ₹{p.price.toLocaleString()}
                    </p>
                    <p className="text-gray-400 line-through text-xs">
                      ₹{p.originalPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {showSizeGuide && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold text-purple-700">Size Guide</h3>

              <button
                onClick={() => setShowSizeGuide(false)}
                className="text-gray-500 hover:text-black text-xl"
              >
                ×
              </button>
            </div>

            <div className="p-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-purple-100">
                    <th className="border p-2">Size</th>
                    <th className="border p-2">Bust</th>
                    <th className="border p-2">Waist</th>
                    <th className="border p-2">Hip</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td className="border p-2">S</td>
                    <td className="border p-2">34"</td>
                    <td className="border p-2">28"</td>
                    <td className="border p-2">36"</td>
                  </tr>

                  <tr>
                    <td className="border p-2">M</td>
                    <td className="border p-2">36"</td>
                    <td className="border p-2">30"</td>
                    <td className="border p-2">38"</td>
                  </tr>

                  <tr>
                    <td className="border p-2">L</td>
                    <td className="border p-2">38"</td>
                    <td className="border p-2">32"</td>
                    <td className="border p-2">40"</td>
                  </tr>

                  <tr>
                    <td className="border p-2">XL</td>
                    <td className="border p-2">40"</td>
                    <td className="border p-2">34"</td>
                    <td className="border p-2">42"</td>
                  </tr>

                  <tr>
                    <td className="border p-2">XXL</td>
                    <td className="border p-2">42"</td>
                    <td className="border p-2">36"</td>
                    <td className="border p-2">44"</td>
                  </tr>
                </tbody>
              </table>

              <p className="text-xs text-gray-500 mt-3">
                Measurements are in inches and may vary slightly by design.
              </p>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
