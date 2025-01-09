import React, { useState } from "react";
import LangflowClient from "../components/LangflowClient";
import Graphs from "../components/Graphs";

const CustomQuestion = () => {
  const [customQuestion, setCustomQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [postTypeData, setPostTypeData] = useState([]);
  const [metricCorrelation, setMetricCorrelation] = useState([]);
  const [topPost, setTopPost] = useState(null);
  const [showGraphs, setShowGraphs] = useState(false);
  const [insights, setInsights] = useState({});
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
  
      // Extract Post Type Analysis
      const postTypeMatch = responseText.match(/Post Type Analysis:\*\*\s*```json\s*(\{.*?\})\s*```/s);
      if (postTypeMatch) {
        const postTypeAnalysis = JSON.parse(postTypeMatch[1]);
        setPostTypeData(
          postTypeAnalysis.metrics.likes.map((_, index) => ({
            index: index + 1,
            likes: postTypeAnalysis.metrics.likes[index],
            shares: postTypeAnalysis.metrics.shares[index],
            comments: postTypeAnalysis.metrics.comments[index],
          }))
        );
        calculateAverages(postTypeAnalysis.metrics);
      } else {
        console.warn("Post Type Analysis not found in the response.");
      }
  
      // Extract Top Post
      const topPostMatch = responseText.match(/Top Post:\*\*\s*```json\s*(\{.*?\})\s*```/s);
      if (!topPostMatch || !topPostMatch[1]) {
        throw new Error("Top Post data is missing or malformed.");
      }
    
      const topPostData = JSON.parse(topPostMatch[1]);
      setTopPost(topPostData);
  
      // Extract Metric Correlation
      const metricCorrelationMatch = responseText.match(/Metric Correlation:\*\*\s*```json\s*(\{.*?\})\s*```/s);
      if (metricCorrelationMatch) {
        const metricCorrelationData = JSON.parse(metricCorrelationMatch[1]);
        setMetricCorrelation(
          Object.entries(metricCorrelationData).map(([key, value]) => ({
            metric: key,
            correlation: value,
          }))
        );
      } else {
        console.warn("Metric Correlation not found in the response.");
      }
  
      // Extract Insights
      const insightsSection = responseText.match(/Insights:\*\*\s*(.*?)(?=Data for Graphs:)/s)?.[1] || "";
      setInsights(insightsSection.trim());
  
      // Extract Recommendations
      const recommendationsSection = responseText.match(/Recommendations:\*\*\s*(.*)$/s)?.[1] || "";
      const extractedRecommendations = recommendationsSection.trim().split("\n").map((rec) => rec.trim());
      setRecommendations(extractedRecommendations);
  
      // Show Graphs
      setShowGraphs(true);
    } catch (error) {
      console.error("Error during generation:", error);
      alert("Failed to generate insights. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const calculateAverages = (metrics) => {
    const safeAverage = (arr) => (Array.isArray(arr) && arr.length > 0
      ? arr.reduce((a, b) => a + b, 0) / arr.length
      : 0);
  
    const averageLikes = safeAverage(metrics.likes);
    const averageShares = safeAverage(metrics.shares);
    const averageComments = safeAverage(metrics.comments);
    const averageEngagement = safeAverage(metrics.engagement_rate);
  
    setAverages({
      likes: averageLikes.toFixed(2),
      shares: averageShares.toFixed(2),
      comments: averageComments.toFixed(2),
      engagement_rate: averageEngagement.toFixed(2),
    });
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
          <Graphs
            postTypeData={postTypeData}
            metricCorrelation={metricCorrelation}
            topPost={topPost}
            insights={insights}
            recommendations={recommendations}
            averages={averages}
          />
        )}
      </main>
    </div>
  );
};

export default CustomQuestion;