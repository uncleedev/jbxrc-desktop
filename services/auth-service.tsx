import { toast } from "sonner";
import { supabase } from "../src/lib/supabase";
import emailjs from "emailjs-com";

export const authService = {
  async signin(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message || "Failed to signin");

    return data.session;
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw new Error(error.message || "Failed to get session");
    return data.session;
  },

  async updatePassword(newPassword: string) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw new Error(error.message || "Failed to update password");
    return data.user;
  },

  async updatePasswordWithOTP(email: string, newPassword: string) {
    const { data, error } = await supabase.functions.invoke("reset-password", {
      body: { email, newPassword },
    });

    if (error) {
      console.error(error);
      throw new Error(error.message || "Failed to reset password");
    }

    if (!data?.success) {
      throw new Error(data?.error || "Password reset failed");
    }

    return true;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message || "Failed to sign out");
  },

  async sendOtpToEmail(email: string) {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // expires in 5 mins

    // 1️⃣ Save OTP to Supabase
    const { error } = await supabase.from("user_otps").insert([
      {
        email,
        otp,
        expires_at: expiresAt,
      },
    ]);

    if (error) {
      console.error(error);
      toast.error("Failed to generate OTP");
      return;
    }

    // 2️⃣ Send OTP using EmailJS
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID_OTP,
        { email, otp },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      toast.success("OTP sent successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send OTP via email");
    }
  },

  async verifyOtp(email: string, otp: string) {
    const { data, error } = await supabase
      .from("user_otps")
      .select("*")
      .eq("email", email)
      .eq("otp", otp)
      .eq("used", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      toast.error("Invalid OTP");
      return false;
    }

    // Check if expired
    const now = new Date();
    const expiry = new Date(data.expires_at);
    if (now > expiry) {
      toast.error("OTP expired");
      return false;
    }

    // Mark OTP as used
    await supabase.from("user_otps").update({ used: true }).eq("id", data.id);

    toast.success("OTP verified successfully!");
    return true;
  },
};
