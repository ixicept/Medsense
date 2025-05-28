import type React from "react"; // Keep this if you prefer explicit type import
import { useState } from "react";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Check, Calendar } from "./Icons"; // Assuming these are correctly imported
import { getCurrentUser } from "../utils/auth";
import { requestAppointment } from "../services/AppointmentService";

interface Doctor {
  id: string;
  name: string;
  email: string;
}

interface AppointmentFormProps {
  doctors: Doctor[];
  isLoadingDoctors: boolean;
}

export default function AppointmentForm({ doctors, isLoadingDoctors }: AppointmentFormProps) { // Destructure props
  const [date, setDate] = useState<Date | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    doctor: "",
    reason: "",
  });

  const user = getCurrentUser();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.doctor) {
      toast.error("Please select a doctor.");
      return;
    }
    if (!date) {
      toast.error("Please select an appointment date.");
      return;
    }

    try {
      const form = new FormData();
      form.append("doctor_id", formData.doctor);
      form.append("requested_time", date.toISOString()); // Use ISO string for consistency
      form.append("reason", formData.reason);
      form.append("patient_id", user?.email || ""); // Use email as patient ID, or handle differently if needed
      console.log(form.values()); // Log form data for debugging
      const response = await requestAppointment(form)
      console.log("Appointment response:", response);
      setSubmitted(true);
      toast.success("Appointment scheduled successfully!", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      toast.error("Could not schedule appointment.");
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
      {/* Doctor Selection Dropdown */}
      <div className="space-y-2">
        <label htmlFor="doctor" className="block text-sm font-medium text-sky-700">
          Select Doctor
        </label>
        <select
          id="doctor"
          name="doctor"
          value={formData.doctor}
          onChange={handleChange}
          className="w-full rounded-md border border-sky-200 p-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 outline-none"
          required
          disabled={isLoadingDoctors} // Disable while loading
        >
          {isLoadingDoctors ? (
            <option value="">Loading doctors...</option>
          ) : (
            <>
              <option value="">Select a doctor</option>
              {doctors.length > 0 ? (
                doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>No doctors available</option>
              )}
            </>
          )}
        </select>
      </div>

      {/* Appointment Date */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-sky-700">Appointment Date</label>
        <div className="relative">
          <DatePicker
            selected={date}
            onChange={(newDate) => setDate(newDate)} // Changed `date` to `newDate` for clarity
            dateFormat="MMMM d, yyyy"
            minDate={new Date()} // Prevent selecting past dates
            className="w-full rounded-md border border-sky-200 p-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 outline-none"
            placeholderText="Select a date"
            required
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-sky-500">
            <Calendar className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Reason for Visit */}
      <div className="space-y-2">
        <label htmlFor="reason" className="block text-sm font-medium text-sky-700">
          Reason for Visit
        </label>
        <textarea
          id="reason"
          name="reason"
          placeholder="Please describe your symptoms or reason for the appointment (optional)"
          className="w-full min-h-[100px] resize-none rounded-md border border-sky-200 p-3 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 outline-none"
          value={formData.reason}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 rounded-md font-medium text-white bg-sky-500 hover:bg-sky-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed" // Changed hover color slightly
        disabled={!date || !formData.doctor || isLoadingDoctors} // Also disable if doctors are loading
      >
        Schedule Appointment
      </button>
    </form>
  );
}