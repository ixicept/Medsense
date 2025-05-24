import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PredictionForm } from "@/components/prediction-form"
import { Activity, Heart, Shield } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-purple-500">
          Symptom Analysis
        </h2>
        <p className="text-muted-foreground mt-2">Predict potential health conditions based on your symptoms</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="w-full border-teal-200 shadow-lg">
            <CardHeader className="bg-gradient-card-1 border-b border-teal-100">
              <CardTitle className="text-teal-700">Symptom Analysis</CardTitle>
              <CardDescription>Describe your symptoms in detail for a more accurate prediction</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <PredictionForm />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-purple-200 shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-card-2 border-b border-purple-100">
              <CardTitle className="text-purple-700">About MediPredict</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                MediPredict uses advanced algorithms to analyze your symptoms and provide potential health conditions.
                Always consult with a healthcare professional for proper diagnosis and treatment.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4">
            <Card className="border-teal-200 shadow-md">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="bg-teal-100 p-2 rounded-full text-teal-600">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Fast Analysis</h3>
                  <p className="text-xs text-muted-foreground">Get results in seconds</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 shadow-md">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Private & Secure</h3>
                  <p className="text-xs text-muted-foreground">Your data stays protected</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-coral-200 shadow-md">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="bg-coral-100 p-2 rounded-full text-coral-600">
                  <Heart className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Health Focused</h3>
                  <p className="text-xs text-muted-foreground">Designed for your wellbeing</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
