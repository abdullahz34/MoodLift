'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const Journal = () => {
  const [entry, setEntry] = useState('');
  const [journalEntries, setJournalEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [mood, setMood] = useState('');
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const { data: session } = useSession();
  const username = session?.user?.username;

  const today = new Date();
  const formattedTodayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  useEffect(() => {
    // Get the best streak from localStorage when the component mounts
    const savedBestStreak = localStorage.getItem('bestStreak');
    if (savedBestStreak) {
      setBestStreak(Number(savedBestStreak));
    }

    fetchJournalEntries();
  }, [username, selectedDate]);

  const fetchJournalEntries = async () => {
    try {
      const journalResponse = await fetch(`/api/journals?username=${username}&date=${selectedDate || formattedTodayDate}`);
      const journalData = await journalResponse.json();
      setJournalEntries(journalData);

      if (journalData.length > 0) {
        const latestEntry = journalData[0];
        setStreak(latestEntry.streak);
        setBestStreak((prevBestStreak) => {
          const newBestStreak = Math.max(prevBestStreak, latestEntry.streak);
          // Save the best streak to localStorage
          localStorage.setItem('bestStreak', String(newBestStreak));
          return newBestStreak;
        });
      } else {
        setStreak(0);
        if (!localStorage.getItem('bestStreak')) {
          setBestStreak(0);
        }
      }
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    }
  };

  const handleJournalSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/journals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, date: selectedDate || formattedTodayDate, entry, mood }),
      });

      if (response.ok) {
        setEntry('');
        setMood('');
        await fetchJournalEntries(); // Fetch updated journal entries
      } else {
        console.error('Error creating journal entry');
      }
    } catch (error) {
      console.error('Error creating journal entry:', error);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleMoodChange = (e) => {
    setMood(e.target.value);
  };

  return (
    <div className="container mx-auto py-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Journal</h2>
        <form onSubmit={handleJournalSubmit}>
          <div className="mb-4">
            <label htmlFor="date" className="block font-bold mb-2">
              Select Date:
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate || formattedTodayDate}
              onChange={handleDateChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="mood" className="block font-bold mb-2">
              Mood:
            </label>
            <select
              id="mood"
              value={mood}
              onChange={handleMoodChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select your mood</option>
              <option value="happy">😊 Happy</option>
              <option value="sad">😢 Sad</option>
              <option value="stressed">😩 Stressed</option>
              <option value="calm">😌 Calm</option>
            </select>
          </div>
          <textarea
            className="w-full h-48 p-2 border border-gray-300 rounded-md mb-4"
            placeholder="Write your journal entry here..."
            value={entry}
            onChange={(e) => setEntry(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </form>
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">Your Streaks</h3>
          <p>
            🔥 Current Streak: <span className="font-bold">{streak} days</span>
          </p>
          <p>
            🏆 Best Streak: <span className="font-bold">{bestStreak} days</span>
          </p>
        </div>
        {journalEntries.length > 0 ? (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-2">Today's Entries</h3>
            {journalEntries.map((entry, index) => (
              <div key={index} className="p-4 bg-gray-100 rounded-md mb-4">
                <p className="break-words">
                  <span className="font-bold">Mood:</span>{' '}
                  {entry.mood === 'happy' && '😊'}
                  {entry.mood === 'sad' && '😢'}
                  {entry.mood === 'stressed' && '😩'}
                  {entry.mood === 'calm' && '😌'}
                </p>
                <p className="break-words">{entry.entry}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-2">No journal entries for this date</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;