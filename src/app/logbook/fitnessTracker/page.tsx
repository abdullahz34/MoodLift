'use client'
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";


async function getData(date, username) {
  const response = await fetch(`http://localhost:3000/api/logging?date=${date}&username=${username}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error('Response for the logging API call failed! (fitness)');
  }
  const data = await response.json();
  console.log('Data from getData:', data);
  // Find the object for the selected date and username
  const item = data.find(item => new Date(item.date).toDateString() === new Date(date).toDateString() && item.username === username);

  // Return the fitness object of the found item, or null if no item was found
  return item ? item.fitness : null;
}

const FitnessPage = () => {
  const [fitnessData, setFitnessData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [date, setDate] = useState(getFormattedCurrentDate());
  const [exercise, setExercise] = useState('');
  const [sets, setSets] = useState(0);
  const [reps, setReps] = useState(0);
  const [steps, setSteps] = useState(0);

  const { data: session } = useSession();
  const username = session?.user?.name;

  const fetchData = async () => {
    try {
      setLoading(true);
      const dataPromise = getData(date, username);
      const timeoutPromise = new Promise(resolve => setTimeout(resolve, 500)); // 500ms minimum loading time
      await Promise.all([dataPromise, timeoutPromise]);
      const data = await dataPromise;
      setFitnessData(data);
      setLoading(false);
      console.log("Data for fitnessData", fitnessData)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  function getFormattedCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Adding 1 to month because it's zero-based
    const day = String(today.getDate()).padStart(2, '0');
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

    const response = await fetch('http://localhost:3000/api/logging', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        date,
        fitness,
      }),
    });
    if (!response.ok) {
      throw new Error('Response for the logging API call failed! (fitness)');
    }

    const responseData = await response.json();
    console.log(responseData);
    await fetchData();
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
      {submitted && (
        <div role="alert" className="alert alert-success fixed top-0 left-0 right-0 flex items-center justify-center mt-4 p-2 text-sm max-w-xs mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Your fitness has been successfully tracked for this day!</span>
        </div>
      )}
      <div className="flex">
        <div className="w-1/2 mr-20">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Exercise</label>
              <input type="string" value={exercise || ''} onChange={(e) => setExercise(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" required />
            </div>
            <div>
              <label className="block text-gray-700">Sets</label>
              <input type="number" value={sets || ''} onChange={(e) => setSets(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" required />
            </div>
            <div>
              <label className="block text-gray-700">Reps</label>
              <input type="number" value={reps || ''} onChange={(e) => setReps(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" required />
            </div>
            <div>
              <label className="block text-gray-700">Steps</label>
              <input type="number" value={steps || ''} onChange={(e) => setSteps(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" required />
            </div>
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
          ) : fitnessData ? (
            <div>
              <h2>Data logged on this date for fitness:</h2>
              <ul>
                <li>Exercise: {fitnessData.exercise}</li>
                <li>Sets: {fitnessData.sets}</li>
                <li>Reps: {fitnessData.reps}</li>
                <li>Steps: {fitnessData.steps}</li>
              </ul>
            </div>
          ) : (
            <p>No logs on this date!</p>
          )}
        </div>
      </div>
    </div>
  )
};

export default FitnessPage;