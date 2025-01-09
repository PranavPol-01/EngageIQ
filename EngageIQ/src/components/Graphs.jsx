// import React from "react";
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
// } from "recharts";
// import { FaChartLine, FaThumbsUp, FaShareAlt, FaComment } from "react-icons/fa";
// const Graphs = ({ postTypeData, metricCorrelation, topPost, insights, recommendations, averages }) => {
//   return (
//     <div>
//       <h2 className="text-2xl font-bold text-center">Graphs and Insights</h2>
//       <div className="mt-8">
//         <h3 className="text-xl font-bold">Post Type Analysis</h3>
//         <LineChart width={600} height={300} data={postTypeData}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="index" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Line type="monotone" dataKey="likes" stroke="#8884d8" />
//           <Line type="monotone" dataKey="shares" stroke="#82ca9d" />
//           <Line type="monotone" dataKey="comments" stroke="#ffc658" />
//         </LineChart>
//       </div>

//       <div className="mt-4">
//         <h3 className="text-xl font-bold">Average Metrics</h3>
//         <div className="p-4 bg-gray-800 rounded-lg">
//           <p>Average Likes: {averages.likes}</p>
//           <p>Average Shares: {averages.shares}</p>
//           <p>Average Comments: {averages.comments}</p>
//           <p>Average Engagement Rate: {averages.engagement_rate}%</p>
//         </div>
//       </div>

//       <div className="mt-8">
//         <h3 className="text-xl font-bold">Top Post</h3>
// {topPost && (
//    <div className="p-4 bg-gray-800 rounded-lg">
//                       <h3 className="text-lg font-semibold text-white mb-4">
//      Post Type: {topPost.post_type}
//      </h3>
//      <div className="bg-gray-600 p-6 rounded-lg shadow-lg">
//        <div className="flex items-center space-x-6">
//          {/* Likes */}
//          <div className="flex items-center text-white">
//            <FaThumbsUp className="w-6 h-6 text-blue-500 mr-2" />
//            <p>
//              <strong>Likes:</strong>{" "}
//              {topPost.likes}
//            </p>
//          </div>

//          {/* Shares */}
//          <div className="flex items-center text-white">
//            <FaShareAlt className="w-6 h-6 text-blue-500 mr-2" />
//            <p>
//              <strong>Shares:</strong>{" "}
//              {topPost.shares}
//            </p>
//          </div>

//          {/* Shares */}
//          <div className="flex items-center text-white">
//            <FaShareAlt className="w-6 h-6 text-blue-500 mr-2" />
//            <p>
//              <strong>Comments:</strong>{" "}
//              {topPost.comments}
//            </p>
//          </div>

//          {/* Engagement Rate */}
//          <div className="flex items-center text-white">
//            <FaChartLine className="w-6 h-6 text-green-500 mr-2" />
//            <p>
//              <strong>Engagement Rate:</strong>{" "}
//              {topPost.engagement_rate}%
//            </p>
//          </div>
//        </div>
//      </div>
//      </div>
// )}
//       </div>

//       <div className="mt-8">
//         <h3 className="text-xl font-bold">Metric Correlation</h3>
//         <BarChart width={600} height={300} data={metricCorrelation}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="metric" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="correlation" fill="#8884d8" />
//         </BarChart>
//       </div>
//     </div>
//   );
// };

// export default Graphs;
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { FaChartLine, FaThumbsUp, FaShareAlt, FaComment } from "react-icons/fa";

const Graphs = ({
  postTypeData,
  metricCorrelation,
  topPost,
  insights,
  recommendations,
  averages
}) => {
  return (
    <div>
      <h2 className="mt-8 text-2xl font-bold text-center">Graphs and Insights</h2>




      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">

        {/* Post Type Analysis */}
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">Post Type Analysis</h3>
            <LineChart width={600} height={300} data={postTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="likes" stroke="#8884d8" />
              <Line type="monotone" dataKey="shares" stroke="#82ca9d" />
              <Line type="monotone" dataKey="comments" stroke="#ffc658" />
            </LineChart>
          </div>
        </div>

        {/* Average Metrics */}
        <div className="mt-4 w-full max-w-3xl">
          <h3 className="text-xl font-bold text-center mb-6">Average Metrics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Average Likes */}
            <div className="p-6 bg-gray-800 rounded-lg text-center shadow-lg hover:shadow-2xl transition-shadow">
              <p className="text-lg font-semibold text-gray-300">Average Likes</p>
              <p className="text-2xl font-bold text-white">{averages.likes}</p>
            </div>

            {/* Average Shares */}
            <div className="p-6 bg-gray-800 rounded-lg text-center shadow-lg hover:shadow-2xl transition-shadow">
              <p className="text-lg font-semibold text-gray-300">Average Shares</p>
              <p className="text-2xl font-bold text-white">{averages.shares}</p>
            </div>

            {/* Average Comments */}
            <div className="p-6 bg-gray-800 rounded-lg text-center shadow-lg hover:shadow-2xl transition-shadow">
              <p className="text-lg font-semibold text-gray-300">Average Comments</p>
              <p className="text-2xl font-bold text-white">{averages.comments}</p>
            </div>

            {/* Average Engagement Rate */}
            <div className="p-6 bg-gray-800 rounded-lg text-center shadow-lg hover:shadow-2xl transition-shadow">
              <p className="text-lg font-semibold text-gray-300">Engagement Rate</p>
              <p className="text-2xl font-bold text-white">{averages.engagement_rate}%</p>
            </div>
          </div>
        </div>


        {/* Top Post */}
        <div className="mt-4 w-full max-w-3xl">
  <h3 className="text-xl font-bold text-center mt-4">Top Post</h3>
  {topPost && (
    <div className="p-4 m-3 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-4">
        Post Type: {topPost.post_type}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-600 p-6 rounded-lg shadow-lg">
        {/* Likes */}
        <div className="flex flex-col items-center text-white">
          <FaThumbsUp className="w-10 h-10 text-blue-500 mb-2" />
          <p>
            <strong>Likes:</strong> {topPost.likes}
          </p>
        </div>

        {/* Shares */}
        <div className="flex flex-col items-center text-white">
          <FaShareAlt className="w-10 h-10 text-blue-500 mb-2" />
          <p>
            <strong>Shares:</strong> {topPost.shares}
          </p>
        </div>

        {/* Comments */}
        <div className="flex flex-col items-center text-white">
          <FaShareAlt className="w-10 h-10 text-blue-500 mb-2" />
          <p>
            <strong>Comments:</strong> {topPost.comments}
          </p>
        </div>

        {/* Engagement Rate */}
        <div className="flex flex-col items-center text-white">
          <FaChartLine className="w-10 h-10 text-green-500 mb-2" />
          <p>
            <strong>Engagement Rate:</strong> {topPost.engagement_rate}%
          </p>
        </div>
      </div>
    </div>
  )}
</div>


        {/* Metric Correlation */}
        <div className="mt-8 w-full max-w-3xl">
          <h3 className="text-xl font-bold text-center">Metric Correlation</h3>
          <div className="flex justify-center">
            <BarChart width={600} height={300} data={metricCorrelation}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="correlation" fill="#8884d8" />
            </BarChart>
          </div>
        </div>

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

      </div>



    </div>
  );
};

export default Graphs;
