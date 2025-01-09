import React, { useState } from "react";
import LangflowClient from "./components/LangflowClient";
import Graphs from "./components/Graphs";
import CustomQuestion
  from "./components/CustomeQuestion";
const App = () => {
  const [customQuestion, setCustomQuestion] = useState("Give me stats about reels for username beerbiceps");
  const [loading, setLoading] = useState(false);
  const [postTypeData, setPostTypeData] = useState([]);
  const [metricCorrelation, setMetricCorrelation] = useState([]);
  const [topPost, setTopPost] = useState(null);
  const [showGraphs, setShowGraphs] = useState(false);
  const [insights, setInsights] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [averages, setAverages] = useState({});
  const [isAdvanced, setIsAdvanced] = useState(false);

  const langflowClient = new LangflowClient(
    "/api", // Backend API endpoint
    "AstraCS:HUwLTOlOLBGgBkUZahZEZeJF:713d0a3f668c0c0483afac18ff15c93072ec3624eeff818f5f6295521a216957" // Application Token
  );

  const flowIdOrName = "0b52bae4-2480-486c-8f56-39ffd996c7f4";
  const langflowId = "a0e03fb4-0bd2-4a8e-8c97-87d09c3e9075";

  // const handleGenerate = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await langflowClient.runFlow(
  //       flowIdOrName,
  //       langflowId,
  //       customQuestion,
  //       "chat",
  //       "chat",
  //       {},
  //       false,
  //       (data) => console.log("Update:", data),
  //       (message) => console.log("Close:", message),
  //       (error) => console.error("Error:", error)
  //     );

  //     const responseText = response.outputs?.[0]?.outputs?.[0]?.outputs?.message?.message?.text || "";

  //     const postTypeMatch = responseText.match(/Post Type Analysis:\*\*\s*```json\s*(\{.*?\})\s*```/s);
  //     const postTypeAnalysis = JSON.parse(postTypeMatch[1]);
  //     setPostTypeData(
  //       postTypeAnalysis.metrics.likes.map((_, index) => ({
  //         index: index + 1,
  //         likes: postTypeAnalysis.metrics.likes[index],
  //         shares: postTypeAnalysis.metrics.shares[index],
  //         comments: postTypeAnalysis.metrics.comments[index],
  //       }))
  //     );

  //     const topPostMatch = responseText.match(/Top Post:\*\*\s*```json\s*(\{.*?\})\s*```/s);
  //     const topPostData = JSON.parse(topPostMatch[1]);
  //     setTopPost(topPostData);

  //     const metricCorrelationMatch = responseText.match(/Metric Correlation:\*\*\s*```json\s*(\{.*?\})\s*```/s);
  //     const metricCorrelationData = JSON.parse(metricCorrelationMatch[1]);
  //     setMetricCorrelation(
  //       Object.entries(metricCorrelationData).map(([key, value]) => ({
  //         metric: key,
  //         correlation: value,
  //       }))
  //     );

  //     const insightsSection = responseText.match(/Insights:\*\*\s*(.*?)(?=Data for Graphs:)/s)?.[1] || "";
  //     setInsights(insightsSection.trim());

  //     const recommendationsSection = responseText.match(/Recommendations:\*\*\s*(.*)$/s)?.[1] || "";
  //     const extractedRecommendations = recommendationsSection.trim().split("\n").map((rec) => rec.trim());
  //     setRecommendations(extractedRecommendations);

  //     calculateAverages(postTypeAnalysis.metrics);
  //     setShowGraphs(true);
  //   } catch (error) {
  //     console.error("Error during generation:", error);
  //     alert("Failed to generate insights. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleGenerate = async () => {
    console.log(customQuestion)
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
      console.log(responseText)

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
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">EngageIQ</h1>
              <p className="mt-1.5 text-sm text-gray-400">
                Insights-Driven Social Media Analysis
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                className="inline-flex items-center justify-center gap-1.5 rounded bg-gray-800 px-5 py-3 text-white transition hover:bg-gray-700 focus:outline-none focus:ring"
                type="button"
              >
                <span className="text-sm font-medium">View Demonstration</span>
              </button>
              <button
                className="inline-block rounded bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-indigo-700 focus:outline-none focus:ring"
                type="button"
              >
                GitHub Repository
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4">

        <div className="max-w-2xl mx-auto p-8 bg-gray-800 rounded-lg shadow-md mt-8">
          <div>
            <label
              htmlFor="UserEmail"
              className="block text-sm font-medium text-gray-300"
            >
              UserName
            </label>
            <input
              type="email"
              id="UserEmail"
              placeholder="Enter the username"
              className="mt-3 w-full rounded-md border border-gray-600 bg-gray-900 text-white shadow-sm sm:text-sm py-3 px-4 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {!showGraphs ? (
         <div className="m-5 flex justify-center">
         <div className="w-full max-w-2xl">
           <button
             className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50"
             onClick={handleGenerate}
             disabled={loading}
           >
             {loading ? "Generating..." : "Generate Insights"}
           </button>
         </div>
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

        <div className="flex items-center justify-between my-6">
          <span className="text-sm font-medium text-gray-300">Advanced Settings:</span>
          <button
            onClick={() => setIsAdvanced(!isAdvanced)}
            className={`relative inline-flex h-8 w-12 items-center rounded-full ${isAdvanced ? "bg-blue-600" : "bg-gray-600"
              }`}
          >
            <span
              className={`${isAdvanced ? "translate-x-6" : "translate-x-1"
                } inline-block h-5 w-5 transform rounded-full bg-white transition-transform`}
            ></span>
          </button>
        </div>
        {isAdvanced && <CustomQuestion />}

      </main>
    </div>
  );
};

export default App;
