import EditVideoForm from "@/components/EditVideoForm";
import EditVideeForm from "@/components/EditVideoForm";

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
    const {id} = params;
    const {video} = await getVideoById(id);
    const {title, videoURL, description} = video;

    return(
        <EditVideoForm id={id} newTitle={title} newVideoURL={videoURL} newDescription={description}/>
    )
}