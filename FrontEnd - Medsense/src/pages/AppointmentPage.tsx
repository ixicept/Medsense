import AppointmentForm from "../components/AppointmentForm"
import { UserRound, Clock, MapPin } from "../components/Icons"

export default function AppointmentPage() {
  return (
    <>
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
                <AppointmentForm />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border border-sky-200 rounded-lg shadow-md overflow-hidden bg-white">
              <div className="bg-sky-500 border-b border-sky-400 px-6 py-4">
                <h3 className="text-lg font-medium text-white">Our Doctors</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="p-3 rounded-lg bg-sky-50 flex items-center gap-3 border border-sky-100">
                  <div className="bg-sky-500 p-2 rounded-full text-white">
                    <UserRound className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sky-800">Dr. Sarah Johnson</h3>
                    <p className="text-xs text-sky-600">General Practitioner</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-sky-50 flex items-center gap-3 border border-sky-100">
                  <div className="bg-sky-500 p-2 rounded-full text-white">
                    <UserRound className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sky-800">Dr. Michael Chen</h3>
                    <p className="text-xs text-sky-600">Cardiologist</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-sky-50 flex items-center gap-3 border border-sky-100">
                  <div className="bg-sky-500 p-2 rounded-full text-white">
                    <UserRound className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sky-800">Dr. Emily Rodriguez</h3>
                    <p className="text-xs text-sky-600">Pediatrician</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-sky-200 rounded-lg shadow-md overflow-hidden bg-white">
              <div className="bg-sky-500 border-b border-amber-400 px-6 py-4">
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
  )
}
