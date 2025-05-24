import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HistoryList } from "@/components/history-list"
import { History, Filter } from "lucide-react"

export default function HistoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-coral-500 to-teal-500">
          Prediction History
        </h2>
        <p className="text-muted-foreground">View your past symptom analyses and predictions</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-coral-100 p-2 rounded-full text-coral-600">
              <History className="h-5 w-5" />
            </div>
            <h3 className="font-medium">Your Past Predictions</h3>
          </div>

          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>

        <Card className="border-coral-200 shadow-lg">
          <CardHeader className="bg-gradient-card-3 border-b border-coral-100">
            <CardTitle className="text-coral-700">Your History</CardTitle>
            <CardDescription>A record of your previous symptom analyses and the predicted conditions</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <HistoryList />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
