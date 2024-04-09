'use client' // client side rendering
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Goals = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleClick = async (e) => {
    e.preventDefault()
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
              <div className="collapse-content"> 
                <p>hello</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body text-sm space-y-4">
          <h1 className="card-title text-sm font-bold text-gray-900 justify-center">Today's water</h1>
          <div className="grid grid-cols-4 items-center">
            <div className="radial-progress" style={{"--value":70, "--size":"3rem"}} role="progressbar">70%</div>
            <div className="col-span-3">
              Good hydration is vital. So far you've had ... cups of water, only ... left to reach your goal!
            </div>
          </div>
          <div className="card-actions">
            <button 
              onClick={handleClick}
              className="btn btn-secondary w-full">Change goal</button>
          </div>
        </div>
      </div>
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body text-sm space-y-4">
          <h1 className="card-title text-sm font-bold text-gray-900 justify-center">Last night's sleep</h1>
          <div className="grid grid-cols-4 items-center">
            <div className="radial-progress" style={{"--value":70, "--size":"3rem"}} role="progressbar">70%</div>
            <div className="col-span-3">
              Good sleep is essential. Take a break and recover some sleep to get closer to your goal of ... hours.
            </div>
          </div>
          <div className="card-actions">
            <button 
              onClick={handleClick}
              className="btn btn-secondary w-full">Change goal</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Goals;