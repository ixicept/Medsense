import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Public routes that don't need authentication
  const publicRoutes = ['/', '/register'];
  const isPublicRoute = publicRoutes.includes(location.pathname);
  
  useEffect(() => {
    // Only check auth for protected routes
    if (!isPublicRoute) {
      const user = sessionStorage.getItem('user');
      if (!user) {
        navigate('/', { replace: true });
      }
    }
  }, [navigate, location.pathname, isPublicRoute]);
  
  return <>{children}</>;
}