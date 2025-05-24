import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { isLoggedIn } from "../utils/auth";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn() && location.pathname !== "/") {
      // If not logged in and not on login page, redirect to login page
      navigate("/");
    }
  }, [location.pathname, navigate]);

  return <>{children}</>;
}
