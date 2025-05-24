"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Check } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "react-toastify"

export function AppointmentForm() {
  const [date, setDate] = useState<Date>()
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    doctor: "",
    reason: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the data to a backend API
    console.log("Appointment data:", { ...formData, date })
    setSubmitted(true)

    toast.success("Appointment scheduled successfully!", {
      position: "bottom-right",
      autoClose: 3000,
    })
  }

  if (submitted) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <Check className="h-4 w-4 text-green-600" />
        <AlertTitle>Appointment Scheduled</AlertTitle>
        <AlertDescription>
          Your appointment has been successfully scheduled. We've sent a confirmation email to {formData.email}.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-purple-700">
            Full Name
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            required
            value={formData.name}
            onChange={handleChange}
            className="border-purple-200 focus-visible:ring-purple-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-purple-700">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            value={formData.email}
            onChange={handleChange}
            className="border-purple-200 focus-visible:ring-purple-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-purple-700">
            Phone Number
          </Label>
          <Input
            id="phone"
            name="phone"
            placeholder="(123) 456-7890"
            required
            value={formData.phone}
            onChange={handleChange}
            className="border-purple-200 focus-visible:ring-purple-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="doctor" className="text-purple-700">
            Select Doctor
          </Label>
          <Select onValueChange={(value) => handleSelectChange("doctor", value)}>
            <SelectTrigger className="border-purple-200 focus:ring-purple-500">
              <SelectValue placeholder="Select a doctor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dr-johnson">Dr. Sarah Johnson</SelectItem>
              <SelectItem value="dr-chen">Dr. Michael Chen</SelectItem>
              <SelectItem value="dr-rodriguez">Dr. Emily Rodriguez</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-purple-700">Appointment Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "w-full flex items-center justify-start rounded-md border border-purple-200 bg-white px-3 py-2 text-sm font-medium",
                !date && "text-gray-500",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-purple-500" />
              {date ? format(date, "PPP") : "Select a date"}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              className="rounded-md border border-purple-200"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason" className="text-purple-700">
          Reason for Visit
        </Label>
        <Textarea
          id="reason"
          name="reason"
          placeholder="Please describe your symptoms or reason for the appointment"
          className="min-h-[100px] border-purple-200 focus-visible:ring-purple-500"
          value={formData.reason}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 rounded-md font-medium text-white bg-gradient-to-r from-purple-500 to-coral-500 hover:from-purple-600 hover:to-coral-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!date || !formData.doctor}
      >
        Schedule Appointment
      </button>
    </form>
  )
}

export default AppointmentForm
