'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const Journal = () => {
  const [entry, setEntry] = useState('');
  const [journalEntries, setJournalEntries] = useState([]);

  const { data: session } = useSession();
  const username = session?.user?.username;

  const today = new Date();
  const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  useEffect(() => {
    fetchJournalEntries();
  }, [username, formattedDate]);

  const fetchJournalEntries = async () => {
    try {
      const journalResponse = await fetch(`/api/journals?username=${username}&date=${formattedDate}`);
      const journalData = await journalResponse.json();
      setJournalEntries(journalData);
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
        body: JSON.stringify({ username, date: formattedDate, entry }),
      });

      if (response.ok) {
        setEntry('');
        await fetchJournalEntries(); // Fetch updated journal entries
      } else {
        console.error('Error creating journal entry');
      }
    } catch (error) {
      console.error('Error creating journal entry:', error);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Journal</h2>
        <form onSubmit={handleJournalSubmit}>
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
        {journalEntries.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-2">Previous Entries</h3>
            {journalEntries.map((entry, index) => (
              <div key={index} className="p-4 bg-gray-100 rounded-md mb-4">
                <p>{entry.entry}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Journal;