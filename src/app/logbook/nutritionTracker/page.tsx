'use client'
import React, { useState, useEffect } from 'react'
import { useSession } from "next-auth/react";
import axios from 'axios';


async function getData(date, username) {
  const response = await fetch(`http://localhost:3000/api/logging?date=${date}&username=${username}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error('Response for the logging API call failed! (nutrition)');
  }
  const data = await response.json();
  console.log('Data from getData:', data);
  // Find the object for the selected date and username
  const item = data.find(item => new Date(item.date).toDateString() === new Date(date).toDateString() && item.username === username);

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

  const [food, setFood] = useState('');
  const [nutrition, setNutrition] = useState(null);

  const { data: session } = useSession();
  const username = session?.user?.name;

  useEffect(() => {
    if (food) {
      axios.get(`https://api.edamam.com/api/food-database/v2/parser?app_id=${process.env.NEXT_PUBLIC_EDAMAM_APP_ID}&app_key=${process.env.NEXT_PUBLIC_EDAMAM_APP_KEY}&ingr=${food}&nutrition-type=logging`)
        .then(response => {
          const foodId = response.data.hints[0].food.foodId;
          const measureURI = response.data.hints[0].measures[0].uri;

          return axios.post(`https://api.edamam.com/api/food-database/v2/nutrients?app_id=${process.env.NEXT_PUBLIC_EDAMAM_APP_ID}&app_key=${process.env.NEXT_PUBLIC_EDAMAM_APP_KEY}`, {
            ingredients: [
              {
                quantity: 1,
                measureURI: measureURI,
                foodId: foodId
              }
            ]
          });
        })
        .then(response => {
          const nutrients = response.data.totalNutrients;
          console.log('Nutrients:', nutrients);
          setNutrition(nutrients);
          setCalories(nutrients.ENERC_KCAL?.quantity?.toFixed(2));
          setProtein(nutrients.PROCNT?.quantity?.toFixed(2));
          setFats(nutrients.FAT?.quantity?.toFixed(2));
          setCarbs(nutrients.CHOCDF?.quantity?.toFixed(2));
        })
        .catch(error => console.error(error));
    }
  }, [food]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000); // Hide the message after 3 seconds

    const nutrition = { calories, protein, fats, carbs };

    const response = await fetch('http://localhost:3000/api/logging', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        date,
        nutrition,
      }),
    });

    if (!response.ok) {
      throw new Error('Response for the logging API call failed! (nutrition)');
    }

    const responseData = await response.json();
    console.log(responseData);
    await fetchData();
  }

  function getFormattedCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Adding 1 to month because it's zero-based
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      const dataPromise = getData(date, username);
      const timeoutPromise = new Promise(resolve => setTimeout(resolve, 500)); // 500ms minimum loading time
      await Promise.all([dataPromise, timeoutPromise]);
      const data = await dataPromise;
      setNutritionData(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    console.log('Current date:', date);
    if (date) {
      fetchData();
    }
  }, [date]);

  return (
    <div className="min-h-screen bg-base-200 py-12">
      {submitted && (
        <div role="alert" className="alert alert-success shadow-lg mx-auto mb-4 max-w-md">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>Your nutrition has been successfully tracked for this day!</span>
          </div>
        </div>
      )}
      <div className="container mx-auto flex justify-center">
        <div className="card bg-base-100 shadow-xl w-full max-w-3xl">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Food</span>
                    </label>
                    <input type="text" value={food} onChange={(e) => setFood(e.target.value)} placeholder="Type here" className="input input-bordered" required />
                  </div>
                  {nutrition && (
                    <div className="overflow-auto max-h-48">
                      {Object.entries(nutrition).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 border-b">
                          <span className="font-semibold">{value?.label || key}</span>
                          <span>{value?.quantity?.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Date</span>
                    </label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input input-bordered" />
                  </div>
                  <div className="form-control mt-6">
                    <button type="submit" className="btn btn-primary">Submit</button>
                  </div>
                </form>
              </div>
              <div>
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <span className="loading loading-dots loading-md"></span>
                  </div>
                ) : nutritionData ? (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Notable data logged on this date for nutrition:</h2>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Calories: {nutritionData.calories}</li>
                      <li>Protein: {nutritionData.protein}</li>
                      <li>Fats: {nutritionData.fats}</li>
                      <li>Carbs: {nutritionData.carbs}</li>
                    </ul>
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No logs on this date!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NutritionTracker