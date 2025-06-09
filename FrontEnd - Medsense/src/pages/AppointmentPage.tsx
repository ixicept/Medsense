import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UserRound, Clock, MapPin, Calendar, Check } from "../components/Icons";
import { getCurrentUser } from "../utils/auth";
import {
  getDoctors,
  getDoctorById,
  getDoctorSchedule,
} from "../services/AuthService";
import { requestAppointment } from "../services/AppointmentService";
import AppointmentForm from "../components/AppointmentForm";
import axios from "axios";

// ---- Types ----
interface Doctor {
  id: string;
  name: string;
  email: string;
  phone_number: string;
}

interface Schedule {
  ID: string;
  DoctorID: string;
  HospitalID: string;
  Day: string; // "Mon", "Tue", etc
  ScheduleStart: string; // ISO
  ScheduleEnd: string; // ISO
}
function formatUTCTime(isoString: string) {
  let date = new Date(isoString);
  let hours = date.getUTCHours();
  let mins = date.getUTCMinutes();
  let ampm = hours >= 12 ? "PM" : "AM";
  let displayHour = hours % 12;
  if (displayHour === 0) displayHour = 12;
  return `${displayHour.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")} ${ampm}`;
}
// ---- Appointment Form ----
// function AppointmentForm({
//   selectedDoctor,
//   disabled,
// }: {
//   selectedDoctor: Doctor | null;
//   disabled: boolean;
// }) {
//   const [date, setDate] = useState<Date | null>(null);
//   const [reason, setReason] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const user = getCurrentUser();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedDoctor) {
//       toast.error("Please select a doctor.");
//       return;
//     }
//     if (!date) {
//       toast.error("Please select an appointment date.");
//       return;
//     }
//     setSubmitting(true);
//     try {
//       const form = new FormData();
//       form.append("doctor_id", selectedDoctor.id);
//       form.append("requested_time", date.toISOString());
//       form.append("reason", reason);
//       form.append("patient_id", user?.email || ""); // use email as patient ID if needed

//       await requestAppointment(form);
//       setSubmitted(true);
//       toast.success("Appointment scheduled successfully!", {
//         position: "bottom-right",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       toast.error("Could not schedule appointment.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (submitted) {
//     return (
//       <div className="bg-green-50 border border-green-200 rounded-md p-4 flex gap-3">
//         <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
//         <div>
//           <h3 className="font-medium text-green-800">Appointment Scheduled</h3>
//           <p className="text-sm text-green-700">
//             Your appointment has been successfully scheduled. We've sent a
//             confirmation email to {user?.email || "your email address"}.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-sky-700">Doctor</label>
//         <input
//           type="text"
//           value={selectedDoctor ? selectedDoctor.name : ""}
//           disabled
//           className="w-full rounded-md border border-sky-200 p-2 text-sm bg-gray-100"
//         />
//       </div>
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-sky-700">
//           Appointment Date
//         </label>
//         <div className="relative">
//           <DatePicker
//             selected={date}
//             onChange={setDate}
//             dateFormat="MMMM d, yyyy"
//             minDate={new Date()}
//             className="w-full rounded-md border border-sky-200 p-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 outline-none"
//             placeholderText="Select a date"
//             required
//             disabled={disabled}
//           />
//           <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-sky-500">
//             <Calendar className="h-4 w-4" />
//           </div>
//         </div>
//       </div>
//       <div className="space-y-2">
//         <label
//           htmlFor="reason"
//           className="block text-sm font-medium text-sky-700"
//         >
//           Reason for Visit
//         </label>
//         <textarea
//           id="reason"
//           name="reason"
//           placeholder="Please describe your symptoms or reason for the appointment (optional)"
//           className="w-full min-h-[100px] resize-none rounded-md border border-sky-200 p-3 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 outline-none"
//           value={reason}
//           onChange={(e) => setReason(e.target.value)}
//           disabled={disabled}
//         />
//       </div>
//       <button
//         type="submit"
//         className="w-full py-2 px-4 rounded-md font-medium text-white bg-sky-500 hover:bg-sky-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//         disabled={disabled || !date}
//       >
//         Schedule Appointment
//       </button>
//     </form>
//   );
// }

