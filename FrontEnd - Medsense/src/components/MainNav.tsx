import { Link, useLocation } from "react-router"
import UserProfile from "./UserProfile"
import { getCurrentUser } from "../utils/auth"

export default function MainNav() {
  const location = useLocation()
  const user = getCurrentUser()
  const isAdmin = user?.role === 'admin'
  const isDoctor = user?.role === 'doctor'

  const routes = [
    {
      name: "Home",
      path: "/home-page",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
    },
    ...(!isDoctor ? [
      {
        name: "Book Appointment",
        path: "/appointment",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
        ),
      },
    ] : []),
    {
      name: "History",
      path: "/history",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      name: "Forum",
      path: "/forum",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <line x1="9" y1="10" x2="15" y2="10" />
          <line x1="12" y1="7" x2="12" y2="13" />
        </svg>
      ),
    },
    // Admin-only route for doctor verification
    ...(isAdmin ? [
      {
        name: "Doctor Requests",
        path: "/doctor-requests",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            <path d="m9 11 3 3 3-3" />
          </svg>
        ),
      },
    ] : []),
  ]

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <div className="bg-sky-500 w-screen flex items-center justify-center px-10 sticky top-0 z-50">
      <div className="flex h-16 items-center justify-between w-full max-w-7xl">
        <h1 className="text-xl font-bold tracking-tight text-white italic">Med Sense</h1>
        <div className="flex items-center justify-end gap-8 flex-1">
          <div className="md:flex items-center space-x-4">
            {routes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(route.path) ? "bg-white text-primary" : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {route.icon}
                {route.name}
              </Link>
            ))}
          </div>

          {/* User Profile */}
          <UserProfile />
        </div>
      </div>
    </div>
  )
}