import { Home, Users, FileUser } from "lucide-react";
import { NavLink } from "react-router-dom";
import logo from "@/assets/logo.png";

export default function Sidebar() {
  const navItems = [
    { name: "Dashboard", icon: Home, path: "/" },
    { name: "Applicants", icon: FileUser, path: "/applicants" },
    { name: "Employees", icon: Users, path: "/employees" },
  ];

  return (
    <aside className=" h-full w-64  flex flex-col">
      <div className="flex flex-col gap-6">
        <img
          src={logo}
          alt="JBXRC Logo"
          className=" h-auto  w-auto place-self-start object-contain"
        />

        {/* Navigation */}
        <nav className="flex-1  space-y-3">
          {navItems.map(({ name, icon: Icon, path }) => (
            <NavLink
              key={name}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-xl transition-colors 
              ${
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
    </aside>
  );
}
