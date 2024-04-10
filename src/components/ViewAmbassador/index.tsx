'use client';
import { FC, useState , useEffect } from "react"
import { useSession } from "next-auth/react";


interface Profile {
    username: string;
    name: string;
    gender: string;
    age: string;
    description: string;
}
const View_Ambassador: FC = () => {

    const [Profiles, setProfiles] = useState<Profile[]>([]);


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

    
    return(
    <div>
        {Profiles.map((Profile, index) => (
            <div key={index} className="py-2">
                <div className="collapse  collapse-plus bg-base-200">
                    <input type="checkbox" /> 
                    <div className="collapse-title text-xl font-semibold">
                        {Profile.name}  {Profile.gender} {Profile.age}
                    </div>
                    <div className="collapse-content"> 

                        <label className="pt-10 ">Description</label>
                        <br/>
                        <textarea className="pt-3 pb-10 text-pretty textarea textarea-ghost w-full" readOnly>{Profile.description}</textarea>
                        <br/>
                    </div>
                </div>
            </div>
        ))}
    </div>
    )

    //   return(

    //     <div className="flex flex-col backdrop-blur-sm bg-slate-500/5  rounded-3xl h-full w-96 p-10">
    //         ViewAmbassador
    //     </div>
    // )
}

export default View_Ambassador;