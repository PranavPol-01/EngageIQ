import React, { useState } from "react";
import LangflowClient from "../components/LangflowClient";

const CustomQuestion = () => {
  const [customQuestion, setCustomQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [postTypeData, setPostTypeData] = useState([]);
  const [metricCorrelation, setMetricCorrelation] = useState([]);
  const [topPost, setTopPost] = useState(null);
  const [showGraphs, setShowGraphs] = useState(false);
  const [insights, setInsights] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [averages, setAverages] = useState({});

  const langflowClient = new LangflowClient(
    "/api", // Backend API endpoint
    "AstraCS:HUwLTOlOLBGgBkUZahZEZeJF:713d0a3f668c0c0483afac18ff15c93072ec3624eeff818f5f6295521a216957" // CustomQuestionlication Token
  );

  const flowIdOrName = "0b52bae4-2480-486c-8f56-39ffd996c7f4";
  const langflowId = "a0e03fb4-0bd2-4a8e-8c97-87d09c3e9075";

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await langflowClient.runFlow(
        flowIdOrName,
        langflowId,
        customQuestion,
        "chat",
        "chat",
        {},
        false,
        (data) => console.log("Update:", data),
        (message) => console.log("Close:", message),
        (error) => console.error("Error:", error)
      );

      const responseText = response.outputs?.[0]?.outputs?.[0]?.outputs?.message?.message?.text || "";
      console.log("Response Text:", responseText);

      // Extract Insights - Looking for "Insights:**" followed by everything until "Data for Graphs:"
      const insightsMatch = responseText.match(/Insights:\*\*\s*(.*?)\s*(?=Data for Graphs:|Recommendations:|$)/s);
      if (insightsMatch) {
        setInsights(insightsMatch[1].trim()); // Set insights if found
      } else {
        setInsights(""); // Set to empty if no insights section is found
      }

      // Extract Recommendations - Looking for "Recommendations:**" and everything after it
      const recommendationsMatch = responseText.match(/Recommendations:\*\*\s*(.*)$/s);
      if (recommendationsMatch) {
        const extractedRecommendations = recommendationsMatch[1].trim().split("\n").map((rec) => rec.trim());
        setRecommendations(extractedRecommendations);
      } else {
        setRecommendations([]); // Set to empty array if no recommendations section is found
      }

      console.log("Insights:", insights);
      console.log("Recommendations:", recommendations);

      // Show Graphs if needed
      setShowGraphs(true);
    } catch (error) {
      console.error("Error during generation:", error);
      alert("Failed to generate insights. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <header className="py-6">
        <h1 className="text-3xl font-bold text-center">EngageIQ</h1>
      </header>
      <main className="container mx-auto px-4">
        {!showGraphs ? (
          <div>
            <div className="mb-4">
              <label htmlFor="customQuestion" className="block text-lg font-medium">
                Enter your query:
              </label>
              <textarea
                id="customQuestion"
                className="w-full mt-2 p-3 bg-gray-800 text-white rounded"
                rows="4"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
              />
            </div>
            <button
              className="w-full py-3 bg-blue-600 rounded hover:bg-blue-500 disabled:opacity-50"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Insights"}
            </button>
          </div>
        ) : (
          <>
            {/* Insights */}
            <div className="max-w-2xl mx-auto p-6 bg-gray-700 rounded-lg shadow-lg mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">Insights</h3>
              <div className="text-sm text-gray-400">
                <ul className="list-disc pl-6 space-y-2">
                  {insights.split("\n").map((line, index) => (
                    <li key={index}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            <div className="max-w-2xl mx-auto p-6 bg-gray-700 rounded-lg shadow-lg mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">Recommendations</h3>
              <div className="text-sm text-gray-400">
                {recommendations.length > 0 ? (
                  <div className="flex space-x-6 overflow-x-auto">
                    {recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="bg-gray-600 p-4 rounded-lg shadow-md hover:bg-gray-500 transition-all duration-300 w-64"
                      >
                        <p className="text-center text-white">{rec}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No recommendations available.</p>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default CustomQuestion;
