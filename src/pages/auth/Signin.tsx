import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../../../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import logo from "@/assets/logo.png";

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type SigninForm = z.infer<typeof signinSchema>;

export default function SigninPage() {
  const { signin, session, loading, getSession } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Update

  const { register, handleSubmit } = useForm<SigninForm>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "partnercommunity01@gmail.com",
    },
  });

  useEffect(() => {
    const checkSession = async () => {
      await getSession();
      if (session) {
        navigate("/dashboard", { replace: true });
      }
    };
    checkSession();
  }, [session, getSession, navigate]);

  const onSubmit = async (data: SigninForm) => {
    await signin(data.email, data.password);
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 gap-6">
      {/* Logo */}
      <img src={logo} alt="JBXRC Logo" className="w-64 h-auto object-contain" />

      {/* Sign In Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-6 bg-white rounded-md shadow-md w-96"
      >
        <h2 className="text-2xl font-semibold text-center text-[#ec0028]">
          File Status Monitoring System
        </h2>

        {/* Email Input */}
        <Input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="mt-2"
        />

        {/* Password Input with Eye */}
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Forgot Password Link */}
        <div className="text-right">
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-[#ec0028] hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="bg-[#ec0028] hover:bg-[#c50020]"
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
}
