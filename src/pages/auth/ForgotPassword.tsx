import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { authService } from "../../../services/auth-service";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  // Step 1️⃣: Send OTP
  const handleSendOtp = async () => {
    if (!email) return toast.error("Please enter your email address.");
    setLoading(true);
    try {
      await authService.sendOtpToEmail(email);
      setStep("otp");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2️⃣: Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("Please enter your OTP.");
    setLoading(true);
    try {
      const isValid = await authService.verifyOtp(email, otp);
      if (isValid) setStep("reset");
    } catch (err) {
      console.error(err);
      toast.error("Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3️⃣: Reset Password
  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters.");
    }
    setLoading(true);
    try {
      await authService.updatePasswordWithOTP(email, newPassword);
      toast.success("Password reset successful!");
      setStep("email");
      setEmail("");
      setOtp("");
      setNewPassword("");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 gap-6">
      {/* Logo */}
      <img src={logo} alt="Logo" className="w-48 h-auto object-contain" />

      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-semibold text-center mb-4">
          Forgot Password
        </h2>

        {/* STEP 1: EMAIL */}
        {step === "email" && (
          <>
            <Input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              className="w-full mt-4"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </>
        )}

        {/* STEP 2: OTP */}
        {step === "otp" && (
          <>
            <Input
              type="text"
              placeholder="Enter the 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button
              className="w-full mt-4"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
            <Button
              variant="link"
              className="w-full mt-2"
              onClick={handleSendOtp}
              disabled={loading}
            >
              Resend OTP
            </Button>
          </>
        )}

        {/* STEP 3: RESET PASSWORD */}
        {step === "reset" && (
          <>
            <Input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Button
              className="w-full mt-4"
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </>
        )}

        {/* Back to Sign In */}
        <Button
          variant="link"
          className="mt-2 w-full"
          onClick={() => {
            setStep("email");
            navigate("/");
          }}
        >
          Back to Sign In
        </Button>
      </div>
    </div>
  );
}
