'use client'
import React, { useState } from 'react'

async function getData() {
  const response = await fetch('http://localhost:3000/api/logging', {cache: "no-store"});
  if (!response.ok) {
    throw new Error('Response for the logging API call failed! (nutrition)');
  }
  return response.json()
}

const username = "testuser"


const NutritionTracker = () => {
  const [submitted, setSubmitted] = useState(false);
  const [date, setDate] = useState(getFormattedCurrentDate());

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000); // Hide the message after 3 seconds
    // Here you can add your logic to send the form data to the server
  }

  function getFormattedCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Adding 1 to month because it's zero-based
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
      {submitted && (
        <div role="alert" className="alert alert-success fixed top-0 left-0 right-0 flex items-center justify-center mt-4 p-2 text-sm max-w-xs mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Your nutrition has been successfully tracked for this day!</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Calories</label>
          <input type="number" placeholder="Type here" className="input input-bordered w-full max-w-xs" required/>
        </div>
        <div>
          <label className="block text-gray-700">Protein</label>
          <input type="number" placeholder="Type here" className="input input-bordered w-full max-w-xs" required/>
        </div>
        <div>
          <label className="block text-gray-700">Fats</label>
          <input type="number" placeholder="Type here" className="input input-bordered w-full max-w-xs" required/>
        </div>
        <div>
          <label className="block text-gray-700">Carbs</label>
          <input type="number" placeholder="Type here" className="input input-bordered w-full max-w-xs" required/>
        </div>
        <div>
          <label className="block text-gray-700">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input input-bordered w-full max-w-xs" />
        </div>
        <button type="submit" className="btn btn-secondary">Submit</button>
      </form>
    </div>
  )
}

export default NutritionTracker