import { Routes, Route } from "react-router";
import HomePage from "./pages/HomePage";
import AppointmentPage from "./pages/AppointmentPage";
import HistoryPage from "./pages/HistoryPage";
import LoginPage from "./pages/LoginPage";
import AuthGuard from "./components/AuthGuard";
import MainNav from "./components/MainNav";
import { useLocation } from "react-router";
import RegisterPage from "./pages/RegisterPage";
import DoctorRequestsPage from "./components/DoctorRequestPage";
import ForumDetailPage from "./components/ForumDetailPage";
import ForumPage from "./pages/ForumPage";
import DoctorSchedulePage from "./pages/DoctorSchedulePage";
import CreateHospitalPage from "./pages/CreateHospitalPage";
import DoctorAppointmentPage from "./pages/DoctorAppointmentPage";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  const isRegisterPage = location.pathname === "/register";

  return (
    <div className="min-h-screen bg-sky-50">
      {!(isLoginPage || isRegisterPage) && <MainNav />}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/doctor-requests" element={<DoctorRequestsPage />} />
        <Route path="/home-page" element={<HomePage />} />
        <Route path="/appointment" element={<AppointmentPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/forum" element={<ForumPage />} />
        <Route path="/forum/:id" element={<ForumDetailPage />} />
        <Route path="/doctor-profile/:id" element={<DoctorSchedulePage />} />
        <Route path="/hospital" element={<CreateHospitalPage />} />
        <Route
          path="/doctor-appointment/:id"
          element={<DoctorAppointmentPage />}
        />
      </Routes>
    </div>
  );
}

export default App;
