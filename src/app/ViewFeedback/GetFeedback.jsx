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
          return [
            `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
            feedback.username,
            feedback.message,
          ];
        });
        setFeedbackList(formattedFeedback);
      } catch (error) {
        console.log("Error loading feedback: ", error);
      }
    };
    fetchFeedback();
  }, []);

  return (
    <div>
      {feedbackList.map((feedback, index) => (
        <div key={index} className="chat chat-start">
          <div className="chat-bubble chat-bubble-secondary">
            {feedback[1] === "" || feedback[1] === undefined
              ? `[${feedback[0]}] ${feedback[2]}`
              : `[${feedback[0]}] ${feedback[2]} (by ${feedback[1]})`}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GetFeedback;