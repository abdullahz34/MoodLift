'use client';
import { FC, useState , useEffect } from "react"
import { useSession } from "next-auth/react";
import Alert from '@/components/Alert/index'


interface Profile {
    username: string;
    name: string;
    gender: string;
    age: string;
    description: string;
}

const Request_Ambassador: FC = () => {

    const [Profiles, setProfiles] = useState<Profile[]>([]);
    const [showAlert, setShowAlert] = useState(false);// alert

    const [Employee_username, setEmployeeUsername]= useState('')
    const [Severity,SetSeverity]=useState('')
    const [Reason, setReason]=useState('')
    const [Appointment_Preference, setAppointmentPref]=useState('')

    const { data: session, status } = useSession();


    const fetchProfiles = async () => {
        try {
          const response = await fetch("http://localhost:3000/api/ProfilePage");
          if (!response.ok) {
            throw new Error("Failed to fetch Profiles");
          }
          const Profiles = await response.json();
          
          return Profiles;
          
        } catch (error) {
          console.error("Error fetching Profiles:", error);
          throw error;
        }
      }
    
    useEffect(() => {
        if (session?.user) {
            setEmployeeUsername(session.user.username as string);
        }
    }, [session]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const ProfilesData = await fetchProfiles();
            setProfiles(ProfilesData);
            // console.log(ProfilesData) //to check if array gets all data
          } catch (error) {
            console.error("Error fetching Profiles:", error);
          }
        };
    
        fetchData();
      }, []);

    // const handleSubmit = async () => {
    //     try {
    //         const data = { Ambassador_username, Employee_username,Severity, Reason, Appointment_Preference}
    //         const response = await fetch('/api/AmbassadorRequest', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(data),
    //         });
    //         if (response.ok) {
    //             const responseData = await response.json();
    //             console.log(responseData); // Handle success response
    //         } else {
    //             console.error('Failed to send data:', response.statusText); // Handle error response
    //         }
    //     } catch (error) {
    //         console.error('Error:', error); // Handle network or other errors
    //     }
    // }

    const handleSubmit = async (Ambassador_username: string) => {
        try {
          const data = { Ambassador_username, Employee_username, Severity, Reason, Appointment_Preference };
          const response = await fetch('/api/AmbassadorRequest', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
          if (response.ok) {
            const responseData = await response.json();
            console.log(responseData);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000); // Hide the alert after 3 seconds
            // Reset form fields
            SetSeverity(''); setReason('');setAppointmentPref(''); //clear for next request
          } else {
            console.error('Failed to send data:', response.statusText);
          }
        } catch (error) {
          console.error('Error:', error);
        }
    };

    const handleCloseAlert = () => {
      setShowAlert(false);
    };


    return(
        <div>
                {showAlert && (
        <Alert message="Request has been sent successfully" onClose={handleCloseAlert} />
      )}
            {Profiles.map((Profile, index) => (
                <div key={index} className="py-2">
                    <div className="collapse collapse-plus bg-base-200">
                        <input type="checkbox" /> 
                        <div className="collapse-title text-xl font-semibold">
                            {Profile.name}  {Profile.gender} {Profile.age}
                        </div>
                        <div className="collapse-content"> 

                            <label className="pt-10 ">Description</label>
                            <br/>
                            <textarea className="pt-3 pb-10 text-pretty textarea textarea-ghost w-full" readOnly>{Profile.description}</textarea>
                            <br/>
                            <label className="pt-10 ">Appointment Preference</label>
                            <br/>
                            <input type="string"    value={Appointment_Preference}    onChange={(e) => setAppointmentPref(e.target.value)}       placeholder="e.g 28th of April 1pm or 4pm"    className="input input-bordered w-full max-w-xs" />

                            <div className="text-gray-700 pt-5">Severity</div>
                            <div className="dropdown dropdown-top pb-5">
                                <div tabIndex={0} role="button" className="btn m-1">{Severity || 'Select Severity'}</div>
                                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                                    <li><a onClick={() => SetSeverity('High')}>High</a></li>
                                    <li><a onClick={() => SetSeverity('Medium')}>Medium</a></li>
                                    <li><a onClick={() => SetSeverity('Low')}>Low</a></li>
                                    <li><a onClick={() => SetSeverity('Unsure')}>Unsure</a></li>
                                </ul>
                            </div>
                        <br></br>
                            <label className="pt-8">Reason</label>
                            <br></br>
                            <input type="string"    value={Reason}    onChange={(e) => setReason(e.target.value)}       placeholder="e.g I want to discuss Sleeping habits"    className="input input-bordered w-full max-w-xs" />


                            {/* Request Button */}
                            <div className="p-5"><button    type="submit"  onClick={() => handleSubmit(Profile.username)}   className="btn btn-wide btn-warning">Request</button></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Request_Ambassador;














//     return(
//         <div className="collapse bg-base-200">
//             <input type="checkbox" /> 
//             <div className="collapse-title text-xl font-medium">
//                 Click me to show/hide content
//             </div>
//             <div className="collapse-content"> 

//                 <label className="pt-3">Appointment Preference</label>
//                 <input type="string"    value={Appointment_Preference}    onChange={(e) => setAppointmentPref(e.target.value)}       placeholder="e.g 28th of April 1pm or 4pm"    className="input input-bordered w-full max-w-xs" />

//                 <div className="text-gray-700 pt-5">Severity</div>
//                 <div className="dropdown dropdown-top pb-5">
//                     <div tabIndex={0} role="button" className="btn m-1">{Severity || 'Select Severity'}</div>
//                     <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
//                         <li><a onClick={() => SetSeverity('High')}>High</a></li>
//                         <li><a onClick={() => SetSeverity('Medium')}>Medium</a></li>
//                         <li><a onClick={() => SetSeverity('Low')}>Low</a></li>
//                         <li><a onClick={() => SetSeverity('Unsure')}>Unsure</a></li>
//                     </ul>
//                 </div>
//             <br></br>
//                 <label className="pt-8">Reason</label>
//                 <br></br>
//                 <input type="string"    value={Reason}    onChange={(e) => setReason(e.target.value)}       placeholder="e.g Want to discuss Sleeping habits"    className="input input-bordered w-full max-w-xs" />


//                 {/* Request Button */}
//                 <div className="p-5"><button    type="submit"  onClick={handleSubmit}   className="btn btn-wide btn-warning">Request</button></div>
//             </div>
//         </div>
//     )
// }

// export default index;