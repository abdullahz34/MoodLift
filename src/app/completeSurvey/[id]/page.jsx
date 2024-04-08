'use client';

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import AnswerSurveyForm from "../../../components/AnswerSurveyForm";

const getSurveyById = async (id) => {
  try {
    const res = await fetch(`http://localhost:3000/api/surveys/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch survey");
    }

    return res.json();
  } catch (error) {
    console.log(error);
  }
};

// To answer a survey using the identity of the id
export default async function EditSurvey({ params }) {
  const { id } = params;
  const { survey } = await getSurveyById(id);
  const { title, description, frequency, questions } = survey;

  return (
    <AnswerSurveyForm
      id={id}
      title={title}
      description={description}
      frequency={frequency}
      questions={questions}
    />
  );
}