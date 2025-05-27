// User type definition
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Function to get the current logged-in user from session storage
export function getCurrentUser(): User | null {
  const userJson = sessionStorage.getItem('user');
  if (!userJson) {
    return null;
  }
  
  try {
    return JSON.parse(userJson) as User;
  } catch (error) {
    console.error('Error parsing user data from session storage:', error);
    return null;
  }
}

// Function to check if a user is logged in
export function isLoggedIn(): boolean {
  return sessionStorage.getItem('user') !== null;
}

// Function to logout the current user
export function logout(): void {
  sessionStorage.removeItem('user');
}
