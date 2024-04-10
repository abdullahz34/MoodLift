import Link from "next/link";
import React from 'react';


const capitalFirst = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const getSurveys = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/surveys", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch surveys");
    }
    
    return res.json();
  } catch (error) {
    console.log("Error loading surveys: ", error);
  }
};

export default async function SurveyList() {
  const { surveys } = await getSurveys();






  
  return (
    <div>
      {surveys.map((survey) => (
        <div key={survey._id} className="border-2 bg-neutral-content border-gray-300 p-4 mb-4">
          <h3 className="text-lg font-bold mb-2">{survey.title}</h3>
          {survey.responses && survey.responses.length > 0 ? (
            survey.responses.map((response, index) => (
              <div key={index} className="mb-2">
                <p className="font-bold">{response.username}</p>
                <button>View Results</button>
                {response.answers.map((answer, i) => (
                  <div 
                    key={i}
                    className={`px-2 py-1 rounded-md mb-2 bg-neutral-200`}
                    
                  >
                    <span>
                      {survey.questions[i].text}: {answer}
                    </span>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p>This survey has no responses.</p>
          )}
        </div>
      ))}
    </div>
  );
}