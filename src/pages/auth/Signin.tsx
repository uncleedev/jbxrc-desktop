import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "../../../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import logo from "@/assets/logo.png";

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type SigninForm = z.infer<typeof signinSchema>;

export default function SigninPage() {
  const { signin, session, loading, getSession } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm<SigninForm>({
    resolver: zodResolver(signinSchema),
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
        <h2 className="text-2xl font-semibold text-center">
          File Status Monitoring System
        </h2>
        <Input placeholder="Email" {...register("email")} />
        <Input
          type="password"
          placeholder="Password"
          {...register("password")}
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
}
