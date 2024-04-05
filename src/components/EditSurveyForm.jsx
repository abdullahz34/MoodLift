"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function EditSurveyForm({ id, title, description, frequency }) {
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const [newFrequency, setNewFrequency] = useState(frequency);
  
  //character checker MIGHT TAKE OUT
  const isCharacterLimitReached = () => {
    return newDescription.length > 200; 
  }; 
  const router = useRouter();

  const handleFrequencyChange = (value) => {
    setNewFrequency(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    

    try {
      const res = await fetch(`http://localhost:3000/api/surveys/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ newTitle, newDescription, newFrequency }),
      });

      if (!res.ok) {
        throw new Error("Failed to update survey");
      }

      router.refresh();
      router.push("/surveys");
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-auto mr-auto">
      <div className="px-4 py-2 bg-gray-100 rounded-lg">
      <input 
        onChange={(e) => setNewTitle(e.target.value)}
        value={newTitle}
        className="w-full border border-slate-500 px-4 py-2"
        type="text"
        placeholder="Survey Title"
      />
</div>
<div className="px-4 py-2 bg-gray-100 rounded-lg">
      <textarea maxLength={200} 
        rows={4} 
        cols={50} 
        onChange={(e) => setNewDescription(e.target.value)}
        value={newDescription}
        className="w-full border border-slate-500 px-4 py-2"
        type="text"
        style={{ maxHeight: "150px", minHeight: "40px"}}
        placeholder="Survey Description"
      />
      <p>Characters remaining: {200 - description.length}</p>
</div>

<div className="pl-4 pr-4">
      <label htmlFor="frequency">Modify Frequency:</label>
      <select
        id="frequency"
        className="w-full border border-slate-500 px-4 py-2  bg-white rounded-lg"
        style={{ height: "40px" }}
        value={newFrequency}
        onChange={(e) => handleFrequencyChange(e.target.value)}
      >
        <option value="">Select...</option>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        
      </select>
    </div>

    <button 
      type="button"
      
      className="btn btn-ghost font-bold text-border-slate-500 py-3 px-6 rounded-lg w-fit text-lg"
      onClick={handleSubmit}
      >
      Update Survey
    </button>
    </form>
  );
}