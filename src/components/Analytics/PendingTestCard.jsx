"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaClipboardList, FaCheckCircle } from "react-icons/fa"; // Updated Icons
import axios from "axios";

// Pending Test Card Component
const PendingTestCard = ({ selectedFilter }) => {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPendingTests = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Get the token from localStorage
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard/pending`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Filter the pending tests
        const pendingTestsData = response.data.filter(
          (test) => test.status === "pending"
        );

        if (pendingTestsData.length > 0) {
          // Format data for the UI
          const formattedData = pendingTestsData.map((test) => ({
            testName: test.testName,
            updatedAt: new Date(test.updatedAt).toLocaleDateString(), // Format updatedAt date
            icon: <FaClipboardList />,
            bgColor: "bg-yellow-100", // Default background color for "pending"
          }));

          setData(formattedData);
        } else {
          setMessage("Congratulations, you have no pending test, keep it up!");
        }
      } catch (error) {
        console.error("Error fetching pending tests:", error);
        setMessage("Failed to load pending tests. Please try again.");
      }
    };

    fetchPendingTests();
  }, [selectedFilter]);

  return (
    <Card className="w-full max-w-md h-96 overflow-hidden">
      <CardHeader className="text-center">
        <CardTitle className="text-lg font-semibold text-[#333B69]">
          Pending Test
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-y-auto max-h-80">
        {/* If no pending tests, show congratulatory message */}
        {message ? (
          <div className="text-center text-lg text-green-500 mt-6">
            {message}
          </div>
        ) : (
          <div>
            {data.map((item, index) => (
              <div key={index} className="flex items-center py-3">
                {/* Icon with Background */}
                <div
                  className={`w-14 h-14 flex items-center justify-center ${item.bgColor} rounded-xl`}
                >
                  {item.icon}
                </div>

                {/* Test Name & Date */}
                <div className="ml-6">
                  <h3 className="text-md font-semibold text-gray-800">
                    {item.testName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Last Updated: {item.updatedAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingTestCard;
