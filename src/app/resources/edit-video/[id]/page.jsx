import EditVideoForm from "@/components/EditVideoForm";
import EditVideeForm from "@/components/EditVideoForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const getVideoById = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/api/videos/${id}`, {
        cache: "no-store",
      });
  
      if (!res.ok) {
        throw new Error("Failed to fetch video");
      }
  
      return res.json();
    } catch (error) {
      console.log(error);
    }
  };

export default async function EditVideo({ params }){
    const session = await getServerSession(authOptions);
    if (!session) redirect("/");
    
    const {id} = params;
    const {video} = await getVideoById(id);
    const {title, videoURL, description} = video;

    return(
        <EditVideoForm id={id} newTitle={title} newVideoURL={videoURL} newDescription={description}/>
    )
}