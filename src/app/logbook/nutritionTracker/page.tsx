"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { withAuth } from "@/components/WithAuth";

async function getData(date, username) {
  const response = await fetch(
    `http://localhost:3000/api/logging?date=${date}&username=${username}`,
    { cache: "no-store" }
  );
  if (!response.ok) {
    throw new Error("Response for the logging API call failed! (nutrition)");
  }
  const data = await response.json();
  console.log("Data from getData:", data);
  // Find the object for the selected date and username
  const item = data.find(
    (item) =>
      new Date(item.date).toDateString() === new Date(date).toDateString() &&
      item.username === username
  );

  // Return the nutrition object of the found item, or null if no item was found
  return item ? item.nutrition : null;
}

const NutritionTracker = () => {
  const [submitted, setSubmitted] = useState(false);
  const [date, setDate] = useState(getFormattedCurrentDate());
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fats, setFats] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [nutritionData, setNutritionData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [food, setFood] = useState("");
  const [nutrition, setNutrition] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const { data: session } = useSession();
  const username = session?.user?.username;

  useEffect(() => {
    if (food.trim() === "") {
      return;
    }
    if (food) {
      axios
        .get(
          `https://api.edamam.com/auto-complete?app_id=${process.env.NEXT_PUBLIC_EDAMAM_APP_ID}&app_key=${process.env.NEXT_PUBLIC_EDAMAM_APP_KEY}&q=${food}`
        )
        .then((response) => {
          const suggestions = response.data;
          if (suggestions.includes(food.toLowerCase())) {
            // Food item exists in the autocomplete API response
            return axios.get(
              `https://api.edamam.com/api/food-database/v2/parser?app_id=${process.env.NEXT_PUBLIC_EDAMAM_APP_ID}&app_key=${process.env.NEXT_PUBLIC_EDAMAM_APP_KEY}&ingr=${food}&nutrition-type=logging`
            );
          } else {
            // Food item does not exist in the autocomplete API response
            setNutrition(null);
            setCalories(0);
            setProtein(0);
            setFats(0);
            setCarbs(0);
            if (food.trim() !== "") {
              setErrorMessage(
                "No matching food item found. Please try a different entry."
              );
              // Clear the error message after 3 seconds
              setTimeout(() => setErrorMessage(""), 1500);
            }
            return Promise.reject();
          }
        })
        .then((response) => {
          if (response.data.hints.length > 0) {
            const foodId = response.data.hints[0].food.foodId;
            const measureURI = response.data.hints[0].measures[0].uri;

            return axios.post(
              `https://api.edamam.com/api/food-database/v2/nutrients?app_id=${process.env.NEXT_PUBLIC_EDAMAM_APP_ID}&app_key=${process.env.NEXT_PUBLIC_EDAMAM_APP_KEY}`,
              {
                ingredients: [
                  {
                    quantity: 1,
                    measureURI: measureURI,
                    foodId: foodId,
                  },
                ],
              }
            );
          } else {
            setNutrition(null);
            setCalories(0);
            setProtein(0);
            setFats(0);
            setCarbs(0);
            if (food.trim() !== "") {
              setErrorMessage("An error occurred while fetching the data.");
              // Clear the error message after 3 seconds
              setTimeout(() => setErrorMessage(""), 1500);
            }
            return Promise.reject();
          }
        })
        .then((response) => {
          const nutrients = response.data.totalNutrients;
          console.log("Nutrients:", nutrients);
          setNutrition(nutrients);
          setCalories(nutrients.ENERC_KCAL?.quantity?.toFixed(2));
          setProtein(nutrients.PROCNT?.quantity?.toFixed(2));
          setFats(nutrients.FAT?.quantity?.toFixed(2));
          setCarbs(nutrients.CHOCDF?.quantity?.toFixed(2));
        })
        .catch((error) => console.error(error));
    }
  }, [food]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    setFood('');
    setTimeout(() => setSubmitted(false), 3000); // Hide the message after 3 seconds

    const nutrition = { calories, protein, fats, carbs };

    const response = await fetch("http://localhost:3000/api/logging", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        date,
        nutrition,
      }),
    });

    if (!response.ok) {
      throw new Error("Response for the logging API call failed! (nutrition)");
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

  const fetchData = async () => {
    try {
      setLoading(true);
      const dataPromise = getData(date, username);
      const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 500)); // 500ms minimum loading time
      await Promise.all([dataPromise, timeoutPromise]);
      const data = await dataPromise;
      setNutritionData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    console.log("Current date:", date);
    if (date) {
      fetchData();
    }
  }, [date]);

  return (
    <div className="min-h-screen py-12 px-3 bg-white">
      <div className="max-w-[1400px] mx-auto flex h-auto md:h-[770px] rounded-lg overflow-hidden shadow">
        <div className="hidden md:block w-[40%]">
          <img
            src="/nutrition.jpg"
            alt="nutrition"
            className="w-full bg-cover h-full"
          />
        </div>
        <div className="w-full md:w-[60%] bg-white flex flex-col py-[10px] px-5 sm:px-32">
          {submitted && (
            <div
              role="alert"
              className="alert alert-success shadow-lg mx-auto mb-6 w-full flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current flex-shrink-0 h-6 w-6"
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
                Your nutrition has been successfully tracked for this day!
              </span>
            </div>
          )}
          <div className="w-full">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="text-[#222222] text-base font-semibold">
                    Food
                  </span>
                </label>
                <input
                  type="text"
                  value={food}
                  onChange={(e) => setFood(e.target.value)}
                  placeholder="Type here"
                  className="input input-bordered"
                  required
                />
              </div>
              <div>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              </div>
              {nutrition && (
                <div className="overflow-auto max-h-48">
                  {Object.entries(nutrition).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between py-2 border-b"
                    >
                      <span className="font-semibold">
                        {value?.label || key}
                      </span>
                      <span>{value?.quantity?.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="form-control">
                <label className="label">
                  <span className="text-[#222222] text-base font-semibold">
                    Date
                  </span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input input-bordered"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
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
            ) : nutritionData ? (
              <div>
                <h2 className="text-xl font-semibold mb-4 mt-10">
                  Notable data logged on this date for nutrition:
                </h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li className="text-base font-medium">
                    Calories:{" "}
                    <span className="font-semibold ml-1">
                      {nutritionData.calories}
                    </span>
                  </li>
                  <li className="text-base font-medium">
                    Protein:{" "}
                    <span className="font-semibold ml-1">
                      {nutritionData.protein}
                    </span>
                  </li>
                  <li className="text-base font-medium">
                    Fats:{" "}
                    <span className="font-semibold ml-1">
                      {nutritionData.fats}
                    </span>
                  </li>
                  <li className="text-base font-medium">
                    Carbs:{" "}
                    <span className="font-semibold ml-1">
                      {nutritionData.carbs}
                    </span>
                  </li>
                </ul>
              </div>
            ) : (
              <p className="text-center text-gray-500">No logs on this date!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default withAuth(NutritionTracker);