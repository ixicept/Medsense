"use client"

import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Pill, Clock, FileText } from "./Icons"

interface HistoryItem {
  id: string
  timestamp: string
  symptoms: string
  prediction: {
    disease: string
    confidence: number
    medication: string[]
    description: string
  }
}

export default function HistoryList() {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const storedHistory = localStorage.getItem("predictionHistory")
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory))
    }
  }, [])

  if (!isClient) {
    return <div className="text-center py-8 text-sky-700">Loading history...</div>
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="bg-sky-100 inline-flex p-4 rounded-full mb-4">
          <FileText className="h-8 w-8 text-sky-600" />
        </div>
        <p className="text-lg font-medium text-sky-700">No prediction history found</p>
        <p className="text-sm mt-2 text-sky-600 max-w-md mx-auto">
          Your symptom analyses will appear here after you use the prediction tool on the home page.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {history.map((item) => (
        <div
          key={item.id}
          className="border border-l-4 border-l-sky-500 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden bg-white"
        >
          <div className="p-4 bg-sky-50 border-b border-sky-100">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <span className="bg-sky-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                  {item.prediction.disease}
                </span>
                <span className="bg-white/50 text-xs px-2 py-0.5 rounded-md border border-coral-100">
                  {item.prediction.confidence}% confidence
                </span>
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
              </div>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-coral-700 flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                Symptoms Reported
              </h4>
              <p className="text-sm text-muted-foreground mt-1 pl-5">{item.symptoms}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-coral-700 flex items-center gap-1">
                <Pill className="h-3.5 w-3.5" />
                Recommended Medication
              </h4>
              <div className="flex flex-wrap gap-2 mt-1 pl-5">
                {item.prediction.medication.map((med, index) => (
                  <span key={index} className="bg-gradient-card-1 text-teal-700 text-xs px-2 py-1 rounded-md">
                    {med}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
