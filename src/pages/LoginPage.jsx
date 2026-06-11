import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../services/AuthContext.jsx";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { user, login, signup, resetPassword } = useAuth();
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((p) => ({ ...p, [field]: value }));
    setError("");
  }

  async function handleForgotPassword() {
    if (!form.email) {
      setError("Please enter your email address first");
      return;
    }

    try {
      setError("");
      setMessage("");

      await resetPassword(form.email);

      toast.success(
        "Password reset email sent. Please check your Inbox and Spam folder.",
      );
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!form.email || !form.password) {
        setError("Email and password required");
        return;
      }

      if (tab === "login") {
        await login(form.email, form.password);
      } else {
        await signup(form.email, form.password);
      }

      // IMPORTANT: wait for auth state update
      setLoading(false);
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
    } catch (err) {
      setLoading(false);

      // Firebase friendly message
      const msg =
        err.code === "auth/user-not-found"
          ? "User not found"
          : err.code === "auth/wrong-password"
            ? "Wrong password"
            : err.message;

      setError(msg);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center relative z-100"
      style={{
        backgroundImage: "url('/nir_logo.jpg')", // your image in public folder
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px]" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/15 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src="/nir_logo.jpg"
                alt="Nir Boutique"
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="mt-4 text-3xl font-bold text-white">নীড় Boutique</h1>

            <p className="text-purple-100 text-sm mt-1">
              Bloom in every step ✨
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-white/20 p-1 rounded-2xl mb-6">
            {["login", "signup"].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setError("");
                }}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                  tab === t
                    ? "bg-purple-600 text-white shadow-lg"
                    : "text-white"
                }`}
              >
                {t === "login" ? "Login" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="
            w-full
            px-4 py-3
            rounded-xl
            bg-white/80
            border border-white/50
            focus:outline-none
            focus:ring-2
            focus:ring-purple-500
          "
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              className="
            w-full
            px-4 py-3
            rounded-xl
            bg-white/80
            border border-white/50
            focus:outline-none
            focus:ring-2
            focus:ring-purple-500
          "
            />

            {error && (
              <div className="bg-red-500/20 border border-red-400 text-white text-sm rounded-xl p-3">
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-purple-200 hover:text-white transition"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
            w-full
            py-3
            rounded-xl
            font-semibold
            text-white
            bg-gradient-to-r
            from-purple-600
            to-fuchsia-600
            hover:scale-[1.02]
            transition-all
            shadow-lg
          "
            >
              {loading
                ? "Please wait..."
                : tab === "login"
                  ? "Login"
                  : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
