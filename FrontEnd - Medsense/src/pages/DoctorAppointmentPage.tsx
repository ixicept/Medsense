import React, { useEffect, useState } from "react";
import axiosInstance from "../services/AxiosInstance";
import { getCurrentUser } from "../utils/auth";
import { toast } from "react-toastify";

interface Appointment {
  ID: string;
  PatientID: string;
  Reason: string;
  Status: string;
  ScheduledDateTime: string;
}

export default function DoctorAppointmentPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null); // appointment id
  const user = getCurrentUser();
  const doctorId = user?.id;

  useEffect(() => {
    if (!doctorId) return;
    setLoading(true);
    axiosInstance
      .get(`/appointment/doctor/${doctorId}`)
      .then((res) => {
        console.log("test2: ", res.data);
        setAppointments(
          Array.isArray(res.data.requests) ? res.data.requests : []
        );
      })
      .catch(() => toast.error("Failed to fetch appointments"))
      .finally(() => setLoading(false));
  }, [doctorId]);
  console.log("test: ", appointments);
  // Approve/Reject handler
  const handleAction = async (
    appointmentId: string,
    action: "approve" | "decline"
  ) => {
    console.log("aid: ", appointmentId);
    setProcessing(appointmentId);
    try {
      const endpoint =
        action === "approve" ? "/appointment/approve" : "/appointment/decline";
      await axiosInstance.post(endpoint, { appointment_id: appointmentId });
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.ID === appointmentId
            ? {
                ...appt,
                status: action === "approve" ? "approved" : "declined",
              }
            : appt
        )
      );
      toast.success(
        `Appointment ${action === "approve" ? "approved" : "declined"}!`
      );
    } catch (err) {
      toast.error("Failed to process appointment");
    } finally {
      setProcessing(null);
    }
  };

  // Format time
  const formatTime = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-sky-700">
        Patient Appointments
      </h2>
      {loading ? (
        <div>Loading appointments...</div>
      ) : appointments.length === 0 ? (
        <div>No appointments found.</div>
      ) : (
        <div className="grid gap-6">
          {appointments.map((appt) => (
            <div
              key={appt.ID}
              className="border border-sky-200 rounded-lg shadow bg-white p-6 flex flex-col md:flex-row md:items-center gap-4"
            >
              <div className="flex-1">
                <div className="font-semibold text-lg mb-1">
                  {appt.PatientID}
                </div>
                <div className="text-sm text-gray-700">
                  Requested: {formatTime(appt.ScheduledDateTime)}
                </div>
                <div className="text-sm text-gray-700 mb-2">
                  Reason: {appt.Reason}
                </div>
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                    appt.Status === "approved"
                      ? "bg-green-100 text-green-800"
                      : appt.Status === "declined"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {appt.Status.charAt(0).toUpperCase() + appt.Status.slice(1)}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  className="px-4 py-2 rounded bg-green-500 text-white font-medium hover:bg-green-600 transition disabled:opacity-50"
                  disabled={appt.Status !== "PENDING" || processing === appt.ID}
                  onClick={() => handleAction(appt.ID, "approve")}
                >
                  Approve
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-500 text-white font-medium hover:bg-red-600 transition disabled:opacity-50"
                  disabled={appt.Status !== "PENDING" || processing === appt.ID}
                  onClick={() => handleAction(appt.ID, "decline")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
