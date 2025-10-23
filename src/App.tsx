import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LayoutAdmin from "./pages/admin/LayoutAdmin";
import DashboardPage from "./pages/admin/Dashboard";
import EmployeePage from "./pages/admin/employees/Employee";
import ApplicantPage from "./pages/admin/applicants/Applicant";
import { useAuthStore } from "../stores/useAuthStore";
import { useEffect, useState } from "react";
import SigninPage from "./pages/auth/Signin";
import SettingPage from "./pages/admin/settings/Setting";
import ProductPage from "./pages/admin/products/Product";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { session, getSession, loading } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      await getSession();
      setInitialized(true);
    };
    init();
  }, [getSession]);

  if (!initialized || loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route index element={<SigninPage />} />

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
    </Router>
  );
}
