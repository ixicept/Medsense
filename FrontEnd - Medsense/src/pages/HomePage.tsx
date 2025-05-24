import PredictionForm from "../components/PredictionForm"

export default function HomePage() {
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-sky-600">
            Symptom Analysis
          </h2>
          <p className="text-sky-700 mt-2">Predict potential health conditions based on your symptoms</p>
        </div>

        <div className="w-100%">
          <div className="md:col-span-2">
            <div className="w-full border border-sky-200 rounded-lg shadow-lg overflow-hidden bg-white">
              <div className="flex justify-center items-center bg-sky-500 px-6 py-4">
                <p className="text-lg text-white font-medium">Describe your symptoms</p>
              </div>
              <div className="p-6">
                <PredictionForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
