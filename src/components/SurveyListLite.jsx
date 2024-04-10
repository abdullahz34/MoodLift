'use client';
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
    <>
    <div className="pt-3 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {surveys.map((s) => (
        
        <div
          key={s._id}
          className="card shadow-xl bg-neutral-content border-secondary border-3"
        >
          <div className="card-body">
            <h2 className="card-title">{s.title}</h2>
            <h3
              className={`whitespace-nowrap overflow-hidden max-w-max text-m font-primary px-2 py-1 rounded-md inline-block ${
                s.frequency === 'daily'
                  ? 'bg-secondary text-black'
                  : s.frequency === 'weekly'
                  ? 'bg-green-500 text-black'
                  : s.frequency === 'monthly'
                  ? 'bg-yellow-500 text-black'
                  : ''
              }`}
>
              {capitalFirst(s.frequency)}
              </h3>

                <div>
          <span
          className={`text-sm font-primary px-2 py-1 rounded-md ${
            s.frequency === 'daily'
              ? 'bg-secondary text-black'
              : s.frequency === 'weekly'
              ? 'bg-green-500 text-black'
              : s.frequency === 'monthly'
              ? 'bg-yellow-500 text-black'
              : ''
          }`}
        >
          {s.frequency === 'daily'
            ? 'Due today'
            : s.frequency === 'weekly'
            ? 'Due in 6 days'
            : s.frequency === 'monthly'
            ? 'Due in 29 days'
            : ''}
        </span>
        </div>


            <div className="card-actions justify-end">{s.description}</div>
          </div>
          

<Link className="btn btn-ghost text-lg text-bg-secondary font-bold" 
        href={`/completeSurvey/${s._id}`}
  >
            Complete Survey
          </Link>

        </div>
      
      ))}
      </div>
    </>
  );
}