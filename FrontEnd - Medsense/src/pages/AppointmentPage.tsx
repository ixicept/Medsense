import { useEffect, useState } from "react";
import AppointmentForm from "../components/AppointmentForm";
import { UserRound, Clock, MapPin } from "../components/Icons";
import { getDoctors } from "../services/AuthService";
// import { getCurrentUser } from "../utils/auth"; // Not used in this specific snippet, but keep if needed elsewhere

interface Doctor {
  id: string;
  name: string;
  email: string;
}

export default function AppointmentPage() {

  const [doctors, setDoctors] = useState<Doctor[]>([]); // Start with an empty array
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(true); // State for loading doctors

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoadingDoctors(true);
      try {
        let response = await getDoctors();
        setDoctors(response);
      } catch (error) {
        setDoctors([]);
      } finally {
        setIsLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <>
      {/* Main content area */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-sky-600">
            Book an Appointment
          </h2>
          <p className="text-sky-700">Schedule a consultation with one of our healthcare professionals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="border border-sky-200 rounded-lg shadow-lg overflow-hidden bg-white">
              <div className="bg-sky-500 border-b border-sky-400 px-6 py-4">
                <h3 className="text-lg font-medium text-white">Appointment Details</h3>
                <p className="text-sm text-sky-100">Fill out the form below to schedule your appointment</p>
              </div>
              <div className="p-6">
                {/* Pass doctors list and loading state to AppointmentForm if it needs them */}
                <AppointmentForm doctors={doctors} isLoadingDoctors={isLoadingDoctors} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border border-sky-200 rounded-lg shadow-md overflow-hidden bg-white">
              <div className="bg-sky-500 border-b border-sky-400 px-6 py-4">
                <h3 className="text-lg font-medium text-white">Our Doctors</h3>
              </div>
              <div className="p-6 space-y-4">
                {isLoadingDoctors ? (
                  // Show spinner while loading doctors
                  <div className="flex justify-center items-center h-40"> {/* Adjusted height */}
                    <svg className="animate-spin h-8 w-8 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="ml-2 text-sky-600">Loading doctors...</p>
                  </div>
                ) : doctors.length > 0 ? (
                  // Map through the doctors array to display them
                  doctors.map((doctor) => (
                    <div key={doctor.id} className="p-3 rounded-lg bg-sky-50 flex items-center gap-3 border border-sky-100">
                      <div className="bg-sky-500 p-2 rounded-full text-white">
                        <UserRound className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sky-800">{doctor.name}</h3>
                        <p className="text-xs text-sky-600">{doctor.email}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  // Show message if no doctors are available after loading
                  <p className="text-center text-sky-600">No doctors available at the moment.</p>
                )}
              </div>
            </div>

            {/* Appointment Information - Static for now */}
            <div className="border border-sky-200 rounded-lg shadow-md overflow-hidden bg-white">
              <div className="bg-sky-500 border-b border-amber-400 px-6 py-4"> {/* Note: amber-400 was here, kept it */}
                <h3 className="text-lg font-medium text-white">Appointment Information</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-sky-100 p-2 rounded-full text-sky-600">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-sky-800">Monday - Friday, 9:00 AM to 5:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-sky-100 p-2 rounded-full text-sky-600">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm text-sky-800">RS Silaom, Jakarta Barat </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}