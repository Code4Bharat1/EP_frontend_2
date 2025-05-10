"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaClipboardList, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { FiClock, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

// Pending Test Card Component
const PendingTestCard = ({ selectedFilter }) => {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingTests = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("authToken");

        if (!token) {
          setError("Authentication required.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/pending`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const responseData = response.data;

        // If response is a message object or no tests
        if (!Array.isArray(responseData)) {
          setMessage(responseData.message || "You're all caught up with your tests!");
          setLoading(false);
          return;
        }

        const pendingTestsData = responseData.filter((test) => test.status === "pending");

        if (pendingTestsData.length > 0) {
          const formattedData = pendingTestsData.map((test) => ({
            testName: test.testName || "Pending Test",
            updatedAt: new Date(test.updatedAt),
            timeAgo: formatDistanceToNow(new Date(test.updatedAt), { addSuffix: true }),
            dueDate: test.dueDate ? new Date(test.dueDate) : null,
            dueSoon: test.dueDate
              ? (new Date(test.dueDate) - new Date()) / (1000 * 60 * 60 * 24) < 3
              : false,
            icon: <FaClipboardList />,
            bgColor: "bg-amber-100 text-amber-600",
          }));

          formattedData.sort((a, b) => b.updatedAt - a.updatedAt);
          setData(formattedData);
        } else {
          setMessage("You're all caught up with your tests!");
        }

        setLoading(false);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Pending tests fetch error:", error.message);
        }

        // Custom error message based on status code
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            setMessage("No pending tests found.");
          } else {
            setError("We couldn't load your pending tests. Please try again later.");
          }
        } else {
          setError("An unexpected error occurred.");
        }

        setLoading(false);
      }
    };

    fetchPendingTests();
  }, [selectedFilter]);


  // Loading state
  if (loading) {
    return (
      <Card className="w-full max-w-md h-96 overflow-hidden bg-white border border-gray-200 shadow-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-lg font-semibold text-[#333B69] flex items-center gap-2 justify-center">
            <FaClipboardList className="text-blue-500" />
            Pending Tests
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-80 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center p-4 bg-gray-50 rounded-xl animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="ml-4 flex-1">
                <div className="h-4 bg-gray-200 w-32 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 w-24 rounded"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="w-full max-w-md h-96 overflow-hidden bg-white border border-gray-200 shadow-sm">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-lg font-semibold text-[#333B69] flex items-center gap-2 justify-center">
            <FaClipboardList className="text-blue-500" />
            Pending Tests
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-72 text-center">
          <FiAlertCircle className="text-amber-500 text-4xl mb-3" />
          <h3 className="text-lg font-semibold text-gray-800 mb-1">Data Unavailable</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Refresh
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md h-96 overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg font-semibold text-[#333B69] flex items-center gap-2 justify-center">
          <FaClipboardList className="text-blue-500" />
          Pending Tests
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto max-h-80">
        {/* If no pending tests, show congratulatory message */}
        {message ? (
          <div className="flex flex-col items-center justify-center h-64 text-center px-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <FiCheckCircle className="text-green-500 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{message}</h3>
            <p className="text-gray-600 text-sm">
              You're all caught up with your tests. Great job staying on top of your work!
            </p>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
              Browse Available Tests
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {data.map((item, index) => (
              <div
                key={index}
                className="flex items-center p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                {/* Icon with Background */}
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                  {item.icon}
                </div>

                {/* Test Name & Date */}
                <div className="ml-4 flex-1">
                  <h3 className="text-sm font-semibold text-gray-800">{item.testName}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FiClock size={12} />
                    <span>Last Updated: {item.timeAgo}</span>
                  </div>

                  {item.dueDate && (
                    <div className="mt-1 text-xs">
                      <span className={`px-2 py-0.5 rounded-full ${item.dueSoon ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"
                        }`}>
                        Due: {item.dueDate.toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status indicator */}
                {item.dueSoon ? (
                  <FaExclamationTriangle className="text-red-500" />
                ) : (
                  <FaClipboardList className="text-gray-400" />
                )}
              </div>
            ))}

            {/* Action button at the bottom */}
            <div className="pt-3 flex justify-center">
              <button className="w-full py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors text-sm">
                View All Pending Tests
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingTestCard;