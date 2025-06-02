"use client";

import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AlertCircle } from "./Icons";

type DiseaseDetails = Record<
  string,
  { description: string; medication: string[] }
>;

type Prediction = {
  label: string;
  confidence: number;
};

export default function PredictionForm() {
  const [symptoms, setSymptoms] = useState("");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [diseaseDetails, setDiseaseDetails] = useState<DiseaseDetails>({});
  const [isLoading, setIsLoading] = useState(false);

  // Dynamically import the disease_details.json once on mount
  useEffect(() => {
    import("../assets/disease_details.json").then((module) => {
      setDiseaseDetails(module.default || module);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:4999/predict", {
        text: symptoms,
      });
      const preds: Prediction[] = res.data.predictions;

      if (!preds || preds.length === 0) {
        throw new Error("No prediction received");
      }

      setPredictions(preds);

      const historyItem = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        symptoms,
        predictions: preds,
      };

      const history = JSON.parse(
        localStorage.getItem("predictionHistory") || "[]"
      );
      localStorage.setItem(
        "predictionHistory",
        JSON.stringify([historyItem, ...history])
      );

      toast.success("Prediction completed successfully", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Prediction failed:", error);
      toast.error("Failed to analyze symptoms. Please try again.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const top3 = predictions.slice(0, 3);
  const allBelow8 =
    top3.length === 3 && top3.every((pred) => pred.confidence * 100 < 10);

  return (
    <div className="space-y-6 w-full text-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          placeholder="Describe your symptoms in detail (e.g., 'I have a headache, fever, and sore throat for the past 3 days')"
          className="w-full min-h-[150px] resize-none rounded-2xl border-none shadow-md bg-gradient-to-br from-sky-50 to-white p-4 text-lg focus:border-teal-500 focus:ring-2 focus:ring-sky-400 focus:ring-opacity-50 outline-none"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
        />
        <button
          type="submit"
          className="w-full py-3 px-6 rounded-2xl font-bold text-white text-lg bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-400 hover:to-sky-400 shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !symptoms.trim()}
        >
          {isLoading ? "Analyzing..." : "Analyze Symptoms"}
        </button>
      </form>
      {top3.length > 0 && (
        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-sky-50 via-white to-teal-50 border-b border-gray-100 px-10 py-8">
            <h3 className="text-3xl font-extrabold text-teal-700 mb-2">
              Analysis Results
            </h3>
            <p className="text-lg text-gray-500">
              Top 3 predictions based on your symptoms
            </p>
          </div>
          <div className="p-10 space-y-8">
            {allBelow8 ? (
              <div className="p-10 rounded-2xl bg-amber-50 border border-amber-200 text-center font-extrabold text-amber-700 text-2xl shadow-sm">
                We don&apos;t know what disease it is.
              </div>
            ) : (
              top3.map((pred, idx) => {
                const confidencePercent =
                  Math.round(pred.confidence * 1000) / 10;
                const details = diseaseDetails[pred.label] || {
                  description: "No description available.",
                  medication: [],
                };

                return (
                  <div
                    key={pred.label}
                    className="p-8 rounded-2xl bg-gradient-to-br from-white to-sky-50 mb-8 shadow-md border border-gray-100"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <span className="font-extrabold text-3xl text-teal-600 drop-shadow">
                        #{idx + 1}
                      </span>
                      <span className="text-2xl font-bold text-sky-800">
                        {pred.label.toUpperCase()}
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-gray-100 rounded-full h-4 shadow-inner">
                      <div
                        className="bg-gradient-to-r from-teal-400 via-sky-400 to-purple-400 h-4 rounded-full shadow-lg"
                        style={{ width: `${confidencePercent}%` }}
                      ></div>
                    </div>
                    <p className="text-md text-right mt-1 text-gray-500 font-semibold">
                      Confidence: {confidencePercent}%
                    </p>
                    <div className="mt-4">
                      <h4 className="font-bold text-teal-700 text-xl mb-1">
                        Description
                      </h4>
                      <p className="text-base text-gray-700">
                        {details.description}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-sky-700 text-xl mt-4 mb-2">
                        Recommended Medication
                      </h4>
                      <ul className="mt-1 space-y-2">
                        {details.medication.length === 0 && (
                          <li className="text-base text-gray-400">
                            No recommendation available.
                          </li>
                        )}
                        {details.medication.map((med, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-3 text-base"
                          >
                            <div className="h-3 w-3 rounded-full bg-teal-400"></div>
                            {med}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })
            )}
            <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-white p-8 border border-amber-200 flex gap-4 text-lg shadow-inner">
              <AlertCircle className="h-7 w-7 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold text-amber-800 text-2xl mb-1">
                  Important Note
                </p>
                <p className="text-lg text-amber-700">
                  This is not a medical diagnosis. Please consult with a
                  healthcare professional.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
