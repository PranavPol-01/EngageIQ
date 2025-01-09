import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
} from "recharts";

const App = () => {
  const [postTypeData, setPostTypeData] = useState([]);
  const [topPostsData, setTopPostsData] = useState([]);
  const [showGraphs, setShowGraphs] = useState(false);
  const [metricCorrelationData, setMetricCorrelationData] = useState([]);
  const [insights, setInsights] = useState({});
  const [recommendations, setRecommendations] = useState([]);

  // Raw response data
  const response = `Answer: Based on the provided JSON data, here are the stats for Reels by the username "beerbiceps":
Total Reels: 20
Total Likes: 31,420,000
Total Shares: 61,419
Total Comments: 71,319
Average Engagement Rate: 34.5% (calculated using the provided formula)
Insights:
The Reels by "beerbiceps" have a high average engagement rate of 34.5%.
The top-performing Reel has 28,800 shares and an engagement rate of 35.7%.
The Reel with the most likes is the one with 3,200,000 likes.
Data for Graphs:
Post Type Analysis:
json

{
  "Post Type": ["Reel"],
  "Average Engagement Rate": [34.5],
  "Average Likes": [1632000],
  "Average Shares": [3064.5],
  "Average Comments": [3565.95]
}
Top Posts:
json

{
  "Post ID": ["CuzjwhOgwtg"],
  "Caption": ["Unavailable"],
  "Post Type": ["Reel"],
  "Likes": [2800000],
  "Shares": [28800],
  "Comments": [0],
  "Engagement Rate": [35.7]
}
Metric Correlation:
json

{
  "Likes vs. Shares": [0.95],
  "Shares vs. Engagement Rate": [0.85],
  "Comments vs. Engagement Rate": [0.78]
}
Recommendations:
Continue creating engaging Reels with high-quality content to maintain a high engagement rate.
Analyze the top-performing Reel to understand the factors contributing to its success.
Consider experimenting with different post types to diversify engagement and reach.`;

  // Function to extract relevant data from the response string
  const extractDataFromResponse = () => {
    const postTypeSection = response.match(/Data for Graphs:\s*Post Type Analysis:\s*json\s*({.*?})/s)?.[1];
    const topPostsSection = response.match(/Top Posts:\s*json\s*({.*?})/s)?.[1];
    const metricCorrelationSection = response.match(/Metric Correlation:\s*json\s*({.*?})/s)?.[1];
    const insightsSection = response.match(/Insights:\s*(.*?)Recommendations:/s)?.[1];
    const recommendationsSection = response.match(/Recommendations:\s*(.*)$/s)?.[1];

    if (postTypeSection && topPostsSection && metricCorrelationSection && insightsSection && recommendationsSection) {
      try {
        const postTypeJson = JSON.parse(postTypeSection.trim());
        const topPostsJson = JSON.parse(topPostsSection.trim());
        const metricCorrelationJson = JSON.parse(metricCorrelationSection.trim());

        // Set state with formatted data
        const formattedPostTypeData = postTypeJson["Post Type"].map((type, index) => ({
          postType: type,
          averageEngagementRate: postTypeJson["Average Engagement Rate"][index],
          averageLikes: postTypeJson["Average Likes"][index],
          averageShares: postTypeJson["Average Shares"][index],
          averageComments: postTypeJson["Average Comments"][index],
        }));

        const formattedTopPostsData = topPostsJson["Post ID"].map((id, index) => ({
          postID: id,
          caption: topPostsJson["Caption"][index],
          postType: topPostsJson["Post Type"][index],
          likes: topPostsJson["Likes"][index],
          shares: topPostsJson["Shares"][index],
          comments: topPostsJson["Comments"][index],
          engagementRate: topPostsJson["Engagement Rate"][index],
        }));

        const formattedMetricCorrelationData = Object.keys(metricCorrelationJson).map(key => ({
          metric: key,
          value: metricCorrelationJson[key][0],
        }));

        // Extract insights and recommendations
        const extractedInsights = insightsSection.trim();
        const extractedRecommendations = recommendationsSection.trim().split("\n").map(rec => rec.trim());

        // Set state with the formatted data and insights
        setPostTypeData(formattedPostTypeData);
        setTopPostsData(formattedTopPostsData);
        setMetricCorrelationData(formattedMetricCorrelationData);
        setInsights(extractedInsights); // Set insights
        setRecommendations(extractedRecommendations); // Set recommendations
        setShowGraphs(true);
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      console.error("Failed to extract valid sections. Check if response format is correct.");
    }
  };

  useEffect(() => {
    extractDataFromResponse();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <header className="py-6">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">EngageIQ</h1>
              <p className="mt-1.5 text-sm text-gray-400">Insights-Driven Social Media Analysis</p>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4">
        <div className="max-w-2xl mx-auto p-8 bg-gray-800 rounded-lg shadow-md mt-8">
          {showGraphs && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-white mb-4">Insights & Graphs</h2>

              {/* Insights Card */}
              <div className="max-w-2xl mx-auto p-6 bg-gray-700 rounded-lg shadow-lg mt-8">
                <h3 className="text-lg font-semibold text-white mb-4">Reels Insights</h3>
                <div className="text-sm text-gray-400">
                  <p>{insights}</p>
                </div>
              </div>

              {/* Recommendations Card */}
              <div className="max-w-2xl mx-auto p-6 bg-gray-700 rounded-lg shadow-lg mt-8">
                <h3 className="text-lg font-semibold text-white mb-4">Recommendations</h3>
                <div className="text-sm text-gray-400">
                  {recommendations.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No recommendations available.</p>
                  )}
                </div>
              </div>

              {/* Bar Chart for Post Type Analysis */}
              {postTypeData.length > 0 && (
                <div className="mt-8">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {postTypeData.map((data, index) => (
                      <div key={index} className="bg-gray-700 p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold text-white mb-4">{data.postType}</h3>
                        <div className="text-sm text-gray-400">
                          <p><strong>Average Engagement Rate:</strong> {data.averageEngagementRate}%</p>
                          <p><strong>Average Likes:</strong> {data.averageLikes.toLocaleString()}</p>
                          <p><strong>Average Shares:</strong> {data.averageShares.toLocaleString()}</p>
                          <p><strong>Average Comments:</strong> {data.averageComments.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Posts Data */}
              {topPostsData.length > 0 ? (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Top Posts - Engagement (Likes & Shares)</h3>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {topPostsData.map((post, index) => (
                      <div key={index} className="bg-gray-700 p-6 rounded-lg shadow-lg">
                        <h4 className="text-xl font-semibold text-white mb-4">{post.postID}</h4>
                        <div className="text-sm text-gray-400">
                          <p><strong>Likes:</strong> {post.likes.toLocaleString()}</p>
                          <p><strong>Shares:</strong> {post.shares.toLocaleString()}</p>
                          <p><strong>Engagement Rate:</strong> {post.engagementRate}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p>No top posts available.</p>
              )}

              {/* Radar Chart for Metric Correlation */}
              {metricCorrelationData.length > 0 && (
                <div className="mt-8">
                  <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" width={300} height={300} data={metricCorrelationData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metric" />
                      <PolarRadiusAxis angle={30} domain={[0, 1]} />
                      <Radar name="Metrics" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    </RadarChart>
                    <p className="mt-4 text-sm text-gray-400">Correlation between metrics (Higher values indicate stronger correlation)</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
