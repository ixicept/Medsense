import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import { Calendar, Check, Clock } from "../components/Icons";
import { requestAppointment } from "../services/AppointmentService";
import { getCurrentUser } from "../utils/auth";

// Helper: JS date.getDay() returns 0 (Sun)...6 (Sat)
const jsDayToDayStr = (d: number) =>
  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d];

const allowedTimes = [7, 9, 11, 13, 15, 17, 19];

export default function AppointmentForm({
  selectedDoctor,
  disabled,
  doctorSchedule,
}: {
  selectedDoctor: any;
  disabled: boolean;
  doctorSchedule: any[];
}) {
  const [date, setDate] = useState<Date | null>(null);
  const [reason, setReason] = useState("");
  const [time, setTime] = useState(""); // e.g. "09:00"
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const user = getCurrentUser();

  // Filter available slots for the selected date
  console.log("doctorSchedule: ", doctorSchedule);
  console.log("date: ", date);
  let dayStr = date ? jsDayToDayStr(date.getDay()) : null;
  console.log("day schedule: ", dayStr);
  let availableSchedule = doctorSchedule.find((s) => s.Day === dayStr);
  console.log("A schedule: ", availableSchedule);
  // Compute allowed times for this day based on schedule
  let start = availableSchedule
    ? parseInt(availableSchedule.ScheduleStart.split("T")[1].split(":")[0], 10)
    : null;
  let end = availableSchedule
    ? parseInt(availableSchedule.ScheduleEnd.split("T")[1].split(":")[0], 10)
    : null;
  let validTimes =
    start !== null && end !== null
      ? allowedTimes.filter((t) => t >= start && t < end)
      : [];
  console.log("valid times: ", validTimes);

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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) {
      toast.error("Please select a doctor.");
      return;
    }
    if (!date) {
      toast.error("Please select an appointment date.");
      return;
    }
    if (!time) {
      toast.error("Please select an available time.");
      return;
    }

    // Compose the requested time as a Date
    let scheduled = new Date(date);
    let [h, m] = time.split(":");
    scheduled.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);

    setSubmitting(true);
    try {
      const form = new FormData();
      form.append("doctor_id", selectedDoctor.id);
      form.append("requested_time", scheduled.toISOString());
      form.append("reason", reason);
      form.append("patient_id", user?.email || "");

      await requestAppointment(form);
      setSubmitted(true);
      toast.success("Appointment scheduled successfully!", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (error) {
      toast.error("Could not schedule appointment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-md p-4 flex gap-3">
        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-green-800">Appointment Scheduled</h3>
          <p className="text-sm text-green-700">
            Your appointment has been successfully scheduled. We've sent a
            confirmation email to {user?.email || "your email address"}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-sky-700">Doctor</label>
        <input
          type="text"
          value={selectedDoctor ? selectedDoctor.name : ""}
          disabled
          className="w-full rounded-md border border-sky-200 p-2 text-sm bg-gray-100"
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-sky-700">
          Appointment Date
        </label>
        <div className="relative">
          <DatePicker
            selected={date}
            onChange={(d) => {
              setDate(d);
              setTime("");
            }}
            dateFormat="MMMM d, yyyy"
            minDate={new Date()}
            className="w-full rounded-md border border-sky-200 p-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 outline-none"
            placeholderText="Select a date"
            required
            disabled={disabled}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-sky-500">
            <Calendar className="h-4 w-4" />
          </div>
        </div>
      </div>
      {date && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-sky-700">
            Select Time
          </label>
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full rounded-md border border-sky-200 p-2 text-sm"
            disabled={validTimes.length === 0}
            required
          >
            <option value="">Select a time...</option>
            {validTimes.map((t) => (
              <option key={t} value={String(t).padStart(2, "0") + ":00"}>
                {String(t).padStart(2, "0")}:00
              </option>
            ))}
          </select>
          {validTimes.length === 0 && (
            <span className="text-xs text-red-500">
              Doctor is not available on this day.
            </span>
          )}
        </div>
      )}
      <div className="space-y-2">
        <label
          htmlFor="reason"
          className="block text-sm font-medium text-sky-700"
        >
          Reason for Visit
        </label>
        <textarea
          id="reason"
          name="reason"
          placeholder="Please describe your symptoms or reason for the appointment (optional)"
          className="w-full min-h-[100px] resize-none rounded-md border border-sky-200 p-3 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 outline-none"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={disabled}
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 rounded-md font-medium text-white bg-sky-500 hover:bg-sky-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled || !date || !time}
      >
        Schedule Appointment
      </button>
    </form>
  );
}
