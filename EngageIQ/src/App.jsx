// import React, { useState } from "react";
// import LangflowClient from "./components/LangflowClient";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   BarChart,
//   Bar,
//   RadarChart,
//   Radar,
//   PolarGrid,
//   PolarAngleAxis,
//   PolarRadiusAxis,
// } from "recharts";
// import { FaChartLine, FaThumbsUp, FaShareAlt, FaComment } from "react-icons/fa";
// const App = () => {
//   const [customQuestion, setCustomQuestion] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [postTypeData, setPostTypeData] = useState([]);
//   const [metricCorrelation, setMetricCorrelation] = useState([]);
//   const [topPost, setTopPost] = useState(null);
//   const [showGraphs, setShowGraphs] = useState(false);
//   const [insights, setInsights] = useState({});
//   const [recommendations, setRecommendations] = useState([]);

//   const [averages, setAverages] = useState({})
//   const langflowClient = new LangflowClient(
//     "/api", // Backend API endpoint
//     "AstraCS:HUwLTOlOLBGgBkUZahZEZeJF:713d0a3f668c0c0483afac18ff15c93072ec3624eeff818f5f6295521a216957" // Application Token
//   );

//   const flowIdOrName = "0b52bae4-2480-486c-8f56-39ffd996c7f4";
//   const langflowId = "a0e03fb4-0bd2-4a8e-8c97-87d09c3e9075";

//   const handleGenerate = async () => {
//     setLoading(true);
//     try {
//       const response = await langflowClient.runFlow(
//         flowIdOrName,
//         langflowId,
//         customQuestion,
//         "chat",
//         "chat",
//         {},
//         false,
//         (data) => console.log("Update:", data),
//         (message) => console.log("Close:", message),
//         (error) => console.error("Error:", error)
//       );
    
//       console.log("Raw Response from Backend:", response);
    
//       const responseText = response.outputs?.[0]?.outputs?.[0]?.outputs?.message?.message?.text || "";
//       console.log("Extracted Response Text:", responseText);


//   const postTypeMatch = responseText.match(/Post Type Analysis:\*\*\s*```json\s*(\{.*?\})\s*```/s);
//   console.log(postTypeMatch);
//   if (!postTypeMatch || !postTypeMatch[1]) {
//     throw new Error("Post Type Analysis data is missing or malformed in the response.");
//   }

//   const postTypeAnalysis = JSON.parse(postTypeMatch[1]);

//   if (
//     !postTypeAnalysis?.metrics?.likes ||
//     !Array.isArray(postTypeAnalysis.metrics.likes) ||
//     !postTypeAnalysis.metrics.shares ||
//     !Array.isArray(postTypeAnalysis.metrics.shares) ||
//     !postTypeAnalysis.metrics.comments ||
//     !Array.isArray(postTypeAnalysis.metrics.comments)
//   ) {
//     throw new Error("Post Type Analysis metrics are missing or malformed.");
//   }

//   setPostTypeData(
//     postTypeAnalysis.metrics.likes.map((_, index) => ({
//       index: index + 1,
//       likes: postTypeAnalysis.metrics.likes[index],
//       shares: postTypeAnalysis.metrics.shares[index],
//       comments: postTypeAnalysis.metrics.comments[index],
//     }))
//   );

//   // Extract Top Post
  // const topPostMatch = responseText.match(/Top Post:\*\*\s*```json\s*(\{.*?\})\s*```/s);
  // if (!topPostMatch || !topPostMatch[1]) {
  //   throw new Error("Top Post data is missing or malformed.");
  // }

  // const topPostData = JSON.parse(topPostMatch[1]);
  // setTopPost(topPostData);

//   // Extract Metric Correlation
//   const metricCorrelationMatch = responseText.match(/Metric Correlation:\*\*\s*```json\s*(\{.*?\})\s*```/s);
//   if (!metricCorrelationMatch || !metricCorrelationMatch[1]) {
//     throw new Error("Metric Correlation data is missing or malformed.");
//   }

