"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RxCross1 } from "react-icons/rx";
import { set } from "mongoose";


export default function AddSurvey() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [frequency, setFrequency] = useState('');


  const [showAlert, setShowAlert] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const maxQuestions = 8; 
  const maxCharacters = 200;
  const maxTitle = 50;
  const isCharacterLimitReached = () => {
    return description.length > maxCharacters; 
  }; 
  const isQuestionLimitReached = () => {
    return questions.length >= maxQuestions;
  }; 
  const isMaxTitle = () => {
    return title.length > maxTitle;
  }; 

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    //questions.length === 0)

    if (!title || !description) {
      setShowAlert(true);
      return;
    }

    if(frequency === '') {
      
      setShowInfo(true);
    }
    

    try {
      const res = await fetch("http://localhost:3000/api/surveys", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ title, description, questions, frequency }),

      });

      if (res.ok) {
        router.push("/surveys");
        router.refresh();

      } else {
        throw new Error("Failed to create a SURVEY");
      }
    } catch (error) {
      console.log(error);
    }
  };


  const handleFrequencyChange = (value) => {
    setFrequency(value);
  };
  
  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = { type: 'text', text: value };
    setQuestions(newQuestions);
  };

  const handleChoiceQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index] = { type: "multipleChoice", text: value, value: 0 };
    setQuestions(newQuestions);
  };

  const handleChoiceValueChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].value = value;
    setQuestions(newQuestions);
  };

const addNewQuestion = () => {
  setQuestions([...questions, { type: 'text', text: '' }]); 
  setShowError(false);
};

const addNewChoiceQuestion = () => {
  setQuestions([...questions, { type: "multipleChoice", text: "", value: 0 }]);
  setShowError(false);
};

const removeLastQuestion = () => {
  if (questions.length === 0) {
    //alert('No questions to remove')
    setShowError(true);
  }
  setQuestions(questions.slice(0, -1));
};


  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-auto mx-auto pt-3 w-full px-3">

      {showAlert && (
        <div role="alert" className="alert alert-warning">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>Please fill out all fields</span>
        </div>
      )}

      {showError && (
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>No questions to remove</span>
        </div>
      )}

        {showInfo && (
        <div role="alert" className="alert alert-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Please select a survey frequency</span>
        </div>
      )}


<div className="flex gap-4">

  
<button 
  type="button"
  onClick={addNewQuestion}
  className="btn btn-ghost font-bold text-border-slate-500 py-3 px-6 rounded-lg w-fit text-lg"
  disabled={isQuestionLimitReached()}
  >
  {isQuestionLimitReached() ? 'Max Questions Reached' : 'Add Text Question'}
</button>

<button 
  type="button"
  onClick={addNewChoiceQuestion}
  className="btn btn-ghost font-bold text-border-slate-500 py-3 px-6 rounded-lg w-fit text-lg"
  disabled={isQuestionLimitReached()}
  >
  {isQuestionLimitReached() ? 'Max Questions Reached' : 'Add Choice Question'}
</button>

<button
type="button"
onClick={removeLastQuestion}
className="btn btn-ghost font-bold text-border-slate-500 py-3 px-6 rounded-lg w-fit text-lg hover:bg-error">
  Remove Last Question
</button>



<button 
  type="submit"
  className="btn btn-ghost font-bold text-border-slate-500 py-3 px-6 rounded-lg w-fit text-lg hover:bg-success hover:text-white transition-colors duration-300"
  disabled={isCharacterLimitReached()}>
  Create Survey
</button>
</div>


      <div className="px-4 py-2 bg-neutral-content rounded-lg">
        <input
        maxLength={50} 
        rows={4} 
        cols={50}
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          className="w-full border border-slate-500 px-4 py-2"
          type="text"
          style={{ maxHeight: "60px", minHeight: "40px"}}
          placeholder="Survey Title"
          disabled={isMaxTitle()}
        />
        <p>Characters remaining: {maxTitle - title.length}</p>
      </div>
      <div className="px-4 py-2 bg-neutral-content rounded-lg">
        <textarea
        maxLength={200} 
        rows={4} 
        cols={50} 
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full border border-slate-500 px-4 py-2"
          style={{ maxHeight: "150px", minHeight: "40px"}}
          placeholder="Survey Description"
          disabled={isCharacterLimitReached()}
        />
        <p>Characters remaining: {maxCharacters - description.length}</p>
      </div>

      <div>
      <label htmlFor="frequency">Select Frequency:</label>
      <select
        id="frequency"
        className="w-full border border-slate-500 px-4 py-2 bg-white rounded-lg"
        style={{ height: "40px" }}
        value={frequency}
        onChange={(e) => handleFrequencyChange(e.target.value)}
      >
        <option value="">Select...</option>
        <option value="daily">daily</option>
        <option value="weekly">weekly</option>
        <option value="monthly">monthly</option>
        
      </select>
    </div>

      <div className="flex flex-wrap -mx-4">
       
  {Array.from({ length: Math.ceil(questions.length / 2) }, (_, rowIndex) => (
    <div key={rowIndex} className="flex w-full">
      {questions.slice(rowIndex * 2, rowIndex * 2 + 2).map((question, index) => (
        <div
          key={index}
          className="w-1/2 px-4 mb-4 relative"
        >
     <div className="px-4 py-2 bg-neutral-content rounded-lg">
  {question.type === "text" ? (
    <textarea
      maxLength={200}
      rows={4}
      cols={50}
      value={question.text}
      onChange={(e) => handleQuestionChange(rowIndex * 2 + index, e.target.value)}
      className="w-full border border-slate-500 px-4 py-2"
      style={{ maxHeight: "150px", minHeight: "40px" }}
      placeholder={`Question ${rowIndex * 2 + index + 1}`}
      disabled={isCharacterLimitReached()}
    />
  ) : (
    <>
      <textarea
        maxLength={200}
        rows={4}
        cols={50}
        value={question.text}
        onChange={(e) => handleChoiceQuestionChange(rowIndex * 2 + index, e.target.value)}
        className="w-full border border-slate-500 px-4 py-2"
        style={{ maxHeight: "150px", minHeight: "40px" }}
        placeholder={`Question ${rowIndex * 2 + index + 1}`}
        disabled={isCharacterLimitReached()}
      />
      <input
        type="range"
        min="1"
        max="5"
        value={question.value}
        onChange={(e) => handleChoiceValueChange(rowIndex * 2 + index, e.target.value)}
        className="w-full mt-2"
      />
      <div className="flex justify-between text-sm">
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
      </div>
    </>
  )}
  <p>Characters remaining: {maxCharacters - question.text.length}</p>
</div>

          

        </div>
      ))}
    </div>
  ))}
</div>
      
    </form>
  );
}