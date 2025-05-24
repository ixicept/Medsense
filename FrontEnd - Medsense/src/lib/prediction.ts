// This is a mock implementation of disease prediction
// In a real application, this would connect to a backend API or ML model

interface Prediction {
  disease: string
  confidence: number
  medication: string[]
  description: string
}

// Simple mock database of symptoms and conditions
const conditionsDatabase = [
  {
    keywords: ["headache", "fever", "sore throat", "cough", "congestion"],
    disease: "Common Cold",
    confidence: 85,
    medication: ["Acetaminophen", "Decongestants", "Throat lozenges"],
    description: "A viral infection of the upper respiratory tract that typically resolves within 7-10 days.",
  },
  {
    keywords: ["headache", "fever", "body aches", "fatigue", "chills"],
    disease: "Influenza",
    confidence: 80,
    medication: ["Oseltamivir", "Acetaminophen", "Ibuprofen"],
    description: "A contagious respiratory illness caused by influenza viruses that can cause mild to severe illness.",
  },
  {
    keywords: ["rash", "itching", "redness", "swelling", "hives"],
    disease: "Allergic Reaction",
    confidence: 75,
    medication: ["Antihistamines", "Corticosteroids", "Calamine lotion"],
    description: "An immune system response to a substance that the body mistakenly identifies as harmful.",
  },
  {
    keywords: ["abdominal pain", "nausea", "vomiting", "diarrhea", "cramps"],
    disease: "Gastroenteritis",
    confidence: 82,
    medication: ["Oral rehydration solutions", "Loperamide", "Bismuth subsalicylate"],
    description: "Inflammation of the stomach and intestines, typically resulting from a viral or bacterial infection.",
  },
  {
    keywords: ["chest pain", "shortness of breath", "dizziness", "fatigue", "palpitations"],
    disease: "Possible Cardiovascular Issue",
    confidence: 65,
    medication: ["Seek immediate medical attention"],
    description: "Symptoms that may indicate a heart-related condition requiring prompt medical evaluation.",
  },
]

export async function predictDisease(symptoms: string): Promise<Prediction> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Convert symptoms to lowercase for matching
  const lowerSymptoms = symptoms.toLowerCase()

  // Score each condition based on keyword matches
  const scoredConditions = conditionsDatabase.map((condition) => {
    const matchCount = condition.keywords.filter((keyword) => lowerSymptoms.includes(keyword)).length

    const score = matchCount / condition.keywords.length
    return { ...condition, score }
  })

  // Sort by score and get the highest match
  scoredConditions.sort((a, b) => b.score - a.score)

  // If no good matches, return a generic response
  if (scoredConditions[0].score === 0) {
    return {
      disease: "Unrecognized Symptoms",
      confidence: 30,
      medication: ["Consult with a healthcare professional"],
      description:
        "Your symptoms don't clearly match any conditions in our database. Please consult with a doctor for proper evaluation.",
    }
  }

  // Adjust confidence based on match quality
  const adjustedConfidence = Math.round(scoredConditions[0].confidence * scoredConditions[0].score)

  return {
    ...scoredConditions[0],
    confidence: adjustedConfidence,
  }
}
