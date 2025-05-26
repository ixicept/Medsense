// Add this to your existing Icons.tsx file, or create it if it doesn't exist

export function DocumentUpload({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 16.5v-9m0 0l-3 3m3-3l3 3"
      />
    </svg>
  );
}

// // Keep your existing Calendar and Check icons...
// export function Calendar({ className = "h-6 w-6" }: { className?: string }) {
//   // Your existing code...
// }

// export function Check({ className = "h-6 w-6" }: { className?: string }) {
//   // Your existing code...
// }