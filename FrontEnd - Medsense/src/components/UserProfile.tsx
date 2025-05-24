import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router"
import { toast } from "react-toastify"
import { getCurrentUser, logout } from "../utils/auth"

export default function UserProfile() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [logoutModalOpen, setLogoutModalOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  // Get user data from session storage
  const user = getCurrentUser()
  
  // Generate initials from name
  const getInitials = (name: string) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }
  
  const userInitials = user ? getInitials(user.name) : "U";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const nav = useNavigate()

  // Handle logout
  const handleLogout = () => {
    // Use the logout utility function to remove user from session storage
    logout();
    setLogoutModalOpen(false);
    nav("/");
    toast.success("Logged out successfully", {
      position: "bottom-right",
      autoClose: 3000,
    });
  }

  // Handle settings
  const handleSettings = () => {
    // In a real app, this would navigate to settings
    toast.info("Settings page would open here", {
      position: "bottom-right",
      autoClose: 3000,
    })
    setDropdownOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md text-white hover:bg-sky-400 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-sky-600 border border-white flex items-center justify-center text-xs font-medium text-white shadow-sm">
          {userInitials}
        </div>
        <span className="hidden md:inline-block font-medium">{user?.name || "User"}</span>
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
          className="opacity-70"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white border border-sky-200 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-sky-100 bg-sky-50">
            <p className="text-sm font-medium text-sky-900">{user?.name || "User"}</p>
            <p className="text-xs text-sky-500 mt-1">{user?.email || "No email available"}</p>
          </div>
          <div className="py-1">
            <button
              onClick={handleSettings}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
            >
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
                className="mr-2 text-purple-500"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Settings
            </button>
            <button
              onClick={() => {
                setDropdownOpen(false)
                setLogoutModalOpen(true)
              }}
              className="w-full text-left px-4 py-2 text-sm text-coral-600 hover:bg-gray-50 flex items-center"
            >
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
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Log out
            </button>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {logoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-medium text-sky-700">Log out of MediPredict?</h3>
              <p className="mt-2 text-sm text-gray-500">
                You will be logged out of your account. You can log back in at any time.
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-2 sm:justify-end">
              <button
                onClick={() => setLogoutModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-sky-500  hover:sky-300 "
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
