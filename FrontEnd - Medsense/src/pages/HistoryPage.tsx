import React, { useEffect, useState } from "react";
import axiosInstance from "../services/AxiosInstance";
import { getCurrentUser } from "../utils/auth";

interface Appointment {
  ID: string;
  DoctorID: string;
  RequestedDateTime: string;
  Status: string;
  Reason: string;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function PatientHistoryPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    axiosInstance
      .get(`/appointment/patient/${user.id}`)
      .then((res) => {
        setAppointments(
          Array.isArray(res.data.requests) ? res.data.requests : []
        );
      })
      .catch(() => setAppointments([]))
      .finally(() => setLoading(false));
  }, [user?.id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-sky-700">
        My Appointment History
      </h2>
      {loading ? (
        <div className="text-sky-500">Loading...</div>
      ) : appointments.length === 0 ? (
        <div className="text-gray-500">No appointments found.</div>
      ) : (
        <div className="space-y-4">
          {appointments.map((a) => (
            <div
              key={a.ID}
              className="border rounded-md p-4 bg-white shadow flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div>
                <div className="font-semibold text-sky-800">
                  Doctor: {a.DoctorID}
                </div>
                <div className="text-gray-600 text-sm">
                  Date: {formatDate(a.RequestedDateTime)}
                </div>
                <div className="text-gray-600 text-sm">
                  Reason: {a.Reason || "-"}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={
                    "px-3 py-1 rounded-full text-sm font-semibold " +
                    (a.Status === "approved"
                      ? "bg-green-100 text-green-700"
                      : a.Status === "declined"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700")
                  }
                >
                  {a.Status.charAt(0).toUpperCase() + a.Status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
