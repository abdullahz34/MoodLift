'use client';
import { FC, useState , useEffect } from "react"
import { useSession } from "next-auth/react";

interface indexProps{};

interface Profile {
    username: string;
    name: string;
    gender: string;
    age: string;
    description: string;
}

const index: FC<indexProps> = ({}) => {

    const { data: session, status } = useSession();
    // const [Ambassador_username,setAmbassador_username]=useState('')
    const [profile, setProfile] = useState<Profile | null>(null);

    // useEffect(() => {
    //     if (session?.user) {
    //         setAmbassador_username(session.user.username as string);
    //         console.log("run")
    //     }
    // }, [session]);

    // useEffect(() => {
    //     const fetchProfiles = async () => {
            
    //         try {
    //             const response = await fetch("http://localhost:3000/api/ProfilePage");
    //             if (!response.ok) {
    //                 throw new Error("Failed to fetch profile");
    //             }
    //             const profilesData: Profile[] = await response.json();
    //             console.log("Profile data:", profilesData);
    //             console.log(Ambassador_username)
    //             // const targetUsername = //making a dropdown just testing the search for now
    //             const selectedProfile = profilesData.find(profile => profile.username === Ambassador_username);
    //             if (selectedProfile){
    //                 setProfile(selectedProfile);
    //             } else{
    //                 console.error(`Profile with username ${Ambassador_username} not found`);
    //             }
    //         } catch (error) {
    //             console.error("Error fetching profile:", error);
    //         }
    //     };

    //     fetchProfiles();
    // }, []);


    useEffect(() => {
        const fetchProfile = async () => {
          if (session?.user) {
            const username = session.user.username as string;
            console.log("Session data:", session);
            try {
              const response = await fetch(`http://localhost:3000/api/ProfilePage`);
              if (!response.ok) {
                throw new Error("Failed to fetch profiles");
              }
              const profilesData: Profile[] = await response.json();
              console.log("Profiles data:", profilesData);
    
              // Find the specific profile object based on the username
              const userProfile = profilesData.find(profile => profile.username === username);
              if (userProfile) {
                setProfile(userProfile);
                console.log("User profile:", userProfile);
              } else {
                console.log("User profile not found");
              }
            } catch (error) {
              console.error("Error fetching profiles:", error);
            }
          }
        };
    
        fetchProfile();
      }, [session]);



    return(

        <div className="flex flex-col backdrop-blur-sm bg-slate-500/5  rounded-3xl h-full w-96 p-10">
            
            {profile ? (
                <div className="">
                    <label className="font-bold pt-3">Name</label>
                    <label className="pt-3"><p> {profile.name}</p></label>

                    <label className="font-bold pt-3">Gender</label>
                    <label className="pt-3"><p> {profile.gender}</p></label>

                    <label className="font-bold pt-3">Age</label>
                    <label className="pt-3"><p> {profile.age}</p></label>

                    <label className="font-bold py-10">Description</label>
                    <textarea className="text-pretty textarea textarea-ghost w-full h-full" readOnly>{profile.description}</textarea>
                </div>
            ) : (
                <label className="flex items-center justify-center h-3/6 text-2xl font-bold text-gray-800">Enter Profile Details</label>
            )}
        </div>
    )
}

export default index;