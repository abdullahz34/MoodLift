'use client';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const Journal = () => {
    const [entry, setEntry] = useState('');
    const [journalEntries, setJournalEntries] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    const { data: session } = useSession();
    const username = session?.user?.username;

    const today = new Date();
    const formattedTodayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    useEffect(() => {
        fetchJournalEntries();
    }, [username, selectedDate]);

    const fetchJournalEntries = async () => {
        try {
            const journalResponse = await fetch(`/api/journals?username=${username}&date=${selectedDate || formattedTodayDate}`);
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
                body: JSON.stringify({ username, date: selectedDate || formattedTodayDate, entry }),
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

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
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
                {journalEntries.length > 0 ? (
                    <div className="mt-8">
                        <h3 className="text-xl font-bold mb-2">Previous Entries</h3>
                        {journalEntries.map((entry, index) => (
                            <div key={index} className="p-4 bg-gray-100 rounded-md mb-4">
                                <p>{entry.entry}</p>
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