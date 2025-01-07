import React, { useState } from "react";
import LangflowClient from "./components/LangflowClient"; // Import LangflowClient

const App = () => {
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [customQuestion, setCustomQuestion] = useState("");
  const [showGraphs, setShowGraphs] = useState(false);

  // Initialize LangflowClient with the necessary parameters
  const langflowClient = new LangflowClient(
    "/api", // Proxy URL, should match your vite proxy config
    "AstraCS:HUwLTOlOLBGgBkUZahZEZeJF:713d0a3f668c0c0483afac18ff15c93072ec3624eeff818f5f6295521a216957" // Your token
  );

  const flowIdOrName = "0b52bae4-2480-486c-8f56-39ffd996c7f4";
  const langflowId = "a0e03fb4-0bd2-4a8e-8c97-87d09c3e9075";

  const handleGenerate = async () => {
    try {
      await langflowClient.runFlow(
        flowIdOrName,
        langflowId,
        customQuestion,
        "chat",
        "chat",
        {},
        false, // stream = false for non-streaming
        (data) => {
          console.log("Update:", data);
        }, // onUpdate
        (message) => {
          console.log("Close:", message);
        }, // onClose
        (error) => {
          console.error("Error:", error);
        } // onError
      );
      setShowGraphs(true); // Assuming success, show the graphs
    } catch (error) {
      console.error("Error during Langflow API call:", error.message);
      alert("An error occurred while generating the flow. Please try again.");
    }
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

      <main className="px-4">
        <div className="max-w-2xl mx-auto p-8 bg-gray-800 rounded-lg shadow-md mt-8">
          <div>
            <label
              htmlFor="UserEmail"
              className="block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="UserEmail"
              placeholder="john@rhcp.com"
              className="mt-3 w-full rounded-md border border-gray-600 bg-gray-900 text-white shadow-sm sm:text-sm py-3 px-4 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-between my-6">
            <span className="text-sm font-medium text-gray-300">
              Advanced Settings:
            </span>
            <button
              onClick={() => setIsAdvanced(!isAdvanced)}
              className={`relative inline-flex h-8 w-12 items-center rounded-full ${
                isAdvanced ? "bg-blue-600" : "bg-gray-600"
              }`}
            >
              <span
                className={`${
                  isAdvanced ? "translate-x-6" : "translate-x-1"
                } inline-block h-5 w-5 transform rounded-full bg-white transition-transform`}
              ></span>
            </button>
          </div>

          <div className="mb-6">
            <label
              htmlFor="customQuestion"
              className="block text-sm font-medium text-gray-300"
            >
              Custom Question:
            </label>
            <input
              type="text"
              id="customQuestion"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="Enter your custom question"
              className="mt-3 w-full rounded-md border border-gray-600 bg-gray-900 text-white shadow-sm sm:text-sm py-3 px-4 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            onClick={handleGenerate}
            className="w-full py-3 px-6 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Generate
          </button>

          {showGraphs && (
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="h-48 bg-blue-500 text-white flex items-center justify-center rounded-lg font-bold">
                Graph 1
              </div>
              <div className="h-48 bg-green-500 text-white flex items-center justify-center rounded-lg font-bold">
                Graph 2
              </div>
              <div className="h-48 bg-yellow-500 text-white flex items-center justify-center rounded-lg font-bold">
                Graph 3
              </div>
              <div className="h-48 bg-red-500 text-white flex items-center justify-center rounded-lg font-bold">
                Graph 4
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
