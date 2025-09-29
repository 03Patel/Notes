import { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export const VerifyOTP = () => {
  const { setUser } = useContext(AuthContext);
  const location = useLocation();
  const email = (location.state as any)?.email;
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      const res = await api.post("/auth/verifyEmail", { email, otp });
      const { user, token } = res.data;
      setUser(user, token);
      navigate("/welcome");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP");
    }
  };

  const handleResend = async () => {
    try {
      setResendLoading(true);
      const res = await api.post("/auth/resend-otp", { email });
      setSuccess(res.data.message);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend OTP");
      setSuccess("");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Verify OTP</h1>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="mb-2 p-2 border rounded"
      />
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <button
        onClick={handleVerify}
        className="bg-green-500 text-white px-4 py-2 rounded mt-2"
      >
        Verify
      </button>
      <button
        onClick={handleResend}
        disabled={resendLoading}
        className="mt-4 text-blue-500 underline"
      >
        {resendLoading ? "Resending..." : "Resend OTP"}
      </button>
    </div>
  );
};
