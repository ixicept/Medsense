"use client"

import type React from "react"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { predictDisease } from "@/lib/prediction"
import { AlertCircle } from "lucide-react"
import { toast } from "react-toastify"

export function PredictionForm() {
  const [symptoms, setSymptoms] = useState("")
  const [prediction, setPrediction] = useState<{
    disease: string
    confidence: number
    medication: string[]
    description: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!symptoms.trim()) return

    setIsLoading(true)

    try {
      // In a real app, this would be an API call to a backend service
      const result = await predictDisease(symptoms)
      setPrediction(result)

      // Save to history
      const historyItem = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        symptoms,
        prediction: result,
      }

      const history = JSON.parse(localStorage.getItem("predictionHistory") || "[]")
      localStorage.setItem("predictionHistory", JSON.stringify([historyItem, ...history]))

      toast.success("Prediction completed successfully", {
        position: "bottom-right",
        autoClose: 3000,
      })
    } catch (error) {
      console.error("Prediction failed:", error)
      toast.error("Failed to analyze symptoms. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Describe your symptoms in detail (e.g., 'I have a headache, fever, and sore throat for the past 3 days')"
          className="min-h-[150px] resize-none border-teal-200 focus-visible:ring-teal-500"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
        />
        <button
          type="submit"
          className="w-full py-2 px-4 rounded-md font-medium text-white bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !symptoms.trim()}
        >
          {isLoading ? "Analyzing..." : "Analyze Symptoms"}
        </button>
      </form>

      {prediction && (
        <Card className="border-purple-200 shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-card-2 border-b border-purple-100">
            <CardTitle className="text-purple-700">Analysis Results</CardTitle>
            <CardDescription>Based on the symptoms you provided</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="p-4 rounded-lg bg-gradient-card-1">
              <h3 className="font-medium text-teal-700">Possible Condition</h3>
              <p className="text-lg font-semibold">{prediction.disease}</p>
              <div className="mt-1 w-full bg-white rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-teal-500 to-purple-500 h-2 rounded-full"
                  style={{ width: `${prediction.confidence}%` }}
                ></div>
              </div>
              <p className="text-xs text-right mt-1 text-muted-foreground">Confidence: {prediction.confidence}%</p>
            </div>

            <div>
              <h3 className="font-medium text-purple-700">Description</h3>
              <p className="text-sm mt-1">{prediction.description}</p>
            </div>

            <div>
              <h3 className="font-medium text-teal-700">Recommended Medication</h3>
              <ul className="mt-2 space-y-2">
                {prediction.medication.map((med, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-teal-500"></div>
                    {med}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg bg-amber-50 p-4 border border-amber-200 flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Important Note</p>
                <p className="text-sm text-amber-700">
                  This is not a medical diagnosis. Please consult with a healthcare professional.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
