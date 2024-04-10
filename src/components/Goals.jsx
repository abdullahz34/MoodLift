'use client' // client side rendering
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

async function getData(date, username) {
  const response = await fetch(`http://localhost:3000/api/logging?date=${date}&username=${username}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error('Response for the logging API call failed! (fitness)');
  }
  const data = await response.json();

  // Find the object for the selected date and username
  const item = data.find(item => new Date(item.date).toDateString() === new Date(date).toDateString() && item.username === username);

  // Return the fitness object of the found item, or null if no item was found
  return item ? item : null;
}

export default function Goals() {
  const [date, setDate] = useState(getFormattedCurrentDate());
  const [fitnessData, setFitnessData] = useState('');
  const [hydrationData, setHydrationData] = useState('');
  const [sleepData, setSleepData] = useState('');
  const [stepsGoal, setStepsGoal] = useState('');
  const [waterGoal, setWaterGoal] = useState('');
  const [sleepGoal, setSleepGoal] = useState('');

  const [value, setValue] = useState('');
  const [goal_type, setGoal_type] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { data: session } = useSession();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resGoals = await fetch(`/api/goals/allgoals?username=${session?.user?.username}`, {
          method: "GET"
        })

        const goals = await resGoals.json();
        const stepsEntry = goals.filter(item => item.goal_type === "Steps");
        const waterEntry = goals.filter(item => item.goal_type === "Water");
        const sleepEntry = goals.filter(item => item.goal_type === "Sleep");
        
        // Accessing value field from stepsEntry
        const stepsValue = stepsEntry.length > 0 ? stepsEntry[0].value : null;

        // Accessing value field from waterEntry
        const waterValue = waterEntry.length > 0 ? waterEntry[0].value : null;

        // Accessing value field from sleepEntry
        const sleepValue = sleepEntry.length > 0 ? sleepEntry[0].value : null;

        setStepsGoal(stepsValue)
        setWaterGoal(waterValue)
        setSleepGoal(sleepValue)

        const data = await getData(date, session?.user?.username)
  
        if (data) {
          setFitnessData(data.fitness);
          setHydrationData(data.hydration);
          setSleepData(data.sleep);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, [date, session?.user?.username]);

  function getFormattedCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Adding 1 to month because it's zero-based
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const calcProgress = (data, goal) => {
    let progressPercentage = 0;
    if (data && goal) {
      const calculatedPercentage = (data / goal) * 100;
      progressPercentage = Math.floor(Math.min(calculatedPercentage, 100));
    }
    return progressPercentage
  }

  const isGoalMet = (data, goal) => {
    let goalMet = false;
    if (calcProgress(data,goal)>=100) {
      goalMet = true
    }
    return goalMet
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const resGoalExists = await fetch(`/api/goals?username=${session?.user?.username}&goal_type=${goal_type}`, {
        method: "GET"
      })
      
      const goal = await resGoalExists.json();
      if (goal) {
        // update goal
        const resUpdate = await fetch(`/api/goals?username=${session?.user?.username}&goal_type=${goal_type}`, {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ value }),
        });
  
        if (resUpdate.ok) {
          const form = e.target;
          form.reset()
          setSubmitted(true);
          setTimeout(() => {
            setSubmitted(false)
            window.location.reload()
          } , 2000);
        }
      }
      else {
        // create new goal
        const username = session?.user?.username
        const resCreate = await fetch("/api/goals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username, 
            goal_type,
            value, 
          })
        })
        if (resCreate.ok) {
          const form = e.target;
          form.reset()
          setSubmitted(true);
          setTimeout(() => setSubmitted(false), 3000);
          setTimeout(window.location.reload(), 3000)
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col space-y-8">
      {submitted && (
        <div role="alert" className="alert alert-success fixed top-0 left-0 right-0 flex items-center justify-center mt-4 p-2 text-sm max-w-xs mx-auto z-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Goal successfully updated!</span>
        </div>
      )}
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body text-sm space-y-4">
          <h1 className="card-title text-sm font-bold text-gray-900 justify-center">Today's steps</h1>
          {(fitnessData && stepsGoal) ?
            <div className="grid grid-cols-4 items-center">
              <div className="radial-progress" style={{"--value":calcProgress(fitnessData.steps, stepsGoal), "--size":"3rem"}} role="progressbar">{calcProgress(fitnessData.steps, stepsGoal)}%</div>
              <div className="col-span-3">
                {!isGoalMet(fitnessData.steps, stepsGoal) ? 
                  <p>
                    Stay determined! So far you've walked {fitnessData.steps} steps. This is {Math.round((fitnessData.steps/stepsGoal)*100)}% of your daily steps goal - keep moving.
                  </p>
                  : 
                  <p>
                    You walked {fitnessData.steps} steps today and met your goal. Well done!
                  </p>
                }
              </div>
            </div>
            :
            (!fitnessData&&!stepsGoal || fitnessData) ?
            <p>
              You haven't set a goal yet! Set one now to start tracking your progress.
            </p>
            :
            <p>
            You haven't got any entries yet for today! Good luck reaching your goal of {stepsGoal} steps!
            </p>
          }
          <div className="card-actions">
            <div className="collapse bg-secondary">
              <input type="checkbox" /> 
              <div className="collapse-title text-sm font-bold item flex justify-center items-center ml-3">
                Change goal
              </div>
              <div className="collapse-content space-y-4"> 
                <h1 className="text-s font-bold text-gray-900">Daily step goal</h1>
                <form className="flex flex-col space-y-8" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="input input-bordered input-primary flex items-center gap-4">
                      <input
                        type="value"
                        onChange={(e) =>{
                          setValue(e.target.value);
                          setGoal_type("Steps");
                        }}
                      />
                      <span className="text-neutral-content">Steps</span>
                    </label>
                    <aside>
                      Getting your steps in is a great way to increase your activity level. You don't need to walk 10,000 steps a day but it's a good number to aim for.
                    </aside>
                  </div>
                  <div className="flex justify-end">
                    <button className="btn btn-base-100">Save</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body text-sm space-y-4">
          <h1 className="card-title text-sm font-bold text-gray-900 justify-center">Today's water</h1>
          {(hydrationData && waterGoal) ? 
            <div className="grid grid-cols-4 items-center">
              <div className="radial-progress" style={{"--value":calcProgress(hydrationData.waterML, waterGoal), "--size":"3rem"}} role="progressbar">{calcProgress(hydrationData.waterML, waterGoal)}%</div>
              <div className="col-span-3">
                {!isGoalMet(hydrationData.waterML, waterGoal) ? 
                  <p>
                    Good hydration is vital. So far you've had {hydrationData.waterML}mL of water, only {waterGoal-hydrationData.waterML}mL left to reach your goal!
                  </p>
                  : 
                  <p>
                    You drank {hydrationData.waterML}mL of water today and met your goal. Well done!
                  </p>
                }
              </div>
            </div>
            :
            (!hydrationData&&!waterGoal || hydrationData) ?
            <p>
              You haven't set a goal yet! Set one now to start tracking your progress.
            </p>
            :
            <p>
            You haven't got any entries yet for today! Good luck reaching your goal of {waterGoal}mL!
            </p>
          }

          <div className="card-actions">
            <div className="collapse bg-secondary">
              <input type="checkbox" /> 
              <div className="collapse-title text-sm font-bold item flex justify-center items-center ml-3">
                Change goal
              </div>
              <div className="collapse-content space-y-4"> 
                <h1 className="text-s font-bold text-gray-900">Daily hydration goal</h1>
                <form className="flex flex-col space-y-8" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="input input-bordered input-primary flex items-center gap-4">
                      <input
                        type="value"
                        onChange={(e) =>{
                          setValue(e.target.value);
                          setGoal_type("Water");
                        }}
                      />
                      <span className="text-neutral-content ml-5">ml</span>
                    </label>
                    <aside>
                      The body needs water - it's 60% water, after all - for many things. Processing food, waste, protecting vital tissues and more. You should try to have around 1.2 litres per day.
                    </aside>
                  </div>
                  <div className="flex justify-end">
                    <button className="btn btn-base-100">Save</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body text-sm space-y-4">
          <h1 className="card-title text-sm font-bold text-gray-900 justify-center">Last night's sleep</h1>
          {(sleepData && sleepGoal) ? 
            <div className="grid grid-cols-4 items-center">
              <div className="radial-progress" style={{"--value":calcProgress(sleepData.hoursSlept, sleepGoal), "--size":"3rem"}} role="progressbar">{calcProgress(sleepData.hoursSlept, sleepGoal)}%</div>
              <div className="col-span-3">
                {!isGoalMet(sleepData.hoursSlept, sleepGoal) ? 
                  <p>
                    Good sleep is essential. Take a break and recover some sleep to get closer to your goal of {sleepGoal} hours.
                  </p>
                  :
                  <p>
                    You slept for {sleepData.hoursSlept} hours last night and met your goal. Well done!
                  </p>
                }
              </div>
            </div>
            :
            (!sleepData&&!sleepGoal || sleepData) ?
            <p>
              You haven't set a goal yet! Set one now to start tracking your progress.
            </p>
            :
            <p>
            You haven't got any entries yet for today! Good luck reaching your goal of {sleepGoal} hours!
            </p>
          }

          <div className="card-actions">
            <div className="collapse bg-secondary">
              <input type="checkbox" /> 
              <div className="collapse-title text-sm font-bold item flex justify-center items-center ml-3">
                Change goal
              </div>
              <div className="collapse-content space-y-4"> 
                <h1 className="text-s font-bold text-gray-900">Nightly sleep goal</h1>
                <form className="flex flex-col space-y-8" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label className="input input-bordered input-primary flex items-center gap-4">
                      <input
                        type="value"
                        onChange={(e) =>{
                          setValue(e.target.value);
                          setGoal_type("Sleep");
                        }}
                      />
                      <span className="text-neutral-content ml-5">Hours</span>
                    </label>
                    <aside>
                      Sleep is an essential and involuntary process, without which we cannot function effectively. It is as essential to our bodies as eating, drinking and breathing, and is vital for maintaining good mental and physical health. You should aim to get 7-9 hours every night.
                    </aside>
                  </div>
                  <div className="flex justify-end">
                    <button className="btn btn-base-100">Save</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}