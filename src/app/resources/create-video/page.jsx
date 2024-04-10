"use client"
import { withAuth } from "@/components/WithAuth";
import {useState} from "react";
import { useRouter } from "next/navigation";
import ReturnButton from "@/components/ReturnButton";

const CreateVideo = () => {

    const startingVideoData = {
        title: "",
        videoURL: "",
        description: ""
    };

    const [formData, setFormData] = useState(startingVideoData);

    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
    
        setFormData((preState) => ({
          ...preState,
          [name]: value,
        }));
      };

    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try{
            const res = await fetch("http://localhost:3000/api/videos", {
                method: "POST",
                body: JSON.stringify({formData}),
                headers: {
                    "Content-Type": "application/json",
                }
            });

            console.log(res)
            console.log(JSON.stringify({formData}))

            if (res.ok){
                router.push("/resources/view-videos");
                router.refresh();
            }

            else{
                throw new Error("Failed to create video");
            }
        }

        catch(error){
            console.error(error)
        }
    };

    return(
        <div className="flex justify-center">
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-1/3">
                <h2>Create a video</h2>

                <label htmlFor="title">Title</label>
                <input type="text" id="title" name="title" onChange={handleChange} className="input input-bordered" required/>


                <label htmlFor="videoURL">Youtube URL</label>
                <input type="text" id="videoURL" name="videoURL" onChange={handleChange} className="input input-bordered" required/>

                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" onChange={handleChange} className="textarea textarea-bordered" required/>

                <button type="submit" className="btn">Add Video</button>
                <ReturnButton/>
            </form>
        </div>
        
    )
}

export default withAuth(CreateVideo);