import Link from "next/link";
import React from 'react';
import SurveyListItem from './SurveyListItem';

const capitalFirst = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

//backend for surveys
//refactored this component into server EXCLUSIVELY so that theres no async errors
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
        <SurveyListItem key={survey._id} survey={survey} />
      ))}
    </div>
  );
}