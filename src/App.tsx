import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { useEffect, useState } from "react";

import LayoutAdmin from "./pages/admin/LayoutAdmin";
import DashboardPage from "./pages/admin/Dashboard";
import EmployeePage from "./pages/admin/employees/Employee";
import ApplicantPage from "./pages/admin/applicants/Applicant";
import ProductPage from "./pages/admin/products/Product";
import SettingPage from "./pages/admin/settings/Setting";
import SigninPage from "./pages/auth/Signin";
import ForgotPasswordPage from "./pages/auth/ForgotPassword";
import HomePage from "./pages/home/Home";
import { isElectron } from "@/lib/platform";
import { AppRouter } from "./routes/app-router";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { session, getSession, loading } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await getSession();
      setInitialized(true);
    };
    init();
  }, []);

  if (!initialized || loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function RedirectIfAuthenticated({ children }: { children: JSX.Element }) {
  const { session } = useAuthStore();
  const location = useLocation();

  if (session && ["/", "/forgot-password"].includes(location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  const getSession = useAuthStore((state) => state.getSession);

  useEffect(() => {
    getSession();
  }, [getSession]);

  return (
    <AppRouter>
      <Routes>
        <Route
          index
          element={
            isElectron() ? <Navigate to="/auth/signin" replace /> : <HomePage />
          }
        />

        {/* Auth Routes */}
        <Route
          path="/auth/signin"
          element={
            <RedirectIfAuthenticated>
              <SigninPage />
            </RedirectIfAuthenticated>
          }
        />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected Admin Routes */}
        <Route
          element={
            <ProtectedRoute>
              <LayoutAdmin />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/applicants" element={<ApplicantPage />} />
          <Route path="/employees" element={<EmployeePage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/settings" element={<SettingPage />} />
        </Route>
      </Routes>
    </AppRouter>
  );
}
