import Sidebar from "@/components/shared/sidebar";
import { Card } from "@/components/ui/card";
import { Outlet } from "react-router-dom";

export default function LayoutAdmin() {
  return (
    <main className="h-screen bg-background min-w-screen flex gap-4 p-4 relative">
      <Sidebar />

      <Card className="w-full overflow-y-auto p-4 relative">
        {/* Watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span
            className="text-gray-300 text-6xl font-bold opacity-50 select-none rotate-[-45deg]"
            style={{ userSelect: "none" }}
          >
            UNCLEDEV
          </span>
        </div>

        <Outlet />
      </Card>
    </main>
  );
}
