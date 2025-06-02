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
        <Route path="/forum" element={<ForumPage />} /> {/* Add this route */}
        <Route path="/forum/:id" element={<ForumDetailPage />} />
      </Routes>
    </div>
  );
}

export default App;
