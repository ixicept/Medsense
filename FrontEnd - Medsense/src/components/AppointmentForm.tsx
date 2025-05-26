import type React from "react"

import { useState } from "react"
import { toast } from "react-toastify"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Check, Calendar } from "./Icons"
import { getCurrentUser } from "../utils/auth"

export default function AppointmentForm() {
  const [date, setDate] = useState<Date | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    doctor: "",
    reason: "",
  })

  const user = getCurrentUser()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const data = localStorage.getItem("user");

    JSON.stringify(data)

    console.log("Appointment data:", { ...formData, date })
    setSubmitted(true)

    toast.success("Appointment scheduled successfully!", {
      position: "bottom-right",
      autoClose: 3000,
    })
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-md p-4 flex gap-3">
        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-green-800">Appointment Scheduled</h3>
          <p className="text-sm text-green-700">
            Your appointment has been successfully scheduled. We've sent a confirmation email to {user?.email}.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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
          >
            <option value="">Select a doctor</option>
            <option value="dr-johnson">Dr. Sarah Johnson</option>
            <option value="dr-chen">Dr. Michael Chen</option>
            <option value="dr-rodriguez">Dr. Emily Rodriguez</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-sky-700">Appointment Date</label>
        <div className="relative">
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            dateFormat="MMMM d, yyyy"
            minDate={new Date()}
            className="w-full rounded-md border border-sky-200 p-2 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 outline-none"
            placeholderText="Select a date"
            required
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-sky-500">
            <Calendar className="h-4 w-4" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="reason" className="block text-sm font-medium text-sky-700">
          Reason for Visit
        </label>
        <textarea
          id="reason"
          name="reason"
          placeholder="Please describe your symptoms or reason for the appointment"
          className="w-full min-h-[100px] resize-none rounded-md border border-sky-200 p-3 text-sm focus:border-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 outline-none"
          value={formData.reason}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 rounded-md font-medium text-white bg-sky-500 hover:bg-sky-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!date || !formData.doctor}
      >
        Schedule Appointment
      </button>
    </form>
  )
}
