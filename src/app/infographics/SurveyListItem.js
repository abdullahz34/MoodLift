'use client';
import React, { useState } from 'react';

const SurveyListItem = ({ survey }) => {
  const [showUserResponses, setShowUserResponses] = useState({});

  const toggleUserResponses = (userId) => {
    setShowUserResponses((prevState) => ({
      ...prevState,
      [userId]: !prevState[userId],
    }));
  };

  return (
    <div className="border-2 bg-neutral-content border-gray-300 p-3 mb-4 rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">{survey.title}</h3>
      </div>
      {survey.responses.map((response, index) => (
        <div key={index} className="mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <p className="font-bold mr-4">{response.username}</p>
              <button
                //survey styling old didnt like it tbh
                //className="px-2 py-1 rounded bg-neutral-200 hover:bg-neutral-300"
                className="btn btn-ghost text-m text-bg-secondary mr-3"
                onClick={() => toggleUserResponses(response.userId)}
              >
                View Responses
              </button>
            </div>
          </div>
          {showUserResponses[response.userId] && (
            <div className="mt-2">
              {response.answers.map((answer, i) => (
                <div key={i} className="mb-2">
                  <div className="px-2 py-1 rounded-md bg-neutral-200">
                    <span>{survey.questions[i].text}</span>
                  </div>
                  <div className="px-2 py-1 rounded-md bg-neutral-300 text-black">
                    <span>{answer}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SurveyListItem;
