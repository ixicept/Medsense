import { Routes, Route } from "react-router"
import HomePage from "./pages/HomePage"
import AppointmentPage from "./pages/AppointmentPage"
import HistoryPage from "./pages/HistoryPage"
import LoginPage from "./pages/LoginPage"
import AuthGuard from "./components/AuthGuard"
import MainNav from "./components/MainNav"
import { useLocation } from "react-router"

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <div className="min-h-screen bg-sky-50">
      <AuthGuard>
        {/* Show MainNav only when not on login page */}
        {!isLoginPage && <MainNav />}
        
        <Routes>
          <Route path="/" element={<LoginPage/>}/>
          <Route path="/home-page" element={<HomePage />} />
          <Route path="/appointment" element={<AppointmentPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </AuthGuard>
    </div>
  )
}

export default App
