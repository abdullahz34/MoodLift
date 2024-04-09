'use client' // client side rendering
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import axios from 'axios';

export default function Goals() {
  const [steps, setSteps] = useState('');
  const [water, setWater] = useState('');
  const [sleep, setSleep] = useState('');
  const [value, setValue] = useState('');
  const [goal_type, setGoal_type] = useState("");

  const { data: session } = useSession();

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
          router.push("/")
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
          router.push("/")
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex flex-col space-y-8">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body text-sm space-y-4">
          <h1 className="card-title text-sm font-bold text-gray-900 justify-center">Today's steps</h1>
          <div className="grid grid-cols-4 items-center">
            <div className="radial-progress" style={{"--value":70, "--size":"3rem"}} role="progressbar">70%</div>
            <div className="col-span-3">
              Stay determined! So far you've walked .... This is ...% of your daily steps goal - keep moving.
            </div>
          </div>
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
          <div className="grid grid-cols-4 items-center">
            <div className="radial-progress" style={{"--value":20, "--size":"3rem"}} role="progressbar">20%</div>
            <div className="col-span-3">
              Good hydration is vital. So far you've had ... cups of water, only ... left to reach your goal!
            </div>
          </div>
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
          <div className="grid grid-cols-4 items-center">
            <div className="radial-progress" style={{"--value":50, "--size":"3rem"}} role="progressbar">50%</div>
            <div className="col-span-3">
              Good sleep is essential. Take a break and recover some sleep to get closer to your goal of ... hours.
            </div>
          </div>
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