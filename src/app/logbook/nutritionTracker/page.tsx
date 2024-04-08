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
      axios.get(`https://api.edamam.com/api/food-database/v2/parser?app_id=7f5534d1&app_key=efc97b8f57bd6654484de2cbb3b140cb&ingr=${food}&nutrition-type=logging`)
        .then(response => {
          const nutrients = response.data.hints[0].food.nutrients;
          console.log('Response', response.data);
          console.log('Nutrients:', nutrients);
          setNutrition(nutrients);
          setCalories(nutrients.ENERC_KCAL.toFixed(2));
          setProtein(nutrients.PROCNT.toFixed(2));
          setFats(nutrients.FAT.toFixed(2));
          setCarbs(nutrients.CHOCDF.toFixed(2));
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
      {submitted && (
        <div role="alert" className="alert alert-success fixed top-0 left-0 right-0 flex items-center justify-center mt-4 p-2 text-sm max-w-xs mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Your nutrition has been successfully tracked for this day!</span>
        </div>
      )}
      <div className="flex">
        <div className="w-1/2 mr-20">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Food</label>
              <input type="text" value={food} onChange={(e) => setFood(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" required />
            </div>
            {nutrition && (
              <div className="stats stats-vertical lg:stats-horizontal shadow">
                <div className="stat">
                  <div className="stat-title">Calories</div>
                  <div className="stat-value">{nutrition.ENERC_KCAL.toFixed(2)}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Protein</div>
                  <div className="stat-value">{nutrition.PROCNT.toFixed(2)}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Fats</div>
                  <div className="stat-value">{nutrition.FAT.toFixed(2)}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Carbs</div>
                  <div className="stat-value">{nutrition.CHOCDF.toFixed(2)}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Fiber</div>
                  <div className="stat-value">{nutrition.FIBTG?.toFixed(2)}</div>
                </div>
              </div>
            )}
            <div>
              <label className="block text-gray-700">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input input-bordered w-full max-w-xs" />
            </div>
            <button type="submit" className="btn btn-secondary">Submit</button>
          </form>
        </div>
        <div className="w-1/2">
          {loading ? (
            <span className="loading loading-dots loading-md"></span>
          ) : nutritionData ? (
            <div>
              <h2>Data logged on this date for nutrition:</h2>
              <ul>
                <li>Calories: {nutritionData.calories}</li>
                <li>Protein: {nutritionData.protein}</li>
                <li>Fats: {nutritionData.fats}</li>
                <li>Carbs: {nutritionData.carbs}</li>
              </ul>
            </div>
          ) : (
            <p>No logs on this date!</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default NutritionTracker