import { useState } from "react";
import { useCart } from "../services/CartContext";
import { useAuth } from "../services/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
// import AuthModal from "../components/AuthModal";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import Footer from "../components/Footer.jsx";

const OWNER_WHATSAPP = "917908064677";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, totalItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);

  let orderNum;

  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  async function handleOrderOnWhatsApp() {
    if (cart.length === 0) return;

    if (!user) {
      setShowAuth(true);
      return;
    }

    const orderData = {
      customerUid: user.uid,
      customerName:
        user.displayName ||
        user.name ||
        user.email?.split("@")[0] ||
        "Customer",

      customerEmail: user.email,

      items: cart.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
        size: item.selectedSize || "",
        image: item.image || item.images?.[0] || "",
      })),

      totalAmount: totalPrice,
    };

    const orderNumber = `NB${Date.now().toString().slice(-6)}`;
    orderNum = orderNumber;
    try {
      await addDoc(collection(db, "orders"), {
        ...orderData,
        orderNumber,
        createdAt: serverTimestamp(),
        createdAtClient: Date.now(),
        status: "PENDING",
      });

      console.log("Order saved to Firestore");
    } catch (e) {
      console.error("Order save failed", e);
    }

    const itemLines = cart
      .map(
        (i) =>
          `• ${i.name} (${i.selectedSize || ""}) x${i.qty} = ₹${i.price * i.qty}`,
      )
      .join("\n");

    const message =
      `Hello! I'd like to place an order from Nir Boutique 🛍️\n\n` +
      `Customer: ${orderData.customerName}\n` +
      `Email: ${orderData.customerEmail}\n\n` +
      `Order Number: ${orderNum}\n\n` +
      `Order Details:\n${itemLines}\n\n` +
      `Total: ₹${totalPrice}`;

    window.open(
      `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(message)}`,
      "_blank",
    );

    clearCart();
  }

  return (
    <div className="min-h-screen bg-purple-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 pt-28 pb-16">
        <h1 className="text-3xl font-bold text-purple-800 mb-8">Your Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate("/")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm border border-purple-100 flex items-center gap-4 p-4"
                >
                  <img
                    src={item.image || item.images?.[0]}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-purple-500 font-bold">₹{item.price}</p>
                    <p className="text-gray-400 text-sm">
                      Qty: {item.qty}{" "}
                      {item.selectedSize && `• Size: ${item.selectedSize}`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-700">
                      ₹{item.price * item.qty}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.id, item.selectedSize)}
                      className="text-red-400 hover:text-red-600 text-sm mt-1 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-white rounded-2xl shadow-sm border border-purple-100 p-6">
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Total Items</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between font-bold text-purple-800 text-lg border-t border-purple-100 pt-3">
                <span>Total Amount</span>
                <span>₹{totalPrice}</span>
              </div>

              <button
                onClick={handleOrderOnWhatsApp}
                className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.859L.057 23.428a.75.75 0 00.916.916l5.569-1.476A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.716 9.716 0 01-4.953-1.355l-.355-.211-3.683.975.993-3.585-.232-.369A9.718 9.718 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z" />
                </svg>
                Order via WhatsApp
              </button>
              <button
                onClick={clearCart}
                className="mt-3 w-full text-red-400 hover:text-red-600 text-sm transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
