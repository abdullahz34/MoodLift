"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { withAuth } from "@/components/WithAuth";

async function getData(date, username) {
  const response = await fetch(
    `http://localhost:3000/api/logging?date=${date}&username=${username}`,
    { cache: "no-store" }
  );
  if (!response.ok) {
    throw new Error("Response for the logging API call failed! (hydration)");
  }
  const data = await response.json();
  console.log("Data from getData:", data);
  // Find the object for the selected date and username
  const item = data.find(
    (item) =>
      new Date(item.date).toDateString() === new Date(date).toDateString() &&
      item.username === username
  );

  // Return the hydration object of the found item, or null if no item was found
  return item ? item.hydration : null;
}

const HydrationTracker = () => {
  const [hydrationData, setHydrationData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [date, setDate] = useState(getFormattedCurrentDate());
  const [waterML, setWaterML] = useState(0);

  const { data: session } = useSession();
  const username = session?.user?.username;

  const fetchData = async () => {
    try {
      setLoading(true);
      const dataPromise = getData(date, username);
      const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 500)); // 500ms minimum loading time
      await Promise.all([dataPromise, timeoutPromise]);
      const data = await dataPromise;
      setHydrationData(data);
      setLoading(false);
      console.log("Data for hydrationData", hydrationData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [date]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000); // Hide the message after 3 seconds

    const hydration = { waterML };

    const response = await fetch("http://localhost:3000/api/logging", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        date,
        hydration,
      }),
    });
    if (!response.ok) {
      throw new Error("Response for the logging API call failed! (hydration)");
    }

    const responseData = await response.json();
    console.log(responseData);
    await fetchData();
  };

  function getFormattedCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Adding 1 to month because it's zero-based
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    console.log("Current date:", date);
    if (date) {
      fetchData();
    }
  }, [date]);

  return (
    <div className="min-h-screen py-12 px-3 bg-white">
      <div className="max-w-[1400px] mx-auto flex h-auto md:h-[620px] rounded-lg overflow-hidden shadow">
        <div className="hidden md:block w-[40%]">
          <img
            src="/hydration.jpg"
            alt="hydration"
            className="w-full h-full bg-center bg-cover"
          />
        </div>

        <div className="w-full md:w-[60%] bg-white flex flex-col py-[70px] px-5 sm:px-32">
          {submitted && (
            <div
              role="alert"
              className="alert alert-success shadow-lg mx-auto mb-6 w-full flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-white text-sm">
                Your hydration has been successfully tracked for this day!
              </span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[#222222] text-base font-semibold">
                  Water (ML)
                </label>
                <input
                  type="number"
                  value={waterML || ""}
                  onChange={(e) => setWaterML(e.target.value)}
                  placeholder="Type here"
                  className="border border-gray-300 mt-1 rounded-[50px] p-3 w-full outline-none font-medium text-base bg-transparent"
                  required
                />
              </div>
              <div>
                <label className="text-[#222222] text-base font-semibold">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border border-gray-300 mt-1 rounded-[50px] p-3 w-full outline-none font-medium text-base bg-transparent"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#ff6801] text-white px-9 h-[45px] text-sm hover:bg-[#cd5300] transition-colors duration-300"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
          <div>
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <span className="loading loading-dots loading-md bg-[#ff6801] mt-10"></span>
              </div>
            ) : hydrationData ? (
              <div>
                <h2 className="text-xl font-semibold mb-4 mt-10">
                  Data logged on this date for hydration:
                </h2>
                <ul>
                  <li className="text-base font-medium">
                    Water(ML):{" "}
                    <span className="font-semibold ml-1">
                      {hydrationData.waterML}
                    </span>
                  </li>
                </ul>
              </div>
            ) : (
              <p>No logs on this date!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(HydrationTracker);