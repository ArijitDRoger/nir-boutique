import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./services/AuthContext.jsx";
import { CartProvider } from "./services/CartContext";
import { WishlistProvider } from "./services/WishlistContext";
import { ProductProvider } from "./services/ProductContext";
import { AdminProvider } from "./services/AdminContext";
import Home from "./pages/Home";
import CartPage from "./pages/Cart";
import AccountPage from "./pages/Account";
import ProductDetails from "./pages/ProductDetails";
import AdminLogin from "./pages/AdminLogin";
import AdminPage from "./pages/AdminPage";
import "./App.css";
import SmoothScroll from "./components/SmoothScroll";
import MobileBottomNav from "./components/MobileBottomNav";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import HelpSupport from "./pages/HelpSupport";
import TermsConditions from "./pages/TermsConditions";
import { Toaster } from "react-hot-toast";
import ReviewsPage from "./pages/ReviewsPage.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminProvider>
          <ProductProvider>
            <CartProvider>
              <WishlistProvider>
                <SmoothScroll />
                <Toaster position="top-right" />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/product/:id" element={<ProductDetails />} />

                  {/* AUTH */}
                  <Route path="/login" element={<LoginPage />} />

                  {/* PROTECTED */}
                  <Route
                    path="/account"
                    element={
                      <ProtectedRoute>
                        <AccountPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* ADMIN */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route
                    path="/admin/change-password"
                    element={<ChangePassword />}
                  />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="/reviews" element={<ReviewsPage />} />
                  <Route path="/support" element={<HelpSupport />} />
                  <Route path="/terms" element={<TermsConditions />} />
                </Routes>

                <MobileBottomNav />
              </WishlistProvider>
            </CartProvider>
          </ProductProvider>
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
