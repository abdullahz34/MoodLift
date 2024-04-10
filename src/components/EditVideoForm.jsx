"use client";
import { useState } from "react";
import {useRouter} from "next/navigation";
import ReturnButton from "./ReturnButton";

export default function EditVideoForm({id, newTitle, newVideoURL, newDescription}){

    const startingVideoData = {
        title: newTitle,
        videoURL: newVideoURL,
        description: newDescription,
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
            const res = await fetch(`http://localhost:3000/api/videos/${id}`, {
                method: "PUT",
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (res.ok){
                router.push("/resources/view-videos");
                router.refresh();
            }

            else{
                throw new Error("Failed to edit video");
            }
        }

        catch(error){
            console.error(error)
        }
    };


    return(
        <div className="flex justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-1/3">
                <h2>Edit video</h2>
                <label htmlFor="title">Title</label>
                <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="input input-bordered" required/>

                <label htmlFor="videoURL">Youtube URL</label>
                <input type="text" id="videoURL" name="videoURL" value={formData.videoURL} onChange={handleChange} className="input input-bordered" required/>

                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" value={formData.description} onChange={handleChange} className="textarea textarea-bordered" required/>

                <button type="submit" className="btn">Edit Video</button>
                <ReturnButton/>
            </form>
        </div>
    )
}