// ---- Main Appointment Page ----
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export default function AppointmentPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [doctorProfile, setDoctorProfile] = useState<Doctor | null>(null);
  const [doctorSchedule, setDoctorSchedule] = useState<Schedule[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Fetch all doctors on page load
  useEffect(() => {
    setLoadingDoctors(true);
    getDoctors()
      .then((docs) => setDoctors(Array.isArray(docs) ? docs : []))
      .finally(() => setLoadingDoctors(false));
  }, []);

  // Fetch profile and schedule when doctor selected
  useEffect(() => {
    if (!selectedDoctorId) {
      setDoctorProfile(null);
      setDoctorSchedule([]);
      return;
    }
    setLoadingProfile(true);
    Promise.all([
      getDoctorById(selectedDoctorId),
      getDoctorSchedule(selectedDoctorId),
    ])
      .then(([profile, schedule]) => {
        setDoctorProfile(profile);
        console.log("Raw schedule object:", schedule);
        setDoctorSchedule(Array.isArray(schedule) ? schedule : []);
      })
      .finally(() => setLoadingProfile(false));
  }, [selectedDoctorId]);
  console.log("Raw: ", doctorSchedule);
  // Map: Day name → schedule(s)
  const dayMap: { [day: string]: Schedule[] } = {};
  doctorSchedule.forEach((sch) => {
    if (!dayMap[sch.Day]) dayMap[sch.Day] = [];
    dayMap[sch.Day].push(sch);
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-sky-600">
          Book an Appointment
        </h2>
        <p className="text-sky-700">
          Schedule a consultation with one of our healthcare professionals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Appointment Form and Doctor Picker */}
        <div className="md:col-span-2">
          <div className="border border-sky-200 rounded-lg shadow-lg bg-white">
            <div className="bg-sky-500 border-b border-sky-400 px-6 py-4 flex flex-col md:flex-row md:items-center gap-2">
              <h3 className="text-lg font-medium text-white flex-1">
                Appointment Details
              </h3>
              <div>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="px-3 py-2 rounded-md border border-sky-300 text-sky-700 text-sm focus:ring-2 focus:ring-sky-400 focus:outline-none"
                  disabled={loadingDoctors}
                >
                  <option value="">Select a doctor…</option>
                  {doctors.map((doc) => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} ({doc.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="p-6">
              {selectedDoctorId && doctorProfile && !loadingProfile ? (
                <AppointmentForm
                  selectedDoctor={doctorProfile}
                  disabled={loadingProfile}
                  doctorSchedule={doctorSchedule}
                />
              ) : (
                <p className="text-sky-500">
                  Please select a doctor to book your appointment.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Doctor Profile and Schedule */}
        <div className="space-y-6">
          {/* Doctor Profile Card */}
          <div className="border border-sky-200 rounded-lg shadow-md bg-white">
            <div className="bg-sky-500 border-b border-sky-400 px-6 py-4">
              <h3 className="text-lg font-medium text-white">
                {selectedDoctorId
                  ? loadingProfile
                    ? "Loading doctor profile..."
                    : "Doctor Profile"
                  : "Our Doctors"}
              </h3>
            </div>
            <div className="p-6">
              {!selectedDoctorId &&
                (loadingDoctors ? (
                  <div className="flex items-center justify-center h-32">
                    <span className="text-sky-400">Loading...</span>
                  </div>
                ) : doctors.length > 0 ? (
                  doctors.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 mb-2 rounded-lg bg-sky-50 flex items-center gap-3 border border-sky-100"
                    >
                      <div className="bg-sky-500 p-2 rounded-full text-white">
                        <UserRound className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sky-800">{doc.name}</h3>
                        <p className="text-xs text-sky-600">{doc.email}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-sky-600">
                    No doctors available at the moment.
                  </p>
                ))}
              {selectedDoctorId && doctorProfile && !loadingProfile && (
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-sky-500 p-4 rounded-full text-white mb-2">
                    <UserRound className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-sky-800">
                    {doctorProfile.name}
                  </h3>
                  <div className="text-sky-600 text-sm">
                    {doctorProfile.email}
                  </div>
                  <div className="text-gray-700 text-sm">
                    Phone: {doctorProfile.phone_number}
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Doctor Schedule Card */}
          <div className="border border-sky-200 rounded-lg shadow-md bg-white">
            <div className="bg-sky-500 border-b border-sky-400 px-6 py-4">
              <h3 className="text-lg font-medium text-white">
                {selectedDoctorId
                  ? "Doctor's Schedule"
                  : "Appointment Information"}
              </h3>
            </div>
            <div className="p-6 space-y-3">
              {!selectedDoctorId && (
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-sky-100 p-2 rounded-full text-sky-600">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm text-sky-800">
                        Monday - Friday, 9:00 AM to 5:00 PM
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-sky-100 p-2 rounded-full text-sky-600">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm text-sky-800">
                        RS Silaom, Jakarta Barat
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {selectedDoctorId &&
                (loadingProfile ? (
                  <div className="text-sky-400">Loading schedule…</div>
                ) : (
                  <div>
                    {daysOfWeek.map((day) => (
                      <div key={day} className="flex items-center gap-3 mb-2">
                        <span className="w-14 font-semibold text-sky-700">
                          {day}:
                        </span>
                        {dayMap[day] && dayMap[day].length > 0 ? (
                          dayMap[day].map((sch) => (
                            <span
                              key={sch.Day}
                              className="flex items-center gap-1 bg-sky-50 px-2 py-1 rounded"
                            >
                              <Clock className="h-4 w-4 text-sky-500" />
                              <span className="text-sky-800 text-sm">
                                {formatUTCTime(sch.ScheduleStart)} -{" "}
                                {formatUTCTime(sch.ScheduleEnd)}
                              </span>
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">
                            Not available
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
