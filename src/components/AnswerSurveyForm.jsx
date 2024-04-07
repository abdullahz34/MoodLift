import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AnswerSurveyForm({ id }) {
  const router = useRouter();
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/surveys/${id}`, {
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error('Failed to fetch survey');
        }

        const { survey } = await res.json();
        setSurvey(survey);
        setAnswers(new Array(survey.questions.length).fill(''));
      } catch (error) {
        console.error(error);
      }
    };

    fetchSurvey();
  }, [id]);

  const handleAnswerChange = (index, value) => {
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[index] = value;
      return newAnswers;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/api/surveys/${id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      if (res.ok) {
        
        router.push('/dashboard');
      } else {
        console.error('Failed to save survey response');
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!survey) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      
      
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-auto mr-auto pl-4 pr-4 pt-2">

      <div className="px-4 py-2 bg-neutral-content rounded-lg">
      <h1>{survey.title}</h1>
       </div>
<div className="px-4 py-2 bg-neutral-content rounded-lg">
<h2>{survey.description}</h2>
    
</div>
{/*BULK OF SURVEY QUESTIONS*/}
        {survey.questions.map((question, index) => (
          <div key={index} className="px-4 py-2 bg-neutral-content rounded-lg">
            <h3>{question.text}</h3>
            {question.type === 'text' ? (
              <input
                type="text"
                value={answers[index] || ''}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
              />
            ) : (
              <select
                value={answers[index] || ''}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
              >
                <option value="">Select an option</option>
                {question.choices.map((choice, choiceIndex) => (
                  <option key={choiceIndex} value={choice}>
                    {choice}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}