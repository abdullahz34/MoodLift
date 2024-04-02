'use client'
import React, { useState, useEffect } from 'react'

async function getData(date) {
  const response = await fetch(`http://localhost:3000/api/logging?date=${date}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error('Response for the logging API call failed! (nutrition)');
  }
  const data = await response.json();
  console.log('Data from getData:', data);
  // Find the object for the selected date
  const item = data.find(item => new Date(item.date).toDateString() === new Date(date).toDateString());

  // Return the sleep object of the found item, or null if no item was found
  return item ? item.sleep : null;
}

const username = "testuser"

const SleepTracker = () => {
  const [submitted, setSubmitted] = useState(false);
  const [date, setDate] = useState(getFormattedCurrentDate());
  const [hoursSlept, setHoursSlept] = useState(0);
  const [sleepQuality, setSleepQuality] = useState('good');
  const [sleepData, setSleepData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const dataPromise = getData(date);
      const timeoutPromise = new Promise(resolve => setTimeout(resolve, 500)); // 500ms minimum loading time
      await Promise.all([dataPromise, timeoutPromise]);
      const data = await dataPromise;
      setSleepData(data);
      setLoading(false);
      console.log("Data for sleepData",sleepData)
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

    const sleep = { hoursSlept, sleepQuality};

    const response = await fetch('http://localhost:3000/api/logging', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        date,
        sleep,
      }),
    });
    if (!response.ok) {
      throw new Error('Response for the logging API call failed! (sleep)');
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
              <label className="block text-gray-700">Sleep hours</label>
              <input type="number" value={hoursSlept || ''} onChange={(e) => setHoursSlept(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" required />
            </div>
            <div className="text-gray-700">Sleep quality</div>
            <div className="dropdown dropdown-left">
              <div tabIndex={0} role="button" className="btn m-1">{sleepQuality || 'Select Quality'}</div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><a onClick={() => setSleepQuality('Good')}>Good</a></li>
                <li><a onClick={() => setSleepQuality('Fair')}>Fair</a></li>
                <li><a onClick={() => setSleepQuality('Poor')}>Poor</a></li>
              </ul>
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
          ) : sleepData ? (
            <div>
              <h2>Data logged on this date for sleep:</h2>
              <ul>
                <li>Sleep hours: {sleepData.hoursSlept}</li>
                <li>Sleep Quality: {sleepData.sleepQuality}</li>
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

export default SleepTracker