import React from "react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
          Welcome to the Landing Page
        </h1>
        <p className="text-gray-600 mb-2">
          Here you can find all the information you need about the project.
        </p>
        <p className="text-gray-600 mb-4">
          Here is a list of all the features:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li>Feature 1</li>
          <li>Feature 2</li>
          <li>Feature 3</li>
        </ul>
      </div>
    </div>
  );
}
