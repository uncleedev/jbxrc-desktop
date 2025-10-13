import Sidebar from "@/components/shared/sidebar";
import { Card } from "@/components/ui/card";
import { Outlet } from "react-router-dom";

export default function LayoutAdmin() {
  return (
    <main className="h-screen bg-background min-w-screen flex gap-4 p-4">
      <Sidebar />

      <Card className="w-full overflow-y-auto p-4">
        <Outlet />
      </Card>
    </main>
  );
}
