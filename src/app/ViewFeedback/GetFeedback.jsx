'use client';
import React, { useEffect, useState } from 'react';

const GetFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/feedback", {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error("Failed to fetch feedback");
        }
        const feedbackData = await res.json();
        const formattedFeedback = feedbackData.map((feedback) => {
          const date = new Date(feedback.createdAt);
          return {
            date: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
            username: feedback.username,
            message: feedback.message,
          };
        });
        setFeedbackList(formattedFeedback);
      } catch (error) {
        console.log("Error loading feedback: ", error);
      }
    };
    fetchFeedback();
  }, []);

  return (
    <div className="grid gap-4">
      {feedbackList.map((feedback, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-4 flex flex-col"
        >
          <div className="flex items-center mb-2">
            <span className="font-semibold mr-2">{feedback.username || 'Anonymous'}</span>
            <span className="text-gray-500">{feedback.date}</span>
          </div>
          <p className="text-gray-800">{feedback.message}</p>
        </div>
      ))}
    </div>
  );
};

export default GetFeedback;