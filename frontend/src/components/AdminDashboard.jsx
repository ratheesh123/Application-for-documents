import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";

import { ArrowDownIcon } from "@heroicons/react/24/outline"; // Example alternative

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [openUserId, setOpenUserId] = useState(null);
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchUsers();
    }
  }, [user, navigate, fetchUsers]);

  const deleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        });
        alert("User deleted successfully");
        fetchUsers(); // Refresh the user list after deletion
      } catch (error) {
        console.error("Delete user error:", error);
        alert("Failed to delete user");
      }
    }
  };
  // New function to toggle user details visibility
  const toggleUserDetails = (userId) => {
    setOpenUserId(openUserId === userId ? null : userId);
  };

  const deleteDocument = async (userId, docId) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await axios.delete(`/api/documents/${docId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        });
        alert("Document deleted successfully");
        // After deletion, refresh the user's documents list
        fetchUsers(); // This might need to be adjusted to only update the affected user's data
      } catch (error) {
        console.error("Delete document error:", error);
        alert("Failed to delete document");
      }
    }
  };

  const sendEmail = async () => {
    try {
      const response = await axios.post(
        "/api/send-email",
        {
          to: email,
          subject: subject,
          text: message,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      alert(response.data.message);
    } catch (error) {
      alert("Failed to send email");
      console.error("Error sending email:", error);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-5">
        Admin Dashboard - <span className="mr-5">Welcome, {user.name}!</span>
      </h1>
      {users.length > 0 ? (
        users.map((user) => (
          <div
            key={user._id}
            className="mb-4 bg-white shadow overflow-hidden sm:rounded-md"
          >
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
              <button
                onClick={() => toggleUserDetails(user._id)}
                className="text-left group flex items-center text-xl font-semibold text-indigo-600 focus:outline-none"
              >
                {user.name}'s Documents
                {openUserId === user._id ? (
                  <ChevronUpIcon className="ml-2 h-5 w-5 text-indigo-600 group-hover:text-indigo-800 transition-colors duration-200" />
                ) : (
                  <ChevronDownIcon className="ml-2 h-5 w-5 text-indigo-600 group-hover:text-indigo-800 transition-colors duration-200" />
                )}
              </button>
              <button
                onClick={() => deleteUser(user._id)}
                className="flex items-center px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition duration-150 ease-in-out"
              >
                <TrashIcon className="h-5 w-5 mr-2" />
                Delete User
              </button>
            </div>
            {openUserId === user._id && (
              <div className="bg-gray-50 px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {user.documents.length > 0 ? (
                    user.documents.map((doc) => (
                      <div
                        key={doc._id}
                        className="bg-white p-4 rounded-lg shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {doc.title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {doc.fileName}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                              Uploaded on:{" "}
                              {new Date(doc.createdAt).toLocaleDateString()} at{" "}
                              {new Date(doc.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <a
                              href={`/uploads/${doc.fileName}`}
                              download={doc.fileName}
                              className="flex items-center justify-center px-2 py-1 bg-blue-500 hover:bg-blue-700 text-white font-medium rounded transition duration-150 ease-in-out"
                            >
                              <ArrowDownIcon className="h-5 w-5" />
                            </a>

                            <button
                              onClick={() => deleteDocument(user._id, doc._id)}
                              className="flex items-center justify-center px-2 py-1 bg-red-500 hover:bg-red-700 text-white font-medium rounded transition duration-150 ease-in-out"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      This user has no documents.
                    </p>
                  )}
                </div>

                {/* Enhanced Additional Info Section */}
                <div className="mt-8 bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 border-gray-200">
                    Additional Info:
                  </h3>
                  <p className="text-gray-600 text-sm mt-2">
                    {user.additionalInfo ||
                      "No additional information provided."}
                  </p>
                </div>

                {/* Conditional Rendering for Email Form */}
                {showEmailForm && (
                  <div className="mt-6 bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Send Email:
                    </h3>
                    <div className="space-y-4">
                      <input
                        type="email"
                        placeholder="User's email"
                        value={user.email} // Assuming `user.email` holds the user's email address
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        disabled={true} // This disables the input field
                      />
                      <input
                        type="text"
                        placeholder="Subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <textarea
                        placeholder="Message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        rows="4"
                      ></textarea>
                      <button
                        onClick={sendEmail}
                        className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:bg-indigo-700"
                      >
                        Send Email
                      </button>
                    </div>
                  </div>
                )}

                {/* Toggle Email Form Button */}
                <button
                  onClick={() => setShowEmailForm(!showEmailForm)}
                  className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-md transition duration-150 ease-in-out"
                >
                  {showEmailForm ? "Hide Email Form" : "Send Email"}
                  <svg
                    className="-mr-1 ml-2 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    {showEmailForm ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16m-7 6h7"
                      />
                    )}
                  </svg>
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">
            No users have uploaded documents yet.
          </p>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