//   const insightsSection = responseText.match(/Insights:\*\*\s*(.*?)(?=Data for Graphs:)/s)?.[1] || "";
// const extractedInsights = insightsSection.trim();
// setInsights(extractedInsights);

// const recommendationsSection = responseText.match(/Recommendations:\*\*\s*(.*)$/s)?.[1] || "";
// const extractedRecommendations = recommendationsSection.trim().split("\n").map((rec) => rec.trim());
// setRecommendations(extractedRecommendations);

//   const metricCorrelationData = JSON.parse(metricCorrelationMatch[1]);
//   setMetricCorrelation(
//     Object.entries(metricCorrelationData).map(([key, value]) => ({
//       metric: key,
//       correlation: value,
//     }))
//   );
//   calculateAverages(postTypeAnalysis.metrics);
//   setShowGraphs(true);
// } catch (error) {
//   console.error("Error during generation:", error);
//   alert("Failed to generate insights. Please try again.");
// } finally {
//   setLoading(false);
// }
// };

// const calculateAverages = (metrics) => {
//   const averageLikes = metrics.likes.reduce((a, b) => a + b, 0) / metrics.likes.length;
//   const averageShares = metrics.shares.reduce((a, b) => a + b, 0) / metrics.shares.length;
//   const averageComments = metrics.comments.reduce((a, b) => a + b, 0) / metrics.comments.length;
//   const averageEngagement = metrics.engagement_rate.reduce((a, b) => a + b, 0) / metrics.engagement_rate.length;

//   setAverages({
//     likes: averageLikes.toFixed(2),
//     shares: averageShares.toFixed(2),
//     comments: averageComments.toFixed(2),
//     engagement_rate: averageEngagement.toFixed(2),
//   });
// };


//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
//       <header className="py-6">
//         <h1 className="text-3xl font-bold text-center">EngageIQ</h1>
//       </header>

//       <main className="container mx-auto px-4">
//         <div className="mb-4">
//           <label htmlFor="customQuestion" className="block text-lg font-medium">
//             Enter your query:
//           </label>
//           <textarea
//             id="customQuestion"
//             className="w-full mt-2 p-3 bg-gray-800 text-white rounded"
//             rows="4"
//             value={customQuestion}
//             onChange={(e) => setCustomQuestion(e.target.value)}
//           />
//         </div>

//         <button
//           className="w-full py-3 bg-blue-600 rounded hover:bg-blue-500 disabled:opacity-50"
//           onClick={handleGenerate}
//           disabled={loading}
//         >
//           {loading ? "Generating..." : "Generate Insights"}
//         </button>

//         {showGraphs && (
//           <div className="mt-8">
//             <h2 className="text-2xl font-bold">Insights</h2>
//             <div className="max-w-2xl mx-auto p-6 bg-gray-700 rounded-lg shadow-lg mt-8">
//                 <h3 className="text-lg font-semibold text-white mb-4">
//                   Reels Insights
//                 </h3>
//                 <div className="text-sm text-gray-400">
//                   <ul className="list-disc pl-6 space-y-2">
//                     {/* Map through insights and render each line as a bullet point */}
//                     {insights.split("\n").map((line, index) => (
//                       <li key={index}>{line}</li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>

