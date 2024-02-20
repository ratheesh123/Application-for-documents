import React, { useState } from "react";
import decorativeShape from "../assets/bg-shape.png"; // Adjust the path as necessary
import { ShieldCheckIcon, SunIcon, BoltIcon } from "@heroicons/react/24/outline"; // or '@heroicons/react/20/outline'

function Register() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isRegistered, setIsRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const emailIsValid = (email) => {
    return /\S+@\S+\.\S+/.test(email); // Simple email validation check
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simple client-side validation for demonstration
    if (user.password !== user.confirmPassword) {
      setErrorMessage("Passwords don't match.");
      return;
    }

    if (!emailIsValid(user.email)) {
      setErrorMessage("Email address is invalid.");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          password: user.password,
          role: "user",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setIsRegistered(true);
        throw new Error(data.message || "Could not register user.");
      }

      setIsRegistered(true);
      setErrorMessage("");
      // Optionally clear the user state if you wish to clear the form
      setUser({ name: "", email: "", password: "", confirmPassword: "" });

      // Optionally redirect to login page or display a success message
      // navigate('/login');

      // Optionally clear the form or redirect the user to the login page
    } catch (error) {
      setIsRegistered(false);
      setErrorMessage(error.message || "Something went wrong!");
    }
  };

  if (isRegistered) {
    // Display success message and/or redirect to login
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Thank you for registering!
        </h2>
        <p className="mt-4 text-center text-lg text-gray-600">
          You can now{" "}
          <a href="/login" className="text-indigo-600 hover:text-indigo-500">
            login
          </a>{" "}
          to your account.
        </p>
        
      </div>
    );
  }

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
          <h2 className="text-white text-4xl font-bold mb-2">
            Your Legal Gateway Awaits
          </h2>
          <h3 className="text-white text-xl mb-10">
            Sign In to Access Your Legal Dashboard
          </h3>
          <a
            href="/login"
            className="inline-block px-6 py-3 mt-2 text-sm font-medium leading-6 text-center text-white uppercase transition bg-blue-500 border border-transparent rounded-full shadow ripple hover:bg-blue-600 focus:outline-none"
          >
            Login
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
            <h2 className="text-2xl font-bold text-center text-gray-700">
              Create your account
            </h2>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {/* Form fields */}
              <div className="rounded-md shadow-sm -space-y-px">
                <div>
                  <label htmlFor="name" className="sr-only">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Full name"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="confirm-password" className="sr-only">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Confirm Password"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Register
                </button>
              </div>
            </form>
            {errorMessage && (
              <p className="text-center py-5 text-red-500">{errorMessage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
