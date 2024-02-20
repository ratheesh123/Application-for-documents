import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import 'animate.css'; // Make sure to install animate.css with npm install animate.css



function HomePage() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-no-repeat bg-center bg-black"
      style={{
        backgroundImage: "url('/mybg.png')" // Replace with the path to your image
      }}
    >
      <div className="text-center animate__animated animate__fadeIn">
        <h1 className="text-6xl font-bold text-white mb-4">Effortless Legal Assistance Rat</h1>
        <p className="text-xl text-gray-300 mb-8">Simplify Your Legal Journey with Quick Answers and Document Submission</p>
        <div className="animate__animated animate__pulse animate__infinite">
          <ChevronRightIcon className="h-8 w-8 text-blue-300 mx-auto" />
        </div>
      </div>
      <div className="mt-8 space-x-4 animate__animated animate__fadeInUp">
        <Link to="/register">
          <button className="px-8 py-3 text-white bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Get Started
          </button>
        </Link>
        <Link to="/login">
          <button className="px-8 py-3 text-blue-300 border border-blue-300 rounded-lg shadow-lg hover:bg-blue-100 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Log In
          </button>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
