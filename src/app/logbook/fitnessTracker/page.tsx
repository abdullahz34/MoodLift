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
    throw new Error("Response for the logging API call failed! (fitness)");
  }
  const data = await response.json();
  console.log("Data from getData:", data);
  // Find the object for the selected date and username
  const item = data.find(
    (item) =>
      new Date(item.date).toDateString() === new Date(date).toDateString() &&
      item.username === username
  );

  // Return the fitness object of the found item, or null if no item was found
  return item ? item.fitness : null;
}

const FitnessPage = () => {
  const [fitnessData, setFitnessData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [date, setDate] = useState(getFormattedCurrentDate());
  const [exercise, setExercise] = useState("");
  const [sets, setSets] = useState(0);
  const [reps, setReps] = useState(0);
  const [steps, setSteps] = useState(0);

  const { data: session } = useSession();
  const username = session?.user?.name;

  const fetchData = async () => {
    try {
      setLoading(true);
      const dataPromise = getData(date, username);
      const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 500)); // 500ms minimum loading time
      await Promise.all([dataPromise, timeoutPromise]);
      const data = await dataPromise;
      setFitnessData(data);
      setLoading(false);
      console.log("Data for fitnessData", fitnessData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  function getFormattedCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Adding 1 to month because it's zero-based
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    fetchData();
  }, [date]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000); // Hide the message after 3 seconds

    const fitness = { exercise, sets, reps, steps };

    const response = await fetch("http://localhost:3000/api/logging", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        date,
        fitness,
      }),
    });
    if (!response.ok) {
      throw new Error("Response for the logging API call failed! (fitness)");
    }

    const responseData = await response.json();
    console.log(responseData);
    await fetchData();
  };

  return (
    <div className="min-h-screen py-12 px-3 bg-white">
      <div className="max-w-[1400px] mx-auto flex h-auto rounded-lg overflow-hidden shadow">
        <div className="hidden md:block w-[40%]">
          <img
            src="/fitness.jpg"
            alt="fitness"
            className="w-full bg-cover h-full"
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
                Your fitness has been successfully tracked for this day!
              </span>
            </div>
          )}

          <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[#222222] text-base font-semibold">
                  Exercise
                </label>
                <input
                  type="string"
                  value={exercise || ""}
                  onChange={(e) => setExercise(e.target.value)}
                  placeholder="Type here"
                  className="border border-gray-300 mt-1 rounded-[50px] p-3 w-full outline-none font-medium text-base bg-transparent"
                  required
                />
              </div>
              <div>
                <label className="text-[#222222] text-base font-semibold">
                  Sets
                </label>
                <input
                  type="number"
                  value={sets || ""}
                  onChange={(e) => setSets(e.target.value)}
                  placeholder="Type here"
                  className="border border-gray-300 mt-1 rounded-[50px] p-3 w-full outline-none font-medium text-base bg-transparent"
                  required
                />
              </div>
              <div>
                <label className="text-[#222222] text-base font-semibold">
                  Reps
                </label>
                <input
                  type="number"
                  value={reps || ""}
                  onChange={(e) => setReps(e.target.value)}
                  placeholder="Type here"
                  className="border border-gray-300 mt-1 rounded-[50px] p-3 w-full outline-none font-medium text-base bg-transparent"
                  required
                />
              </div>
              <div>
                <label className="text-[#222222] text-base font-semibold">
                  Steps
                </label>
                <input
                  type="number"
                  value={steps || ""}
                  onChange={(e) => setSteps(e.target.value)}
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
            ) : fitnessData ? (
              <div>
                <h2 className="text-xl font-semibold mb-4 mt-10">
                  Data logged on this date for fitness:
                </h2>
                <ul>
                  <li className="text-base font-medium">
                    Exercise:{" "}
                    <span className="font-semibold ml-1">
                      {fitnessData.exercise}
                    </span>
                  </li>
                  <li className="text-base font-medium">
                    Sets:
                    <span className="font-semibold ml-1">
                      {fitnessData.sets}
                    </span>
                  </li>
                  <li className="text-base font-medium">
                    Reps:
                    <span className="font-semibold ml-1">
                      {fitnessData.reps}
                    </span>
                  </li>
                  <li className="text-base font-medium ml-1">
                    Steps:
                    <span className="font-semibold ml-1">
                      {fitnessData.steps}
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

export default withAuth(FitnessPage);