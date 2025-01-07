import React from "react";

const Graphs = () => {
  return (
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
  );
};

export default Graphs;