//               {/* Recommendations Card */}
//               <div className="max-w-2xl mx-auto p-6 bg-gray-700 rounded-lg shadow-lg mt-8">
//                 <h3 className="text-lg font-semibold text-white mb-4">
//                   Recommendations
//                 </h3>
//                 <div className="text-sm text-gray-400">
//                   {recommendations.length > 0 ? (
//                     <div className="flex space-x-6 overflow-x-auto">
//                       {recommendations.map((rec, index) => (
//                         <div
//                           key={index}
//                           className="bg-gray-600 p-4 rounded-lg shadow-md hover:bg-gray-500 transition-all duration-300 w-64"
//                         >
//                           <p className="text-center text-white">{rec}</p>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <p>No recommendations available.</p>
//                   )}
//                 </div>
//               </div>
//             <div className="mt-8">
//               <h3 className="text-xl font-bold">Post Type Analysis</h3>
//               <LineChart
//                 width={600}
//                 height={300}
//                 data={postTypeData}
//                 margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="index" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line type="monotone" dataKey="likes" stroke="#8884d8" />
//                 <Line type="monotone" dataKey="shares" stroke="#82ca9d" />
//                 <Line type="monotone" dataKey="comments" stroke="#ffc658" />
//               </LineChart>
//             </div>
//             <div className="mt-4">
//               <h3 className="text-xl font-bold">Average Metrics</h3>
//               <div className="p-4 bg-gray-800 rounded-lg">
//                 <p>Average Likes: {averages.likes}</p>
//                 <p>Average Shares: {averages.shares}</p>
//                 <p>Average Comments: {averages.comments}</p>
//                 <p>Average Engagement Rate: {averages.engagement_rate}%</p>
//               </div>
//             </div>
//             <div className="mt-8">
//               <h3 className="text-xl font-bold">Top Post</h3>
//               {topPost && (
//                 <div className="p-4 bg-gray-800 rounded-lg">
//                  <h3 className="text-lg font-semibold text-white mb-4">
// Post Type: {topPost.post_type}
// </h3>
// <div className="bg-gray-600 p-6 rounded-lg shadow-lg">
//   <div className="flex items-center space-x-6">
//     {/* Likes */}
//     <div className="flex items-center text-white">
//       <FaThumbsUp className="w-6 h-6 text-blue-500 mr-2" />
//       <p>
//         <strong>Likes:</strong>{" "}
//         {topPost.likes}
//       </p>
//     </div>

//     {/* Shares */}
//     <div className="flex items-center text-white">
//       <FaShareAlt className="w-6 h-6 text-blue-500 mr-2" />
//       <p>
//         <strong>Shares:</strong>{" "}
//         {topPost.shares}
//       </p>
//     </div>

//     {/* Shares */}
//     <div className="flex items-center text-white">
//       <FaShareAlt className="w-6 h-6 text-blue-500 mr-2" />
//       <p>
//         <strong>Comments:</strong>{" "}
//         {topPost.comments}
//       </p>
//     </div>

//     {/* Engagement Rate */}
//     <div className="flex items-center text-white">
//       <FaChartLine className="w-6 h-6 text-green-500 mr-2" />
//       <p>
//         <strong>Engagement Rate:</strong>{" "}
//         {topPost.engagement_rate}%
//       </p>
//     </div>
//   </div>
// </div>
//                 </div>


//               )}
//             </div>

//             <div className="mt-8">
//               <h3 className="text-xl font-bold">Metric Correlation</h3>
//               <BarChart width={600} height={300} data={metricCorrelation}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="metric" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="correlation" fill="#8884d8" />
//               </BarChart>
//             </div>

//             {metricCorrelation.length > 0 && (
//                 <div className="mt-8">
//                   <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-full">
//                     {/* Title for the Radar Chart */}
//                     <h2 className="text-lg font-semibold text-white mb-4">
//                       Metric Correlation Analysis
//                     </h2>

//                     <div className="flex justify-center">
//                       <RadarChart
//                         cx="50%"
//                         cy="50%"
//                         outerRadius="80%"
//                         width={300}
//                         height={300}
//                         data={metricCorrelation}
//                       >
//                         <PolarGrid />
//                         <PolarAngleAxis dataKey="metric" />
//                         <PolarRadiusAxis angle={30} domain={[0, 1]} />
//                         <Radar
//                           name="Metrics"
//                           dataKey="value"
//                           stroke="#8884d8"
//                           fill="#8884d8"
//                           fillOpacity={0.6}
//                         />
//                       </RadarChart>
//                     </div>

//                     <p className="mt-4 text-sm text-gray-400 text-center">
//                       Correlation between metrics (Higher values indicate
//                       stronger correlation)
//                     </p>
//                   </div>
//                 </div>
//               )}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default App;
import React, { useState } from "react";
import LangflowClient from "./components/LangflowClient";
import Graphs from "./components/Graphs";

const App = () => {
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

export default App;
