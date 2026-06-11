import { useState } from "react";
import { useAuth } from "../services/AuthContext.jsx";

export default function OtpModal({ onSuccess, onClose }) {
  const { sendOtp, verifyOtp, otpSent } = useAuth();
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  function handleSendOtp() {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    setError("");
    sendOtp(mobile);
  }

  function handleVerify() {
    const ok = verifyOtp(mobile, otp);
    if (ok) onSuccess();
    else setError("Invalid OTP. Please try again.");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-purple-700 mb-1">
          Login to Continue
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          We'll send an OTP to your mobile number
        </p>

        <label className="text-sm text-gray-600 font-medium">
          Mobile Number
        </label>
        <div className="flex gap-2 mt-1 mb-4">
          <span className="px-3 py-2 bg-purple-50 border border-purple-200 rounded-xl text-purple-700 font-medium">
            +91
          </span>
          <input
            type="tel"
            maxLength={10}
            value={mobile}
            onChange={(e) => setMobile(e.target.value.replace(/\D/, ""))}
            placeholder="Enter mobile number"
            disabled={otpSent}
            className="flex-1 border border-purple-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {!otpSent ? (
          <button
            onClick={handleSendOtp}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-xl font-semibold transition-colors"
          >
            Send OTP
          </button>
        ) : (
          <>
            <label className="text-sm text-gray-600 font-medium">
              Enter OTP
            </label>
            <input
              type="tel"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/, ""))}
              placeholder="6-digit OTP"
              className="w-full mt-1 mb-4 border border-purple-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              onClick={handleVerify}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2.5 rounded-xl font-semibold transition-colors"
            >
              Verify & Continue
            </button>
            <button
              onClick={() => sendOtp(mobile)}
              className="w-full mt-2 text-purple-500 text-sm hover:underline"
            >
              Resend OTP
            </button>
          </>
        )}

        {error && (
          <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}
