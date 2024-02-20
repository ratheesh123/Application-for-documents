import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import jwt_decode from "jwt-decode";
import decorativeShape from "../assets/bg-shape.png"; // Adjust the path as necessary
import { ShieldCheckIcon, SunIcon, BoltIcon } from "@heroicons/react/24/outline"; // or '@heroicons/react/20/outline'


// ... rest of your component

function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    try {
      const response = await axios.post("/api/login", credentials);
      const { token } = response.data;
      localStorage.setItem("userToken", token);
      console.log("Token:", token);

      // Assuming login function updates app context/state and maybe stores the token
      login(token); // Pass the token to login function to handle context/state update

      const decodedToken = jwt_decode(token);
      console.log("Decoded Token:", decodedToken);

      // Set user data with decoded token information
      login({
        name: decodedToken.name, // Make sure the token has a 'name' claim
        role: decodedToken.role, // Ensure there's a 'role' claim
        id: decodedToken.userId, // And an 'id' or similar identifier
      });

      // Redirect based on the role
      if (decodedToken.role === "admin") {
        console.log("Redirecting to admin dashboard");
        navigate("/admindashboard");
      } else {
        console.log("Redirecting to user dashboard");
        navigate("/userdashboard");
      }
    } catch (error) {
      const message = error.response?.data?.message ?? "Login failed";
      setErrorMessage(message);
    }
  };

  const FeatureItem = ({ Icon, title }) => {
    return (
      <div className="flex items-center p-4 bg-white shadow-md rounded-lg mb-4">
        <Icon className="h-8 w-8 text-blue-500 mr-3" />
        <div>
          <h5 className="text-lg font-semibold">{title}</h5>
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="relative flex w-full max-w-md sm:max-w-xl lg:max-w-4xl mx-auto">
        {/* Decorative Shape */}
        <img
          src={decorativeShape}
          className="absolute right-0 lg:-top-12 lg:-right-12 md:w-48 z-0"
          alt="Decorative Shape"
          style={{ width: "200px" }} // Adjust this as needed to get the full image visible
        />

        {/* Left Side with Gradient */}
        <div className="hidden lg:block lg:w-1/2 bg-gradient-to-r from-blue-500 to-blue-700 p-12 rounded-l-lg">
          <h2 className="text-white text-4xl font-bold mb-2">Free Sign Up</h2>
          <h3 className="text-white text-xl mb-10">
            Begin Your Legal Consultation Today
          </h3>
          <a
            href="/register"
            className="inline-block px-6 py-3 mt-2 text-sm font-medium leading-6 text-center text-white uppercase transition bg-blue-500 border border-transparent rounded-full shadow ripple hover:bg-blue-600 focus:outline-none"
          >
            Create An Account
          </a>

          <div className="mt-6 grid grid-cols-1 gap-y-3 gap-x-4">
            <FeatureItem Icon={BoltIcon} title="Fast-Track" />
            <FeatureItem Icon={ShieldCheckIcon} title="Secure Document" />
            <FeatureItem Icon={SunIcon} title="Expert Support" />
          </div>
        </div>

        {/* Right Side with Login Form */}
        <div className="w-full lg:w-1/2 bg-white p-5 rounded-r-lg">
          <div className="px-8 mt-8">
            <h2 className="text-2xl font-bold text-center text-gray-700 justify-center">
              Log in
            </h2>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign in
                </button>
              </div>
              {errorMessage && (
                <div className="text-red-500 text-center mt-2">
                  {errorMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
