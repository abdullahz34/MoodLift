'use client';

import React, { useState } from 'react';

const SurveyListItem = ({ survey }) => {
  const [showUserResponses, setShowUserResponses] = useState({});


  //display each usernames responses given their username is clicked
  const toggleUserResponses = (username) => {
    setShowUserResponses((prevState) => ({
      ...prevState,

      [username]: !prevState[username],
    }));
  };
  
  const getUsernameColour = (answers) => {
    const numericValues = answers.filter((answer) => !isNaN(Number(answer))).map(Number);
    const totalValue = numericValues.reduce((sum, value) => sum + value, 0);
    const colourIndex = totalValue % 6;
        if (colourIndex < 4) {
            return 'bg-error';
        } else if (colourIndex >= 3 && colourIndex <= 5) {
            return 'bg-accent';
        } else {
            return 'bg-success';
        }
    };
    //is the user happy or sad, using green or red in an algorithm to reflect this by totalling their 
    //number scores and taking an average over the number of questions in the survey
    //if the score is low = red
    //else = green

  


  return (
    <div className="px-3 pt-3">
      <div className="border-2 bg-neutral-content border-gray-300 p-3 mb-4 rounded-md">
        <div className="flex justify-between items-center mb-4 pl-1">
          <h3 className="text-lg font-bold">{survey.title}</h3>
        </div>

        {survey.responses.length > 0 ? (
          survey.responses.map((response, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <p
                    className={`font-bold mr-4 px-2 py-1 rounded-md ${getUsernameColour(
                      response.answers
                    )}`}
                  >
                    {response.username}
                  </p>
                  <button
                    className="btn btn-ghost text-m text-bg-secondary mr-3"
                    onClick={() => toggleUserResponses(response.username)}
                  >
                    View Responses
                  </button>
                </div>
              </div>
              {showUserResponses[response.username] && (
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
          ))
        ) : (
          <p className="text-center">No responses recorded</p>
        )}
      </div>
    </div>
  );
};

export default SurveyListItem;