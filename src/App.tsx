import { HashRouter as Router, Routes, Route } from "react-router-dom";
import LayoutAdmin from "./pages/admin/LayoutAdmin";
import DashboardPage from "./pages/admin/Dashboard";
import EmployeePage from "./pages/admin/employees/Employee";
import ApplicantPage from "./pages/admin/applicants/Applicant";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<LayoutAdmin />}>
          <Route index element={<DashboardPage />} />
          <Route path="/applicants" element={<ApplicantPage />} />
          <Route path="/employees" element={<EmployeePage />} />
        </Route>
      </Routes>
    </Router>
  );
}
