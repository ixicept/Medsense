import HistoryList from "../components/HistoryList"
import { History, Filter } from "../components/Icons"

export default function HistoryPage() {
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-sky-600">
            Prediction History
          </h2>
          <p className="text-sky-700">View your past symptom analyses and predictions</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-sky-100 p-2 rounded-full text-sky-600">
                <History className="h-5 w-5" />
              </div>
              <h3 className="font-medium text-sky-800">Your Past Predictions</h3>
            </div>

            <button className="flex items-center gap-1 text-sm text-sky-600 hover:text-sky-800">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </div>

          <div className="border border-coral-200 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-card-3 border-b border-coral-100 px-6 py-4">
              <h3 className="text-lg font-medium text-coral-700">Your History</h3>
              <p className="text-sm text-gray-500">
                A record of your previous symptom analyses and the predicted conditions
              </p>
            </div>
            <div className="p-6">
              <HistoryList />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
