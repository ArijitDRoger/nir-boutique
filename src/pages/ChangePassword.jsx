import { useState } from "react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { auth } from "../firebase";

export default function ChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (form.newPassword !== form.confirmPassword) {
      return setError("New passwords do not match");
    }

    try {
      const user = auth.currentUser;

      const credential = EmailAuthProvider.credential(
        user.email,
        form.oldPassword,
      );

      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, form.newPassword);

      setMessage("Password changed successfully");

      setForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
      setError("Old password is incorrect");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">Change Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Old Password"
          className="w-full border p-2 mb-3"
          value={form.oldPassword}
          onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
        />

        <input
          type="password"
          placeholder="New Password"
          className="w-full border p-2 mb-3"
          value={form.newPassword}
          onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full border p-2 mb-3"
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({
              ...form,
              confirmPassword: e.target.value,
            })
          }
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        {message && <p className="text-green-500 text-sm mb-3">{message}</p>}

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded"
        >
          Update Password
        </button>
      </form>
    </div>
  );
}
