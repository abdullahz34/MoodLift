import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AnswerSurveyForm({ id }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [survey, setSurvey] = useState(null);
  const [answers, setAnswers] = useState([]);
  

  const maxCharacters = 400;

  const isCharacterLimitReached = (text) => {
    return text.length > maxCharacters; 
  }; 

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
      const res = await fetch(`http://localhost:3000/api/surveys/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers, username: session.user.username }),
      });

      if (res.ok) {
        
        router.push('/surveys');
      } else {
        console.error('Failed to save survey response');
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!survey) {
    return <div>Loading</div>;
  }

  return (
    <div>
  <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-auto mr-auto pl-4 pr-4 pt-2">
    <div className="px-4 py-2 bg-neutral-content rounded-lg">
      <h1 className="text-black text-2xl bg-neutral-content rounded inline-block px-4">
        {survey.title}
      </h1>
    </div>
    <div className="px-4 py-2 bg-neutral-content rounded-lg">
      <h2 className="text-black bg-neutral-content rounded inline-block px-4">
        {survey.description}
      </h2>
    </div>
{/*BULK OF SURVEY QUESTIONS*/}
        {survey.questions.map((question, index) => (
          <div key={index} className="px-4 py-2 bg-neutral-content rounded-lg text-lg">
            <h3>{question.text}</h3>
            {question.type === 'text' ? (
              <div>
              <textarea
                rows={6}
                type="text"
                value={answers[index] || ''}
                onChange={(e) => {
                  const newValue = e.target.value;
                  const isDeleting = newValue.length < (answers[index] || '').length;
                  if (isDeleting || newValue.length <= maxCharacters) {
                    handleAnswerChange(index, newValue);
                  }
                }}
                className='w-full min-h-20 max-h-40 px-1' 
            
                disabled = {isCharacterLimitReached(answers[index] || '')}
              />
              <p>Characters remaining: {maxCharacters - (answers[index] || '').length}</p>
              </div>
            ) : (
              <div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={answers[index] || ''}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className="w-full h-6 bg-gray-200 rounded-full appearance-none cursor-pointer
                  "
                />
                <div className="flex justify-between text-sm">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                </div>
              </div>
            )}
          </div>
        ))}
        <div className="flex justify-end">
  <button
    type="submit"
    className="btn btn-ghost font-bold text-border-slate-500 pb-1 py-3 px-6 rounded-lg w-fit text-lg hover:bg-success hover:text-white transition-colors duration-300"
  >
    Submit
  </button>
</div>
      </form>
    </div>
  );
}