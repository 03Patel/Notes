import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export const Login = () => {
  const { setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false); // OTP visibility flag
  const navigate = useNavigate();

  // Send OTP
  const handleSendOtp = async () => {
    try {
      setError("");
      const res = await api.post("/auth/login", { email });
      setSuccess(res.data.message || "OTP sent to your email");
      setShowOtp(true); // Show OTP input and hide Get OTP button
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP");
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    try {
      setError("");
      const res = await api.post("/auth/login-verify-otp", { email, otp });
      const { user, token } = res.data;
      setUser(user, token);
      navigate("/welcome");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
  };

  // Resend OTP
  const handleResend = async () => {
    try {
      setResendLoading(true);
      const res = await api.post("/auth/resend-otp", { email });
      setSuccess(res.data.message || "OTP resent");
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend OTP");
      setSuccess("");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-blue-200 via-purple-200 to-pink-200 px-4">
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Login
        </h1>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Enter Gmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          />

          {!showOtp && (
            <button
              onClick={handleSendOtp}
              className="w-full bg-purple-500 text-white p-4 rounded-xl hover:bg-purple-600 transition font-semibold"
            >
              Get OTP
            </button>
          )}

          {success && <p className="text-green-600">{success}</p>}
          {error && <p className="text-red-500">{error}</p>}

          {showOtp && (
            <div className="mt-4 space-y-2">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              <button
                onClick={handleVerifyOtp}
                className="w-full bg-green-500 text-white p-4 rounded-xl hover:bg-green-600 transition font-semibold"
              >
                Login
              </button>
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="w-full text-blue-500 underline hover:text-blue-600 transition"
              >
                {resendLoading ? "Resending..." : "Resend OTP"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
