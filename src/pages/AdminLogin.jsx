import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../services/AdminContext";

export default function AdminLogin() {
  const { adminLogin } = useAdmin();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const ok = await adminLogin(form.username, form.password);

    if (ok) {
      navigate("/admin");
    } else {
      setError("Invalid admin credentials");
    }

    console.log(await adminLogin(form.username, form.password));
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-800">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl w-[350px]"
      >
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 mb-3"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            className="w-full border p-2 mb-3"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            className="absolute right-2 top-2 text-sm"
          >
            {showPass ? "Hide" : "Show"}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button className="w-full bg-purple-600 text-white p-2">Login</button>
      </form>
    </div>
  );
}
