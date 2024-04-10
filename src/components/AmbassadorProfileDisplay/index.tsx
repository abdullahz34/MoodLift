'use client';
import { FC, useState , useEffect } from "react"

interface indexProps{};

interface Profile {
    username: string;
    name: string;
    gender: string;
    age: string;
    description: string;
}

const index: FC<indexProps> = ({}) => {

    const [profile, setProfile] = useState<Profile | null>(null);

    // const fetchProfile = async (username:string) => {
    //     try {
    //       const response = await fetch(`http://localhost:3000/api/ProfilePage?username=${username}`);
    //       if (!response.ok) {
    //         throw new Error("Failed to fetch profile");
    //       }
    //       const profile = await response.json();
    //       return profile;
    //     } catch (error) {
    //       console.error("Error fetching profile:", error);
    //       throw error;
    //     }
    // }


    // useEffect(() => {
    //     const username = "Yaserrr"; // Set the default username or retrieve it from wherever necessary
    //     fetchProfile(username);
    //     }, []); // Fetch profile on initial render


    // const fetchProfile = async (username: string) => {
    //     try {
    //         const response = await fetch(`http://localhost:3000/api/ProfilePage?username=${username}`);
    //         if (!response.ok) {
    //             throw new Error("Failed to fetch profile");
    //         }
    //         const profileData = await response.json();
    //         setProfile(profileData);
    //         console.log(profile?.username)
    //     } catch (error) {
    //         console.error("Error fetching profile:", error);
    //     }
    // };



    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/ProfilePage");
                if (!response.ok) {
                    throw new Error("Failed to fetch profile");
                }
                const profilesData: Profile[] = await response.json();
                console.log("Profile data:", profilesData);
                const targetUsername = "Test2";//making a dropdown just testing the search for now
                const selectedProfile = profilesData.find(profile => profile.username === targetUsername);
                if (selectedProfile){
                    setProfile(selectedProfile);
                } else{
                    console.error(`Profile with username ${targetUsername} not found`);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };

        fetchProfiles();
    }, []);



    return(

        <div className="flex flex-col backdrop-blur-sm bg-slate-500/5  rounded-3xl h-full w-96 p-10">
            
            {profile ? (
                <div className="">
                    <label className="font-bold pt-3">Name</label>
                    <label className="pt-3"><p> {profile.name}</p></label>

                    <label className="font-bold pt-3">Username</label>
                    <label className="pt-3"><p> {profile.username}</p></label>

                    <label className="font-bold pt-3">Gender</label>
                    <label className="pt-3"><p> {profile.gender}</p></label>

                    <label className="font-bold pt-3">Age</label>
                    <label className="pt-3"><p> {profile.age}</p></label>

                    <label className="font-bold pt-3">Description</label>
                    <label className="pt-3"><p> {profile.description}</p></label>
                </div>
            ) : (
                <label>No profile found</label>
            )}
        </div>
    )
}

export default index;