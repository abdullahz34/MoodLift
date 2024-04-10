'use client';
import { FC, useState , useEffect } from "react"
import { useSession } from "next-auth/react";
import Alert from '@/components/Alert/index'

interface indexProps{};

const index: FC<indexProps> = ({}) => { 

    const { data: session, status } = useSession();
    const [showAlert, setShowAlert] = useState(false);// alert


    const [username,setUsername]=useState('')
    const [name,setName]=useState('')
    const [gender,setGender]=useState('')
    const [age,setAge]=useState('')
    const [description,setDescription]=useState('')

    useEffect(() => {
        if (session?.user) {
            setUsername(session.user.username as string);
        }
    }, [session]);

    const handleCloseAlert = () => {
        setShowAlert(false);
      };

    const handleSubmit = async () => {
        try {
            const data = { username, name, gender,age, description}
            const response = await fetch('/api/ProfilePage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData); // Handle success response
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 5000); // Hide the alert after 5 seconds
            } else {
                console.error('Failed to send data:', response.statusText); // Handle error response
            }
        } catch (error) {
            console.error('Error:', error); // Handle network or other errors
        }
    }


    return (


        <div className=" w-100 bg-slate-500/5 backdrop-blur-sm p-10 rounded-3xl h-full w-fit">

            <div className=" backdrop-blur-sm bg-slate-500/5 rounded-3xl p-5 h-full">
                {showAlert && (
                    <Alert message="Profile Updated. Refresh to see changes" onClose={handleCloseAlert} />
                )}
                <div className="flex flex-col w-full p-5">

                    <label className="">Name</label>
                    <input type="string" value={name} onChange={(e) => setName(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />

                    <label className="pt-3">Gender</label>
                    <input type="string" value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />

                    <label className="pt-3">Age</label>
                    <input type="string" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />


                    <label className="pt-3">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="textarea text-pretty textarea-bordered textarea-md w-full max-w-md h-full" placeholder="Bio"></textarea>
                    <div className="p-5"><button type="submit" onClick={handleSubmit} className="btn btn-wide">Submit</button></div>
                </div>
            </div>
        </div>
    )
}

export default index;