import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AppointmentForm from "@/components/AppointmentForm"
import { UserRound, Clock, MapPin } from "lucide-react"

export default function AppointmentPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-coral-500">
          Book an Appointment
        </h2>
        <p className="text-muted-foreground">Schedule a consultation with one of our healthcare professionals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="border-purple-200 shadow-lg">
            <CardHeader className="bg-gradient-card-2 border-b border-purple-100">
              <CardTitle className="text-purple-700">Appointment Details</CardTitle>
              <CardDescription>Fill out the form below to schedule your appointment</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <AppointmentForm />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-coral-200 shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-card-3 border-b border-coral-100">
              <CardTitle className="text-coral-700">Our Doctors</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="p-3 rounded-lg bg-gradient-card-1 flex items-center gap-3">
                <div className="bg-white p-2 rounded-full text-teal-600">
                  <UserRound className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium">Dr. Sarah Johnson</h3>
                  <p className="text-xs text-muted-foreground">General Practitioner</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-gradient-card-2 flex items-center gap-3">
                <div className="bg-white p-2 rounded-full text-purple-600">
                  <UserRound className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium">Dr. Michael Chen</h3>
                  <p className="text-xs text-muted-foreground">Cardiologist</p>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-gradient-card-3 flex items-center gap-3">
                <div className="bg-white p-2 rounded-full text-coral-600">
                  <UserRound className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-medium">Dr. Emily Rodriguez</h3>
                  <p className="text-xs text-muted-foreground">Pediatrician</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-teal-200 shadow-md">
            <CardHeader className="bg-gradient-card-1 border-b border-teal-100">
              <CardTitle className="text-teal-700">Appointment Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-teal-100 p-2 rounded-full text-teal-600">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm">Monday - Friday, 9:00 AM to 5:00 PM</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-teal-100 p-2 rounded-full text-teal-600">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm">123 Medical Center Drive, Suite 200</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
