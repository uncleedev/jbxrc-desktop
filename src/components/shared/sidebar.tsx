import { Home, Users, FileUser, LogOut, UserRoundCog } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useAuthStore } from "../../../stores/useAuthStore";
import { toast } from "sonner";

export default function Sidebar() {
  const navigate = useNavigate();
  const signOut = useAuthStore((state) => state.signOut);

  const navItems = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Applicants", icon: FileUser, path: "/applicants" },
    { name: "Employees", icon: Users, path: "/employees" },
    { name: "Setting", icon: UserRoundCog, path: "/settings" },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully!");
      navigate("/"); // redirect to login
    } catch (err: any) {
      toast.error(err.message || "Failed to sign out");
    }
  };

  return (
    <aside className="h-full w-64 flex flex-col justify-between ">
      <div className="flex flex-col gap-6">
        <img
          src={logo}
          alt="JBXRC Logo"
          className="h-auto w-auto px-4 object-contain"
        />

        {/* Navigation */}
        <nav className="flex-1 space-y-3 px-2">
          {navItems.map(({ name, icon: Icon, path }) => (
            <NavLink
              key={name}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-xl transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-primary/10 dark:text-gray-300"
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-semibold">{name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Sign Out button at the bottom */}
      <div className="px-4 pb-4">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-xl text-red-600 hover:bg-red-100 dark:hover:bg-red-900 dark:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-semibold">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
